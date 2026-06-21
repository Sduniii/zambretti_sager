# Installation

## Via HACS (recommended)

### One-click install

[![Install with HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ziffmafiya&repository=zambretti_sager&category=integration)

### Manual HACS setup

1. Open **HACS → Integrations**
2. Click **⋮ → Custom repositories**
3. Add URL: `https://github.com/ziffmafiya/zambretti_sager`
4. Category: **Integration**
5. Click **Install**
6. Restart Home Assistant

---

## Manual installation

1. Copy the `custom_components/zambretti_sager` folder into your Home Assistant `custom_components` directory
2. Restart Home Assistant

Expected structure after installation:

```
config/
└── custom_components/
    └── zambretti_sager/
        ├── __init__.py
        ├── manifest.json
        ├── config_flow.py
        ├── coordinator.py
        ├── sensor.py
        ├── const.py
        ├── pressure_util.py
        ├── strings.json
        ├── translations/
        └── frontend/
            └── zambretti-weather-card.js
```

---

## First run

After installation and restart:

[![Open in Home Assistant](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=zambretti_sager)

Or go to **Settings → Devices & Services → Add Integration → Zambretti and Sager**

Then follow the steps on the [Configuration](Configuration) page.

---

## Updating

### HACS
HACS will show available updates automatically. Install the new version and restart HA.

### Manual
Replace the contents of `custom_components/zambretti_sager` with the latest version from the repository and restart HA.

---

## Uninstalling

1. **Settings → Devices & Services → Zambretti and Sager → Delete**
2. Remove the `custom_components/zambretti_sager` folder
3. Restart Home Assistant
