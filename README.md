# Zambretti & Sager Weather Forecaster

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
![Version](https://img.shields.io/badge/version-1.9.3-blue.svg)

A Home Assistant custom integration that provides weather forecasting using the classic Zambretti and Sager algorithms based on barometric pressure trends.

<img src="https://raw.githubusercontent.com/ziffmafiya/zambretti_sager/main/logo.png" alt="Zambretti & Sager Logo" width="400">

## 🎉 What's New in v1.9.0

- **Sunny theme** — warm orange gradient for sunny conditions (like iOS Weather app), instead of blue
- **Custom card background** — new toggle in card settings: when disabled, you can pick any background color or CSS gradient for the card
- **Live color preview** — color picker updates the card in real time without closing the picker
- **Compact mode removed** — simplified card editor

## Previous: v1.4.0

- **Localization support** — the setup UI now automatically adapts to your Home Assistant language. English and Russian are fully supported. Change your language in your HA profile and the integration follows.
- **Removed built-in card** — the Zambretti Barometer Card has been removed from the integration. Use standard Lovelace cards or any community card to display your sensors.
- **Cleaner codebase** — removed unused frontend and HTTP dependencies.

## Features

- **Zambretti Forecast** — 32 different weather predictions based on pressure trends over 3 hours
- **Sager Forecast** — weather prediction based on current pressure and wind direction
- **Extended Forecasts** — predictions for 6, 12, and 24 hours ahead
- **Precipitation Probability** — percentage chance of rain based on pressure trends
- **Sea Level Pressure Correction** — automatic altitude-based pressure correction for accurate forecasts
- **Interactive Map Selection** — choose your location on a map for automatic altitude detection
- **Temperature Compensation** — uses temperature sensor for precise pressure correction
- **Localization** — English and Russian UI out of the box

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to **Integrations**
3. Click the three dots → **Custom repositories**
4. Add `https://github.com/ziffmafiya/zambretti_sager` with category **Integration**
5. Find **Zambretti & Sager Weather Forecaster** and install it
6. Restart Home Assistant

### Manual Installation

1. Copy `custom_components/zambretti_sager` to your Home Assistant `custom_components` directory
2. Restart Home Assistant

## Configuration

1. Go to **Settings** → **Devices & Services**
2. Click **Add Integration**
3. Search for **Zambretti and Sager**
4. Follow the setup wizard:
   - Select your **pressure sensor** (absolute or sea level pressure)
   - Select your **wind direction sensor**
   - (Optional) Select your **temperature sensor** for accurate sea level correction
   - Enable **sea level pressure correction** if using an absolute pressure sensor
   - Click on the **map** to select your weather station location
5. Click **Submit**

## Sensors

The integration creates six sensors grouped under a single device:

| Sensor | Description |
|---|---|
| **Zambretti Forecast** | Current detailed weather prediction (32 states) |
| **Sager Forecast** | Simplified weather prediction |
| **Zambretti Forecast 6h** | Prediction for 6 hours ahead |
| **Zambretti Forecast 12h** | Prediction for 12 hours ahead |
| **Zambretti Forecast 24h** | Prediction for 24 hours ahead |
| **Precipitation Probability** | Chance of rain, 0–100% |

## How It Works

### Zambretti Algorithm

Analyzes barometric pressure trends over the past 3 hours:

- **Falling** (≤ −1.6 hPa) — worsening weather
- **Steady** (−1.6 to +1.6 hPa) — stable conditions
- **Rising** (≥ +1.6 hPa) — improving weather

The result maps to one of 32 classical weather descriptions.

### Sager Algorithm

Uses current pressure and wind direction:

- **> 1020 hPa** — Fair, No Change
- **< 1005 hPa** — Unsettled, Rain
- **1005–1020 hPa** — Variable

### Sea Level Pressure Correction

When enabled, the integration fetches your altitude from Open-Elevation API using the map location, then applies the barometric formula:

```
P_sea = P_abs / (1 − (0.0065 × h) / (T + 0.0065 × h + 273.15))^5.257
```

## Localization

The setup UI is available in:

- 🇬🇧 **English** — default
- 🇷🇺 **Russian** — автоматически при языке `ru` в профиле HA

To change the language, go to your **HA profile → Language**.

## Requirements

- Home Assistant 2024.1.0 or newer
- A barometric pressure sensor (hPa)
- A wind direction sensor (degrees, optional but recommended for Sager)
- A temperature sensor (optional, for sea level correction)

## Troubleshooting

**Forecast shows "Calculating..." or "Initializing..."**
Wait a few minutes — the integration needs pressure history to calculate trends. Make sure the pressure sensor is providing valid data.

**Inaccurate forecasts**
Enable sea level correction if you're above sea level, verify the map location, and make sure the temperature sensor is working.

**Altitude not detected**
The integration uses the [Open-Elevation API](https://open-elevation.com). Check that your Home Assistant instance has internet access. Altitude is fetched once at startup.

## Credits

- **Zambretti Algorithm** — developed by Negretti and Zambra in the early 1900s
- **Sager Algorithm** — developed by meteorologist Raymond Sager
- **Integration Author** — Maksym ([@ziffmafiya](https://github.com/ziffmafiya))

## License

MIT License — see [LICENSE](LICENSE) for details.

## Support

Found a bug or have a suggestion? [Open an issue](https://github.com/ziffmafiya/zambretti_sager/issues) on GitHub.
