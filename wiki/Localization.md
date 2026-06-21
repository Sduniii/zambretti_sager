# Localization

The integration supports three UI languages.

---

## Supported languages

| Language | Code | Coverage |
|---|---|---|
| 🇬🇧 English | `en` | Config flow, options, sensors, card |
| 🇷🇺 Russian | `ru` | Config flow, options, sensors, card |
| 🇫🇷 French | `fr` | Config flow, options, sensors, card |

---

## Home Assistant language

Config flow and options flow automatically use the language from your **HA user profile**:

**Profile → Language → English / Русский / Français**

Translation files:

```
custom_components/zambretti_sager/translations/
├── en.json
├── ru.json
└── fr.json
```

---

## Lovelace card language

The card has its **own** language setting, independent of HA:

```yaml
type: custom:zambretti-weather-card
entity: sensor.zambretti_forecast
language: en
```

| Value | Language |
|---|---|
| `en` | English (default) |
| `ru` | Russian |
| `fr` | French |

> Sensors return **keys** (e.g. `settled_fine`), and the card translates them based on the `language` parameter.

---

## Sensor states

38 state keys are translated in all three languages:

- 32 Zambretti states
- 11 Sager states (including `stable`)

Example keys:

| Key | EN | RU |
|---|---|---|
| `settled_fine` | Settled Fine | Ясно, устойчиво |
| `stormy_much_rain` | Stormy, Heavy Rain | Штормово, сильные дожди |
| `sager_fair_no_change` | Fair, no important change | Хорошая погода, без изменений |

---

## Adding a new language

1. Create `custom_components/zambretti_sager/translations/xx.json` based on `en.json`
2. Add a `LABELS_XX` block in `frontend/zambretti-weather-card.js`
3. Add `xx` to the card language selector
4. Submit a Pull Request

---

## Translation credits

- 🇫🇷 French — [@gael1980](https://github.com/gael1980)
