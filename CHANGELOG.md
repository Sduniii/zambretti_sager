# Changelog

## [1.9.5] — 2026-06-21

### Fixed
- **Conflict when configuring multiple instances** — removed manual `self.entity_id` assignments from all 6 sensor classes; HA now auto-generates entity IDs from unique IDs
- **Pressure watcher subscription leak on unload** — `_stop_pressure_watcher()` is now called in `async_unload_entry` to prevent stale callbacks and memory leaks
- **Dead code in precipitation probability** — humidity `<= 30%` branch was never reached because `<= 40%` was checked first; corrected evaluation order
- **History pressure retrieval** — now searches within a ±15-minute window and picks the nearest state to the target time instead of the oldest state in the range
- **Sea-level warning not reset** — `_sea_level_warning_logged` flag is now cleared when the pressure sensor changes in options
- **Missing `humidity_sensor` in `strings.json`** — added the field to config and options flows so it appears in HA UI for non-English languages
- **Division before guard in sea-level formula** — `factor <= 0` check now protects the exponentiation step as intended

---

## [1.9.4] — 2026-06-16

### Fixed
- **hassfest validation errors** — two issues reported by the HA CI pipeline:
  - Added `lovelace` to `dependencies` in `manifest.json` (required when using the lovelace/frontend card registration)
  - Added `CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)` in `__init__.py` (required when `async_setup` is defined but the integration has no YAML configuration)

---

## [1.9.3] — 2026-06-16

### Fixed
- **Card language setting now translates forecast text** — previously, sensors had `_attr_translation_key` set, which caused HA to translate state values via `translations/en.json` before the card reads them. So `hass.states[...].state` returned already-translated text like `"Settled Fine"` instead of the raw key `"settled_fine"`, making the card unable to look it up in `LABELS_RU`. Removed `_attr_translation_key` from all forecast sensors — they now always return raw keys, and the card handles all translation itself based on the card's language setting.

---

## [1.9.2] — 2026-06-16

### Fixed
- **Sensors stay unavailable after HA restart** — root cause was that HA loads integrations before all sensor states are restored. The coordinator now subscribes to state-change events on the pressure sensor and triggers a refresh the moment it becomes available, instead of waiting up to 5 minutes for the next scheduled poll.

---

## [1.9.1] — 2026-06-16

### Fixed
- **Sensors unavailable after fresh install** — all sensors now show a value immediately after setup, without waiting for pressure history to accumulate. When history is not yet available, delta is treated as 0 (steady trend). Extended forecasts (6h/12h/24h) use the best available history window and scale accordingly.

---

## [1.9.0] — 2026-06-16

### Changed
- **Sunny condition** — warm orange gradient (`#C65A00 → #F2820A → #FFAA33 → #FFD580`) instead of blue, matching iOS Weather app style
- **Card editor** — removed Compact mode toggle (simplified UI)

### Added
- **Auto theme toggle** — new switch in card settings; when enabled (default) the background follows the weather condition automatically; when disabled the user can set a custom background
- **Custom background picker** — color swatch opens a native color picker with live preview; text field accepts any CSS value (`#hex`, `linear-gradient(...)`, etc.)
- **Live preview** — background color updates the card in real time while the picker is open, without closing it (uses `window` custom event bridge across shadow DOM)

---

## [1.7.1] — 2026-06-15

### Fixed
- **Duplicate recorder queries** — all sensors share one `DataUpdateCoordinator` update cycle
- **Entity unique IDs** — based on config entry ID, stable when pressure sensor changes in options
- **History parsing** — handles recorder `State` objects and compressed dict responses
- **Optional sensors** — empty wind/temperature selections are cleared instead of saved as blank strings

### Changed
- Sensors use `CoordinatorEntity` and `_attr_native_value` (modern Home Assistant pattern)
- Wind and temperature selectors filter by `wind_direction` and `temperature` device classes
- Options flow uses the current `config_entry` API

---

## [1.7.0] — 2026-06-15

### Fixed
- **Sager forecast** — now uses pressure trend (3 h) and wind direction when available
- **Pressure units** — automatic conversion to hPa (Pa, inHg, mmHg, etc.)
- **Sea level correction** — skips correction when sensor already reports sea level pressure
- **Unavailable state** — sensors mark themselves unavailable when pressure data is missing
- **Extended forecasts** — extrapolated delta is used consistently for 6h/12h/24h Zambretti forecasts
- **Coordinates (0, 0)** — no longer treated as missing location
- **Duplicate integrations** — config flow aborts if the same pressure sensor is already configured
- **Elevation API** — uses Home Assistant shared aiohttp session instead of creating a new one

### Changed
- Pressure sensor selector in config flow filters by `atmospheric_pressure` device class

---

## [1.4.0] — 2026-06-15

### Added
- **Localization support** — the config flow and options UI now automatically use the language set in your Home Assistant profile. English (`en`) and Russian (`ru`) are fully supported out of the box. Any other language falls back to English.
  - Added `translations/en.json`
  - Added `translations/ru.json`
  - Updated `strings.json` with `abort` messages

### Removed
- **Zambretti Barometer Card** — the built-in Lovelace card has been removed from the integration.
  - Deleted `custom_components/zambretti_sager/zambretti-barometer-card.js`
  - Deleted `www/zambretti-barometer-card.js`
  - Deleted `www/README.md`
  - Removed `async_setup` function and card HTTP serving code from `__init__.py`
  - Removed `frontend` and `http` from `manifest.json` dependencies

### Changed
- `manifest.json` — bumped version to `1.4.0`, cleaned up dependencies
- `README.md` — updated version badge, rewrote changelog section, removed card documentation, added localization section
- `info.md` — updated description to reflect v1.4.0 changes

---

## [1.3.0]

### Added
- Built-in Zambretti Barometer Card (bundled with the integration)
- Automatic card registration via `add_extra_js_url`

---

## [1.2.0]

### Added
- Sea level pressure correction using Open-Elevation API
- Interactive map selector in config flow for location/altitude detection
- Temperature sensor support for precise pressure correction

---

## [1.1.0]

### Added
- Extended forecasts: Zambretti 6h, 12h, 24h sensors
- Precipitation Probability sensor (0–100%)
- Options flow — reconfigure sensors without reinstalling

---

## [1.0.0]

### Added
- Initial release
- Zambretti Forecast sensor (32 states)
- Sager Forecast sensor
- Config flow with pressure and wind sensor selection
