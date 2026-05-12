# Zambretti & Sager Weather Forecaster

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)

A Home Assistant custom integration that provides weather forecasting using the classic Zambretti and Sager algorithms based on barometric pressure trends.

<img src="https://raw.githubusercontent.com/ziffmafiya/zambretti_sager/main/logo.png" alt="Zambretti & Sager Logo" width="400">

## Features

- **Zambretti Forecast**: 32 different weather predictions based on pressure trends over 3 hours
- **Sager Forecast**: Simplified weather prediction based on current pressure and wind direction
- **Extended Forecasts**: Predictions for 6, 12, and 24 hours ahead
- **Precipitation Probability**: Percentage chance of rain based on pressure trends
- **Sea Level Pressure Correction**: Automatic altitude-based pressure correction for accurate forecasts
- **Interactive Map Selection**: Choose your location on a map for automatic altitude detection
- **Temperature Compensation**: Uses temperature sensor for precise pressure correction

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to "Integrations"
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/ziffmafiya/zambretti_sager`
6. Select category "Integration"
7. Click "Add"
8. Find "Zambretti & Sager Weather Forecaster" in the list and install it
9. Restart Home Assistant

### Manual Installation

1. Copy the `custom_components/zambretti_sager` folder to your Home Assistant's `custom_components` directory
2. Restart Home Assistant

## Configuration

1. Go to **Settings** → **Devices & Services**
2. Click **Add Integration**
3. Search for "Zambretti and Sager"
4. Follow the setup wizard:
   - Select your **pressure sensor** (absolute or sea level pressure)
   - Select your **wind direction sensor**
   - (Optional) Select your **temperature sensor** for accurate sea level correction
   - Enable **sea level pressure correction** if using absolute pressure sensor
   - Click on the **map** to select your weather station location
5. Click **Submit**

## Sensors

The integration creates six sensors:

- **Zambretti Forecast**: Current detailed weather prediction (32 states)
- **Sager Forecast**: Simplified weather prediction (3 states)
- **Zambretti Forecast 6h**: Weather prediction for 6 hours ahead
- **Zambretti Forecast 12h**: Weather prediction for 12 hours ahead
- **Zambretti Forecast 24h**: Weather prediction for 24 hours ahead
- **Precipitation Probability**: Chance of rain in percentage (0-100%)

## How It Works

### Zambretti Algorithm

The Zambretti algorithm analyzes barometric pressure trends over the past 3 hours:
- **Falling pressure** (≤ -1.6 hPa): Indicates worsening weather
- **Steady pressure** (-1.6 to +1.6 hPa): Stable conditions
- **Rising pressure** (≥ +1.6 hPa): Improving weather

### Sager Algorithm

The Sager algorithm uses current pressure and wind direction:
- **High pressure** (> 1020 hPa): Fair weather
- **Low pressure** (< 1005 hPa): Unsettled, rainy weather
- **Medium pressure**: Variable conditions

### Sea Level Pressure Correction

If you're using an absolute pressure sensor and are above sea level, enable the correction feature. The integration will:
1. Automatically fetch your altitude from the selected map location
2. Apply the barometric formula using temperature data
3. Convert absolute pressure to sea level pressure for accurate forecasts

Formula used:
```
P_sea = P_abs / (1 - (0.0065 × altitude) / (T + 0.0065 × altitude + 273.15))^5.257
```

## Requirements

- Home Assistant 2024.1.0 or newer
- A pressure sensor (barometric pressure in hPa)
- A wind direction sensor (in degrees)
- (Optional) A temperature sensor for sea level correction

## Troubleshooting

**Forecast shows "Calculating..." or "Initializing..."**
- Wait a few minutes for the integration to collect pressure history
- Ensure your pressure sensor is providing valid data

**Inaccurate forecasts**
- Enable sea level pressure correction if you're above sea level
- Verify your location is correctly set on the map
- Check that your temperature sensor is working

**Altitude not detected**
- The integration uses the Open-Elevation API
- Check your Home Assistant has internet access
- Altitude is fetched once at startup

## Visualization

### Zambretti Barometer Card

A beautiful custom Lovelace card is available for visualizing your weather data:

**Features:**
- 🎨 Animated barometer gauge with gradient design
- 📊 Pressure trend arrow (rising/falling/steady)
- 🌈 Color-coded forecasts (green = good, red = storms)
- 🌧️ Precipitation probability bar
- 🎭 Animated weather icons

**Installation:**

1. Copy `www/zambretti-barometer-card.js` to your Home Assistant `www` folder
2. Add to your Lovelace resources:

```yaml
resources:
  - url: /local/zambretti-barometer-card.js
    type: module
```

3. Add the card to your dashboard:

```yaml
type: custom:zambretti-barometer-card
pressure_entity: sensor.your_pressure_sensor
zambretti_entity: sensor.zambretti_forecast
precipitation_entity: sensor.precipitation_probability
```

See [www/README.md](www/README.md) for detailed documentation.

## Credits

- **Zambretti Algorithm**: Developed by Negretti and Zambra in the early 1900s
- **Sager Algorithm**: Developed by meteorologist Sager
- **Integration Author**: Maksym

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/ziffmafiya/zambretti_sager/issues) on GitHub.
