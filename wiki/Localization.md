# Localization

The integration supports **20 languages** for the config flow, options flow, sensor states, and Lovelace card.

---

## Supported languages

| Language | HA code | Card code |
|---|---|---|
| 🇬🇧 English | `en` | `en` |
| 🇩🇪 German | `de` | `de` |
| 🇪🇸 Spanish | `es` | `es` |
| 🇫🇷 French | `fr` | `fr` |
| 🇮🇹 Italian | `it` | `it` |
| 🇳🇱 Dutch | `nl` | `nl` |
| 🇵🇱 Polish | `pl` | `pl` |
| 🇵🇹 Portuguese | `pt` | `pt` |
| 🇷🇺 Russian | `ru` | `ru` |
| 🇺🇦 Ukrainian | `uk` | `uk` |
| 🇨🇳 Chinese (Simplified) | `zh-Hans` | `zh-Hans` |
| 🇹🇼 Chinese (Traditional) | `zh-Hant` | `zh-Hant` |
| 🇯🇵 Japanese | `ja` | `ja` |
| 🇰🇷 Korean | `ko` | `ko` |
| 🇨🇿 Czech | `cs` | `cs` |
| 🇸🇪 Swedish | `sv` | `sv` |
| 🇩🇰 Danish | `da` | `da` |
| 🇳🇴 Norwegian | `nb` | `nb` |
| 🇭🇺 Hungarian | `hu` | `hu` |
| 🇹🇷 Turkish | `tr` | `tr` |

---

## Home Assistant language

Config flow and options flow automatically use the language from your **HA user profile**:

**Profile → Language**

Translation files live in `custom_components/zambretti_sager/translations/`.

---

## Lovelace card language

The card has its **own** language setting, independent of HA:

```yaml
type: custom:zambretti-weather-card
entity: sensor.zambretti_forecast
language: de
```

| Value | Language |
|---|---|
| `auto` | Follow Home Assistant profile (default) |
| `de`, `es`, `it`, … | Force a specific language |

All 38 forecast state keys are translated in every supported language.

---

## Adding a new language

1. Add `scripts/locale_overlays/xx.json` (copy from `de.json` as template)
2. Run `python scripts/gen_translations.py` to generate `translations/xx.json`
3. Run `python scripts/gen_card_i18n.py` to update card labels
4. Add the language to `LANG_OPTIONS` in `scripts/gen_card_i18n.py`
5. Submit a Pull Request

---

## Translation credits

- 🇫🇷 French — [@gael1980](https://github.com/gael1980)
