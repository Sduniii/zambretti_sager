from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.const import PERCENTAGE
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    DOMAIN,
    VERSION,
    ZAMBRETTI_MAPPING,
    calculate_sager_forecast,
)
from .coordinator import ForecastData, ZambrettiSagerCoordinator


async def async_setup_entry(hass, entry, async_add_entities):
    """Настройка сенсоров."""
    coordinator: ZambrettiSagerCoordinator = hass.data[DOMAIN][entry.entry_id]

    async_add_entities([
        ZambrettiSensor(coordinator),
        SagerSensor(coordinator),
        ZambrettiForecast6h(coordinator),
        ZambrettiForecast12h(coordinator),
        ZambrettiForecast24h(coordinator),
        PrecipitationProbability(coordinator),
    ])


class WeatherSensorBase(CoordinatorEntity, SensorEntity):
    """Базовый класс сенсоров прогноза."""

    def __init__(self, coordinator: ZambrettiSagerCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, coordinator.entry.entry_id)},
            name="Weather Station",
            manufacturer="Zambretti & Sager",
            model="Software Forecaster",
            sw_version=VERSION,
        )

    @property
    def _data(self) -> ForecastData | None:
        """Текущие данные координатора."""
        return self.coordinator.data

    @staticmethod
    def _zambretti_index(p_now: float, delta: float) -> int:
        """Вычислить индекс Замбретти (1–32)."""
        if delta <= -1.6:
            z = round(127 - 0.12 * p_now)
        elif delta >= 1.6:
            z = round(185 - 0.16 * p_now)
        else:
            z = round(144 - 0.13 * p_now)
        return max(1, min(z, 32))

    def _set_unavailable(self) -> None:
        """Пометить сенсор недоступным."""
        self._attr_available = False


class ZambrettiSensor(WeatherSensorBase):
    """Текущий прогноз Замбретти на основе тренда за 3 часа."""

    def __init__(self, coordinator: ZambrettiSagerCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_name = "Zambretti Forecast"
        self._attr_unique_id = f"{coordinator.entry.entry_id}_zambretti"
        self.entity_id = "sensor.zambretti_forecast"

    def _handle_coordinator_update(self) -> None:
        data = self._data
        if not data or not data.available or data.p_now is None or data.p_3h is None:
            self._set_unavailable()
            return
        delta = data.p_now - data.p_3h
        self._attr_available = True
        self._attr_native_value = ZAMBRETTI_MAPPING.get(
            self._zambretti_index(data.p_now, delta), "Stable"
        )


class SagerSensor(WeatherSensorBase):
    """Прогноз Сейгера на основе давления, тренда и направления ветра."""

    def __init__(self, coordinator: ZambrettiSagerCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_name = "Sager Forecast"
        self._attr_unique_id = f"{coordinator.entry.entry_id}_sager"
        self.entity_id = "sensor.sager_forecast"

    def _handle_coordinator_update(self) -> None:
        data = self._data
        if not data or not data.available or data.p_now is None or data.p_3h is None:
            self._set_unavailable()
            return
        delta = data.p_now - data.p_3h
        self._attr_available = True
        self._attr_native_value = calculate_sager_forecast(
            data.p_now, delta, data.wind_degrees
        )


class ZambrettiForecast6h(WeatherSensorBase):
    """Прогноз на 6 ч: тренд за 3 ч × 2."""

    def __init__(self, coordinator: ZambrettiSagerCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_name = "Zambretti Forecast 6h"
        self._attr_unique_id = f"{coordinator.entry.entry_id}_zambretti_6h"
        self._attr_icon = "mdi:weather-partly-cloudy"
        self.entity_id = "sensor.zambretti_forecast_6h"

    def _handle_coordinator_update(self) -> None:
        data = self._data
        if not data or not data.available or data.p_now is None or data.p_3h is None:
            self._set_unavailable()
            return
        delta_6h = (data.p_now - data.p_3h) * 2
        predicted = data.p_now + delta_6h
        self._attr_available = True
        self._attr_native_value = ZAMBRETTI_MAPPING.get(
            self._zambretti_index(predicted, delta_6h), "Stable"
        )


class ZambrettiForecast12h(WeatherSensorBase):
    """Прогноз на 12 ч: тренд за 6 ч × 2."""

    def __init__(self, coordinator: ZambrettiSagerCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_name = "Zambretti Forecast 12h"
        self._attr_unique_id = f"{coordinator.entry.entry_id}_zambretti_12h"
        self._attr_icon = "mdi:weather-cloudy"
        self.entity_id = "sensor.zambretti_forecast_12h"

    def _handle_coordinator_update(self) -> None:
        data = self._data
        if not data or not data.available or data.p_now is None or data.p_6h is None:
            self._set_unavailable()
            return
        delta_12h = (data.p_now - data.p_6h) * 2
        predicted = data.p_now + delta_12h
        self._attr_available = True
        self._attr_native_value = ZAMBRETTI_MAPPING.get(
            self._zambretti_index(predicted, delta_12h), "Stable"
        )


class ZambrettiForecast24h(WeatherSensorBase):
    """Прогноз на 24 ч: тренд за 12 ч × 2."""

    def __init__(self, coordinator: ZambrettiSagerCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_name = "Zambretti Forecast 24h"
        self._attr_unique_id = f"{coordinator.entry.entry_id}_zambretti_24h"
        self._attr_icon = "mdi:weather-sunset"
        self.entity_id = "sensor.zambretti_forecast_24h"

    def _handle_coordinator_update(self) -> None:
        data = self._data
        if not data or not data.available or data.p_now is None or data.p_12h is None:
            self._set_unavailable()
            return
        delta_24h = (data.p_now - data.p_12h) * 2
        predicted = data.p_now + delta_24h
        self._attr_available = True
        self._attr_native_value = ZAMBRETTI_MAPPING.get(
            self._zambretti_index(predicted, delta_24h), "Stable"
        )


class PrecipitationProbability(WeatherSensorBase):
    """Вероятность осадков на основе давления и тренда за 3 часа."""

    def __init__(self, coordinator: ZambrettiSagerCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_name = "Precipitation Probability"
        self._attr_unique_id = f"{coordinator.entry.entry_id}_precipitation_probability"
        self._attr_icon = "mdi:water-percent"
        self._attr_native_unit_of_measurement = PERCENTAGE
        self._attr_state_class = SensorStateClass.MEASUREMENT
        self.entity_id = "sensor.precipitation_probability"

    def _handle_coordinator_update(self) -> None:
        data = self._data
        if not data or not data.available or data.p_now is None or data.p_3h is None:
            self._set_unavailable()
            return

        delta = data.p_now - data.p_3h
        p_now = data.p_now

        if p_now < 1000:       base_prob = 90
        elif p_now < 1005:     base_prob = 70
        elif p_now < 1010:     base_prob = 50
        elif p_now < 1015:     base_prob = 30
        elif p_now < 1020:     base_prob = 15
        else:                  base_prob = 5

        if delta < -3.0:       trend_modifier = 30
        elif delta < -1.6:     trend_modifier = 15
        elif delta > 3.0:      trend_modifier = -30
        elif delta > 1.6:      trend_modifier = -15
        else:                  trend_modifier = 0

        self._attr_available = True
        self._attr_native_value = round(max(0, min(100, base_prob + trend_modifier)))
