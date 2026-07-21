import { LitElement, html, svg, css, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { tokens } from './styles.js';
import './meter-register.js';
import { MeterRegister } from './meter-register.js';
import type {
  HomeAssistant,
  RvEnergyCardConfig,
  StatisticRow,
} from './types.js';

const CARD_VERSION = '0.5.1';

interface Site {
  key: 'north' | 'south' | 'shed';
  name: string;
  color: string;
  power: string;
  stat: string;
  fallbackPeriod: string;
  today: string;
}

const SITES: Site[] = [
  {
    key: 'north',
    name: 'North',
    color: 'var(--north)',
    power: 'sensor.north_site_power',
    stat: 'sensor.refoss_smart_energy_monitor_total_energy_north_site',
    fallbackPeriod: 'sensor.refoss_smart_energy_monitor_north_site_billing_period',
    today: 'sensor.north_site_today_energy',
  },
  {
    key: 'south',
    name: 'South',
    color: 'var(--south)',
    power: 'sensor.south_site_power',
    stat: 'sensor.refoss_smart_energy_monitor_south_site_total_energy',
    fallbackPeriod: 'sensor.refoss_smart_energy_monitor_south_site_billing_period',
    today: 'sensor.south_site_today_energy',
  },
  {
    key: 'shed',
    name: 'She-Shed',
    color: 'var(--shed)',
    power: 'sensor.em_channel_3_power',
    stat: 'sensor.shed_refoss_smart_energy_monitor_she_shed_total_energy',
    fallbackPeriod: 'sensor.refoss_smart_energy_monitor_she_shed_billing_period',
    today: 'sensor.em_channel_3_today_energy',
  },
];

@customElement('rv-energy-card')
export class RvEnergyCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config!: RvEnergyCardConfig;
  /** Authoritative period-to-date kWh per site, from statistics (the baseline). */
  @state() private _stats: Partial<Record<Site['key'], number>> = {};
  /** Live cumulative-sensor reading captured at the moment stats last loaded. */
  private _statsAnchor: Partial<Record<Site['key'], number>> = {};

  private _statsTimer?: number;
  private _statsLoaded = false;

  setConfig(config: RvEnergyCardConfig) {
    this._config = {
      billing_start_day: 12,
      use_statistics: true,
      show_flow: true,
      show_billing: true,
      total_power_entity: 'sensor.total_site_power',
      grid_status_entity: 'sensor.aiken_co_op_outage_status',
      customers_out_entity: 'sensor.aiken_co_op_customers_out',
      base_rate_entity: 'input_number.base_electricity_rate',
      pca_rate_entity: 'input_number.current_pca_rate',
      meter_multiplier: 40,
      ...config,
    };
  }

  protected updated(changed: PropertyValues) {
    // Kick off statistics loading once hass is available.
    if (changed.has('hass') && this.hass && !this._statsLoaded && this._config.use_statistics) {
      this._statsLoaded = true;
      this._loadStatistics();
      // Refresh the authoritative baseline every 60s; live creep fills the gaps.
      this._statsTimer = window.setInterval(() => this._loadStatistics(), 60000);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._statsTimer) clearInterval(this._statsTimer);
  }

  // ---- data helpers -------------------------------------------------------

  private _num(entityId?: string, fallback = 0): number {
    if (!entityId || !this.hass?.states[entityId]) return fallback;
    const n = parseFloat(this.hass.states[entityId].state);
    return isNaN(n) ? fallback : n;
  }

  private _rate(): number {
    return this._num(this._config.base_rate_entity) + this._num(this._config.pca_rate_entity);
  }

  private _billingWindow(): { start: Date; end: Date } {
    const startDay = this._config.billing_start_day ?? 12;
    const now = new Date();
    const start =
      now.getDate() >= startDay
        ? new Date(now.getFullYear(), now.getMonth(), startDay)
        : new Date(now.getFullYear(), now.getMonth() - 1, startDay);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, startDay);
    return { start, end };
  }

  private async _loadStatistics() {
    if (!this.hass) return;
    const { start, end } = this._billingWindow();
    const ids = SITES.map((s) => s.stat);
    try {
      const result = await this.hass.callWS<Record<string, StatisticRow[]>>({
        type: 'recorder/statistics_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        statistic_ids: ids,
        period: 'day',
        types: ['change'],
      });
      const stats: Partial<Record<Site['key'], number>> = {};
      const anchor: Partial<Record<Site['key'], number>> = {};
      for (const site of SITES) {
        const rows = result?.[site.stat];
        if (Array.isArray(rows) && rows.length) {
          let sum = rows.reduce((a, r) => a + (r.change || 0), 0);
          if (site.key === 'shed' && sum > 1000) sum = sum / 1000; // Wh → kWh
          stats[site.key] = sum;
          // Capture the live cumulative reading NOW so we can add real-time creep
          // on top of this authoritative baseline until the next stats refresh.
          anchor[site.key] = this._liveCumulative(site);
        }
      }
      this._stats = stats;
      this._statsAnchor = anchor;
    } catch {
      this._stats = {}; // fall back to live sensors
      this._statsAnchor = {};
    }
  }

  /** Live cumulative total-energy reading for a site (kWh), from its stat entity. */
  private _liveCumulative(site: Site): number {
    let v = this._num(site.stat);
    if (site.key === 'shed' && v > 1000) v = v / 1000; // Wh → kWh
    return v;
  }

  /**
   * Period-to-date kWh for a site. Anchored to the authoritative statistics
   * baseline, plus the live delta since that baseline was captured — so the
   * register creeps upward in real time like a physical meter, and self-corrects
   * to the accurate value on each statistics refresh.
   */
  private _periodKwh(site: Site): number {
    if (this._config.use_statistics && this._stats[site.key] != null) {
      const baseline = this._stats[site.key]!;
      const anchor = this._statsAnchor[site.key];
      if (anchor != null) {
        const creep = Math.max(0, this._liveCumulative(site) - anchor);
        return baseline + creep;
      }
      return baseline;
    }
    let v = this._num(site.fallbackPeriod);
    if (site.key === 'shed' && v > 1000) v = v / 1000;
    return v;
  }

  private _fmtPower(w: number): string {
    return w >= 1000 ? `${(w / 1000).toFixed(2)} kW` : `${Math.round(w)} W`;
  }

  private _fmtRange(a: Date, b: Date): string {
    const o: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${a.toLocaleDateString('en-US', o)} → ${b.toLocaleDateString('en-US', o)}`;
  }

  // ---- render -------------------------------------------------------------

  render() {
    if (!this.hass || !this._config) return nothing;

    const rate = this._rate();
    const { start, end } = this._billingWindow();
    const now = new Date();
    const daysElapsed = Math.max(1, Math.round((now.getTime() - start.getTime()) / 86400000));
    const daysTotal = Math.round((end.getTime() - start.getTime()) / 86400000);

    const totalPower = this._num(this._config.total_power_entity);
    const todayKwh = SITES.reduce((a, s) => a + this._num(s.today), 0);
    const periodKwh = SITES.reduce((a, s) => a + this._periodKwh(s), 0);
    const projected = (periodKwh / daysElapsed) * daysTotal;
    const usingStats = !!this._config.use_statistics && Object.keys(this._stats).length > 0;

    const customersOut = this._num(this._config.customers_out_entity);
    const gridOk = customersOut === 0;

    return html`
      <div class="wrap">
        <div class="meter">
          <div class="meter-head">
            <div class="brand">
              <div class="glyph">⌁</div>
              <div>
                <h1>RV ENERGY</h1>
                <div class="acct">
                  AIKEN CO-OP · REG ${this._fmtRange(start, end)} · DAY ${daysElapsed}/${daysTotal}
                </div>
              </div>
            </div>
            <div class="status ${gridOk ? '' : 'alert'}">
              <span class="live-dot"></span>${gridOk ? 'GRID OK' : `${customersOut} OUT`}
            </div>
          </div>

          <div class="hero">
            <div class="register-block">
              <div class="register-label">Cumulative — this billing period</div>
              <meter-register
                .value=${periodKwh}
                .digits=${7}
                .decimals=${3}
                .mult=${`× MULT ${this._config.meter_multiplier}`}
                unit="kWh"
              ></meter-register>
              <div class="register-sub">
                <b>${this._fmtPower(totalPower)}</b> across all sites now ·
                <b>${todayKwh.toFixed(1)} kWh</b> today ·
                projected <b>${projected.toFixed(0)} kWh</b>
              </div>
            </div>

            ${this._renderFlow(totalPower)}
          </div>
        </div>

        ${this._config.show_billing
          ? html`
              <div class="sec-head">
                <span class="idx">§</span><h2>This Billing Period</h2>
                <span class="rule"></span>
                <span class="prov ${usingStats ? 'ok' : 'est'}">
                  ${usingStats ? 'AUTHORITATIVE' : 'LIVE (est.)'}
                </span>
              </div>
              <div class="meter statement">
                <div class="amt">$${(periodKwh * rate).toFixed(2)}</div>
                <div class="register-sub">
                  ${periodKwh.toFixed(0)} kWh · projected ~${projected.toFixed(0)} kWh /
                  ~$${(projected * rate).toFixed(2)} @ $${rate.toFixed(4)}/kWh
                </div>
                <table class="tbl">
                  <thead>
                    <tr><th>Meter</th><th>kWh</th><th>Cost</th><th>Today</th></tr>
                  </thead>
                  <tbody>
                    ${SITES.map((s) => {
                      const kwh = this._periodKwh(s);
                      return html`
                        <tr>
                          <td>
                            <span class="dot" style="background:${s.color}"></span>${s.name}
                          </td>
                          <td>${kwh.toFixed(1)}</td>
                          <td>$${(kwh * rate).toFixed(2)}</td>
                          <td class="muted">${this._num(s.today).toFixed(1)}</td>
                        </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  /**
   * Integrated live-flow diagram: a Grid source node feeds the three site
   * nodes. Each connecting line animates with dashes whose speed is
   * proportional to that site's current draw (faster = more power); a
   * zero-draw site shows a dimmed, static line. The site nodes double as the
   * per-site readout (live W + period kWh) — replacing the old separate dials
   * so no data point is duplicated.
   */
  private _renderFlow(totalPower: number) {
    // Y positions for the three site nodes (top / mid / bottom) in a 190-tall viewBox.
    const rows = [40, 95, 150];
    const maxExpected = (this._config.max_expected_power as number) || 5000;

    const line = (site: Site, y: number) => {
      const power = this._num(site.power);
      // dash animation duration: map power → 1.0s (high) .. 5s (low); static if ~0.
      const frac = Math.min(1, Math.max(0, power / maxExpected));
      const dur = power < 2 ? 0 : (5 - frac * 4).toFixed(2);
      // from the Grid node's right edge (x≈80) to each site node's left edge (x≈304)
      const d = `M80 95 C180 95, 210 ${y}, 304 ${y}`;
      // NOTE: must use the svg`` tag so <path> lands in the SVG namespace and renders.
      return svg`
        <path class="fl-base" d="${d}" stroke="${site.color}" />
        ${dur === 0
          ? nothing
          : svg`<path class="fl-flow" d="${d}" stroke="${site.color}"
              style="animation-duration:${dur}s" />`}
      `;
    };

    const node = (site: Site, y: number) => {
      const power = this._num(site.power);
      const kwh = this._periodKwh(site);
      return svg`
        <circle cx="330" cy="${y}" r="24" fill="none" stroke="${site.color}" stroke-width="2.5" />
        <text x="330" y="${y - 2}" text-anchor="middle" class="fl-w">${Math.round(power)}</text>
        <text x="330" y="${y + 9}" text-anchor="middle" class="fl-u">W</text>
        <text x="366" y="${y - 3}" class="fl-name" fill="${site.color}">${site.name.toUpperCase()}</text>
        <text x="366" y="${y + 9}" class="fl-kwh">${kwh.toFixed(0)} kWh period</text>
      `;
    };

    return html`
      <div class="flow-well">
        <div class="flow-cap">LIVE FLOW · <span>GRID → SITES</span></div>
        <svg class="flow" viewBox="0 0 470 190" preserveAspectRatio="xMidYMid meet">
          ${SITES.map((s, i) => line(s, rows[i]))}
          <circle cx="52" cy="95" r="26" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="52" y="92" text-anchor="middle" class="fl-w" style="fill:var(--brass)">
            ${(totalPower / 1000).toFixed(2)}
          </text>
          <text x="52" y="104" text-anchor="middle" class="fl-u">kW</text>
          <text x="52" y="140" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${SITES.map((s, i) => node(s, rows[i]))}
        </svg>
      </div>
    `;
  }

  static styles = [
    tokens,
    css`
      :host {
        display: block;
        font-family: var(--font-body);
      }
      .meter {
        background: linear-gradient(180deg, var(--panel) 0%, #191c22 100%);
        border: 1px solid var(--bezel);
        border-radius: 10px;
        box-shadow: 0 1px 0 #3a414c inset, 0 18px 40px -22px #000;
        padding: 22px 24px;
        margin-bottom: 18px;
      }
      .meter-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 16px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--hairline);
      }
      .brand { display: flex; align-items: center; gap: 14px; }
      .glyph {
        width: 40px; height: 40px; border-radius: 7px;
        background: radial-gradient(circle at 35% 30%, var(--brass) 0%, var(--brass-dim) 70%, #6f5620 100%);
        display: grid; place-items: center; color: #241c08; font-size: 22px;
        box-shadow: 0 0 0 1px #000 inset, 0 2px 6px -1px #000;
      }
      h1 {
        margin: 0; font-family: var(--font-display); font-weight: 600;
        font-size: 20px; letter-spacing: 0.06em; color: var(--ink); line-height: 1;
      }
      .acct {
        font-family: var(--font-mono); font-size: 11px; color: var(--ink-dim);
        letter-spacing: 0.04em; margin-top: 5px;
      }
      .status {
        display: inline-flex; align-items: center; gap: 7px;
        font-family: var(--font-mono); font-size: 11px; font-weight: 700;
        letter-spacing: 0.08em; padding: 5px 10px; border-radius: 4px;
        color: var(--ledger); border: 1px solid #3d5236; background: rgba(120, 160, 110, 0.08);
      }
      .status.alert {
        color: var(--needle); border-color: #5a2f2a; background: rgba(200, 72, 58, 0.09);
      }
      .live-dot {
        width: 7px; height: 7px; border-radius: 50%; background: currentColor;
        box-shadow: 0 0 0 0 currentColor; animation: live-pulse 2s infinite;
      }
      @keyframes live-pulse {
        0% { box-shadow: 0 0 0 0 rgba(159, 191, 143, 0.5); }
        70% { box-shadow: 0 0 0 6px rgba(159, 191, 143, 0); }
        100% { box-shadow: 0 0 0 0 rgba(159, 191, 143, 0); }
      }
      @media (prefers-reduced-motion: reduce) { .live-dot { animation: none; } }
      .hero {
        display: flex; gap: 20px; align-items: stretch; flex-wrap: wrap;
      }
      .register-block {
        flex: 1; min-width: 330px; display: flex; flex-direction: column; justify-content: center;
      }
      .register-label {
        font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.22em;
        text-transform: uppercase; color: var(--ink-faint); margin-bottom: 8px;
      }
      .register-sub {
        font-family: var(--font-mono); font-size: 12px; color: var(--ink-dim); margin-top: 12px;
      }
      .register-sub b { color: var(--ledger); font-weight: 700; }

      /* integrated live-flow well */
      .flow-well {
        flex: 1.1; min-width: 360px; position: relative;
        background: var(--well, #171a20); border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.35) inset, 0 0 0 1px #000 inset;
        padding: 16px 18px;
      }
      .flow-cap {
        position: absolute; top: 12px; left: 16px;
        font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em;
        text-transform: uppercase; color: var(--ink-faint);
      }
      .flow-cap span { color: var(--ledger); }
      svg.flow { width: 100%; height: 190px; display: block; margin-top: 8px; }
      .fl-base { fill: none; stroke-width: 3; stroke-linecap: round; opacity: 0.28; }
      .fl-flow {
        fill: none; stroke-width: 3.5; stroke-linecap: round;
        stroke-dasharray: 7 12; animation: fl-move 1s linear infinite;
        filter: drop-shadow(0 0 3px currentColor);
      }
      @keyframes fl-move { to { stroke-dashoffset: -38; } }
      @media (prefers-reduced-motion: reduce) { .fl-flow { animation: none; } }
      .fl-w { fill: var(--ink); font-family: var(--font-mono); font-size: 13px; font-weight: 700; }
      .fl-u { fill: var(--ink-dim); font-family: var(--font-mono); font-size: 8px; }
      .fl-name { font-family: var(--font-display); font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; }
      .fl-kwh { fill: var(--ink-faint); font-family: var(--font-mono); font-size: 9px; }
      .sec-head { display: flex; align-items: baseline; gap: 12px; margin: 26px 2px 12px; }
      .sec-head .idx { font-family: var(--font-mono); font-size: 11px; color: var(--brass); font-weight: 700; }
      .sec-head h2 {
        font-family: var(--font-display); font-weight: 500; font-size: 15px;
        letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink); margin: 0;
      }
      .sec-head .rule { flex: 1; height: 1px; background: var(--hairline); }
      .prov {
        font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
        padding: 3px 8px; border-radius: 4px;
      }
      .prov.ok { color: var(--ledger); border: 1px solid #3d5236; }
      .prov.est { color: var(--brass); border: 1px dashed var(--brass-dim); }
      .statement .amt {
        font-family: var(--font-display); font-weight: 700; font-size: 34px;
        color: var(--ledger); line-height: 1.1;
      }
      .tbl { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 13px; margin-top: 16px; }
      .tbl th {
        text-align: right; font-size: 10px; font-weight: 600; color: var(--ink-faint);
        text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 8px; border-bottom: 1px solid var(--hairline);
      }
      .tbl th:first-child, .tbl td:first-child { text-align: left; }
      .tbl td { text-align: right; padding: 10px 8px; border-bottom: 1px solid var(--hairline); color: var(--ink); }
      .tbl tr:last-child td { border-bottom: none; }
      .tbl .muted { color: var(--ink-dim); }
      .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
      @media (max-width: 820px) {
        .register-row { flex-direction: column; align-items: flex-start; }
      }
    `,
  ];

  getCardSize() {
    return 8;
  }

  static getStubConfig(): Partial<RvEnergyCardConfig> {
    return { billing_start_day: 12, use_statistics: true };
  }
}

// keep the imported symbol referenced so bundlers retain the component
void MeterRegister;

(window as unknown as { customCards?: unknown[] }).customCards ||= [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: 'rv-energy-card',
  name: 'RV Energy',
  description: 'Meter-register site power & billing overview (gap-proof statistics)',
  preview: true,
});

// eslint-disable-next-line no-console
console.info(
  `%c RV-ENERGY-CARD %c v${CARD_VERSION} `,
  'background:#d9a441;color:#241c08;font-weight:700;',
  'background:#14161b;color:#d9a441;'
);

declare global {
  interface HTMLElementTagNameMap {
    'rv-energy-card': RvEnergyCard;
  }
}
