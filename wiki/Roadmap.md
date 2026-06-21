# Roadmap

Current project status and development plans.

---

## Current status — v1.9.8 ✅

| Component | Status |
|---|---|
| Zambretti/Sager integration | ✅ Stable |
| 6 sensors | ✅ Working |
| Config Flow + Options Flow | ✅ Done |
| Sea level correction | ✅ Done |
| Lovelace Weather Card | ✅ Done |
| Animated SVG icons | ✅ v1.9.7+ |
| Pressure sparkline | ✅ v1.9.5+ |
| Night mode | ✅ v1.9.5+ |
| Wind speed + units | ✅ v1.9.7+ |
| Localization EN/RU/FR | ✅ Done |
| HACS | ✅ Published |
| CI (hassfest + hacs) | ✅ Configured |

---

## Completed

- [x] Core Zambretti algorithm (32 states)
- [x] Sager algorithm
- [x] Extended forecasts 6h / 12h / 24h
- [x] Precipitation probability
- [x] Config Flow with map
- [x] Sea level pressure correction
- [x] Lovelace custom card
- [x] Animated weather icons
- [x] Card night mode
- [x] Pressure sparkline
- [x] Wind speed support
- [x] EN, RU, FR translations
- [x] Fix unavailable sensors after restart
- [x] Fix SVG animation jitter
- [x] Multiple integration instances

---

## Planned

- [ ] **German translation (DE)** — community request
- [ ] **Spanish translation (ES)**
- [ ] **HACS default repository** — submit to HACS default repo
- [ ] **Unit tests** — Zambretti/Sager algorithm tests
- [ ] **Card themes** — custom color schemes
- [ ] **Weather entity integration** — map Zambretti → `weather.*`

---

## Ideas (backlog)

- Multi-sensor pressure averaging
- Push notifications on rapid pressure drop
- Forecast history export
- inHg / mmHg unit support
- Comparison with Met.no / OpenWeatherMap forecasts
- Mobile-friendly responsive card

---

## How to influence the roadmap

1. ⭐ Star the [GitHub repo](https://github.com/ziffmafiya/zambretti_sager)
2. 💬 [Open an Issue](https://github.com/ziffmafiya/zambretti_sager/issues) with a suggestion
3. 🔧 Submit a Pull Request
4. 🌍 Help translate to a new language

---

## Version history

Full changelog: [CHANGELOG.md](https://github.com/ziffmafiya/zambretti_sager/blob/main/CHANGELOG.md)

| Version | Date | Highlights |
|---|---|---|
| 1.9.8 | 2026-06-21 | Fix SVG jitter (patch render) |
| 1.9.7 | 2026-06-21 | Wind speed, animated icons rework |
| 1.9.6 | 2026-06-21 | French translation |
| 1.9.5 | 2026-06-21 | Sparkline, night mode, bugfixes |
| 1.9.0 | 2026-06-16 | Major card update |
| 1.0.0 | — | Initial release |
