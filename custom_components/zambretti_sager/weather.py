"""Weather platform for Zambretti & Sager."""
from __future__ import annotations

import datetime
import logging

from homeassistant.components.weather import (
    ATTR_CONDITION_CLEAR_NIGHT,
    ATTR_CONDITION_CLOUDY,
    ATTR_CONDITION_PARTLYCLOUDY,
    ATTR_CONDITION_POURING,
    ATTR_CONDITION_RAINY,
    ATTR_CONDITION_SUNNY,
    Forecast,
    WeatherEntity,
    WeatherEntityFeature,
)
from homeassistant.const import UnitOfPressure, UnitOfSpeed, UnitOfTemperature
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .const import DOMAIN, VERSION, ZAMBRETTI_MAPPING, calculate_sager_forecast
from .coordinator import ForecastData, ZambrettiSagerCoordinator
from .sensor import ZambrettiSensor

_LOGGER = logging.getLogger(__name__)

def zambretti_to_condition(z_str: str, is_night: bool) -> str:
    """Map Zambretti/Sager string to HA weather condition."""
    if not z_str:
        return ATTR_CONDITION_CLOUDY
        
    z_str = z_str.lower()
    
    # Sager mapping
    if "sager_" in z_str:
        if "rain_likely" in z_str or "rain_at_times" in z_str:
            return ATTR_CONDITION_RAINY
        if "fair_improving" in z_str or "fair_no_change" in z_str:
            return ATTR_CONDITION_CLEAR_NIGHT if is_night else ATTR_CONDITION_SUNNY
        if "fair" in z_str or "improving" in z_str or "fairer" in z_str:
            return ATTR_CONDITION_PARTLYCLOUDY
        return ATTR_CONDITION_CLOUDY

    # Zambretti mapping
    if "storm" in z_str:
        return ATTR_CONDITION_POURING
    if "rain" in z_str or "showery" in z_str:
        return ATTR_CONDITION_RAINY
        
    if "fine" in z_str and "showers" not in z_str and "rain" not in z_str and "unsettled" not in z_str:
        return ATTR_CONDITION_CLEAR_NIGHT if is_night else ATTR_CONDITION_SUNNY
        
    if "fine" in z_str or "fairly_fine" in z_str or "changeable" in z_str or "showery_early_improving" in z_str:
        return ATTR_CONDITION_PARTLYCLOUDY
        
    return ATTR_CONDITION_CLOUDY

async def async_setup_entry(hass, entry, async_add_entities):
    """Set up weather entity."""
    coordinator: ZambrettiSagerCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([ZambrettiWeatherEntity(coordinator)])

class ZambrettiWeatherEntity(CoordinatorEntity, WeatherEntity):
    """Weather entity for Zambretti & Sager."""

    _attr_has_entity_name = True
    _attr_name = "Zambretti Weather"
    _attr_supported_features = WeatherEntityFeature.FORECAST_DAILY | WeatherEntityFeature.FORECAST_HOURLY
    
    _attr_native_pressure_unit = UnitOfPressure.HPA
    _attr_native_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_native_wind_speed_unit = UnitOfSpeed.METERS_PER_SECOND

    def __init__(self, coordinator: ZambrettiSagerCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_weather"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, coordinator.entry.entry_id)},
            name="Weather Station",
            manufacturer="Zambretti & Sager",
            model="Software Forecaster",
            sw_version=VERSION,
        )

    @property
    def data(self) -> ForecastData | None:
        return self.coordinator.data

    def _calculate_precipitation(self, p_now: float, delta: float, humidity: float | None, rain_amount: float | None) -> tuple[int, float]:
        """Estimate precipitation probability (%) and return actual rain amount if available, else estimate."""
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

        humidity_modifier = 0
        if humidity is not None:
            if humidity >= 90:    humidity_modifier = 15
            elif humidity >= 80:  humidity_modifier = 10
            elif humidity >= 70:  humidity_modifier = 5
            elif humidity <= 30:  humidity_modifier = -15
            elif humidity <= 40:  humidity_modifier = -10

        prob = max(0, min(100, base_prob + trend_modifier + humidity_modifier))
        
        # Override probability if it's currently raining
        if rain_amount is not None and rain_amount > 0:
            prob = max(prob, 90)
            amount = rain_amount
        else:
            amount = 0.0
            if prob >= 90: amount = 5.0
            elif prob >= 70: amount = 2.5
            elif prob >= 50: amount = 1.0
            elif prob >= 30: amount = 0.2
            
        return prob, amount

    @property
    def condition(self) -> str | None:
        d = self.data
        if not d or not d.available or d.p_now is None:
            return None
            
        p_3h = d.p_history.get(3, d.p_now)
        delta = d.p_now - p_3h
        
        if d.wind_degrees is not None:
            z_str = calculate_sager_forecast(d.p_now, delta, d.wind_degrees)
        else:
            z_index = ZambrettiSensor._zambretti_index(d.p_now, delta)
            z_str = ZAMBRETTI_MAPPING.get(z_index, "stable")
        
        return zambretti_to_condition(z_str, d.is_night)

    @property
    def native_pressure(self) -> float | None:
        d = self.data
        if d and d.p_now is not None:
            return round(d.p_now, 1)
        return None

    @property
    def humidity(self) -> float | None:
        d = self.data
        if d and d.humidity is not None:
            return round(d.humidity, 1)
        return None

    @property
    def native_wind_speed(self) -> float | None:
        d = self.data
        if d and d.wind_speed is not None:
            return round(d.wind_speed, 1)
        return None
        
    @property
    def wind_bearing(self) -> float | None:
        d = self.data
        if d and d.wind_degrees is not None:
            return round(d.wind_degrees, 1)
        return None

    @property
    def native_temperature(self) -> float | None:
        return self.coordinator._get_temperature()

    def _get_forecast(self, target_hours: int) -> Forecast:
        d = self.data
        best_hour = target_hours if target_hours <= 24 else 24
        
        if d.p_history:
            hours_ref = min(d.p_history.keys(), key=lambda h: abs(h - best_hour))
            p_ref = d.p_history[hours_ref]
        else:
            hours_ref = 1
            p_ref = d.p_now

        delta = (d.p_now - p_ref) / hours_ref * target_hours if hours_ref else 0
        predicted_p = d.p_now + delta
        
        if d.wind_degrees is not None:
            z_str = calculate_sager_forecast(predicted_p, delta, d.wind_degrees)
        else:
            z_index = ZambrettiSensor._zambretti_index(predicted_p, delta)
            z_str = ZAMBRETTI_MAPPING.get(z_index, "stable")
            
        condition = zambretti_to_condition(z_str, False)
        
        prob, amount = self._calculate_precipitation(predicted_p, delta, d.humidity, d.rain_amount)
        
        dt = dt_util.utcnow() + datetime.timedelta(hours=target_hours)
        return {
            "datetime": dt.isoformat(),
            "condition": condition,
            "native_pressure": round(predicted_p, 1),
            "native_temperature": self.native_temperature,
            "native_wind_speed": self.native_wind_speed,
            "wind_bearing": self.wind_bearing,
            "humidity": self.humidity,
            "precipitation_probability": prob,
            "native_precipitation": amount,
        }

    async def async_forecast_daily(self) -> list[Forecast] | None:
        """Return the daily forecast extrapolated up to 5 days."""
        if not self.data or not self.data.available or self.data.p_now is None:
            return None
        return [self._get_forecast(days * 24) for days in range(1, 6)]

    async def async_forecast_hourly(self) -> list[Forecast] | None:
        """Return the hourly forecast for the next 24 hours."""
        if not self.data or not self.data.available or self.data.p_now is None:
            return None
        return [self._get_forecast(h) for h in range(1, 25)]
