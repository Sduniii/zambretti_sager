/**
 * Zambretti & Sager Weather Card  v1.9.3
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

// ── SVG weather icons ─────────────────────────────────────────────────────
const WEATHER_ICONS = {
  sunny:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="12" fill="#FFD700"><animate attributeName="r" values="12;13.5;12" dur="3s" repeatCount="indefinite"/></circle>
    <g stroke="#FFD700" stroke-width="2.5" stroke-linecap="round" opacity="0.85">
      <line x1="32" y1="8" x2="32" y2="14"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></line>
      <line x1="32" y1="50" x2="32" y2="56"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></line>
      <line x1="8" y1="32" x2="14" y2="32"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></line>
      <line x1="50" y1="32" x2="56" y2="32"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></line>
      <line x1="14.9" y1="14.9" x2="19.3" y2="19.3"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></line>
      <line x1="44.7" y1="44.7" x2="49.1" y2="49.1"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></line>
      <line x1="49.1" y1="14.9" x2="44.7" y2="19.3"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></line>
      <line x1="19.3" y1="44.7" x2="14.9" y2="49.1"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="12s" repeatCount="indefinite"/></line>
    </g></svg>`,
  partlycloudy:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="26" r="9" fill="#FFD700" opacity="0.9"><animate attributeName="cy" values="26;24;26" dur="4s" repeatCount="indefinite"/></circle>
    <ellipse cx="36" cy="36" rx="16" ry="10" fill="#B0BEC5"/>
    <ellipse cx="28" cy="34" rx="12" ry="9" fill="#CFD8DC"/>
    <ellipse cx="44" cy="37" rx="10" ry="7" fill="#B0BEC5"/></svg>`,
  cloudy:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="30" rx="20" ry="12" fill="#90A4AE"><animate attributeName="cx" values="32;33;32;31;32" dur="5s" repeatCount="indefinite"/></ellipse>
    <ellipse cx="24" cy="34" rx="14" ry="10" fill="#B0BEC5"/>
    <ellipse cx="42" cy="35" rx="12" ry="9" fill="#90A4AE"/></svg>`,
  rainy:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="24" rx="18" ry="11" fill="#78909C"/>
    <ellipse cx="22" cy="28" rx="13" ry="9" fill="#90A4AE"/>
    <ellipse cx="42" cy="28" rx="12" ry="8" fill="#78909C"/>
    <g fill="#64B5F6" opacity="0.85">
      <ellipse cx="24" cy="43" rx="1.5" ry="4"><animate attributeName="cy" values="43;52;43" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.2s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="32" cy="41" rx="1.5" ry="4"><animate attributeName="cy" values="41;50;41" dur="1.4s" begin="0.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.4s" begin="0.3s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="40" cy="43" rx="1.5" ry="4"><animate attributeName="cy" values="43;52;43" dur="1.1s" begin="0.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.1s" begin="0.6s" repeatCount="indefinite"/></ellipse>
    </g></svg>`,
  pouring:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="22" rx="18" ry="11" fill="#546E7A"/>
    <ellipse cx="22" cy="26" rx="13" ry="9" fill="#607D8B"/>
    <ellipse cx="42" cy="26" rx="12" ry="8" fill="#546E7A"/>
    <g fill="#42A5F5" opacity="0.9">
      <ellipse cx="20" cy="41" rx="1.5" ry="4"><animate attributeName="cy" values="41;52;41" dur="0.9s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="0.9s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="28" cy="39" rx="1.5" ry="4"><animate attributeName="cy" values="39;50;39" dur="0.8s" begin="0.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="0.8s" begin="0.2s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="36" cy="41" rx="1.5" ry="4"><animate attributeName="cy" values="41;52;41" dur="1.0s" begin="0.1s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="1.0s" begin="0.1s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="44" cy="39" rx="1.5" ry="4"><animate attributeName="cy" values="39;50;39" dur="0.85s" begin="0.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="0.85s" begin="0.4s" repeatCount="indefinite"/></ellipse>
    </g></svg>`,
  "lightning-rainy":`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="20" rx="18" ry="11" fill="#37474F"/>
    <ellipse cx="22" cy="25" rx="13" ry="9" fill="#455A64"/>
    <ellipse cx="42" cy="25" rx="12" ry="8" fill="#37474F"/>
    <polygon points="34,33 28,44 33,44 29,54 38,40 33,40" fill="#FFD740" opacity="0.95"><animate attributeName="opacity" values="0.95;0.3;0.95" dur="2.5s" repeatCount="indefinite"/></polygon>
    <g fill="#64B5F6" opacity="0.85">
      <ellipse cx="22" cy="43" rx="1.5" ry="3"><animate attributeName="cy" values="43;51;43" dur="1.1s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="1.1s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="44" cy="42" rx="1.5" ry="3"><animate attributeName="cy" values="42;50;42" dur="0.9s" begin="0.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.85;0;0.85" dur="0.9s" begin="0.5s" repeatCount="indefinite"/></ellipse>
    </g></svg>`,
};

// ── Themes ────────────────────────────────────────────────────────────────
const CONDITION_THEME = {
  sunny:            {bg:"linear-gradient(135deg,#C65A00 0%,#F2820A 35%,#FFAA33 65%,#FFD580 100%)"},
  partlycloudy:     {bg:"linear-gradient(135deg,#1565C0 0%,#1976D2 55%,#42A5F5 100%)"},
  cloudy:           {bg:"linear-gradient(135deg,#37474F 0%,#546E7A 60%,#78909C 100%)"},
  rainy:            {bg:"linear-gradient(135deg,#1A237E 0%,#283593 55%,#3949AB 100%)"},
  pouring:          {bg:"linear-gradient(135deg,#0D1B2A 0%,#1A237E 55%,#283593 100%)"},
  "lightning-rainy":{bg:"linear-gradient(135deg,#1a0533 0%,#311B92 55%,#4527A0 100%)"},
};
const DEFAULT_THEME = {bg:"linear-gradient(135deg,#1565C0 0%,#1976D2 100%)"};
function getTheme(c){ return CONDITION_THEME[c] || DEFAULT_THEME; }

// ── Short 2-word label ────────────────────────────────────────────────────
function shortLabel(key, labels) {
  const full = labels[key] || key || "—";
  return full.split(/[,\s]+/).filter(Boolean).slice(0,2).join(" ");
}

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
  const gid="pw"+(Math.random()*1e6|0);

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
    return lang.startsWith("ru") ? LABELS_RU : LABELS_EN;
  }

  _isRu(){ return this._labels()===LABELS_RU; }

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

    const cond=ZAMBRETTI_CONDITION[zState]||"partlycloudy";
    const autoTheme = cfg.auto_theme !== false;
    const theme = autoTheme ? getTheme(cond) : {bg: cfg.custom_bg || DEFAULT_THEME.bg};
    const icon=WEATHER_ICONS[cond]||WEATHER_ICONS.partlycloudy;
    const zLabel=L[zState]||zState||"—";
    const sLabel=L[sState]||sState||"—";
    const precipLabel=this._isRu()?"Осадки":"Precip";

    const showPrecip    = cfg.show_precip    !== false;
    const showForecasts = cfg.show_forecasts !== false;
    const showSager     = cfg.show_sager     !== false;

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

    // Grid layout: if precip hidden → main-cell takes full width
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
        ${showSager ? `
        <div class="footer">
          <span class="footer-badge">Sager</span>
          <span class="footer-text">${sLabel}</span>
        </div>` : ""}
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

      /* ── Footer ── */
      .footer {
        display:flex; align-items:center;
        gap: 10px;
        padding: ${compact?"6px 12px 8px":"8px 16px 10px"};
        background: rgba(0,0,0,0.20);
        border-top: 1px solid rgba(255,255,255,0.09);
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
    const isRu = (c.language||"auto")==="ru" ||
      ((c.language||"auto")==="auto" && (this._hass?.language||"en").startsWith("ru"));
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
          <option value="auto" ${(c.language||"auto")==="auto"?"selected":""}>${t.langAuto}</option>
          <option value="en"   ${c.language==="en"?"selected":""}>English</option>
          <option value="ru"   ${c.language==="ru"?"selected":""}>Русский</option>
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
