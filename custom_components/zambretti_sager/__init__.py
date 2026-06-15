import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .coordinator import async_create_coordinator

_LOGGER = logging.getLogger(__name__)
PLATFORMS: list[str] = ["sensor"]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Настройка интеграции при добавлении через интерфейс."""
    _LOGGER.info("Инициализация прогнозирования Zambretti & Sager для: %s", entry.title)

    hass.data.setdefault(DOMAIN, {})
    coordinator = await async_create_coordinator(hass, entry)
    hass.data[DOMAIN][entry.entry_id] = coordinator

    entry.async_on_unload(entry.add_update_listener(update_listener))

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Перезапуск интеграции при изменении опций."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Выгрузка при удалении."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok
