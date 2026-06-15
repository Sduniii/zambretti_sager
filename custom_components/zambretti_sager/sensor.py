import logging
import datetime
from homeassistant.components.sensor import SensorEntity
from homeassistant.components.recorder import history
from homeassistant.util import dt as dt_util
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

VERSION = "1.5.2"


async def get_elevation(hass, latitude, longitude):
    """Получить высоту над уровнем моря через Open-Elevation API."""
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

    # P_sea = P_abs / (1 - (0.0065 * h) / (T + 0.0065 * h + 273.15))^5.257
    factor = 1 - (0.0065 * altitude) / (temperature + 0.0065 * altitude + 273.15)

    if factor <= 0:
        # Упрощённая формула как fallback
        return pressure + (altitude / 8.3)

    return pressure / (factor ** 5.257)


async def async_setup_entry(hass, entry, async_add_entities):
    """Настройка сенсоров. Высота запрашивается один раз и передаётся всем сенсорам."""
    pressure_id = entry.options.get(CONF_PRESSURE_SENSOR, entry.data.get(CONF_PRESSURE_SENSOR))
    wind_id     = entry.options.get(CONF_WIND_SENSOR,      entry.data.get(CONF_WIND_SENSOR))
    temp_id     = entry.options.get(CONF_TEMPERATURE_SENSOR, entry.data.get(CONF_TEMPERATURE_SENSOR))
    use_sea_level = entry.options.get(CONF_USE_SEA_LEVEL, entry.data.get(CONF_USE_SEA_LEVEL, False))
    latitude    = entry.options.get(CONF_LATITUDE,  entry.data.get(CONF_LATITUDE))
    longitude   = entry.options.get(CONF_LONGITUDE, entry.data.get(CONF_LONGITUDE))
    device_id   = entry.entry_id

    # Получаем высоту один раз для всех сенсоров
    altitude = None
    if use_sea_level and latitude and longitude:
        altitude = await get_elevation(hass, latitude, longitude)
        if altitude is not None:
            _LOGGER.info("Altitude for (%.6f, %.6f): %.1f m", latitude, longitude, altitude)
        else:
            _LOGGER.warning("Could not determine altitude, using raw pressure for all sensors")

    async_add_entities([
        ZambrettiSensor(pressure_id, temp_id, use_sea_level, altitude, device_id),
        SagerSensor(pressure_id, wind_id, temp_id, use_sea_level, altitude, device_id),
        ZambrettiForecast6h(pressure_id, temp_id, use_sea_level, altitude, device_id),
        ZambrettiForecast12h(pressure_id, temp_id, use_sea_level, altitude, device_id),
        ZambrettiForecast24h(pressure_id, temp_id, use_sea_level, altitude, device_id),
        PrecipitationProbability(pressure_id, temp_id, use_sea_level, altitude, device_id),
    ], True)


class WeatherSensorBase(SensorEntity):
    """Базовый класс со вспомогательными методами."""

    def __init__(self, device_id, pressure_id, temp_id, use_sea_level, altitude):
        self._device_id = device_id
        self._pressure_id = pressure_id
        self._temp_id = temp_id
        self._use_sea_level = use_sea_level
        self._altitude = altitude

    @property
    def device_info(self):
        return {
            "identifiers": {(DOMAIN, self._device_id)},
            "name": "Maksym's Weather Station",
            "manufacturer": "Zambretti & Sager",
            "model": "Software Forecaster",
            "sw_version": VERSION,
        }

    def _get_corrected_pressure(self, raw_pressure):
        """Применить коррекцию на уровень моря, если включено."""
        if not self._use_sea_level or self._altitude is None:
            return raw_pressure
        temp = self._get_temperature()
        return calculate_sea_level_pressure(raw_pressure, temp, self._altitude)

    def _get_temperature(self):
        """Получить текущую температуру или вернуть значение по умолчанию."""
        if self._temp_id:
            state = self.hass.states.get(self._temp_id)
            if state and state.state not in ("unknown", "unavailable"):
                try:
                    return float(state.state)
                except ValueError:
                    pass
        return 15.0  # Стандартная атмосферная температура

    async def _get_history_pressure(self, hours):
        """Получить давление N часов назад."""
        start_time = dt_util.utcnow() - datetime.timedelta(hours=hours)
        events = await self.hass.async_add_executor_job(
            history.get_significant_states, self.hass, start_time, None, [self._pressure_id]
        )
        if self._pressure_id in events and events[self._pressure_id]:
            try:
                return float(events[self._pressure_id][0].state)
            except (ValueError, TypeError):
                pass
        return None

    def _zambretti_index(self, p_now, delta):
        """Вычислить индекс Замбретти."""
        if delta <= -1.6:
            z = round(127 - 0.12 * p_now)
        elif delta >= 1.6:
            z = round(185 - 0.16 * p_now)
        else:
            z = round(144 - 0.13 * p_now)
        return max(1, min(z, 32))


class ZambrettiSensor(WeatherSensorBase):

    def __init__(self, pressure_id, temp_id, use_sea_level, altitude, device_id):
        super().__init__(device_id, pressure_id, temp_id, use_sea_level, altitude)
        self._attr_name = "Zambretti Forecast"
        self._attr_unique_id = f"{pressure_id}_zambretti"
        self._state = "Calculating..."

    async def async_update(self):
        current_state = self.hass.states.get(self._pressure_id)
        if not current_state or current_state.state in ("unknown", "unavailable"):
            return
        try:
            p_now = self._get_corrected_pressure(float(current_state.state))
            p_old_raw = await self._get_history_pressure(3)
            p_old = self._get_corrected_pressure(p_old_raw) if p_old_raw is not None else p_now

            delta = p_now - p_old
            self._state = ZAMBRETTI_MAPPING.get(self._zambretti_index(p_now, delta), "Stable")
        except Exception:
            _LOGGER.exception("Error updating ZambrettiSensor")

    @property
    def state(self):
        return self._state


class SagerSensor(WeatherSensorBase):

    def __init__(self, pressure_id, wind_id, temp_id, use_sea_level, altitude, device_id):
        super().__init__(device_id, pressure_id, temp_id, use_sea_level, altitude)
        self._wind_id = wind_id
        self._attr_name = "Sager Forecast"
        self._attr_unique_id = f"{pressure_id}_sager"
        self._state = "Calculating..."

    async def async_update(self):
        p_state = self.hass.states.get(self._pressure_id)
        if not p_state or p_state.state in ("unknown", "unavailable"):
            return
        try:
            p = self._get_corrected_pressure(float(p_state.state))

            if p > 1020:
                self._state = "Fair, No Change"
            elif p < 1005:
                self._state = "Unsettled, Rain"
            else:
                self._state = "Variable"
        except Exception:
            _LOGGER.exception("Error updating SagerSensor")

    @property
    def state(self):
        return self._state


class ZambrettiForecast6h(WeatherSensorBase):
    """Прогноз Zambretti на 6 часов вперёд на основе тренда за последние 3 часа."""

    def __init__(self, pressure_id, temp_id, use_sea_level, altitude, device_id):
        super().__init__(device_id, pressure_id, temp_id, use_sea_level, altitude)
        self._attr_name = "Zambretti Forecast 6h"
        self._attr_unique_id = f"{pressure_id}_zambretti_6h"
        self._state = "Calculating..."
        self._attr_icon = "mdi:weather-partly-cloudy"

    async def async_update(self):
        current_state = self.hass.states.get(self._pressure_id)
        if not current_state or current_state.state in ("unknown", "unavailable"):
            return
        try:
            p_now = self._get_corrected_pressure(float(current_state.state))
            p_old_raw = await self._get_history_pressure(3)
            p_old = self._get_corrected_pressure(p_old_raw) if p_old_raw is not None else p_now

            # Тренд за 3 часа → экстраполируем на 6 часов вперёд
            delta_3h = p_now - p_old
            predicted = p_now + delta_3h * 2  # 3ч тренд × 2 = 6ч прогноз

            self._state = ZAMBRETTI_MAPPING.get(self._zambretti_index(predicted, delta_3h), "Stable")
        except Exception:
            _LOGGER.exception("Error updating ZambrettiForecast6h")

    @property
    def state(self):
        return self._state


class ZambrettiForecast12h(WeatherSensorBase):
    """Прогноз Zambretti на 12 часов вперёд на основе тренда за последние 6 часов."""

    def __init__(self, pressure_id, temp_id, use_sea_level, altitude, device_id):
        super().__init__(device_id, pressure_id, temp_id, use_sea_level, altitude)
        self._attr_name = "Zambretti Forecast 12h"
        self._attr_unique_id = f"{pressure_id}_zambretti_12h"
        self._state = "Calculating..."
        self._attr_icon = "mdi:weather-cloudy"

    async def async_update(self):
        current_state = self.hass.states.get(self._pressure_id)
        if not current_state or current_state.state in ("unknown", "unavailable"):
            return
        try:
            p_now = self._get_corrected_pressure(float(current_state.state))
            p_old_raw = await self._get_history_pressure(6)
            p_old = self._get_corrected_pressure(p_old_raw) if p_old_raw is not None else p_now

            # Тренд за 6 часов → экстраполируем на 12 часов вперёд
            delta_6h = p_now - p_old
            predicted = p_now + delta_6h * 2  # 6ч тренд × 2 = 12ч прогноз

            self._state = ZAMBRETTI_MAPPING.get(self._zambretti_index(predicted, delta_6h), "Stable")
        except Exception:
            _LOGGER.exception("Error updating ZambrettiForecast12h")

    @property
    def state(self):
        return self._state


class ZambrettiForecast24h(WeatherSensorBase):
    """Прогноз Zambretti на 24 часа вперёд на основе тренда за последние 12 часов."""

    def __init__(self, pressure_id, temp_id, use_sea_level, altitude, device_id):
        super().__init__(device_id, pressure_id, temp_id, use_sea_level, altitude)
        self._attr_name = "Zambretti Forecast 24h"
        self._attr_unique_id = f"{pressure_id}_zambretti_24h"
        self._state = "Calculating..."
        self._attr_icon = "mdi:weather-sunset"

    async def async_update(self):
        current_state = self.hass.states.get(self._pressure_id)
        if not current_state or current_state.state in ("unknown", "unavailable"):
            return
        try:
            p_now = self._get_corrected_pressure(float(current_state.state))
            p_old_raw = await self._get_history_pressure(12)
            p_old = self._get_corrected_pressure(p_old_raw) if p_old_raw is not None else p_now

            # Тренд за 12 часов → экстраполируем на 24 часа вперёд
            delta_12h = p_now - p_old
            predicted = p_now + delta_12h * 2  # 12ч тренд × 2 = 24ч прогноз

            self._state = ZAMBRETTI_MAPPING.get(self._zambretti_index(predicted, delta_12h), "Stable")
        except Exception:
            _LOGGER.exception("Error updating ZambrettiForecast24h")

    @property
    def state(self):
        return self._state


class PrecipitationProbability(WeatherSensorBase):
    """Вероятность осадков на основе давления и его изменения."""

    def __init__(self, pressure_id, temp_id, use_sea_level, altitude, device_id):
        super().__init__(device_id, pressure_id, temp_id, use_sea_level, altitude)
        self._attr_name = "Precipitation Probability"
        self._attr_unique_id = f"{pressure_id}_precipitation_probability"
        self._state = 0
        self._attr_icon = "mdi:water-percent"
        self._attr_unit_of_measurement = "%"

    async def async_update(self):
        current_state = self.hass.states.get(self._pressure_id)
        if not current_state or current_state.state in ("unknown", "unavailable"):
            return
        try:
            p_now = self._get_corrected_pressure(float(current_state.state))
            p_old_raw = await self._get_history_pressure(3)
            p_old = self._get_corrected_pressure(p_old_raw) if p_old_raw is not None else p_now

            delta = p_now - p_old

            # Базовая вероятность по текущему давлению
            if p_now < 1000:
                base_prob = 90
            elif p_now < 1005:
                base_prob = 70
            elif p_now < 1010:
                base_prob = 50
            elif p_now < 1015:
                base_prob = 30
            elif p_now < 1020:
                base_prob = 15
            else:
                base_prob = 5

            # Корректировка по тренду
            if delta < -3.0:
                trend_modifier = 30
            elif delta < -1.6:
                trend_modifier = 15
            elif delta > 3.0:
                trend_modifier = -30
            elif delta > 1.6:
                trend_modifier = -15
            else:
                trend_modifier = 0

            self._state = round(max(0, min(100, base_prob + trend_modifier)))
        except Exception:
            _LOGGER.exception("Error updating PrecipitationProbability")

    @property
    def state(self):
        return self._state
