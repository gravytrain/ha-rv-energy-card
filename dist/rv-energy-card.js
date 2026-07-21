/**
 * RV Energy Card — Site Power & Billing Overview
 * A dark-themed energy dashboard card for the RV sites (North, South, She-Shed).
 * Matches the Double E Reserve / Home Overview design system.
 *
 * Billing/period numbers are pulled from Home Assistant long-term STATISTICS
 * (device-sourced, gap-proof) rather than the lossy live utility-meter sensors.
 */

const RV_CARD_VERSION = '0.1.0';

// Site definitions — colors match the existing RV dashboard convention.
const SITES = [
  {
    key: 'north',
    name: 'North',
    color: '#4285f4',
    power: 'sensor.north_site_power',
    // Authoritative statistic id (written by the Refoss backfill job).
    // Falls back to the live billing-period sensor until backfill lands.
    stat: 'sensor.refoss_smart_energy_monitor_total_energy_north_site',
    fallback_period: 'sensor.refoss_smart_energy_monitor_north_site_billing_period',
    today: 'sensor.north_site_today_energy',
    month: 'sensor.north_site_this_month_energy',
    daily_cost: 'sensor.north_site_daily_cost',
    monthly_cost: 'sensor.north_site_monthly_cost',
  },
  {
    key: 'south',
    name: 'South',
    color: '#34a853',
    power: 'sensor.south_site_power',
    stat: 'sensor.refoss_smart_energy_monitor_south_site_total_energy',
    fallback_period: 'sensor.refoss_smart_energy_monitor_south_site_billing_period',
    today: 'sensor.south_site_today_energy',
    month: 'sensor.south_site_this_month_energy',
    daily_cost: 'sensor.south_site_daily_cost',
    monthly_cost: 'sensor.south_site_monthly_cost',
  },
  {
    key: 'shed',
    name: 'She-Shed',
    color: '#9c27b0',
    power: 'sensor.em_channel_3_power',
    stat: 'sensor.shed_refoss_smart_energy_monitor_she_shed_total_energy',
    fallback_period: 'sensor.refoss_smart_energy_monitor_she_shed_billing_period',
    today: 'sensor.em_channel_3_today_energy',
    month: 'sensor.em_channel_3_this_month_energy',
    daily_cost: null,
    monthly_cost: 'sensor.she_shed_monthly_cost',
  },
];

class RvEnergyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = {};
    this._stats = {};           // key -> kWh consumed this billing period (from statistics)
    this._statsLoaded = false;
  }

  setConfig(config) {
    this._config = {
      billing_start_day: config.billing_start_day || 12,
      grid_status_entity: config.grid_status_entity || 'sensor.aiken_co_op_outage_status',
      customers_out_entity: config.customers_out_entity || 'sensor.aiken_co_op_customers_out',
      total_power_entity: config.total_power_entity || 'sensor.total_site_power',
      base_rate_entity: config.base_rate_entity || 'input_number.base_electricity_rate',
      pca_rate_entity: config.pca_rate_entity || 'input_number.current_pca_rate',
      use_statistics: config.use_statistics !== false,
      show_flow: config.show_flow !== false,
      show_billing: config.show_billing !== false,
      ...config,
    };
    this._render();
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    // Load billing-period statistics once, then refresh every 5 minutes.
    if (!this._statsLoaded && this._config.use_statistics) {
      this._statsLoaded = true;
      this._loadStatistics();
      setInterval(() => this._loadStatistics(), 300000);
    }

    if (!oldHass) {
      this._render();
      return;
    }

    const watched = this._getWatchedEntities();
    const changed = watched.some(id => oldHass.states[id] !== hass.states[id]);
    if (changed) this._render();
  }

  _getWatchedEntities() {
    const ids = [
      this._config.grid_status_entity,
      this._config.customers_out_entity,
      this._config.total_power_entity,
      this._config.base_rate_entity,
      this._config.pca_rate_entity,
    ];
    for (const s of SITES) {
      ids.push(s.power, s.today, s.month, s.daily_cost, s.monthly_cost, s.fallback_period);
    }
    return ids.filter(Boolean);
  }

  // ---- Data helpers -------------------------------------------------------

  _getState(entityId) {
    if (!entityId || !this._hass || !this._hass.states[entityId]) return null;
    return this._hass.states[entityId];
  }

  _num(entityId, fallback = 0) {
    const s = this._getState(entityId);
    if (!s) return fallback;
    const n = parseFloat(s.state);
    return isNaN(n) ? fallback : n;
  }

  _rate() {
    return this._num(this._config.base_rate_entity) + this._num(this._config.pca_rate_entity);
  }

  _billingWindow() {
    // Billing period runs from the Nth of the month to the Nth of next month.
    const startDay = this._config.billing_start_day;
    const now = new Date();
    let start;
    if (now.getDate() >= startDay) {
      start = new Date(now.getFullYear(), now.getMonth(), startDay);
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - 1, startDay);
    }
    const end = new Date(start.getFullYear(), start.getMonth() + 1, startDay);
    return { start, end };
  }

  /**
   * Pull per-site energy consumed this billing period from long-term statistics.
   * Uses the recorder statistics_during_period websocket API and the `change`
   * of the cumulative sum across the window — the authoritative, gap-proof value.
   */
  async _loadStatistics() {
    if (!this._hass) return;
    const { start, end } = this._billingWindow();
    const statIds = SITES.map(s => s.stat).filter(Boolean);
    try {
      const result = await this._hass.callWS({
        type: 'recorder/statistics_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        statistic_ids: statIds,
        period: 'day',
        types: ['change'],
      });
      const stats = {};
      for (const site of SITES) {
        const rows = result?.[site.stat];
        if (Array.isArray(rows) && rows.length) {
          let sum = 0;
          for (const r of rows) sum += (r.change || 0);
          // She-Shed statistic is in Wh; convert to kWh for consistency.
          if (site.key === 'shed' && sum > 1000) sum = sum / 1000;
          stats[site.key] = sum;
        }
      }
      this._stats = stats;
      this._render();
    } catch (err) {
      // Statistics unavailable (backfill not yet installed) — fall back to
      // the live billing-period sensors so the card still shows numbers.
      this._stats = {};
    }
  }

  _periodKwh(site) {
    if (this._config.use_statistics && this._stats[site.key] != null) {
      return this._stats[site.key];
    }
    // Fallback: live billing-period sensor (She-Shed reported in Wh).
    let v = this._num(site.fallback_period);
    if (site.key === 'shed' && v > 1000) v = v / 1000;
    return v;
  }

  // ---- Rendering ----------------------------------------------------------

  _render() {
    if (!this._hass) return;

    const rate = this._rate();
    const { start, end } = this._billingWindow();
    const now = new Date();
    const daysElapsed = Math.max(1, Math.round((now - start) / 86400000));
    const daysTotal = Math.round((end - start) / 86400000);

    const totalPower = this._num(this._config.total_power_entity);
    const todayKwh = SITES.reduce((a, s) => a + this._num(s.today), 0);
    const periodKwh = SITES.reduce((a, s) => a + this._periodKwh(s), 0);
    const periodCost = periodKwh * rate;
    const projectedKwh = periodKwh / daysElapsed * daysTotal;
    const usingStats = this._config.use_statistics && Object.keys(this._stats).length > 0;

    const customersOut = this._num(this._config.customers_out_entity);
    const gridOk = customersOut === 0;

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <div class="card">

        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <span class="header-icon">⚡</span>
            <div>
              <h1>RV Energy</h1>
              <span class="header-sub">${this._fmtRange(start, end)} · Day ${daysElapsed}/${daysTotal}</span>
            </div>
          </div>
          <div class="header-right">
            <span class="badge ${gridOk ? 'badge-on' : 'badge-alert'}">${gridOk ? 'GRID OK' : `${customersOut} OUT`}</span>
          </div>
        </div>

        <!-- Status Banner -->
        <div class="status-banner">
          <span class="status-icon">🔌</span>
          <div class="status-text">
            <strong>${this._fmtPower(totalPower)}</strong> across all sites
            <br><em>${todayKwh.toFixed(1)} kWh today · ${periodKwh.toFixed(0)} kWh this period · $${periodCost.toFixed(2)} @ $${rate.toFixed(4)}/kWh</em>
          </div>
          <div class="status-stats">
            ${SITES.map(s => `
              <div class="stat">
                <span class="stat-val" style="color:${s.color}">${this._fmtPowerShort(this._num(s.power))}</span>
                <span class="stat-label">${s.name.toUpperCase()}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Live Power (gauges) -->
        ${this._config.show_flow ? `
        <div class="section">
          <div class="section-header">
            <h2>🔋 Live Power</h2>
            <span class="badge badge-muted">NOW</span>
          </div>
          <div class="gauge-grid">
            ${SITES.map(s => this._renderGauge(s)).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Billing Period -->
        ${this._config.show_billing ? `
        <div class="section">
          <div class="section-header">
            <h2>🧾 This Billing Period</h2>
            <span class="badge ${usingStats ? 'badge-on' : 'badge-pending'}" title="${usingStats ? 'Sourced from device statistics (gap-proof)' : 'Live sensors — install Refoss backfill for accurate numbers'}">
              ${usingStats ? 'AUTHORITATIVE' : 'LIVE (est.)'}
            </span>
          </div>
          <div class="bill-summary">
            <div class="bill-headline">
              <span class="bill-total">$${periodCost.toFixed(2)}</span>
              <span class="bill-sub">${periodKwh.toFixed(0)} kWh · projected ~${projectedKwh.toFixed(0)} kWh / ~$${(projectedKwh * rate).toFixed(2)}</span>
            </div>
          </div>
          <table class="site-table">
            <thead><tr><th>Site</th><th>kWh</th><th>Cost</th><th>Today</th></tr></thead>
            <tbody>
              ${SITES.map(s => {
                const kwh = this._periodKwh(s);
                return `<tr>
                  <td><span class="dot" style="background:${s.color}"></span>${s.name}</td>
                  <td>${kwh.toFixed(1)}</td>
                  <td>$${(kwh * rate).toFixed(2)}</td>
                  <td class="muted">${this._num(s.today).toFixed(1)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="footer">
          <span class="version">RV Energy v${RV_CARD_VERSION}</span>
        </div>
      </div>
    `;
  }

  _renderGauge(site) {
    const power = this._num(site.power);
    const max = this._config[`${site.key}_max_power`] || 5000;
    const pct = Math.min(100, Math.max(0, (power / max) * 100));
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (pct / 100) * circumference;
    const today = this._num(site.today);

    return `
      <div class="gauge-card">
        <svg class="gauge" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#2a2a3e" stroke-width="6"/>
          <circle cx="40" cy="40" r="36" fill="none" stroke="${site.color}" stroke-width="6"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            stroke-linecap="round" transform="rotate(-90 40 40)"/>
          <text x="40" y="37" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">${Math.round(power)}</text>
          <text x="40" y="50" text-anchor="middle" fill="#888" font-size="8">W</text>
        </svg>
        <div class="gauge-label">${site.name}</div>
        <div class="gauge-sub">${today.toFixed(1)} kWh today</div>
      </div>
    `;
  }

  // ---- Formatting ---------------------------------------------------------

  _fmtPower(watts) {
    if (watts >= 1000) return `${(watts / 1000).toFixed(2)} kW`;
    return `${Math.round(watts)} W`;
  }

  _fmtPowerShort(watts) {
    if (watts >= 1000) return `${(watts / 1000).toFixed(1)}k`;
    return `${Math.round(watts)}`;
  }

  _fmtRange(start, end) {
    const opts = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
  }

  _styles() {
    return `
      :host { display: block; }
      .card {
        background: #0f0f1a;
        border-radius: 16px;
        padding: 24px;
        color: #e0e0e0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      /* Header */
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .header-left { display: flex; align-items: center; gap: 12px; }
      .header-icon { font-size: 28px; }
      .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #fff; }
      .header-sub { font-size: 12px; color: #888; }

      /* Badges */
      .badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px; }
      .badge-on { background: #1D9E75; color: #fff; }
      .badge-alert { background: #e74c3c; color: #fff; animation: pulse-badge 2s infinite; }
      .badge-muted { background: #2a2a3e; color: #888; }
      .badge-pending { background: #2a2a3e; color: #d4a017; border: 1px dashed #d4a017; }
      @keyframes pulse-badge { 0%,100%{opacity:1} 50%{opacity:0.5} }

      /* Status Banner */
      .status-banner {
        display: flex; align-items: center; gap: 16px;
        padding: 16px 20px; border-radius: 12px; margin-bottom: 24px;
        background: linear-gradient(135deg, #1D9E75 0%, #16a085 100%); color: #fff;
      }
      .status-icon { font-size: 24px; }
      .status-text { flex: 1; font-size: 14px; line-height: 1.5; }
      .status-text strong { font-size: 18px; }
      .status-text em { opacity: 0.9; font-size: 12px; font-style: normal; }
      .status-stats { display: flex; gap: 16px; }
      .stat { display: flex; flex-direction: column; align-items: center; min-width: 52px; }
      .stat-val { font-size: 18px; font-weight: 700; }
      .stat-label { font-size: 9px; letter-spacing: 0.5px; opacity: 0.85; margin-top: 2px; }

      /* Sections */
      .section { margin-bottom: 20px; padding: 20px; background: #1a1a2e; border-radius: 14px; }
      .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
      .section-header h2 { margin: 0; font-size: 14px; font-weight: 600; color: #fff; }

      /* Gauges */
      .gauge-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 16px; }
      .gauge-card {
        display: flex; flex-direction: column; align-items: center;
        background: #16213e; border-radius: 12px; padding: 16px 8px 12px;
      }
      .gauge { width: 80px; height: 80px; margin-bottom: 8px; }
      .gauge-label { font-size: 13px; font-weight: 600; color: #fff; }
      .gauge-sub { font-size: 11px; color: #888; margin-top: 2px; }

      /* Billing summary */
      .bill-summary { margin-bottom: 16px; }
      .bill-headline { display: flex; flex-direction: column; }
      .bill-total { font-size: 32px; font-weight: 700; color: #1D9E75; line-height: 1.1; }
      .bill-sub { font-size: 12px; color: #888; margin-top: 4px; }

      /* Site table */
      .site-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .site-table th {
        text-align: right; font-size: 10px; font-weight: 600; color: #888;
        text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 8px; border-bottom: 1px solid #2a2a3e;
      }
      .site-table th:first-child { text-align: left; }
      .site-table td { text-align: right; padding: 10px 8px; border-bottom: 1px solid #2a2a3e; color: #e0e0e0; }
      .site-table td:first-child { text-align: left; font-weight: 600; color: #fff; }
      .site-table tr:last-child td { border-bottom: none; }
      .site-table .muted { color: #888; }
      .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }

      /* Footer */
      .footer { text-align: center; margin-top: 4px; }
      .version { font-size: 10px; color: #444; }
    `;
  }

  getCardSize() {
    return 8;
  }

  static getStubConfig() {
    return {
      billing_start_day: 12,
      use_statistics: true,
    };
  }
}

customElements.define('rv-energy-card', RvEnergyCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'rv-energy-card',
  name: 'RV Energy',
  description: 'Site power & billing overview for the RV sites (gap-proof statistics)',
  preview: true,
});

console.info(`%c RV-ENERGY-CARD %c v${RV_CARD_VERSION} `, 'background:#4285f4;color:#fff;font-weight:700;', 'background:#0f0f1a;color:#4285f4;');
