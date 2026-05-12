class ZambrettiBarometerCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.header = 'Weather Forecast';
      this.content = document.createElement('div');
      this.content.style.padding = '16px';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const config = this.config;
    const pressureSensor = hass.states[config.pressure_entity];
    const zambrettiSensor = hass.states[config.zambretti_entity];
    const precipSensor = hass.states[config.precipitation_entity];

    if (!pressureSensor || !zambrettiSensor) {
      this.content.innerHTML = 'Sensors not found';
      return;
    }

    const pressure = parseFloat(pressureSensor.state);
    const forecast = zambrettiSensor.state;
    const precipitation = precipSensor ? parseFloat(precipSensor.state) : 0;

    // Получаем историю давления для расчета тренда
    const history = pressureSensor.attributes.history || [];
    const trend = this.calculateTrend(pressure, history);

    // Определяем цвет на основе прогноза
    const color = this.getWeatherColor(forecast, precipitation);
    const icon = this.getWeatherIcon(forecast);

    this.content.innerHTML = `
      <style>
        .barometer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .barometer-gauge {
          position: relative;
          width: 250px;
          height: 250px;
        }
        .barometer-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .barometer-inner {
          width: 85%;
          height: 85%;
          border-radius: 50%;
          background: var(--card-background-color, #1c1c1c);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 5px 15px rgba(0,0,0,0.5);
        }
        .pressure-value {
          font-size: 48px;
          font-weight: bold;
          color: ${color};
          text-shadow: 0 2px 10px ${color}80;
        }
        .pressure-unit {
          font-size: 18px;
          color: var(--secondary-text-color);
          margin-top: -5px;
        }
        .trend-arrow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(${this.getTrendRotation(trend)}deg);
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 60px solid ${color};
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.3));
          transition: transform 0.5s ease;
        }
        .forecast-info {
          text-align: center;
          width: 100%;
        }
        .weather-icon {
          font-size: 64px;
          margin: 10px 0;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .forecast-text {
          font-size: 24px;
          font-weight: 600;
          color: ${color};
          margin: 10px 0;
          text-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .precipitation-bar {
          width: 100%;
          height: 30px;
          background: var(--secondary-background-color);
          border-radius: 15px;
          overflow: hidden;
          margin: 15px 0;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
        }
        .precipitation-fill {
          height: 100%;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          width: ${precipitation}%;
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        .trend-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 18px;
          color: var(--secondary-text-color);
          margin-top: 10px;
        }
        .trend-text {
          font-weight: 600;
          color: ${color};
        }
        .pressure-scale {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 10px;
          font-size: 12px;
          color: var(--secondary-text-color);
        }
      </style>

      <div class="barometer-container">
        <div class="barometer-gauge">
          <div class="barometer-circle">
            <div class="barometer-inner">
              <div class="pressure-value">${pressure.toFixed(1)}</div>
              <div class="pressure-unit">hPa</div>
            </div>
            <div class="trend-arrow"></div>
          </div>
        </div>

        <div class="forecast-info">
          <div class="weather-icon">${icon}</div>
          <div class="forecast-text">${forecast}</div>

          <div class="precipitation-bar">
            <div class="precipitation-fill">
              ${precipitation > 10 ? precipitation + '%' : ''}
            </div>
          </div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">
            Precipitation Probability: ${precipitation}%
          </div>

          <div class="trend-indicator">
            <span>Trend:</span>
            <span class="trend-text">${this.getTrendText(trend)}</span>
          </div>

          <div class="pressure-scale">
            <span>Low<br/>980</span>
            <span>Normal<br/>1013</span>
            <span>High<br/>1040</span>
          </div>
        </div>
      </div>
    `;
  }

  calculateTrend(current, history) {
    if (!history || history.length < 2) return 0;
    const old = parseFloat(history[0]);
    return current - old;
  }

  getTrendRotation(trend) {
    // Стрелка указывает вверх при росте, вниз при падении
    if (trend > 2) return 0;      // Быстрый рост - вверх
    if (trend > 0.5) return 45;   // Медленный рост - вверх-вправо
    if (trend < -2) return 180;   // Быстрое падение - вниз
    if (trend < -0.5) return 135; // Медленное падение - вниз-вправо
    return 90;                     // Стабильно - вправо
  }

  getTrendText(trend) {
    if (trend > 2) return '↑↑ Rising Fast';
    if (trend > 0.5) return '↑ Rising';
    if (trend < -2) return '↓↓ Falling Fast';
    if (trend < -0.5) return '↓ Falling';
    return '→ Steady';
  }

  getWeatherColor(forecast, precipitation) {
    const lower = forecast.toLowerCase();

    // Красный - плохая погода
    if (lower.includes('storm') || lower.includes('rain') || precipitation > 70) {
      return '#ff4444';
    }
    // Оранжевый - переменная погода
    if (lower.includes('unsettled') || lower.includes('shower') || precipitation > 40) {
      return '#ff9800';
    }
    // Желтый - облачно
    if (lower.includes('cloud') || lower.includes('variable')) {
      return '#ffc107';
    }
    // Зеленый - хорошая погода
    return '#4caf50';
  }

  getWeatherIcon(forecast) {
    const lower = forecast.toLowerCase();

    if (lower.includes('storm')) return '⛈️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('shower')) return '🌦️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('fair') || lower.includes('fine')) return '☀️';
    if (lower.includes('settled')) return '🌤️';
    return '🌥️';
  }

  setConfig(config) {
    if (!config.pressure_entity) {
      throw new Error('You need to define pressure_entity');
    }
    if (!config.zambretti_entity) {
      throw new Error('You need to define zambretti_entity');
    }
    this.config = config;
  }

  getCardSize() {
    return 5;
  }

  static getConfigElement() {
    return document.createElement('zambretti-barometer-card-editor');
  }

  static getStubConfig() {
    return {
      pressure_entity: '',
      zambretti_entity: '',
      precipitation_entity: ''
    };
  }
}

class ZambrettiBarometerCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    if (!this.content) {
      this.innerHTML = `
        <div class="card-config">
          <div class="option">
            <ha-entity-picker
              label="Pressure Sensor"
              allow-custom-entity
            ></ha-entity-picker>
          </div>
          <div class="option">
            <ha-entity-picker
              label="Zambretti Forecast Sensor"
              allow-custom-entity
            ></ha-entity-picker>
          </div>
          <div class="option">
            <ha-entity-picker
              label="Precipitation Probability Sensor (Optional)"
              allow-custom-entity
            ></ha-entity-picker>
          </div>
        </div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        .card-config {
          padding: 16px;
        }
        .option {
          margin-bottom: 16px;
        }
      `;
      this.appendChild(style);

      this.content = true;
    }

    const pickers = this.querySelectorAll('ha-entity-picker');
    if (pickers[0]) {
      pickers[0].value = config.pressure_entity || '';
      pickers[0].addEventListener('value-changed', (ev) => {
        this._config.pressure_entity = ev.detail.value;
        this._fireEvent();
      });
    }
    if (pickers[1]) {
      pickers[1].value = config.zambretti_entity || '';
      pickers[1].addEventListener('value-changed', (ev) => {
        this._config.zambretti_entity = ev.detail.value;
        this._fireEvent();
      });
    }
    if (pickers[2]) {
      pickers[2].value = config.precipitation_entity || '';
      pickers[2].addEventListener('value-changed', (ev) => {
        this._config.precipitation_entity = ev.detail.value;
        this._fireEvent();
      });
    }
  }

  set hass(hass) {
    this._hass = hass;
    const pickers = this.querySelectorAll('ha-entity-picker');
    pickers.forEach(picker => {
      picker.hass = hass;
    });
  }

  _fireEvent() {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define('zambretti-barometer-card', ZambrettiBarometerCard);
customElements.define('zambretti-barometer-card-editor', ZambrettiBarometerCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'zambretti-barometer-card',
  name: 'Zambretti Barometer Card',
  description: 'Beautiful barometer card with weather forecast visualization'
});
