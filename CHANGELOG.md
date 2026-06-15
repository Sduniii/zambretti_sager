# Changelog

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
