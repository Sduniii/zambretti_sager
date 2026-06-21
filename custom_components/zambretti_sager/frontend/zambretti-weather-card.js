/**
 * Zambretti & Sager Weather Card  v1.9.6
 * Lovelace custom card for Home Assistant
 */

// ── Condition map ─────────────────────────────────────────────────────────
const ZAMBRETTI_CONDITION = {
  settled_fine:"sunny", fine_weather:"sunny",
  fine_becoming_less_settled:"partlycloudy", fairly_fine_showery_later:"partlycloudy",
  showery_becoming_more_unsettled:"rainy", unsettled_rain_later:"cloudy",
  rain_at_times_worse_later:"rainy", rain_at_times_becoming_very_unsettled:"pouring",
  very_unsettled_rain:"pouring", fine_possibly_showers:"partlycloudy",
  fairly_fine_showers_likely:"partlycloudy", showery_bright_intervals:"rainy",
  changeable_some_rain:"cloudy", unsettled_rain_at_times:"rainy",
  rain_at_frequent_intervals:"pouring", stormy_much_rain:"lightning-rainy",
  becoming_fine:"partlycloudy", fairly_fine_improving:"partlycloudy",
  fairly_fine_possibly_showers_early:"partlycloudy", showery_early_improving:"rainy",
  changeable_mending:"cloudy", rather_unsettled_clearing_later:"cloudy",
  unsettled_probably_improving:"cloudy", unsettled_short_fine_intervals:"cloudy",
  very_unsettled_finer_at_times:"pouring", stormy_possibly_improving:"lightning-rainy",
  stable:"partlycloudy",
};

// ── Labels ────────────────────────────────────────────────────────────────
const LABELS_EN = {
  settled_fine:"Settled Fine", fine_weather:"Fine Weather",
  fine_becoming_less_settled:"Fine, Less Settled", fairly_fine_showery_later:"Fine, Showers Later",
  showery_becoming_more_unsettled:"Showery, Worsening", unsettled_rain_later:"Unsettled, Rain Later",
  rain_at_times_worse_later:"Rain, Worse Later", rain_at_times_becoming_very_unsettled:"Rain, Very Unsettled",
  very_unsettled_rain:"Very Unsettled, Rain", fine_possibly_showers:"Fine, Possibly Showers",
  fairly_fine_showers_likely:"Fine, Showers Likely", showery_bright_intervals:"Showery, Bright Intervals",
  changeable_some_rain:"Changeable, Some Rain", unsettled_rain_at_times:"Unsettled, Rain at Times",
  rain_at_frequent_intervals:"Frequent Rain", stormy_much_rain:"Stormy, Heavy Rain",
  becoming_fine:"Becoming Fine", fairly_fine_improving:"Fine, Improving",
  fairly_fine_possibly_showers_early:"Fine, Early Showers", showery_early_improving:"Early Showers, Improving",
  changeable_mending:"Changeable, Mending", rather_unsettled_clearing_later:"Unsettled, Clearing Later",
  unsettled_probably_improving:"Unsettled, Improving", unsettled_short_fine_intervals:"Unsettled, Short Fine",
  very_unsettled_finer_at_times:"Very Unsettled", stormy_possibly_improving:"Stormy, May Improve",
  stable:"Stable",
  sager_fair_improving:"Fair, improving", sager_fair_tending_to_deteriorate:"Fair, tending to deteriorate",
  sager_fair_no_change:"Fair, no important change", sager_unsettled_rain_likely:"Unsettled, rain likely",
  sager_unsettled_probably_improving:"Unsettled, probably improving",
  sager_unsettled_rain_at_times:"Unsettled, rain at times",
  sager_changeable_becoming_fairer:"Changeable, becoming fairer",
  sager_changeable_becoming_more_unsettled:"Changeable, more unsettled",
  sager_variable_slowly_improving:"Variable, slowly improving",
  sager_variable_slowly_deteriorating:"Variable, slowly deteriorating",
  sager_variable_some_change:"Variable, some change",
};
const LABELS_RU = {
  settled_fine:"Ясно, устойчиво", fine_weather:"Хорошая погода",
  fine_becoming_less_settled:"Хорошо, возможно ухудшение", fairly_fine_showery_later:"Довольно хорошо, дожди позже",
  showery_becoming_more_unsettled:"Дождливо, ухудшение", unsettled_rain_later:"Неустойчиво, дождь позже",
  rain_at_times_worse_later:"Дожди, ухудшение позже", rain_at_times_becoming_very_unsettled:"Дожди, сильное ухудшение",
  very_unsettled_rain:"Очень неустойчиво, дождь", fine_possibly_showers:"Хорошо, возможны ливни",
  fairly_fine_showers_likely:"Довольно хорошо, ливни вероятны", showery_bright_intervals:"Ливни, прояснения",
  changeable_some_rain:"Переменчиво, небольшой дождь", unsettled_rain_at_times:"Неустойчиво, дожди периодически",
  rain_at_frequent_intervals:"Частые дожди", stormy_much_rain:"Штормово, сильные дожди",
  becoming_fine:"Улучшение погоды", fairly_fine_improving:"Довольно хорошо, улучшение",
  fairly_fine_possibly_showers_early:"Довольно хорошо, ранние ливни", showery_early_improving:"Ранние ливни, улучшение",
  changeable_mending:"Переменчиво, улучшается", rather_unsettled_clearing_later:"Неустойчиво, прояснение позже",
  unsettled_probably_improving:"Неустойчиво, вероятно улучшение", unsettled_short_fine_intervals:"Неустойчиво, короткие прояснения",
  very_unsettled_finer_at_times:"Очень неустойчиво, временами лучше", stormy_possibly_improving:"Штормово, возможно улучшение",
  stable:"Стабильно",
  sager_fair_improving:"Хорошая погода, улучшение", sager_fair_tending_to_deteriorate:"Пока хорошо, ожидается ухудшение",
  sager_fair_no_change:"Хорошая погода, без изменений", sager_unsettled_rain_likely:"Неустойчиво, дождь вероятен",
  sager_unsettled_probably_improving:"Неустойчиво, вероятно улучшение",
  sager_unsettled_rain_at_times:"Неустойчиво, дожди периодически",
  sager_changeable_becoming_fairer:"Переменчиво, прояснение",
  sager_changeable_becoming_more_unsettled:"Переменчиво, ухудшение",
  sager_variable_slowly_improving:"Переменно, медленное улучшение",
  sager_variable_slowly_deteriorating:"Переменно, медленное ухудшение",
  sager_variable_some_change:"Переменно, ожидаются изменения",
};
const LABELS_FR = {
  settled_fine:"Beau temps stable", fine_weather:"Beau temps",
  fine_becoming_less_settled:"Beau temps, moins stable", fairly_fine_showery_later:"Assez beau, averses plus tard",
  showery_becoming_more_unsettled:"Averses, aggravation", unsettled_rain_later:"Perturbé, pluie plus tard",
  rain_at_times_worse_later:"Pluie, aggravation", rain_at_times_becoming_very_unsettled:"Pluie, très perturbé",
  very_unsettled_rain:"Très perturbé, pluie", fine_possibly_showers:"Beau, averses possibles",
  fairly_fine_showers_likely:"Assez beau, averses probables", showery_bright_intervals:"Averses, éclaircies",
  changeable_some_rain:"Variable, quelques pluies", unsettled_rain_at_times:"Perturbé, pluie par moments",
  rain_at_frequent_intervals:"Pluies fréquentes", stormy_much_rain:"Orageux, fortes pluies",
  becoming_fine:"Amélioration", fairly_fine_improving:"Assez beau, amélioration",
  fairly_fine_possibly_showers_early:"Assez beau, averses tôt", showery_early_improving:"Averses tôt, amélioration",
  changeable_mending:"Variable, amélioration", rather_unsettled_clearing_later:"Perturbé, éclaircies plus tard",
  unsettled_probably_improving:"Perturbé, amélioration probable", unsettled_short_fine_intervals:"Perturbé, courtes éclaircies",
  very_unsettled_finer_at_times:"Très perturbé, accalmies", stormy_possibly_improving:"Orageux, amélioration possible",
  stable:"Stable",
  sager_fair_improving:"Beau temps, amélioration", sager_fair_tending_to_deteriorate:"Beau temps, tendance à la dégradation",
  sager_fair_no_change:"Beau temps, pas de changement", sager_unsettled_rain_likely:"Perturbé, pluie probable",
  sager_unsettled_probably_improving:"Perturbé, amélioration probable",
  sager_unsettled_rain_at_times:"Perturbé, pluie par moments",
  sager_changeable_becoming_fairer:"Variable, tendance à l'amélioration",
  sager_changeable_becoming_more_unsettled:"Variable, devenant plus perturbé",
  sager_variable_slowly_improving:"Variable, amélioration progressive",
  sager_variable_slowly_deteriorating:"Variable, dégradation progressive",
  sager_variable_some_change:"Variable, changement attendu",
};

// ── SVG weather icons ─────────────────────────────────────────────────────
const WEATHER_ICONS = {
  sunny:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="12" fill="#FFD700"><animate attributeName="r" values="12;13.5;12" dur="3s" repeatCount="indefinite"/></circle>
    <g stroke="#FFD700" stroke-width="2.5" stroke-linecap="round" opacity="0.85">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="20s" repeatCount="indefinite" calcMode="linear"/>
        <line x1="32" y1="8" x2="32" y2="14"/>
        <line x1="32" y1="50" x2="32" y2="56"/>
        <line x1="8" y1="32" x2="14" y2="32"/>
        <line x1="50" y1="32" x2="56" y2="32"/>
        <line x1="14.9" y1="14.9" x2="19.3" y2="19.3"/>
        <line x1="44.7" y1="44.7" x2="49.1" y2="49.1"/>
        <line x1="49.1" y1="14.9" x2="44.7" y2="19.3"/>
        <line x1="19.3" y1="44.7" x2="14.9" y2="49.1"/>
      </g>
    </g></svg>`,
  night_clear:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M38 12a22 22 0 1 1-22 22 22 22 0 0 1 22-22z" fill="#F5F5DC" opacity="0.9">
      <animate attributeName="opacity" values="0.85;1;0.85" dur="4s" repeatCount="indefinite"/>
    </path>
    <circle cx="42" cy="18" r="2" fill="#FFF" opacity="0.4"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="12" cy="14" r="1.2" fill="#FFF" opacity="0.3"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite"/></circle>
    <circle cx="50" cy="10" r="1" fill="#FFF" opacity="0.35"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite"/></circle>
    <circle cx="16" cy="48" r="1.5" fill="#FFF" opacity="0.3"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.5s" repeatCount="indefinite"/></circle>
    <circle cx="52" cy="44" r="1" fill="#FFF" opacity="0.25"><animate attributeName="opacity" values="0.15;0.4;0.15" dur="2.8s" repeatCount="indefinite"/></circle>
  </svg>`,
  partlycloudy:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="26" r="9" fill="#FFD700" opacity="0.9"><animate attributeName="cy" values="26;24;26" dur="4s" repeatCount="indefinite"/></circle>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;3,0;0,0" dur="8s" repeatCount="indefinite"/>
      <ellipse cx="36" cy="36" rx="16" ry="10" fill="#B0BEC5"/>
      <ellipse cx="28" cy="34" rx="12" ry="9" fill="#CFD8DC"/>
      <ellipse cx="44" cy="37" rx="10" ry="7" fill="#B0BEC5"/>
    </g></svg>`,
  cloudy:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g>
      <animateTransform attributeName="transform" type="translate" values="-4,0;4,0;-4,0" dur="10s" repeatCount="indefinite"/>
      <ellipse cx="32" cy="30" rx="20" ry="12" fill="#90A4AE"/>
      <ellipse cx="24" cy="34" rx="14" ry="10" fill="#B0BEC5"/>
      <ellipse cx="42" cy="35" rx="12" ry="9" fill="#90A4AE"/>
    </g></svg>`,
  rainy:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g>
      <animateTransform attributeName="transform" type="translate" values="-2,0;2,0;-2,0" dur="7s" repeatCount="indefinite"/>
      <ellipse cx="32" cy="24" rx="18" ry="11" fill="#78909C"/>
      <ellipse cx="22" cy="28" rx="13" ry="9" fill="#90A4AE"/>
      <ellipse cx="42" cy="28" rx="12" ry="8" fill="#78909C"/>
    </g>
    <g fill="#64B5F6" opacity="0.85">
      <ellipse cx="24" cy="43" rx="1.5" ry="4"><animate attributeName="cy" values="43;52;43" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.2s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="32" cy="41" rx="1.5" ry="4"><animate attributeName="cy" values="41;50;41" dur="1.4s" begin="0.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.4s" begin="0.3s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="40" cy="43" rx="1.5" ry="4"><animate attributeName="cy" values="43;52;43" dur="1.1s" begin="0.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.1s" begin="0.6s" repeatCount="indefinite"/></ellipse>
    </g></svg>`,
  pouring:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g>
      <animateTransform attributeName="transform" type="translate" values="-1,0;2,0;-1,0" dur="6s" repeatCount="indefinite"/>
      <ellipse cx="32" cy="22" rx="18" ry="11" fill="#546E7A"/>
      <ellipse cx="22" cy="26" rx="13" ry="9" fill="#607D8B"/>
      <ellipse cx="42" cy="26" rx="12" ry="8" fill="#546E7A"/>
    </g>
    <g fill="#42A5F5" opacity="0.9">
      <ellipse cx="20" cy="41" rx="1.5" ry="4"><animate attributeName="cy" values="41;52;41" dur="0.9s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="0.9s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="28" cy="39" rx="1.5" ry="4"><animate attributeName="cy" values="39;50;39" dur="0.8s" begin="0.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="0.8s" begin="0.2s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="36" cy="41" rx="1.5" ry="4"><animate attributeName="cy" values="41;52;41" dur="1.0s" begin="0.1s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="1.0s" begin="0.1s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="44" cy="39" rx="1.5" ry="4"><animate attributeName="cy" values="39;50;39" dur="0.85s" begin="0.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="0.85s" begin="0.4s" repeatCount="indefinite"/></ellipse>
    </g></svg>`,
  "lightning-rainy":`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g>
      <animateTransform attributeName="transform" type="translate" values="-1,0;1,0;-1,0" dur="5s" repeatCount="indefinite"/>
      <ellipse cx="32" cy="20" rx="18" ry="11" fill="#37474F"/>
      <ellipse cx="22" cy="25" rx="13" ry="9" fill="#455A64"/>
      <ellipse cx="42" cy="25" rx="12" ry="8" fill="#37474F"/>
    </g>
    <polygon points="34,33 28,44 33,44 29,54 38,40 33,40" fill="#FFD740" opacity="0.95"><animate attributeName="opacity" values="0.95;0.3;0.95" dur="2.5s" repeatCount="indefinite"/></polygon>
    <g fill="#64B5F6" opacity="0.85">
      <ellipse cx="22" cy="43" rx="1.5" ry="3"><animate attributeName="cy" values="43;51;43" dur="1.1s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.1s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="44" cy="42" rx="1.5" ry="3"><animate attributeName="cy" values="42;50;42" dur="0.9s" begin="0.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="0.9s" begin="0.5s" repeatCount="indefinite"/></ellipse>
    </g></svg>`,
  snowy:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g>
      <animateTransform attributeName="transform" type="translate" values="-2,0;3,0;-2,0" dur="8s" repeatCount="indefinite"/>
      <ellipse cx="32" cy="24" rx="18" ry="11" fill="#B0BEC5"/>
      <ellipse cx="22" cy="28" rx="13" ry="9" fill="#CFD8DC"/>
      <ellipse cx="42" cy="28" rx="12" ry="8" fill="#B0BEC5"/>
    </g>
    <g fill="#FFF" opacity="0.85">
      <circle cx="20" cy="44" r="2"><animate attributeName="cy" values="40;54;40" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.8s" repeatCount="indefinite"/></circle>
      <circle cx="30" cy="42" r="1.5"><animate attributeName="cy" values="38;52;38" dur="2.0s" begin="0.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="2.0s" begin="0.3s" repeatCount="indefinite"/></circle>
      <circle cx="38" cy="44" r="1.8"><animate attributeName="cy" values="40;54;40" dur="1.6s" begin="0.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.6s" begin="0.6s" repeatCount="indefinite"/></circle>
      <circle cx="46" cy="42" r="1.3"><animate attributeName="cy" values="38;52;38" dur="2.2s" begin="0.1s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="2.2s" begin="0.1s" repeatCount="indefinite"/></circle>
    </g></svg>`,
  windy:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#90A4AE" stroke-width="2.5" stroke-linecap="round" opacity="0.7">
      <path d="M6 20 Q20 14 34 20 Q48 26 58 20" fill="none"><animate attributeName="d" values="M6 20 Q20 14 34 20 Q48 26 58 20;M6 20 Q20 24 34 20 Q48 14 58 20;M6 20 Q20 14 34 20 Q48 26 58 20" dur="3s" repeatCount="indefinite"/></path>
      <path d="M8 30 Q22 24 36 30 Q50 36 60 30" fill="none"><animate attributeName="d" values="M8 30 Q22 24 36 30 Q50 36 60 30;M8 30 Q22 34 36 30 Q50 24 60 30;M8 30 Q22 24 36 30 Q50 36 60 30" dur="3.5s" begin="0.5s" repeatCount="indefinite"/></path>
      <path d="M10 40 Q24 36 38 40 Q52 44 62 40" fill="none"><animate attributeName="d" values="M10 40 Q24 36 38 40 Q52 44 62 40;M10 40 Q24 44 38 40 Q52 36 62 40;M10 40 Q24 36 38 40 Q52 44 62 40" dur="2.8s" begin="1s" repeatCount="indefinite"/></path>
    </g></svg>`,
};

// ── Map Zambretti conditions to weather icons (day/night aware) ──────────
const ZAMBRETTI_TO_ICON = {
  sunny:"sunny", night_clear:"night_clear",
  settled_fine:"sunny", fine_weather:"sunny",
  fine_becoming_less_settled:"partlycloudy", fairly_fine_showery_later:"partlycloudy",
  showery_becoming_more_unsettled:"rainy", unsettled_rain_later:"cloudy",
  rain_at_times_worse_later:"rainy", rain_at_times_becoming_very_unsettled:"pouring",
  very_unsettled_rain:"pouring", fine_possibly_showers:"partlycloudy",
  fairly_fine_showers_likely:"partlycloudy", showery_bright_intervals:"rainy",
  changeable_some_rain:"cloudy", unsettled_rain_at_times:"rainy",
  rain_at_frequent_intervals:"pouring", stormy_much_rain:"lightning-rainy",
  becoming_fine:"partlycloudy", fairly_fine_improving:"partlycloudy",
  fairly_fine_possibly_showers_early:"partlycloudy", showery_early_improving:"rainy",
  changeable_mending:"cloudy", rather_unsettled_clearing_later:"cloudy",
  unsettled_probably_improving:"cloudy", unsettled_short_fine_intervals:"cloudy",
  very_unsettled_finer_at_times:"pouring", stormy_possibly_improving:"lightning-rainy",
  stable:"partlycloudy",
};

// ── Themes ────────────────────────────────────────────────────────────────
const CONDITION_THEME = {
  sunny:            {bg:"linear-gradient(135deg,#C65A00 0%,#F2820A 35%,#FFAA33 65%,#FFD580 100%)"},
  night_clear:      {bg:"linear-gradient(135deg,#0a1628 0%,#1a237e 55%,#283593 100%)"},
  partlycloudy:     {bg:"linear-gradient(135deg,#1565C0 0%,#1976D2 55%,#42A5F5 100%)"},
  cloudy:           {bg:"linear-gradient(135deg,#37474F 0%,#546E7A 60%,#78909C 100%)"},
  rainy:            {bg:"linear-gradient(135deg,#1A237E 0%,#283593 55%,#3949AB 100%)"},
  pouring:          {bg:"linear-gradient(135deg,#0D1B2A 0%,#1A237E 55%,#283593 100%)"},
  "lightning-rainy":{bg:"linear-gradient(135deg,#1a0533 0%,#311B92 55%,#4527A0 100%)"},
  snowy:            {bg:"linear-gradient(135deg,#37474F 0%,#546E7A 60%,#B0BEC5 100%)"},
  windy:            {bg:"linear-gradient(135deg,#455A64 0%,#607D8B 55%,#90A4AE 100%)"},
};
const DEFAULT_THEME = {bg:"linear-gradient(135deg,#1565C0 0%,#1976D2 100%)"};
function getTheme(c){ return CONDITION_THEME[c] || DEFAULT_THEME; }

// ── Determine weather icon key from zambretti state + night flag ─────────
function getWeatherIconKey(zambrettiState, isNight) {
  if (zambrettiState === "settled_fine" || zambrettiState === "fine_weather") {
    return isNight ? "night_clear" : "sunny";
  }
  return ZAMBRETTI_TO_ICON[zambrettiState] || "partlycloudy";
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────
function sparklineSvg(points, width=240, height=48) {
  if (!points || points.length < 2) return "";
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);
  const pts = points.map((v, i) => `${(i*stepX).toFixed(1)},${(height - (v-min)/range*(height-6) - 3).toFixed(1)}`).join(" ");
  const color = points[points.length-1] > points[0] ? "#4CAF50" : "#EF5350";
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <polyline fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${pts}"/>
    <polygon fill="${color}" opacity="0.12" points="${pts} ${width},${height} 0,${height}"/>
    <text x="${width-4}" y="10" fill="${color}" font-size="9" font-weight="700" text-anchor="end">${min.toFixed(0)}</text>
    <text x="${width-4}" y="${height-4}" fill="${color}" font-size="9" font-weight="700" text-anchor="end">${max.toFixed(0)}</text>
  </svg>`;
}

// ── Short 2-word label ────────────────────────────────────────────────────
function shortLabel(key, labels) {
  const full = labels[key] || key || "—";
  return full.split(/[,\s]+/).filter(Boolean).slice(0,2).join(" ");
}

// ── Unique ID counter for SVG gradients ──────────────────────────────────
let _gradientIdCounter = 0;

// ── Precipitation SVG ─────────────────────────────────────────────────────
function precipWidget(pct) {
  // viewBox 120×110 — подкова занимает почти весь блок
  // Центр дуги (60, 60), радиус 44, толщина 10
  // 270° arc, gap внизу (rot = -225°)
  const r=44, cx=60, cy=60, circ=2*Math.PI*r;
  const trackLen=circ*0.75, trackGap=circ-trackLen;
  const fillLen=trackLen*(pct/100), fillGap=circ-fillLen;
  const rot=-225;

  const fillColor = pct<30 ? "#90CAF9" : pct<60 ? "#42A5F5" : "#1565C0";
  const gid="pw"+(++_gradientIdCounter);

  return `<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <defs>
      <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fillColor}" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="${fillColor}" stop-opacity="1"/>
      </linearGradient>
    </defs>

    <!-- Track -->
    <circle cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="rgba(255,255,255,0.20)" stroke-width="10"
      stroke-dasharray="${trackLen.toFixed(2)} ${trackGap.toFixed(2)}"
      stroke-linecap="round"
      transform="rotate(${rot} ${cx} ${cy})"/>

    <!-- Fill -->
    <circle cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="url(#${gid})" stroke-width="10"
      stroke-dasharray="${fillLen.toFixed(2)} ${fillGap.toFixed(2)}"
      stroke-linecap="round"
      transform="rotate(${rot} ${cx} ${cy})"
      style="transition:stroke-dasharray .9s ease"/>

    <!-- Процент строго в центре дуги -->
    <text x="${cx}" y="${cy}"
      text-anchor="middle" dominant-baseline="central"
      fill="white" font-size="22" font-weight="900"
      font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">${pct}%</text>
  </svg>`;
}

// ── Main card ─────────────────────────────────────────────────────────────
class ZambrettiWeatherCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"});
    this._config = {};
  }

  static getConfigElement() { return document.createElement("zambretti-weather-card-editor"); }

  static getStubConfig() {
    return {
      entity_zambretti:"sensor.zambretti_forecast",
      entity_sager:"sensor.sager_forecast",
      entity_6h:"sensor.zambretti_forecast_6h",
      entity_12h:"sensor.zambretti_forecast_12h",
      entity_24h:"sensor.zambretti_forecast_24h",
      entity_precip:"sensor.precipitation_probability",
      language:"auto",
      compact:false,
      auto_theme:true,
      custom_bg:"linear-gradient(135deg,#1565C0 0%,#1976D2 100%)",
    };
  }

  setConfig(config) {
    this._config = {
      entity_zambretti:"sensor.zambretti_forecast",
      entity_sager:"sensor.sager_forecast",
      entity_6h:"sensor.zambretti_forecast_6h",
      entity_12h:"sensor.zambretti_forecast_12h",
      entity_24h:"sensor.zambretti_forecast_24h",
      entity_precip:"sensor.precipitation_probability",
      language:"auto",
      compact:false,
      show_sager:true,
      show_precip:true,
      show_forecasts:true,
      auto_theme:true,
      custom_bg:"linear-gradient(135deg,#1565C0 0%,#1976D2 100%)",
      ...config,
    };
  }

  set hass(h) { this._hass=h; this._render(); }

  // Listen for live background updates from the editor without re-rendering
  connectedCallback() {
    this._bgHandler = e => {
      if (this._config && this._config.auto_theme === false) {
        this._config = {...this._config, custom_bg: e.detail.bg};
        const card = this.shadowRoot.querySelector("ha-card");
        if (card) card.style.background = e.detail.bg;
      }
    };
    window.addEventListener("zambretti-bg-preview", this._bgHandler);
  }

  disconnectedCallback() {
    window.removeEventListener("zambretti-bg-preview", this._bgHandler);
  }

  _state(id){ return this._hass?.states?.[id]?.state ?? null; }

  _labels() {
    const lang = this._config.language==="auto"
      ? (this._hass?.language||"en") : this._config.language;
    if (lang.startsWith("ru")) return LABELS_RU;
    if (lang.startsWith("fr")) return LABELS_FR;
    return LABELS_EN;
  }

  _isRu(){ return this._labels()===LABELS_RU; }

  _attr(id, key, fallback) {
    return this._hass?.states?.[id]?.attributes?.[key] ?? fallback;
  }

  _render() {
    if (!this._hass) return;
    const cfg=this._config, L=this._labels();
    const compact=!!cfg.compact;

    const zState=this._state(cfg.entity_zambretti);
    const sState=this._state(cfg.entity_sager);
    const s6h=this._state(cfg.entity_6h);
    const s12h=this._state(cfg.entity_12h);
    const s24h=this._state(cfg.entity_24h);
    const precip = Math.max(0, Math.min(100, parseInt(this._state(cfg.entity_precip)||"0", 10) || 0));

    // Night detection and icon selection
    const isNight = this._attr(cfg.entity_zambretti, "is_night", false);
    const iconKey = getWeatherIconKey(zState, isNight);
    const condThemeKey = isNight && (zState === "settled_fine" || zState === "fine_weather")
      ? "night_clear" : (ZAMBRETTI_CONDITION[zState] || "partlycloudy");

    const windSpeed = this._attr(cfg.entity_zambretti, "wind_speed", null);
    const windDeg = this._attr(cfg.entity_zambretti, "wind_degrees", null);
    const windDir = this._attr(cfg.entity_zambretti, "wind_direction", null);

    const autoTheme = cfg.auto_theme !== false;
    const theme = autoTheme ? getTheme(condThemeKey) : {bg: cfg.custom_bg || DEFAULT_THEME.bg};
    const icon=WEATHER_ICONS[iconKey]||WEATHER_ICONS.partlycloudy;
    const zLabel=L[zState]||zState||"—";
    const sLabel=L[sState]||sState||"—";
    const precipLabel=this._isRu()?"Осадки":"Precip";

    const showPrecip    = cfg.show_precip    !== false;
    const showForecasts = cfg.show_forecasts !== false;
    const showSager     = cfg.show_sager     !== false;

    // Sparkline data from sensor attributes
    const pHistory = this._attr(cfg.entity_zambretti, "pressure_history", null);

    const fCells=[
      {label:"6h",  key:s6h},
      {label:"12h", key:s12h},
      {label:"24h", key:s24h},
    ].map(f=>`
      <div class="fc">
        <span class="fc-time">${f.label}</span>
        <span class="fc-icon">${WEATHER_ICONS[ZAMBRETTI_CONDITION[f.key]||"partlycloudy"]||""}</span>
        <span class="fc-lbl">${L[f.key] || f.key || "—"}</span>
      </div>`).join("");

    // Wind info line
    const windStr = windSpeed !== null
      ? `${windDir ? windDir + " " : ""}${windSpeed.toFixed?.(1) || windSpeed} ${this._isRu()?"м/с":"m/s"}`
      : (windDir || "");

    const showWind = windStr && windStr.length > 0;

    // Grid layout
    const gridCols = showPrecip ? "1fr 1fr" : "1fr";

    this.shadowRoot.innerHTML=`
      <style>${this._css(theme,compact,showPrecip)}</style>
      <ha-card style="background:${theme.bg}">
        <div class="grid" style="grid-template-columns:${gridCols}">
          <div class="cell main-cell">
            <div class="main-icon">${icon}</div>
            <div class="main-info">
              <div class="main-label">${zLabel}</div>
              <div class="main-sub">Zambretti</div>
            </div>
          </div>
          ${showPrecip ? `
          <div class="cell precip-cell">
            <div class="precip-title">${precipLabel}</div>
            <div class="precip-widget">${precipWidget(precip)}</div>
          </div>` : ""}
          ${showForecasts ? `
          <div class="cell forecast-row">${fCells}</div>` : ""}
        </div>
        ${pHistory && pHistory.length > 1 ? `
        <div class="sparkline-row">
          <div class="sparkline-box">${sparklineSvg(pHistory, 240, 42)}</div>
        </div>` : ""}
        <div class="footer">
          ${showWind ? `<span class="footer-wind">${windStr}</span>` : ""}
          ${showSager ? `
          <span class="footer-badge">Sager</span>
          <span class="footer-text">${sLabel}</span>` : ""}
        </div>
      </ha-card>`;
  }

  _css(theme, compact, showPrecip=true) {
    // Scale factor: compact mode shrinks everything proportionally
    const s = compact ? 0.82 : 1;
    const iconSz    = Math.round(72*s);
    const mainFsz   = (1.15*s).toFixed(2);
    const subFsz    = (0.72*s).toFixed(2);
    const timeFsz   = (0.82*s).toFixed(2);
    const fcLblFsz  = (0.96*s).toFixed(2);
    const fcIconSz  = Math.round(42*s);
    const footFsz   = (0.80*s).toFixed(2);
    const precipSz  = Math.round(118*s);
    const precipTSz = (0.75*s).toFixed(2);

    return `
      :host { display:block; }

      ha-card {
        border-radius: 22px;
        overflow: hidden;
        box-shadow: 0 8px 36px rgba(0,0,0,0.30);
        font-family: var(--primary-font-family,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif);
        color: #fff;
        padding: 0;
        border: none;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
      }

      .cell { padding: ${compact?"12px 10px":"16px 14px"}; }

      /* ── Top-left ── */
      .main-cell {
        grid-column:1; grid-row:1;
        display:flex; align-items:center;
        gap:${compact?10:13}px;
        border-right:  1px solid rgba(255,255,255,0.12);
        border-bottom: 1px solid rgba(255,255,255,0.12);
      }

      .main-icon {
        flex: 0 0 ${iconSz}px;
        width: ${iconSz}px; height: ${iconSz}px;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.35));
      }
      .main-icon svg { width:100%; height:100%; }

      .main-info { flex:1; min-width:0; }

      .main-label {
        font-size: ${mainFsz}rem;
        font-weight: 700;
        line-height: 1.25;
        letter-spacing: -0.01em;
        text-shadow: 0 1px 6px rgba(0,0,0,0.35);
      }

      .main-sub {
        font-size: ${subFsz}rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.58;
        margin-top: 4px;
      }

      /* ── Top-right: precipitation ── */
      .precip-cell {
        grid-column:2; grid-row:1;
        display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        gap: 2px;
        border-bottom: 1px solid rgba(255,255,255,0.12);
        padding: ${compact?"10px 6px":"12px 8px"};
      }

      .precip-title {
        font-size: ${precipTSz}rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 1;
        text-shadow: 0 1px 4px rgba(0,0,0,0.35);
      }

      .precip-widget {
        width:  ${precipSz}px;
        height: ${precipSz}px;
      }

      /* ── Bottom forecast row ── */
      .forecast-row {
        grid-column:1/-1; grid-row:2;
        display:grid;
        grid-template-columns:1fr 1fr 1fr;
        padding:0;
      }

      .fc {
        display:flex; flex-direction:column;
        align-items:center;
        padding: ${compact?"8px 4px 10px":"10px 6px 14px"};
        border-right: 1px solid rgba(255,255,255,0.09);
        gap: 3px;
      }
      .fc:last-child { border-right:none; }

      .fc-time {
        font-size: ${(0.82*s).toFixed(2)}rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        opacity: 1;
        color: rgba(255,255,255,0.95);
        background: rgba(255,255,255,0.15);
        border-radius: 5px;
        padding: 1px 7px;
      }

      .fc-icon {
        width:${fcIconSz}px; height:${fcIconSz}px;
        display:flex; align-items:center; justify-content:center;
        opacity: 0.90;
      }
      .fc-icon svg { width:100%; height:100%; }

      .fc-lbl {
        font-size: ${fcLblFsz}rem;
        font-weight: 700;
        text-align: center;
        line-height: 1.25;
        opacity: 1;
        color: #fff;
        text-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }

      /* ── Sparkline row ── */
      .sparkline-row {
        padding: ${compact?"4px 12px 2px":"6px 16px 4px"};
        background: rgba(0,0,0,0.08);
      }
      .sparkline-box {
        width:100%; height:42px;
        opacity: 0.85;
      }

      /* ── Footer ── */
      .footer {
        display:flex; align-items:center;
        gap: 10px;
        padding: ${compact?"6px 12px 8px":"8px 16px 10px"};
        background: rgba(0,0,0,0.20);
        border-top: 1px solid rgba(255,255,255,0.09);
        flex-wrap: wrap;
      }

      .footer-wind {
        font-size: ${(0.72*s).toFixed(2)}rem;
        font-weight: 600;
        opacity: 0.85;
        letter-spacing: 0.04em;
        white-space: nowrap;
      }

      .footer-badge {
        font-size: 0.62rem;
        font-weight: 700;
        letter-spacing: 0.10em;
        text-transform: uppercase;
        background: rgba(255,255,255,0.16);
        border: 1px solid rgba(255,255,255,0.28);
        border-radius: 5px;
        padding: 2px 8px;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .footer-text {
        font-size: ${footFsz}rem;
        font-weight: 500;
        opacity: 0.80;
        line-height: 1.3;
      }
    `;
  }

  getCardSize() { return 3; }
}

// ── Visual editor ─────────────────────────────────────────────────────────
class ZambrettiWeatherCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"});
    this._config={};
  }

  setConfig(config) {
    this._config={...config};
    this._render();
  }

  set hass(h) { this._hass=h; }

  _applyBgToCard(bg) {
    window.dispatchEvent(new CustomEvent("zambretti-bg-preview", {detail: {bg}}));
  }

  _fire(config) {
    this.dispatchEvent(new CustomEvent("config-changed",{detail:{config},bubbles:true,composed:true}));
  }

  _render() {
    const c=this._config;
    const lang = c.language || "auto";
    const hLang = this._hass?.language || "en";
    const isRu = lang === "ru" || (lang === "auto" && hLang.startsWith("ru"));
    const isFr = lang === "fr" || (lang === "auto" && hLang.startsWith("fr"));
    const t = isRu ? {
      appearance:   "Внешний вид",
      language:     "Язык",
      langAuto:     "Авто (из Home Assistant)",
      compact:      "Компактный режим",
      compactHint:  "Уменьшить карточку для узких колонок",
      showSager:    "Показывать прогноз Sager",
      showSagerH:   "Нижняя полоска с аналитикой Sager",
      showPrecip:   "Показывать вероятность осадков",
      showPrecipH:  "Круговой индикатор справа",
      showForecasts:"Показывать прогнозы 6ч / 12ч / 24ч",
      showForecastH:"Нижний ряд с иконками",
      autoTheme:    "Авто-тема по погоде",
      autoThemeH:   "Цвет фона меняется по текущему условию",
      customBg:     "Свой фон карточки",
      customBgH:    "CSS-градиент или цвет, напр. #1a1a2e или linear-gradient(...)",
    } : isFr ? {
      appearance:   "Apparence",
      language:     "Langue",
      langAuto:     "Auto (depuis Home Assistant)",
      compact:      "Mode compact",
      compactHint:  "Carte plus petite pour les colonnes étroites",
      showSager:    "Afficher la prévision Sager",
      showSagerH:   "Bandeau inférieur avec l'analyse Sager",
      showPrecip:   "Afficher les précipitations",
      showPrecipH:  "Jauge circulaire à droite",
      showForecasts:"Afficher les prévisions 6h / 12h / 24h",
      showForecastH:"Rangée inférieure avec les icônes de prévision",
      autoTheme:    "Thème automatique selon la météo",
      autoThemeH:   "La couleur de fond suit la condition météo actuelle",
      customBg:     "Fond personnalisé",
      customBgH:    "Dégradé CSS ou couleur, ex. #1a1a2e ou linear-gradient(...)",
    } : {
      appearance:   "Appearance",
      language:     "Language",
      langAuto:     "Auto (from Home Assistant)",
      compact:      "Compact mode",
      compactHint:  "Smaller card for narrow columns",
      showSager:    "Show Sager forecast",
      showSagerH:   "Bottom strip with Sager analytics",
      showPrecip:   "Show precipitation indicator",
      showPrecipH:  "Circular gauge on the right",
      showForecasts:"Show 6h / 12h / 24h forecasts",
      showForecastH:"Bottom row with forecast icons",
      autoTheme:    "Auto theme by condition",
      autoThemeH:   "Background color follows current weather condition",
      customBg:     "Custom card background",
      customBgH:    "CSS gradient or color, e.g. #1a1a2e or linear-gradient(...)",
    };

    const autoThemeOn = c.auto_theme !== false;
    const customBg = c.custom_bg || "linear-gradient(135deg,#1565C0 0%,#1976D2 100%)";
    // Extract solid color from custom_bg for the color input (works when user sets a plain hex)
    const isSolidColor = /^#[0-9a-fA-F]{3,8}$/.test(customBg.trim());
    const colorInputVal = isSolidColor ? customBg.trim() : "#1565C0";

    this.shadowRoot.innerHTML=`
      <style>
        :host{display:block;padding:4px 0 8px}
        .section-title{
          font-size:0.70rem;font-weight:700;letter-spacing:.10em;
          text-transform:uppercase;color:var(--secondary-text-color);
          margin:16px 0 6px;padding-left:2px;
        }
        .lang-row{margin-bottom:12px}
        .lang-row label{
          display:block;font-size:0.82rem;
          color:var(--secondary-text-color);margin-bottom:4px;
        }
        select{
          width:100%;padding:10px 12px;
          border-radius:8px;
          border:1px solid var(--divider-color,rgba(255,255,255,0.15));
          background:var(--card-background-color,#1e1e1e);
          color:var(--primary-text-color,#fff);
          font-size:0.95rem;cursor:pointer;
        }
        .row{
          display:flex;align-items:center;justify-content:space-between;
          padding:10px 2px;
          border-bottom:1px solid var(--divider-color,rgba(0,0,0,.10));
        }
        .row:last-child{border-bottom:none}
        .row-label{font-size:0.95rem;color:var(--primary-text-color)}
        .row-hint{font-size:0.75rem;color:var(--secondary-text-color);margin-top:2px}
        .custom-bg-row{
          padding:10px 2px 12px;
          border-bottom:1px solid var(--divider-color,rgba(0,0,0,.10));
        }
        .custom-bg-row .row-label{font-size:0.95rem;color:var(--primary-text-color)}
        .custom-bg-row .row-hint{font-size:0.75rem;color:var(--secondary-text-color);margin-top:2px;margin-bottom:8px}
        .bg-inputs{display:flex;gap:8px;align-items:center;margin-top:6px}
        .bg-color-swatch{
          width:36px;height:36px;border-radius:8px;border:2px solid rgba(255,255,255,0.2);
          cursor:pointer;flex-shrink:0;overflow:hidden;position:relative;
        }
        .bg-color-swatch input[type=color]{
          position:absolute;inset:0;width:100%;height:100%;
          border:none;padding:0;cursor:pointer;opacity:0;
        }
        .bg-color-preview{
          position:absolute;inset:0;border-radius:6px;pointer-events:none;
        }
        .bg-text-input{
          flex:1;padding:8px 10px;
          border-radius:8px;
          border:1px solid var(--divider-color,rgba(255,255,255,0.15));
          background:var(--card-background-color,#1e1e1e);
          color:var(--primary-text-color,#fff);
          font-size:0.85rem;font-family:monospace;
        }
      </style>

      <div class="section-title">${t.appearance}</div>

      <div class="lang-row">
        <label>${t.language}</label>
        <select id="sel-lang">
          <option value="auto" ${lang==="auto"?"selected":""}>${t.langAuto}</option>
          <option value="en"   ${lang==="en"?"selected":""}>English</option>
          <option value="fr"   ${lang==="fr"?"selected":""}>Français</option>
          <option value="ru"   ${lang==="ru"?"selected":""}>Русский</option>
        </select>
      </div>

      ${this._toggle("sw-auto-theme",t.autoTheme,    t.autoThemeH,    autoThemeOn)}
      ${!autoThemeOn ? `
      <div class="custom-bg-row">
        <div class="row-label">${t.customBg}</div>
        <div class="row-hint">${t.customBgH}</div>
        <div class="bg-inputs">
          <div class="bg-color-swatch" title="Pick solid color">
            <div class="bg-color-preview" id="bg-preview" style="background:${customBg}"></div>
            <input type="color" id="bg-color-picker" value="${colorInputVal}">
          </div>
          <input type="text" class="bg-text-input" id="bg-text"
            value="${customBg.replace(/"/g,'&quot;')}"
            placeholder="linear-gradient(...) or #hex" spellcheck="false">
        </div>
      </div>` : ""}
      ${this._toggle("sw-sager",     t.showSager,    t.showSagerH,    c.show_sager    !==false)}
      ${this._toggle("sw-precip",    t.showPrecip,   t.showPrecipH,   c.show_precip   !==false)}
      ${this._toggle("sw-forecasts", t.showForecasts,t.showForecastH, c.show_forecasts!==false)}
    `;

    this.shadowRoot.querySelector("#sel-lang").addEventListener("change",e=>{
      this._fire({...this._config, language: e.target.value});
    });

    this.shadowRoot.querySelectorAll("ha-switch[data-key]").forEach(el=>{
      el.addEventListener("change",()=>{
        this._fire({...this._config, [el.dataset.key]: el.checked});
      });
    });

    // Custom background controls (only rendered when auto_theme=false)
    const bgText = this.shadowRoot.querySelector("#bg-text");
    const bgPicker = this.shadowRoot.querySelector("#bg-color-picker");
    const bgPreview = this.shadowRoot.querySelector("#bg-preview");

    if (bgText) {
      bgText.addEventListener("change", e => {
        const val = e.target.value.trim();
        if (bgPreview) bgPreview.style.background = val;
        this._fire({...this._config, custom_bg: val});
      });
    }
    if (bgPicker) {
      // "input" — live preview without re-rendering the editor
      bgPicker.addEventListener("input", e => {
        const val = e.target.value;
        if (bgPreview) bgPreview.style.background = val;
        if (bgText) bgText.value = val;
        // Patch config silently and force the card to re-render
        // without dispatching config-changed (which would destroy the editor/picker)
        this._config = {...this._config, custom_bg: val};
        this._applyBgToCard(val);
      });
      // "change" — picker closed: persist to HA config
      bgPicker.addEventListener("change", e => {
        const val = e.target.value;
        if (bgPreview) bgPreview.style.background = val;
        if (bgText) bgText.value = val;
        this._fire({...this._config, custom_bg: val});
      });
    }
  }

  _toggle(id, label, hint, checked) {
    const keyMap = {
      "sw-compact":"compact","sw-sager":"show_sager",
      "sw-precip":"show_precip","sw-forecasts":"show_forecasts",
      "sw-auto-theme":"auto_theme",
    };
    return `<div class="row">
      <div class="row-text">
        <div class="row-label">${label}</div>
        <div class="row-hint">${hint}</div>
      </div>
      <ha-switch data-key="${keyMap[id]}" ${checked?"checked":""}></ha-switch>
    </div>`;
  }
}

// ── Register ──────────────────────────────────────────────────────────────
customElements.define("zambretti-weather-card", ZambrettiWeatherCard);
customElements.define("zambretti-weather-card-editor", ZambrettiWeatherCardEditor);

window.customCards = window.customCards||[];
window.customCards.push({
  type:             "zambretti-weather-card",
  name:             "Zambretti & Sager Weather Card",
  description:      "iOS-style weather widget — Zambretti & Sager forecasts",
  preview:          true,
  documentationURL: "https://github.com/ziffmafiya/zambretti_sager",
});
