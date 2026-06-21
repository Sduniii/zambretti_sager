#!/usr/bin/env python3
"""Generate zambretti-card-i18n.js from locale overlays."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OVERLAYS = Path(__file__).resolve().parent / "locale_overlays"
OUT = ROOT / "custom_components" / "zambretti_sager" / "frontend" / "zambretti-card-i18n.js"

PRECIP = {
    "en": "Precip",
    "ru": "Осадки",
    "fr": "Précip.",
    "de": "Niederschlag",
    "es": "Precip.",
    "it": "Precip.",
    "pl": "Opady",
    "zh-Hans": "降水",
    "zh-Hant": "降水",
    "nl": "Neerslag",
    "pt": "Precip.",
    "uk": "Опади",
    "ja": "降水",
    "ko": "강수",
    "cs": "Srážky",
    "sv": "Nederb.",
    "da": "Nedb.",
    "nb": "Nedb.",
    "hu": "Csapadék",
    "tr": "Yağış",
}

LANG_OPTIONS = [
    ("auto", "langAuto"),
    ("en", "English"),
    ("de", "Deutsch"),
    ("es", "Español"),
    ("fr", "Français"),
    ("it", "Italiano"),
    ("nl", "Nederlands"),
    ("pl", "Polski"),
    ("pt", "Português"),
    ("ru", "Русский"),
    ("uk", "Українська"),
    ("zh-Hans", "简体中文"),
    ("zh-Hant", "繁體中文"),
    ("ja", "日本語"),
    ("ko", "한국어"),
    ("cs", "Čeština"),
    ("sv", "Svenska"),
    ("da", "Dansk"),
    ("nb", "Norsk"),
    ("hu", "Magyar"),
    ("tr", "Türkçe"),
]

EDITOR_EN = {
    "appearance": "Appearance",
    "language": "Language",
    "langAuto": "Auto (from Home Assistant)",
    "showWind": "Show wind",
    "showWindH": "Wind direction and speed in the footer",
    "windEntity": "Wind speed sensor",
    "windEntityH": "Optional — if not set, uses the main sensor attribute",
    "windUnit": "Wind unit",
    "showSager": "Show Sager forecast",
    "showSagerH": "Bottom strip with Sager analytics",
    "showPrecip": "Show precipitation indicator",
    "showPrecipH": "Circular gauge on the right",
    "showForecasts": "Show 6h / 12h / 24h forecasts",
    "showForecastH": "Bottom row with forecast icons",
    "autoTheme": "Auto theme by condition",
    "autoThemeH": "Background color follows current weather condition",
    "customBg": "Custom card background",
    "customBgH": "CSS gradient or color, e.g. #1a1a2e or linear-gradient(...)",
}

EDITOR_RU = {
    **EDITOR_EN,
    "appearance": "Внешний вид",
    "language": "Язык",
    "langAuto": "Авто (из Home Assistant)",
    "showWind": "Показывать ветер",
    "showWindH": "Направление и скорость ветра в нижней полоске",
    "windEntity": "Датчик скорости ветра",
    "windEntityH": "Необязательно — если не выбран, используется атрибут основного датчика",
    "windUnit": "Единицы ветра",
    "showSager": "Показывать прогноз Sager",
    "showSagerH": "Нижняя полоска с аналитикой Sager",
    "showPrecip": "Показывать вероятность осадков",
    "showPrecipH": "Круговой индикатор справа",
    "showForecasts": "Показывать прогнозы 6ч / 12ч / 24ч",
    "showForecastH": "Нижний ряд с иконками",
    "autoTheme": "Авто-тема по погоде",
    "autoThemeH": "Цвет фона меняется по текущему условию",
    "customBg": "Свой фон карточки",
    "customBgH": "CSS-градиент или цвет, напр. #1a1a2e или linear-gradient(...)",
}

EDITOR_FR = {
    **EDITOR_EN,
    "appearance": "Apparence",
    "language": "Langue",
    "langAuto": "Auto (depuis Home Assistant)",
    "showWind": "Afficher le vent",
    "showWindH": "Direction et vitesse du vent dans le bandeau inférieur",
    "windEntity": "Capteur de vitesse du vent",
    "windEntityH": "Optionnel — si vide, utilise l'attribut du capteur principal",
    "windUnit": "Unité du vent",
    "showSager": "Afficher la prévision Sager",
    "showSagerH": "Bandeau inférieur avec l'analyse Sager",
    "showPrecip": "Afficher les précipitations",
    "showPrecipH": "Jauge circulaire à droite",
    "showForecasts": "Afficher les prévisions 6h / 12h / 24h",
    "showForecastH": "Rangée inférieure avec les icônes de prévision",
    "autoTheme": "Thème automatique selon la météo",
    "autoThemeH": "La couleur de fond suit la condition météo actuelle",
    "customBg": "Fond personnalisé",
    "customBgH": "Dégradé CSS ou couleur, ex. #1a1a2e ou linear-gradient(...)",
}

EDITOR_DE = {**EDITOR_EN, "appearance": "Darstellung", "language": "Sprache", "langAuto": "Auto (von Home Assistant)", "showWind": "Wind anzeigen", "showWindH": "Windrichtung und -geschwindigkeit in der Fußzeile", "windEntity": "Windgeschwindigkeitssensor", "windEntityH": "Optional — sonst Attribut des Haupt-Sensors", "windUnit": "Windeinheit", "showSager": "Sager-Prognose anzeigen", "showPrecip": "Niederschlagsanzeige", "showForecasts": "Prognosen 6h / 12h / 24h anzeigen", "autoTheme": "Auto-Thema nach Wetter"}
EDITOR_ES = {**EDITOR_EN, "appearance": "Apariencia", "language": "Idioma", "langAuto": "Auto (desde Home Assistant)", "showWind": "Mostrar viento", "windEntity": "Sensor de velocidad del viento", "windUnit": "Unidad de viento", "showSager": "Mostrar pronóstico Sager", "showPrecip": "Mostrar precipitación", "showForecasts": "Mostrar pronósticos 6h / 12h / 24h", "autoTheme": "Tema automático según el tiempo"}
EDITOR_IT = {**EDITOR_EN, "appearance": "Aspetto", "language": "Lingua", "langAuto": "Auto (da Home Assistant)", "showWind": "Mostra vento", "windEntity": "Sensore velocità vento", "windUnit": "Unità vento", "showSager": "Mostra previsione Sager", "showPrecip": "Mostra precipitazioni", "showForecasts": "Mostra previsioni 6h / 12h / 24h", "autoTheme": "Tema automatico per condizione"}
EDITOR_PL = {**EDITOR_EN, "appearance": "Wygląd", "language": "Język", "langAuto": "Auto (z Home Assistant)", "showWind": "Pokaż wiatr", "windEntity": "Czujnik prędkości wiatru", "windUnit": "Jednostka wiatru", "showSager": "Pokaż prognozę Sager", "showPrecip": "Pokaż opady", "showForecasts": "Pokaż prognozy 6h / 12h / 24h", "autoTheme": "Motyw auto wg pogody"}
EDITOR_UK = {**EDITOR_RU, "appearance": "Зовнішній вигляд", "language": "Мова", "langAuto": "Авто (з Home Assistant)"}
EDITOR_ZH_HANS = {**EDITOR_EN, "appearance": "外观", "language": "语言", "langAuto": "自动（跟随 Home Assistant）", "showWind": "显示风速", "windEntity": "风速传感器", "windUnit": "风速单位", "showSager": "显示 Sager 预报", "showPrecip": "显示降水", "showForecasts": "显示 6/12/24 小时预报", "autoTheme": "按天气自动主题"}
EDITOR_ZH_HANT = {**EDITOR_ZH_HANS, "appearance": "外觀", "language": "語言", "langAuto": "自動（跟隨 Home Assistant）", "showWind": "顯示風速", "windEntity": "風速感測器", "windUnit": "風速單位", "showSager": "顯示 Sager 預報", "showPrecip": "顯示降水", "showForecasts": "顯示 6/12/24 小時預報", "autoTheme": "依天氣自動主題"}
EDITOR_JA = {**EDITOR_EN, "appearance": "外観", "language": "言語", "langAuto": "自動（Home Assistant から）", "showWind": "風を表示", "windEntity": "風速センサー", "windUnit": "風速単位", "showSager": "Sager 予報を表示", "showPrecip": "降水を表示", "showForecasts": "6/12/24時間予報を表示", "autoTheme": "天候に応じた自動テーマ"}
EDITOR_KO = {**EDITOR_EN, "appearance": "모양", "language": "언어", "langAuto": "자동 (Home Assistant)", "showWind": "바람 표시", "windEntity": "풍속 센서", "windUnit": "풍속 단위", "showSager": "Sager 예보 표시", "showPrecip": "강수 표시", "showForecasts": "6/12/24시간 예보 표시", "autoTheme": "날씨별 자동 테마"}

EDITOR_MAP = {
    "en": EDITOR_EN,
    "ru": EDITOR_RU,
    "fr": EDITOR_FR,
    "de": EDITOR_DE,
    "es": EDITOR_ES,
    "it": EDITOR_IT,
    "pl": EDITOR_PL,
    "nl": EDITOR_EN,
    "pt": EDITOR_ES,
    "uk": EDITOR_UK,
    "zh-Hans": EDITOR_ZH_HANS,
    "zh-Hant": EDITOR_ZH_HANT,
    "ja": EDITOR_JA,
    "ko": EDITOR_KO,
    "cs": EDITOR_EN,
    "sv": EDITOR_EN,
    "da": EDITOR_EN,
    "nb": EDITOR_EN,
    "hu": EDITOR_EN,
    "tr": EDITOR_EN,
}

# Card labels from existing card (short form)
CARD_EN = {
    "settled_fine": "Settled Fine", "fine_weather": "Fine Weather",
    "fine_becoming_less_settled": "Fine, Less Settled", "fairly_fine_showery_later": "Fine, Showers Later",
    "showery_becoming_more_unsettled": "Showery, Worsening", "unsettled_rain_later": "Unsettled, Rain Later",
    "rain_at_times_worse_later": "Rain, Worse Later", "rain_at_times_becoming_very_unsettled": "Rain, Very Unsettled",
    "very_unsettled_rain": "Very Unsettled, Rain", "fine_possibly_showers": "Fine, Possibly Showers",
    "fairly_fine_showers_likely": "Fine, Showers Likely", "showery_bright_intervals": "Showery, Bright Intervals",
    "changeable_some_rain": "Changeable, Some Rain", "unsettled_rain_at_times": "Unsettled, Rain at Times",
    "rain_at_frequent_intervals": "Frequent Rain", "stormy_much_rain": "Stormy, Heavy Rain",
    "becoming_fine": "Becoming Fine", "fairly_fine_improving": "Fine, Improving",
    "fairly_fine_possibly_showers_early": "Fine, Early Showers", "showery_early_improving": "Early Showers, Improving",
    "changeable_mending": "Changeable, Mending", "rather_unsettled_clearing_later": "Unsettled, Clearing Later",
    "unsettled_probably_improving": "Unsettled, Improving", "unsettled_short_fine_intervals": "Unsettled, Short Fine",
    "very_unsettled_finer_at_times": "Very Unsettled", "stormy_possibly_improving": "Stormy, May Improve", "stable": "Stable",
    "sager_fair_improving": "Fair, improving", "sager_fair_tending_to_deteriorate": "Fair, tending to deteriorate",
    "sager_fair_no_change": "Fair, no important change", "sager_unsettled_rain_likely": "Unsettled, rain likely",
    "sager_unsettled_probably_improving": "Unsettled, probably improving", "sager_unsettled_rain_at_times": "Unsettled, rain at times",
    "sager_changeable_becoming_fairer": "Changeable, becoming fairer", "sager_changeable_becoming_more_unsettled": "Changeable, more unsettled",
    "sager_variable_slowly_improving": "Variable, slowly improving", "sager_variable_slowly_deteriorating": "Variable, slowly deteriorating",
    "sager_variable_some_change": "Variable, some change",
}


def js_obj(d: dict) -> str:
    parts = [f"  {json.dumps(k)}: {json.dumps(v, ensure_ascii=False)}" for k, v in d.items()]
    return "{\n" + ",\n".join(parts) + "\n}"


def js_labels_map(d: dict[str, dict]) -> str:
    blocks = []
    for locale, labels in d.items():
        inner = ", ".join(
            f"{json.dumps(k)}: {json.dumps(v, ensure_ascii=False)}" for k, v in labels.items()
        )
        blocks.append(f"  {json.dumps(locale)}: {{{inner}}}")
    return "{\n" + ",\n".join(blocks) + "\n}"


def main() -> None:
    card_labels: dict[str, dict] = {"en": CARD_EN}

    for path in sorted(OVERLAYS.glob("*.json")):
        locale = path.stem
        data = json.loads(path.read_text(encoding="utf-8"))
        card_labels[locale] = {**data["z"], **data["s"]}

    # ru/fr from card short labels - read from existing if needed; use overlay z/s for consistency
    ru_path = ROOT / "custom_components" / "zambretti_sager" / "translations" / "ru.json"
    if ru_path.exists():
        ru = json.loads(ru_path.read_text(encoding="utf-8"))
        card_labels["ru"] = {
            **ru["entity"]["sensor"]["zambretti_forecast"]["state"],
            **ru["entity"]["sensor"]["sager_forecast"]["state"],
        }
    fr_path = ROOT / "custom_components" / "zambretti_sager" / "translations" / "fr.json"
    if fr_path.exists():
        fr = json.loads(fr_path.read_text(encoding="utf-8"))
        card_labels["fr"] = {
            **fr["entity"]["sensor"]["zambretti_forecast"]["state"],
            **fr["entity"]["sensor"]["sager_forecast"]["state"],
        }

    lines = [
        "/** Generated by scripts/gen_card_i18n.py — do not edit manually */",
        "",
        f"export const CARD_LABELS = {js_labels_map(card_labels)};",
        "",
        f"export const PRECIP_LABELS = {js_obj(PRECIP)};",
        "",
        f"export const EDITOR_STRINGS = {js_obj(EDITOR_MAP)};",
        "",
        f"export const LANG_OPTIONS = {json.dumps(LANG_OPTIONS, ensure_ascii=False, indent=2)};",
        "",
        "export function resolveLang(lang) {",
        "  if (!lang) return 'en';",
        "  if (lang === 'auto') return 'auto';",
        "  if (lang.startsWith('zh')) return lang.includes('Hant') ? 'zh-Hant' : 'zh-Hans';",
        "  if (lang.startsWith('pt')) return 'pt';",
        "  if (lang.startsWith('nb') || lang.startsWith('no')) return 'nb';",
        "  const base = lang.split('-')[0];",
        "  if (CARD_LABELS[lang]) return lang;",
        "  if (CARD_LABELS[base]) return base;",
        "  return 'en';",
        "}",
        "",
        "export function getLabels(configLang, hassLang) {",
        "  const code = configLang === 'auto' ? resolveLang(hassLang || 'en') : resolveLang(configLang);",
        "  return CARD_LABELS[code] || CARD_LABELS.en;",
        "}",
        "",
        "export function getPrecipLabel(configLang, hassLang) {",
        "  const code = configLang === 'auto' ? resolveLang(hassLang || 'en') : resolveLang(configLang);",
        "  return PRECIP_LABELS[code] || PRECIP_LABELS.en;",
        "}",
        "",
        "export function getEditorStrings(configLang, hassLang) {",
        "  const code = configLang === 'auto' ? resolveLang(hassLang || 'en') : resolveLang(configLang);",
        "  return EDITOR_STRINGS[code] || EDITOR_STRINGS.en;",
        "}",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(card_labels)} languages)")


if __name__ == "__main__":
    main()
