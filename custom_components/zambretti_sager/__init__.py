import logging
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.components.lovelace import _register_panel

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)
PLATFORMS: list[str] = ["sensor"]

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Настройка интеграции при старте Home Assistant."""
    # Регистрируем ресурс для карточки
    from pathlib import Path
    card_path = Path(__file__).parent / "zambretti-barometer-card.js"
    card_url = f"/zambretti_sager_card/zambretti-barometer-card.js"

    hass.http.register_static_path(card_url, str(card_path), cache_headers=False)

    # Добавляем ресурс в lovelace
    if "lovelace" not in hass.data:
        hass.data["lovelace"] = {"resources": []}

    if "resources" not in hass.data["lovelace"]:
        hass.data["lovelace"]["resources"] = []

    hass.data["lovelace"]["resources"].append({
        "url": card_url,
        "type": "module"
    })

    _LOGGER.info("Zambretti Barometer Card registered at %s", card_url)
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Настройка интеграции при добавлении через интерфейс."""
    _LOGGER.info("Инициализация прогнозирования Zambretti & Sager для: %s", entry.title)

    entry.async_on_unload(entry.add_update_listener(update_listener))

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True

async def update_listener(hass: HomeAssistant, entry: ConfigEntry):
    """Перезапуск интеграции при изменении опций."""
    await hass.config_entries.async_reload(entry.entry_id)

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Выгрузка при удалении."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)