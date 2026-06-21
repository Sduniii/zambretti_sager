# Troubleshooting

---

## Forecast shows "Calculating..." or "Initializing..."

**Cause:** The integration needs pressure history to calculate trends.

**Fix:**
1. Wait 5–15 minutes after installation
2. Make sure the pressure sensor returns valid data (not `unavailable`)
3. Verify that **recorder** is enabled and storing your pressure sensor
4. After an HA restart, sensors recover automatically (v1.9.2+)

---

## Sensors unavailable after HA restart

**Fixed in v1.9.2.** The coordinator subscribes to pressure sensor state changes and refreshes as soon as the sensor becomes available.

If the issue persists:
- Check that the pressure sensor is not `unavailable` at startup
- Reload the integration: **Configure → Reload**

---

## Inaccurate forecasts

**Possible causes and fixes:**

| Cause | Fix |
|---|---|
| Altitude above sea level | Enable **Sea level correction** |
| Wrong coordinates | Verify the map location in settings |
| Absolute vs MSLP pressure | Ensure correction is enabled/disabled correctly |
| No temperature sensor | Add a temperature sensor for the barometric formula |
| Noisy pressure sensor | Use filtering or a more stable sensor |

---

## Altitude not detected

**Cause:** The integration uses the [Open-Elevation API](https://open-elevation.com).

**Fix:**
1. Check that Home Assistant has internet access
2. Verify map coordinates are correct
3. Altitude is fetched **once** at startup — reload the integration after changing coordinates

---

## Card not displaying

**"Custom element doesn't exist: zambretti-weather-card"**

1. Make sure the integration is installed and loaded
2. Clear browser cache (Ctrl+Shift+R)
3. Check **Settings → Dashboards → Resources** — should include `/zambretti_sager_card/zambretti-weather-card.js`
4. Restart Home Assistant

---

## Animations stutter or flicker

**Fixed in v1.9.8.** The card no longer rebuilds SVG on every `hass` update.

Make sure you are running version **≥ 1.9.8**.

---

## Entity ID conflict with multiple instances

**Fixed in v1.9.5.** HA automatically generates unique entity IDs.

If you see duplicates, remove old entities via **Settings → Devices & Services → Entities**.

---

## Recorder not storing pressure

Check your `configuration.yaml`:

```yaml
recorder:
  include:
    entities:
      - sensor.your_pressure_sensor
```

Or make sure the sensor is not excluded via `exclude`.

---

## Logs

Enable debug logging:

```yaml
logger:
  logs:
    custom_components.zambretti_sager: debug
```

Restart HA and check **Settings → System → Logs**.

---

## Report an issue

If the problem is not resolved, [open an Issue](https://github.com/ziffmafiya/zambretti_sager/issues) with:

- Integration version
- Home Assistant version
- Configuration (no secrets)
- Relevant log output (debug level)
