# Zambretti Barometer Card

Beautiful Lovelace card for visualizing weather forecasts with an animated barometer gauge.

## Features

- 🎨 **Animated Barometer Gauge** - Circular gauge with gradient design
- 📊 **Pressure Trend Arrow** - Visual indicator of pressure changes
- 🌈 **Color-Coded Forecasts** - Green (good weather), Yellow (cloudy), Orange (unsettled), Red (storms)
- 🌧️ **Precipitation Bar** - Visual percentage of rain probability
- 🎭 **Animated Weather Icons** - Floating emoji icons based on forecast
- 📈 **Trend Indicator** - Shows if pressure is rising, falling, or steady

## Installation

### Method 1: Manual Installation

1. Copy `zambretti-barometer-card.js` to your `www` folder in Home Assistant
2. Add the resource in your Lovelace configuration:

```yaml
resources:
  - url: /local/zambretti-barometer-card.js
    type: module
```

3. Restart Home Assistant

### Method 2: HACS (Coming Soon)

This card will be available through HACS in the future.

## Configuration

Add the card to your Lovelace dashboard:

```yaml
type: custom:zambretti-barometer-card
pressure_entity: sensor.your_pressure_sensor
zambretti_entity: sensor.zambretti_forecast
precipitation_entity: sensor.precipitation_probability
```

### Configuration Options

| Option | Required | Description |
|--------|----------|-------------|
| `pressure_entity` | Yes | Entity ID of your pressure sensor |
| `zambretti_entity` | Yes | Entity ID of Zambretti forecast sensor |
| `precipitation_entity` | No | Entity ID of precipitation probability sensor |

## Example Configuration

```yaml
type: custom:zambretti-barometer-card
pressure_entity: sensor.bme280_pressure
zambretti_entity: sensor.zambretti_forecast
precipitation_entity: sensor.precipitation_probability
```

## Visual Guide

### Color Indicators

- 🟢 **Green** - Fair weather, low precipitation chance
- 🟡 **Yellow** - Cloudy or variable conditions
- 🟠 **Orange** - Unsettled weather, moderate rain chance
- 🔴 **Red** - Storms or heavy rain expected

### Trend Arrow

- ⬆️ **Up** - Pressure rising (improving weather)
- ➡️ **Right** - Pressure steady (stable conditions)
- ⬇️ **Down** - Pressure falling (worsening weather)

### Weather Icons

- ☀️ Fair/Fine weather
- 🌤️ Settled conditions
- ☁️ Cloudy
- 🌥️ Partly cloudy
- 🌦️ Showers
- 🌧️ Rain
- ⛈️ Storms

## Screenshots

The card features:
- Large, easy-to-read pressure display
- Smooth animations and transitions
- Responsive design that works on mobile and desktop
- Dark mode support

## Troubleshooting

**Card not showing:**
- Make sure the resource is added to your Lovelace configuration
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors

**Sensors not found:**
- Verify entity IDs are correct
- Make sure Zambretti & Sager integration is installed and configured

## Credits

Created for the Zambretti & Sager Weather Forecaster integration.
