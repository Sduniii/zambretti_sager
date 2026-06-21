# Development

Information for contributors and developers.

---

## Project structure

```
zambretti_sager/
├── custom_components/zambretti_sager/
│   ├── __init__.py          # Entry point, frontend registration
│   ├── manifest.json        # Integration metadata
│   ├── config_flow.py       # UI setup (Config Flow)
│   ├── coordinator.py       # DataUpdateCoordinator
│   ├── sensor.py            # 6 sensors
│   ├── const.py             # Constants, Sager algorithm, Zambretti mapping
│   ├── pressure_util.py     # Pressure utilities, sea level correction
│   ├── strings.json         # Config flow strings
│   ├── translations/        # en.json, ru.json, fr.json
│   └── frontend/
│       ├── __init__.py
│       └── zambretti-weather-card.js
├── .github/workflows/
│   ├── hacs.yaml            # HACS validation
│   └── hassfest.yaml        # Home Assistant validation
├── hacs.json
├── pyproject.toml
├── CHANGELOG.md
└── README.md
```

---

## Key components

### Coordinator (`coordinator.py`)

- Polls the pressure sensor and history from the recorder
- Computes trend, Zambretti/Sager forecasts, precipitation probability
- Subscribes to pressure sensor state-change events (v1.9.2+)
- Update interval: 5 minutes

### Sensors (`sensor.py`)

6 sensor classes, all using coordinator data:

| Class | Unique ID suffix |
|---|---|
| `ZambrettiForecastSensor` | `_zambretti` |
| `SagerForecastSensor` | `_sager` |
| `ZambrettiForecast6hSensor` | `_zambretti_6h` |
| `ZambrettiForecast12hSensor` | `_zambretti_12h` |
| `ZambrettiForecast24hSensor` | `_zambretti_24h` |
| `PrecipitationProbabilitySensor` | `_precipitation` |

### Frontend card

- Web Component (`custom:zambretti-weather-card`)
- Registered via `frontend.add_extra_js_url`
- URL base: `/zambretti_sager_card`

---

## CI/CD

GitHub Actions validate every push/PR:

| Workflow | Check |
|---|---|
| `hassfest.yaml` | Manifest and integration structure validation |
| `hacs.yaml` | HACS compatibility |

---

## Local development

1. Clone the repository
2. Copy `custom_components/zambretti_sager` to your HA `config/custom_components/`
3. Enable debug logs:

```yaml
logger:
  logs:
    custom_components.zambretti_sager: debug
```

4. Restart HA or reload the integration

### Testing the card

After changing `zambretti-weather-card.js`:
- Clear browser cache
- Reload the dashboard
- Bump `version` in `JSMODULES` (const.py) for cache busting

---

## Code style

- Python 3.11+ type hints
- Async/await for all HA API calls
- Docstrings for internal functions
- Minimal, focused diffs

---

## Pull requests

1. Fork → feature branch
2. Update `CHANGELOG.md` and version in `manifest.json`
3. Ensure CI passes
4. Describe changes in the PR

---

## Dependencies

The integration has **no external Python dependencies** (`requirements: []` in manifest).

External services:
- **Open-Elevation API** — altitude lookup (HTTP, at startup)
- **Home Assistant Recorder** — pressure history
