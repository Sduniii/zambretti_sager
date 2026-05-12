# Zambretti & Sager Weather Forecaster

Classic barometric weather forecasting for Home Assistant.

## What does it do?

This integration provides weather forecasts based on barometric pressure trends using two proven algorithms:

- **Zambretti**: Analyzes pressure changes over 3 hours to predict weather (32 different forecasts)
- **Sager**: Uses current pressure and wind direction for quick predictions

## Why use it?

- Works offline with your local weather station
- No API keys or cloud services required
- Based on proven meteorological methods used for over 100 years
- Automatic altitude correction for accurate forecasts

## Setup

1. Install via HACS
2. Add the integration
3. Select your pressure, wind, and temperature sensors
4. Click on the map to set your location
5. Enable sea level correction if needed

That's it! You'll get two new sensors with weather forecasts.

## Requirements

- Barometric pressure sensor (in hPa)
- Wind direction sensor (in degrees)
- Temperature sensor (optional, for altitude correction)
