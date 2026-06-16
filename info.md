# Zambretti & Sager Weather Forecaster

Classic barometric weather forecasting for Home Assistant. No cloud, no API keys — just your local sensors.

## What does it do?

Provides weather forecasts based on barometric pressure trends using two proven algorithms:

- **Zambretti** — analyzes pressure changes over 3 hours, produces 32 different forecasts
- **Sager** — uses current pressure and wind direction for a quick three-state prediction

Extended forecasts for **6h, 12h, and 24h** ahead, plus a **precipitation probability** sensor.

## Why use it?

- Works fully offline with your local weather station
- No API keys or cloud services required
- Based on meteorological methods used for over 100 years
- Automatic altitude correction for accurate sea-level pressure conversion
- Supports **English and Russian** — UI adapts to your Home Assistant language setting

## What's new in v1.7.0

- 🐛 Bug fixes for Sager forecast, pressure units, and sea level correction
- ✅ Sensors go unavailable when pressure data is missing
- 🔒 Config flow prevents duplicate integrations

## Previous: v1.4.0

- 🌐 Full localization support (English + Russian)
- 🧹 Removed built-in card — cleaner, lighter integration
- ⚙️ Removed unused frontend and HTTP dependencies

## Setup

1. Install via HACS
2. Add the integration under **Settings → Devices & Services**
3. Select your pressure, wind, and temperature sensors
4. Click on the map to set your location
5. Enable sea level correction if needed

Six sensors are created automatically and grouped under one device.

## Requirements

- Barometric pressure sensor (hPa)
- Wind direction sensor (degrees, optional but recommended for Sager)
- Temperature sensor (optional, for altitude correction)

## Custom Lovelace Card

An iOS-style weather widget card is **included and registered automatically** — no manual resource setup needed.

After installing the integration via HACS and restarting Home Assistant, just add the card to any dashboard:

```yaml
type: custom:zambretti-weather-card
```

That's it. All entity IDs use defaults (`sensor.zambretti_forecast`, etc.). Override them only if you renamed the entities:

```yaml
type: custom:zambretti-weather-card
entity_zambretti: sensor.zambretti_forecast
entity_sager: sensor.sager_forecast
entity_6h: sensor.zambretti_forecast_6h
entity_12h: sensor.zambretti_forecast_12h
entity_24h: sensor.zambretti_forecast_24h
entity_precip: sensor.precipitation_probability
language: auto   # "en" | "ru" | "auto"
```
