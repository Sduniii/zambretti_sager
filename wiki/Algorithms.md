# Forecasting Algorithms

The integration uses two classic barometric pressure forecasting methods — no external weather APIs required.

---

## Zambretti Algorithm

Developed by **Negretti and Zambra** in the early 1900s. Used in mechanical barometer forecasters.

### How it works

1. Measures **pressure change** over the last **~3 hours** (ΔP in hPa)
2. ΔP is classified into one of three trends:

| Trend | ΔP (hPa over ~3 h) |
|---|---|
| **Falling** | ≤ −1.6 |
| **Steady** | −1.6 … +1.6 |
| **Rising** | ≥ +1.6 |

3. Based on the trend and current pressure, one of **32 weather descriptions** is selected

### Extended forecasts (6h / 12h / 24h)

For future forecasts, the integration:

- Reads historical pressure from the **recorder** for the corresponding interval
- Scales the trend proportionally to the forecast horizon
- When history is insufficient, uses the best available window and extrapolates

### Data sources

- Current pressure — from the configured sensor
- History — from the **Home Assistant Recorder** database
- When no history is available, ΔP = 0 (steady) and sensors show a forecast immediately

---

## Sager Algorithm

Developed by meteorologist **Raymond Sager**. Simpler approach using pressure, trend, and wind direction.

### Pressure zones

| Pressure | Zone |
|---|---|
| **> 1020 hPa** | Fair |
| **< 1005 hPa** | Unsettled |
| **1005–1020 hPa** | Changeable |

### Trend classification (Sager)

| Trend | ΔP (hPa) |
|---|---|
| Rising rapidly | ≥ +1.4 |
| Rising slowly | ≥ +0.7 |
| Steady | −0.7 … +0.7 |
| Falling slowly | ≤ −0.7 |
| Falling rapidly | ≤ −1.4 |

### Forecast matrix

**Fair (> 1020 hPa):**
- Rising → Fair, improving
- Falling → Fair, tending to deteriorate
- Steady → Fair, no important change

**Unsettled (< 1005 hPa):**
- Falling → Unsettled, rain likely
- Rising → Unsettled, probably improving
- Steady → Unsettled, rain at times

**Changeable (1005–1020 hPa):**
- Rising rapidly → Changeable, becoming fairer
- Falling rapidly → Changeable, more unsettled
- Rising slowly → Variable, slowly improving
- Falling slowly → Variable, slowly deteriorating
- Steady → Variable, some change

### Wind direction

Wind is converted from degrees to compass points: **N, NE, E, SE, S, SW, W, NW**

---

## Precipitation probability

Calculated based on:

- **Pressure trend** — falling pressure increases probability
- **Current pressure** — low pressure increases probability
- **Humidity** (if sensor configured) — high humidity increases probability

Result: a value from **0–100%**.

---

## Sea level correction

If the sensor measures absolute pressure at altitude *h* meters, forecasts will be inaccurate without correction.

### Barometric formula

```
P_sea = P_abs / (1 − (0.0065 × h) / (T + 0.0065 × h + 273.15))^5.257
```

Where:
- `P_abs` — absolute pressure (hPa)
- `h` — altitude above sea level (m)
- `T` — temperature (°C)

Altitude is determined via the **Open-Elevation API** using map coordinates.

---

## Limitations

| Limitation | Explanation |
|---|---|
| Local forecast | Algorithms do not account for fronts, satellites, or radar |
| Trend delay | Requires ~3 hours of pressure history for an accurate trend |
| Altitude | Open-Elevation is queried once at startup |
| Accuracy | Works best with a stable, reliable pressure sensor |

> Zambretti and Sager are **short-term** forecasts (hours, not days). For multi-day forecasts, use standard HA weather integrations.

---

## History

- **Zambretti** — Negretti & Zambra, ~1915, mechanical barometer forecasters
- **Sager** — Raymond Sager, simplified table for field meteorologists
