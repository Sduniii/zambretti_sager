# Zambretti Weather Card

A built-in **Lovelace custom card** bundled with the integration. It registers automatically on load — no separate installation required.

**File:** `custom_components/zambretti_sager/frontend/zambretti-weather-card.js`

---

## Adding to a dashboard

1. Open your dashboard → **Edit Dashboard**
2. **Add Card → Manual**
3. Paste the configuration:

```yaml
type: custom:zambretti-weather-card
entity: sensor.zambretti_forecast
```

4. Save

> Replace `entity` with your Zambretti Forecast sensor entity ID.

---

## Card options

| Option | Type | Default | Description |
|---|---|---|---|
| `entity` | string | — | **Required.** Zambretti Forecast sensor |
| `entity_sager` | string | — | Sager forecast sensor (optional) |
| `entity_precip` | string | — | Precipitation probability sensor |
| `entity_wind_speed` | string | — | Dedicated wind speed sensor |
| `language` | string | `en` | Display language: `en`, `ru`, `fr` |
| `show_sparkline` | boolean | `true` | Mini 24-hour pressure chart |
| `show_wind` | boolean | `true` | Show wind in the footer |
| `wind_unit` | string | `m/s` | Wind speed unit: `m/s`, `km/h`, `mph` |
| `name` | string | — | Card title |

### Full configuration example

```yaml
type: custom:zambretti-weather-card
entity: sensor.zambretti_forecast
entity_sager: sensor.sager_forecast
entity_precip: sensor.precipitation_probability
entity_wind_speed: sensor.wind_speed
language: en
show_sparkline: true
show_wind: true
wind_unit: km/h
name: Zambretti Forecast
```

---

## Visual features

### Animated icons (SVG)

| Condition | Animation |
|---|---|
| ☀️ Sunny | Rotating sun |
| ☁️ Cloudy | Clouds drifting horizontally |
| 🌧 Rain | Falling drops (lines with fade) |
| ❄️ Snow | Falling snowflakes with staggered timing |
| ⚡ Storm | Double lightning flash |
| 💨 Wind | Sinusoidal wind lines |
| 🌙 Night | Crescent moon and twinkling stars |

### Night mode

Automatically activates when the sun is below the horizon (based on HA coordinates). Dark blue gradient background with a moon icon.

### Pressure sparkline

Mini chart of pressure over the last 24 hours:

- 🟢 Green — pressure rising
- 🔴 Red — pressure falling

### Footer

Shows wind direction and speed, e.g. `💨 SW 5.2 km/h`

---

## State → icon mapping

The card maps Zambretti keys to visual conditions:

| Condition | States (examples) |
|---|---|
| `sunny` | `settled_fine`, `fine_weather` |
| `partlycloudy` | `fine_becoming_less_settled`, `becoming_fine` |
| `cloudy` | `unsettled_rain_later`, `changeable_some_rain` |
| `rainy` | `showery_bright_intervals`, `unsettled_rain_at_times` |
| `pouring` | `very_unsettled_rain`, `rain_at_frequent_intervals` |
| `lightning-rainy` | `stormy_much_rain`, `stormy_possibly_improving` |

---

## Performance (v1.9.8+)

The card uses **two render modes**:

- **Full render** — only on first load or when the weather condition actually changes
- **Patch** — subsequent `hass` updates only mutate text nodes, precipitation gauge, and sparkline

This prevents SVG animations from restarting on every HA update.

---

## Visual editor

The card supports the Lovelace **visual editor** — settings are available through the UI without editing YAML.
