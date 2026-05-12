from __future__ import annotations
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector
from .const import (
    DOMAIN,
    CONF_PRESSURE_SENSOR,
    CONF_WIND_SENSOR,
    CONF_TEMPERATURE_SENSOR,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_USE_SEA_LEVEL
)

CONF_LOCATION = "location"

class ZambrettiSagerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            # Извлекаем координаты из location, если они есть
            if CONF_LOCATION in user_input:
                location = user_input.pop(CONF_LOCATION)
                user_input[CONF_LATITUDE] = location.get("latitude")
                user_input[CONF_LONGITUDE] = location.get("longitude")

            return self.async_create_entry(title="Weather Forecaster", data=user_input)

        # Получаем координаты Home Assistant по умолчанию
        default_location = {
            "latitude": self.hass.config.latitude,
            "longitude": self.hass.config.longitude,
        }

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_PRESSURE_SENSOR): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor")
                ),
                vol.Required(CONF_WIND_SENSOR): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor")
                ),
                vol.Optional(CONF_TEMPERATURE_SENSOR): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor")
                ),
                vol.Optional(CONF_USE_SEA_LEVEL, default=False): selector.BooleanSelector(),
                vol.Optional(CONF_LOCATION, default=default_location): selector.LocationSelector(
                    selector.LocationSelectorConfig(radius=False, icon="mdi:map-marker")
                ),
            })
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return ZambrettiSagerOptionsFlowHandler(config_entry)

class ZambrettiSagerOptionsFlowHandler(config_entries.OptionsFlow):
    def __init__(self, config_entry):
        super().__init__()
        self._config_entry = config_entry

    async def async_step_init(self, user_input=None):
        if user_input is not None:
            # Извлекаем координаты из location, если они есть
            if CONF_LOCATION in user_input:
                location = user_input.pop(CONF_LOCATION)
                user_input[CONF_LATITUDE] = location.get("latitude")
                user_input[CONF_LONGITUDE] = location.get("longitude")

            return self.async_create_entry(title="", data=user_input)

        # Получаем текущие значения
        current_pressure = (
            self._config_entry.options.get(CONF_PRESSURE_SENSOR)
            or self._config_entry.data.get(CONF_PRESSURE_SENSOR)
        )
        current_wind = (
            self._config_entry.options.get(CONF_WIND_SENSOR)
            or self._config_entry.data.get(CONF_WIND_SENSOR)
        )
        current_temp = (
            self._config_entry.options.get(CONF_TEMPERATURE_SENSOR)
            or self._config_entry.data.get(CONF_TEMPERATURE_SENSOR)
        )
        current_use_sea_level = (
            self._config_entry.options.get(CONF_USE_SEA_LEVEL)
            if CONF_USE_SEA_LEVEL in self._config_entry.options
            else self._config_entry.data.get(CONF_USE_SEA_LEVEL, False)
        )
        current_lat = (
            self._config_entry.options.get(CONF_LATITUDE)
            or self._config_entry.data.get(CONF_LATITUDE)
        )
        current_lon = (
            self._config_entry.options.get(CONF_LONGITUDE)
            or self._config_entry.data.get(CONF_LONGITUDE)
        )

        # Формируем location для карты
        if current_lat and current_lon:
            default_location = {
                "latitude": current_lat,
                "longitude": current_lon,
            }
        else:
            # Используем координаты Home Assistant по умолчанию
            default_location = {
                "latitude": self.hass.config.latitude,
                "longitude": self.hass.config.longitude,
            }

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required(CONF_PRESSURE_SENSOR, default=current_pressure): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor")
                ),
                vol.Required(CONF_WIND_SENSOR, default=current_wind): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor")
                ),
                vol.Optional(CONF_TEMPERATURE_SENSOR, default=current_temp): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor")
                ),
                vol.Optional(CONF_USE_SEA_LEVEL, default=current_use_sea_level): selector.BooleanSelector(),
                vol.Optional(CONF_LOCATION, default=default_location): selector.LocationSelector(
                    selector.LocationSelectorConfig(radius=False, icon="mdi:map-marker")
                ),
            }),
        )