"""Lovelace card registration for Zambretti & Sager integration."""
import logging
from pathlib import Path
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

CARD_URL = "/zambretti_sager/zambretti-barometer-card.js"
CARD_PATH = Path(__file__).parent / "zambretti-barometer-card.js"


async def async_register_card(hass: HomeAssistant) -> None:
    """Register the Zambretti Barometer card."""
    try:
        # Регистрируем URL для карточки
        await hass.http.async_register_static_path(
            CARD_URL,
            str(CARD_PATH),
            cache_headers=False
        )

        # Добавляем JS в frontend
        add_extra_js_url(hass, CARD_URL)

        _LOGGER.info("Zambretti Barometer Card registered successfully at %s", CARD_URL)
    except Exception as e:
        _LOGGER.error("Failed to register Zambretti Barometer Card: %s", e)
