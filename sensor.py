import logging
import datetime
import math
from homeassistant.components.sensor import SensorEntity
from homeassistant.components.recorder import history
from homeassistant.util import dt as dt_util
from homeassistant.helpers import location
from .const import (
    DOMAIN,
    CONF_PRESSURE_SENSOR,
    CONF_WIND_SENSOR,
    CONF_TEMPERATURE_SENSOR,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_USE_SEA_LEVEL,
    ZAMBRETTI_MAPPING
)

_LOGGER = logging.getLogger(__name__)

async def get_elevation(hass, latitude, longitude):
    """Получить высоту над уровнем моря через API elevation."""
    try:
        import aiohttp
        url = f"https://api.open-elevation.com/api/v1/lookup?locations={latitude},{longitude}"
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                if response.status == 200:
                    data = await response.json()
                    return data['results'][0]['elevation']
    except Exception as e:
        _LOGGER.warning("Failed to get elevation from API: %s", e)
    return None

def calculate_sea_level_pressure(pressure, temperature, altitude):
    """Рассчитать давление на уровне моря.

    Args:
        pressure: Абсолютное давление в hPa
        temperature: Температура в °C
        altitude: Высота над уровнем моря в метрах

    Returns:
        Давление на уровне моря в hPa
    """
    if altitude is None or altitude == 0:
        return pressure

    # Используем барометрическую формулу
    # P_sea = P_abs / (1 - (0.0065 * h) / (T + 0.0065 * h + 273.15))^5.257
    temp_kelvin = temperature + 273.15
    exponent = 5.257
    factor = 1 - (0.0065 * altitude) / (temp_kelvin + 0.0065 * altitude)

    if factor <= 0:
        # Упрощенная формула как fallback
        return pressure + (altitude / 8.3)

    sea_level_pressure = pressure / (factor ** exponent)
    return sea_level_pressure

async def async_setup_entry(hass, entry, async_add_entities):
    # Приоритет отдаем опциям из меню 'Настроить'
    pressure_id = entry.options.get(CONF_PRESSURE_SENSOR, entry.data.get(CONF_PRESSURE_SENSOR))
    wind_id = entry.options.get(CONF_WIND_SENSOR, entry.data.get(CONF_WIND_SENSOR))
    temp_id = entry.options.get(CONF_TEMPERATURE_SENSOR, entry.data.get(CONF_TEMPERATURE_SENSOR))
    use_sea_level = entry.options.get(CONF_USE_SEA_LEVEL, entry.data.get(CONF_USE_SEA_LEVEL, False))
    latitude = entry.options.get(CONF_LATITUDE, entry.data.get(CONF_LATITUDE))
    longitude = entry.options.get(CONF_LONGITUDE, entry.data.get(CONF_LONGITUDE))

    device_id = entry.entry_id

    async_add_entities([
        ZambrettiSensor(pressure_id, temp_id, use_sea_level, latitude, longitude, device_id, hass),
        SagerSensor(pressure_id, wind_id, temp_id, use_sea_level, latitude, longitude, device_id, hass)
    ], True)

class WeatherSensorBase(SensorEntity):
    def __init__(self, device_id):
        self._device_id = device_id

    @property
    def device_info(self):
        return {
            "identifiers": {(DOMAIN, self._device_id)},
            "name": "Maksym's Weather Station",
            "manufacturer": "Zambretti & Sager",
            "model": "Software Forecaster",
            "sw_version": "1.0.0",
        }

class ZambrettiSensor(WeatherSensorBase):
    def __init__(self, pressure_id, temp_id, use_sea_level, latitude, longitude, device_id, hass):
        super().__init__(device_id)
        self._pressure_id = pressure_id
        self._temp_id = temp_id
        self._use_sea_level = use_sea_level
        self._latitude = latitude
        self._longitude = longitude
        self._hass = hass
        self._altitude = None
        self._attr_name = "Zambretti Forecast"
        self._attr_unique_id = f"{pressure_id}_zambretti"
        self._state = "Calculating..."

    async def async_added_to_hass(self):
        """Вызывается когда сенсор добавлен в Home Assistant."""
        await super().async_added_to_hass()

        # Получаем высоту, если указаны координаты
        if self._use_sea_level and self._latitude and self._longitude:
            self._altitude = await get_elevation(self._hass, self._latitude, self._longitude)
            if self._altitude:
                _LOGGER.info("Zambretti: Altitude for coordinates (%.6f, %.6f) is %.1f m",
                           self._latitude, self._longitude, self._altitude)
            else:
                _LOGGER.warning("Zambretti: Could not determine altitude, using raw pressure")

    async def async_update(self):
        start_time = dt_util.utcnow() - datetime.timedelta(hours=3)
        events = await self.hass.async_add_executor_job(
            history.get_significant_states, self.hass, start_time, None, [self._pressure_id]
        )
        current_state = self.hass.states.get(self._pressure_id)
        if not current_state or current_state.state in ["unknown", "unavailable"]:
            return
        try:
            p_now = float(current_state.state)
            p_old = float(events[self._pressure_id][0].state) if self._pressure_id in events and events[self._pressure_id] else p_now

            # Применяем коррекцию на уровень моря, если включено
            if self._use_sea_level and self._altitude:
                temp = 15.0  # Температура по умолчанию
                if self._temp_id:
                    temp_state = self.hass.states.get(self._temp_id)
                    if temp_state and temp_state.state not in ["unknown", "unavailable"]:
                        try:
                            temp = float(temp_state.state)
                        except:
                            pass

                p_now = calculate_sea_level_pressure(p_now, temp, self._altitude)
                p_old = calculate_sea_level_pressure(p_old, temp, self._altitude)

            delta = p_now - p_old

            if delta <= -1.6: z = round(127 - 0.12 * p_now)
            elif delta >= 1.6: z = round(185 - 0.16 * p_now)
            else: z = round(144 - 0.13 * p_now)

            self._state = ZAMBRETTI_MAPPING.get(max(1, min(z, 32)), "Stable")
        except: pass

    @property
    def state(self): return self._state

class SagerSensor(WeatherSensorBase):
    def __init__(self, pressure_id, wind_id, temp_id, use_sea_level, latitude, longitude, device_id, hass):
        super().__init__(device_id)
        self._pressure_id = pressure_id
        self._wind_id = wind_id
        self._temp_id = temp_id
        self._use_sea_level = use_sea_level
        self._latitude = latitude
        self._longitude = longitude
        self._hass = hass
        self._altitude = None
        self._attr_name = "Sager Forecast"
        self._attr_unique_id = f"{pressure_id}_sager"
        self._state = "Initializing..."

    async def async_added_to_hass(self):
        """Вызывается когда сенсор добавлен в Home Assistant."""
        await super().async_added_to_hass()

        # Получаем высоту, если указаны координаты
        if self._use_sea_level and self._latitude and self._longitude:
            self._altitude = await get_elevation(self._hass, self._latitude, self._longitude)
            if self._altitude:
                _LOGGER.info("Sager: Altitude for coordinates (%.6f, %.6f) is %.1f m",
                           self._latitude, self._longitude, self._altitude)
            else:
                _LOGGER.warning("Sager: Could not determine altitude, using raw pressure")

    async def async_update(self):
        p_state = self.hass.states.get(self._pressure_id)
        w_state = self.hass.states.get(self._wind_id)

        if not p_state or not w_state or w_state.state in ["unknown", "unavailable"]:
            return
        try:
            p = float(p_state.state)

            # Применяем коррекцию на уровень моря, если включено
            if self._use_sea_level and self._altitude:
                temp = 15.0  # Температура по умолчанию
                if self._temp_id:
                    temp_state = self.hass.states.get(self._temp_id)
                    if temp_state and temp_state.state not in ["unknown", "unavailable"]:
                        try:
                            temp = float(temp_state.state)
                        except:
                            pass

                p = calculate_sea_level_pressure(p, temp, self._altitude)

            # ФИКС ГРАДУСА: убираем символ °
            wind_raw = w_state.state.replace("°", "").strip()
            wind = float(wind_raw)

            if p > 1020: self._state = "Fair, No Change"
            elif p < 1005: self._state = "Unsettled, Rain"
            else: self._state = "Variable"
        except: pass

    @property
    def state(self): return self._state