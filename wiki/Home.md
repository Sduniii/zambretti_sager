# Zambretti & Sager Weather Forecaster

A **Home Assistant custom integration** that forecasts weather using the classic **Zambretti** and **Sager** algorithms based on barometric pressure trends.

| | |
|---|---|
| **Version** | 1.9.10 |
| **Domain** | `zambretti_sager` |
| **HACS** | ✅ Supported |
| **License** | MIT |
| **Author** | Maksym ([@ziffmafiya](https://github.com/ziffmafiya)) |

---

## Features

- **32 Zambretti states** — detailed forecast based on 3-hour pressure trends
- **Sager forecast** — simplified prediction from pressure and wind direction
- **Extended forecasts** — 6, 12, and 24 hours ahead
- **Precipitation probability** — 0–100% based on pressure trends and humidity
- **Sea level pressure correction** — altitude and temperature compensation
- **Lovelace card** — animated icons, night mode, pressure sparkline
- **Localization** — English, Russian, French

---

## Quick Start

1. Install via [HACS](Installation) or manually
2. Configure the integration in **Settings → Devices & Services → Add Integration**
3. Add the [Zambretti Weather Card](Zambretti-Weather-Card) to your dashboard

[![Install with HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ziffmafiya&repository=zambretti_sager&category=integration)

[![Open in Home Assistant](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=zambretti_sager)

---

## Requirements

- Home Assistant **2024.1.0** or newer
- Barometric pressure sensor (hPa)
- Wind direction sensor (recommended for Sager)
- Temperature sensor (optional, for sea level correction)
- Humidity sensor (optional, for precipitation probability)

---

## Wiki Pages

| Page | Description |
|---|---|
| [Installation](Installation) | HACS and manual setup |
| [Configuration](Configuration) | Setup wizard and options |
| [Sensors](Sensors) | Created entities and attributes |
| [Lovelace Card](Zambretti-Weather-Card) | Custom weather card |
| [Algorithms](Algorithms) | How Zambretti and Sager work |
| [Localization](Localization) | Supported languages |
| [Troubleshooting](Troubleshooting) | Common issues and fixes |
| [Development](Development) | Project structure and CI |
| [Roadmap](Roadmap) | Project status and plans |

---

## Support

- 🐛 [Report a bug](https://github.com/ziffmafiya/zambretti_sager/issues)
- 📖 [Repository README](https://github.com/ziffmafiya/zambretti_sager)
- 📋 [Changelog](https://github.com/ziffmafiya/zambretti_sager/blob/main/CHANGELOG.md)
