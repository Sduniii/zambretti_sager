import logging
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)
PLATFORMS: list[str] = ["sensor"]

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Настройка интеграции при добавлении через интерфейс."""
    _LOGGER.info("Инициализация прогнозирования Zambretti & Sager для: %s", entry.title)

    # ИСПРАВЛЕНИЕ: Правильный метод — add_update_listener
    # Он регистрирует функцию, которая сработает при нажатии кнопки "Сохранить" в настройках
    entry.async_on_unload(entry.add_update_listener(update_listener))

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True

async def update_listener(hass: HomeAssistant, entry: ConfigEntry):
    """Перезапуск интеграции при изменении опций."""
    await hass.config_entries.async_reload(entry.entry_id)

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Выгрузка при удалении."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)