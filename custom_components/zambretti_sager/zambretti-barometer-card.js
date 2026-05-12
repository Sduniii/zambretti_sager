console.log('Zambretti Barometer Card: Loading...');

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
    if (!config) {
      this.content.innerHTML = 'No configuration';
      return;
    }

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
          gap: 16px;
          padding: 16px;
        }
        .top-section {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: center;
        }
        .pressure-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${color}40 0%, ${color}20 100%);
          border: 3px solid ${color};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px ${color}40;
        }
        .pressure-value {
          font-size: 32px;
          font-weight: bold;
          color: ${color};
          line-height: 1;
        }
        .pressure-unit {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }
        .forecast-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .forecast-main {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .weather-icon {
          font-size: 48px;
          line-height: 1;
        }
        .forecast-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--primary-text-color);
          line-height: 1.3;
        }
        .trend-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: ${color}20;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
          color: ${color};
          border: 1px solid ${color}40;
        }
        .divider {
          height: 1px;
          background: var(--divider-color, rgba(255,255,255,0.1));
          margin: 8px 0;
        }
        .precipitation-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .precipitation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .precipitation-label {
          font-size: 13px;
          color: var(--secondary-text-color);
          font-weight: 500;
        }
        .precipitation-percent {
          font-size: 16px;
          font-weight: bold;
          color: ${precipitation > 50 ? color : 'var(--primary-text-color)'};
        }
        .precipitation-bar {
          width: 100%;
          height: 8px;
          background: var(--secondary-background-color, rgba(255,255,255,0.1));
          border-radius: 4px;
          overflow: hidden;
        }
        .precipitation-fill {
          height: 100%;
          background: linear-gradient(90deg, ${color} 0%, ${color}80 100%);
          width: ${precipitation}%;
          transition: width 0.5s ease;
          border-radius: 4px;
        }
      </style>

      <div class="barometer-container">
        <div class="top-section">
          <div class="pressure-circle">
            <div class="pressure-value">${pressure.toFixed(1)}</div>
            <div class="pressure-unit">hPa</div>
          </div>

          <div class="forecast-section">
            <div class="forecast-main">
              <div class="weather-icon">${icon}</div>
              <div class="forecast-text">${forecast}</div>
            </div>
            <div>
              <span class="trend-badge">${this.getTrendText(trend)}</span>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="precipitation-section">
          <div class="precipitation-header">
            <span class="precipitation-label">Precipitation Probability</span>
            <span class="precipitation-percent">${precipitation}%</span>
          </div>
          <div class="precipitation-bar">
            <div class="precipitation-fill"></div>
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
}

customElements.define('zambretti-barometer-card', ZambrettiBarometerCard);

console.log('Zambretti Barometer Card: Registered');

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'zambretti-barometer-card',
  name: 'Zambretti Barometer Card',
  description: 'Beautiful barometer card with weather forecast visualization'
});

console.log('Zambretti Barometer Card: Added to customCards');
