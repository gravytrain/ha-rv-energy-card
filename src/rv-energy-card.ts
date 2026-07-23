import { LitElement, html, svg, css, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { tokens } from './styles.js';
import './meter-register.js';
import './outage-map.js';
import { MeterRegister } from './meter-register.js';
import type {
  HomeAssistant,
  GridMetricConfig,
  RvEnergyCardConfig,
  StatisticRow,
  OutageDetail,
  CountyStatus,
  WeatherAlert,
} from './types.js';

const CARD_VERSION = '0.11.0';

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
  /** Manual normal-state disclosure of the otherwise quiet grid-service panel. */
  @state() private _gridExpanded = false;
  /** Live cumulative-sensor reading captured at the moment stats last loaded. */
  @state() private _mapOpen = false;
  @state() private _selectedOutage?: string;
  @state() private _selectedCounty?: string;
  private _statsAnchor: Partial<Record<Site['key'], number>> = {};
  /** Monitored total kWh for the previous billing period (all sites), from statistics. */
  @state() private _lastPeriodMonitored?: number;
  /** Per-site statistics for the previous billing period, used for bill allocation. */
  @state() private _lastPeriodStats: Partial<Record<Site['key'], number>> = {};

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
      show_grid_status: true,
      grid_metrics: [
        { entity: 'sensor.aiken_co_op_customers_affected', name: 'Affected' },
        { entity: 'sensor.aiken_co_op_customers_restored', name: 'Restored' },
        { entity: 'sensor.aiken_co_op_planned_outages', name: 'Planned' },
      ],
      grid_map_url: 'https://map.aikenco-op.org/',
      grid_map_link: 'https://map.aikenco-op.org/',
      weather_alert_entity: 'sensor.nws_wagener_power_weather_alerts',
      show_weather_alerts: true,
      base_rate_entity: 'input_number.base_electricity_rate',
      pca_rate_entity: 'input_number.current_pca_rate',
      meter_multiplier: 40,
      show_last_period: true,
      show_invoices: true,
      last_bill_kwh_entity: 'input_number.last_coop_bill_kwh',
      last_bill_energy_entity: 'input_number.last_coop_bill_energy_charge',
      last_bill_local_tax_entity: 'input_number.last_coop_bill_local_tax',
      last_bill_sc_tax_entity: 'input_number.last_coop_bill_sc_tax',
      invoice_script: 'script.generate_monthly_invoice',
      // Installation-specific URLs (portal, stored bills, invoice PDF base) are
      // intentionally NOT defaulted here — set them in your dashboard card config.
      // They point at private infrastructure and must not be baked into the repo.
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

    // Also load the previous period's monitored total for reconciliation.
    if (this._config.show_last_period) {
      try {
        const prevEnd = start;
        const prevStart = new Date(start.getFullYear(), start.getMonth() - 1, start.getDate());
        const prev = await this.hass.callWS<Record<string, StatisticRow[]>>({
          type: 'recorder/statistics_during_period',
          start_time: prevStart.toISOString(),
          end_time: prevEnd.toISOString(),
          statistic_ids: ids,
          period: 'day',
          types: ['change'],
        });
        let total = 0;
        const bySite: Partial<Record<Site['key'], number>> = {};
        for (const site of SITES) {
          const rows = prev?.[site.stat];
          if (Array.isArray(rows) && rows.length) {
            let sum = rows.reduce((a, r) => a + (r.change || 0), 0);
            if (site.key === 'shed' && sum > 1000) sum = sum / 1000;
            total += sum;
            bySite[site.key] = sum;
          }
        }
        this._lastPeriodMonitored = total;
        this._lastPeriodStats = bySite;
      } catch {
        this._lastPeriodMonitored = undefined;
        this._lastPeriodStats = {};
      }
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

  private _gridStatus(): string {
    const state = this.hass?.states[this._config.grid_status_entity ?? '']?.state;
    if (!state || state === 'unknown' || state === 'unavailable') return 'STATUS UNKNOWN';
    return state.replace(/[_-]/g, ' ').toUpperCase();
  }

  private _lastUpdated(entityId?: string): string {
    const raw = entityId ? this.hass?.states[entityId]?.last_updated : undefined;
    if (!raw) return '—';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  }

  private _hasGridIssue(customersOut: number): boolean {
    const state = this.hass?.states[this._config.grid_status_entity ?? '']?.state?.toLowerCase();
    return customersOut > 0 || state === 'unknown' || state === 'unavailable';
  }

  private _hasMeaningfulValue(state: string): boolean {
    const normalized = state.trim().toLowerCase();
    if (['', '0', 'off', 'false', 'none', 'no', 'unknown', 'unavailable'].includes(normalized)) {
      return false;
    }
    const numeric = Number(normalized);
    return Number.isNaN(numeric) || numeric !== 0;
  }

  private _weatherAlerts(): WeatherAlert[] {
    const attributes = this.hass?.states[this._config.weather_alert_entity ?? '']?.attributes;
    const alerts = attributes?.alerts ?? attributes?.features;
    return Array.isArray(alerts)
      ? alerts.filter((alert): alert is WeatherAlert => !!alert && typeof alert === 'object')
      : [];
  }

  private _weatherUnavailable(): boolean {
    const state = this.hass?.states[this._config.weather_alert_entity ?? '']?.state?.toLowerCase();
    return !state || state === 'unknown' || state === 'unavailable';
  }

  private _fmtAlertTime(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-US', {
      weekday: 'short', hour: 'numeric', minute: '2-digit',
    });
  }

  private _renderWeatherStatus() {
    const alerts = this._weatherAlerts();
    const unavailable = this._weatherUnavailable();
    const active = alerts.length > 0;
    const primary = alerts[0]?.properties;
    const state = unavailable ? 'NWS STATUS UNKNOWN' : active ? `${alerts.length} ACTIVE ALERT${alerts.length === 1 ? '' : 'S'}` : 'NO ACTIVE ALERTS';
    const detail = primary?.headline || primary?.description || 'No NWS weather alerts are active for the RV area.';
    return html`
      <div class="weather-status ${active || unavailable ? 'alert' : ''}" aria-label="National Weather Service power weather status">
        <div class="weather-status-head">
          <div class="grid-cap">POWER WEATHER · NWS WAGENER AREA</div>
          <div class="grid-state ${active || unavailable ? 'alert' : 'ok'}">
            <span class="live-dot"></span>${state}
          </div>
          <div class="grid-updated">UPDATED ${this._lastUpdated(this._config.weather_alert_entity)}</div>
        </div>
        <div class="weather-readings">
          ${active ? alerts.map((alert) => html`
            <div class="weather-alert">
              <b>${alert.properties?.event ?? 'Weather alert'}</b>
              <span>${alert.properties?.severity ?? 'Unknown severity'} · expires ${this._fmtAlertTime(alert.properties?.expires)}</span>
            </div>
          `) : html`<div class="weather-alert clear"><b>${unavailable ? 'Check NWS source' : 'Monitoring for lightning, severe storms, tornadoes & hurricanes'}</b><span>${detail}</span></div>`}
        </div>
        ${active ? html`<div class="weather-detail">${detail}${primary?.instruction ? html`<span><b>Recommended action:</b> ${primary.instruction}</span>` : nothing}</div>` : nothing}
      </div>
    `;
  }

  private _gridMetrics(hasGridIssue: boolean): GridMetricConfig[] {
    return (this._config.grid_metrics ?? []).filter((metric): metric is GridMetricConfig => {
      const entity = metric?.entity ? this.hass?.states[metric.entity] : undefined;
      if (!entity) return false;
      const when = metric.show_when ?? 'issue';
      return when === 'always' || (when === 'issue' && hasGridIssue) ||
        (when === 'nonzero' && this._hasMeaningfulValue(entity.state));
    });
  }

  private _outages(): OutageDetail[] {
    const outages = this.hass?.states['sensor.aiken_co_op_outage_details']?.attributes.outages;
    return Array.isArray(outages) ? outages.filter((o): o is OutageDetail => !!o && typeof o === 'object') : [];
  }

  private _outageCounties(): CountyStatus[] {
    const counties = this.hass?.states['sensor.aiken_co_op_county_status']?.attributes.counties;
    if (!Array.isArray(counties)) return [];
    return counties.filter((county): county is CountyStatus =>
      !!county && typeof county === 'object' && Number(county.customersOutNow) > 0
    );
  }

  private _fmtIncidentTime(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  }

  private _allCounties(): CountyStatus[] {
    const counties = this.hass?.states['sensor.aiken_co_op_county_status']?.attributes.counties;
    return Array.isArray(counties) ? counties.filter((c): c is CountyStatus => !!c && typeof c === 'object') : [];
  }

  private _homeLocation(): { lat: number; lng: number } | undefined {
    const attrs = this.hass?.states['zone.home']?.attributes;
    const lat = Number(attrs?.latitude);
    const lng = Number(attrs?.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined;
  }

  private _polygons(entityId: string): unknown[] {
    const value = this.hass?.states[entityId]?.attributes.polygons;
    return Array.isArray(value) ? value : [];
  }

  private _serviceArea(): GeoJSON.GeoJsonObject | undefined {
    const value = this.hass?.states['sensor.aiken_co_op_service_area']?.attributes.geojson;
    return value && typeof value === 'object' ? value as GeoJSON.GeoJsonObject : undefined;
  }

  private _openMap = () => { this._mapOpen = true; };
  private _closeMap = () => { this._mapOpen = false; };
  private _selectOutage = (name?: string) => { this._selectedOutage = name; };
  private _selectCounty = (name?: string) => { this._selectedCounty = name; };

  private _renderTerritoryMap(compact = false) {
    if (compact) {
      const outage = this._outages()[0];
      const county = this._outageCounties()[0];
      return html`<div class="impact-summary"><span>ACTIVE IMPACT</span><b>${county ? `${county.name} County - ${Number(county.customersOutNow).toLocaleString()} / ${Number(county.customersServed ?? 0).toLocaleString()} members out` : outage ? `${Number(outage.customersOutNow ?? 0).toLocaleString()} members out` : 'No active outages reported'}</b>${outage ? html`<small>${outage.outageName ?? 'ACTIVE OUTAGE'} - ${outage.crewAssigned ? 'crew assigned' : 'awaiting crew'} - since ${this._fmtIncidentTime(outage.outageStartTime)}</small>` : nothing}<button @click=${this._openMap}>Open live map</button></div>`;
    }
    return html`<rv-outage-map .counties=${this._allCounties()} .outages=${this._outages()} .selectedCounty=${this._selectedCounty ?? ''} .homeLocation=${this._homeLocation()} .outagePolygons=${this._polygons('sensor.aiken_co_op_outage_polygons')} .plannedOutagePolygons=${this._polygons('sensor.aiken_co_op_planned_outage_polygons')} .serviceArea=${this._serviceArea()}></rv-outage-map>`;
  }

  private _renderFullMap() {
    const outages=this._outages(), selected=outages.find((o)=>o.outageName===this._selectedOutage)??outages[0];
    return html`<div class="map-modal" role="dialog" aria-modal="true" @click=${this._closeMap}><section class="map-dialog" @click=${(e:Event)=>e.stopPropagation()}><header class="map-head"><div><div class="grid-cap">AIKEN CO-OP · LIVE OUTAGES</div><div class="map-title">Grid Territory</div></div><div><a href="${this._config.grid_map_link}" target="_blank" rel="noopener noreferrer">Vendor map ↗</a><button @click=${this._closeMap}>×</button></div></header><div class="map-summary"><span><b>${this._num(this._config.customers_out_entity)}</b> OUT NOW</span><span><b>${this._num('sensor.aiken_co_op_customers_affected')}</b> AFFECTED</span><span><b>${this._num('sensor.aiken_co_op_customers_restored')}</b> RESTORED</span><span><b>${this._num('sensor.aiken_co_op_planned_outages')}</b> PLANNED</span></div><div class="map-body"><div class="map-canvas">${this._renderTerritoryMap()}</div><aside class="map-aside"><div class="aside-cap">Active outages</div>${outages.length?outages.map((o)=>html`<button class="map-incident ${o===selected?'selected':''}" @click=${()=>this._selectOutage(o.outageName)}><b>${o.outageName??'ACTIVE OUTAGE'}</b><span>${o.customersOutNow??0} out · ${o.crewAssigned?'crew assigned':'awaiting crew'}</span></button>`):html`<div class="map-empty">No active incidents reported.</div>`}${selected?html`<div class="selected-detail"><span>Started</span><b>${this._fmtIncidentTime(selected.outageStartTime)}</b><span>Estimated restoration</span><b>${selected.estimatedTimeOfRestoral??'TBD'}</b></div>`:nothing}<div class="aside-cap">County status</div><div class="map-counties">${this._allCounties().sort((a,b)=>Number(b.customersOutNow)-Number(a.customersOutNow)).map((c)=>html`<button class="map-county ${Number(c.customersOutNow)>0?'affected':''}" @mouseenter=${()=>this._selectCounty(c.name)} @focus=${()=>this._selectCounty(c.name)} @mouseleave=${()=>this._selectCounty()} @blur=${()=>this._selectCounty()}>${c.name}<b>${Number(c.customersOutNow)} / ${Number(c.customersServed??0).toLocaleString()}</b></button>`)}</div></aside></div></section></div>`;
  }
  private _renderGridStatus(gridOk: boolean, customersOut: number) {

    const hasGridIssue = this._hasGridIssue(customersOut);
    // Opening the badge is an explicit request for the full service snapshot.
    const metrics = this._gridMetrics(hasGridIssue || this._gridExpanded);
    // In the normal state the header badge says everything actionable. Keep the
    // detailed panel out of the way until the badge is explicitly opened.
    if (!hasGridIssue && !this._gridExpanded) return nothing;
    return html`
      <div class="grid-status ${hasGridIssue ? 'alert' : ''}" aria-label="Grid service status">
        <div class="grid-status-head">
          <div class="grid-cap">GRID SERVICE · AIKEN CO-OP</div>
          <div class="grid-state ${gridOk ? 'ok' : 'alert'}">
            <span class="live-dot"></span>${gridOk ? 'SERVICE NORMAL' : 'OUTAGE REPORTED'}
          </div>
          <div class="grid-updated">UPDATED ${this._lastUpdated(this._config.grid_status_entity)}</div>
        </div>
        ${this._renderTerritoryMap(true)}
        <div class="grid-readings">
          <div class="grid-reading">
            <span class="grid-reading-k">Co-op status</span>
            <b>${this._gridStatus()}</b>
          </div>
          <div class="grid-reading ${gridOk ? '' : 'alert'}">
            <span class="grid-reading-k">Customers out</span>
            <b>${customersOut.toLocaleString()}</b>
          </div>
          ${metrics.map((metric) => {
            const entity = this.hass!.states[metric.entity];
            const name = metric.name ?? entity.attributes.friendly_name ?? metric.entity;
            const unit = metric.unit ?? entity.attributes.unit_of_measurement ?? '';
            return html`
              <div class="grid-reading">
                <span class="grid-reading-k">${name}</span>
                <b>${entity.state}${unit ? html` <small>${unit}</small>` : nothing}</b>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _toggleGridStatus = () => {
    this._gridExpanded = !this._gridExpanded;
  };

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
    const gridIssue = this._hasGridIssue(customersOut);
    const gridOk = !gridIssue;
    const gridLabel = customersOut > 0 ? `${customersOut} OUT` : gridOk ? 'GRID OK' : 'GRID STATUS ?';
    const weatherAlert = this._weatherAlerts().length > 0;

    return html`
      <div class="wrap">
        <div class="meter">
          <div class="meter-head">
            <div class="brand">
              <div class="glyph">⌁</div>
              <div>
                <h1>ENERGY</h1>
                <div class="acct">
                  AIKEN CO-OP · REG ${this._fmtRange(start, end)} · DAY ${daysElapsed}/${daysTotal}
                </div>
              </div>
            </div>
            <div class="head-right">
              ${this._config.portal_url
                ? html`<a
                    class="portal"
                    href="${this._config.portal_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    >AIKEN PORTAL ↗</a
                  >`
                : nothing}
              <button
                class="status ${gridOk ? '' : 'alert'}"
                type="button"
                @click=${this._toggleGridStatus}
                aria-expanded="${this._gridExpanded || gridIssue}"
                aria-controls="grid-service-details"
                title="${gridIssue ? 'Grid service details' : 'Open grid service details'}"
              >
                <span class="live-dot"></span>${gridLabel}
              </button>
              ${this._config.show_weather_alerts ? html`<span class="status ${weatherAlert ? 'alert' : ''}" title="National Weather Service alert status"><span class="live-dot"></span>${weatherAlert ? 'WX ALERT' : 'WX CLEAR'}</span>` : nothing}
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

            ${this._config.show_flow ? this._renderFlow(totalPower) : nothing}
          </div>
          ${this._config.show_grid_status
            ? html`<div id="grid-service-details">${this._renderGridStatus(gridOk, customersOut)}</div>`
            : nothing}
          ${this._config.show_weather_alerts ? this._renderWeatherStatus() : nothing}
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

        ${this._config.show_last_period ? this._renderLastPeriod(rate) : nothing}
        ${this._config.show_invoices ? this._renderInvoices() : nothing}
      </div>
      ${this._mapOpen ? this._renderFullMap() : nothing}
    `;
  }

  /**
   * Last billing period reconciliation — monitored total vs the co-op bill,
   * with a variance readout. Confirms the gap-proof statistics stay accurate
   * against the authoritative paper bill.
   */
  private _renderLastPeriod(_rate: number) {
    const { start } = this._billingWindow();
    // previous window = [start-1 month, start)
    const prevStart = new Date(start.getFullYear(), start.getMonth() - 1, start.getDate());
    const prevEnd = start;
    const billed = this._num(this._config.last_bill_kwh_entity);
    // Real dollar amounts entered from the paper bill (energy + both taxes).
    const billEnergy = this._num(this._config.last_bill_energy_entity);
    const billLocal = this._num(this._config.last_bill_local_tax_entity);
    const billSc = this._num(this._config.last_bill_sc_tax_entity);
    const billTotal = billEnergy + billLocal + billSc;
    const monitored = this._lastPeriodMonitored ?? 0;
    const haveData = monitored > 0 && billed > 0;
    const varKwh = monitored - billed;
    const varPct = billed > 0 ? (varKwh / billed) * 100 : 0;
    const within = Math.abs(varPct) <= 2;
    const sign = varKwh >= 0 ? '+' : '';
    const northAndShed = (this._lastPeriodStats.north ?? 0) + (this._lastPeriodStats.shed ?? 0);
    const south = this._lastPeriodStats.south ?? 0;
    const allocation = (kwh: number) => {
      const share = monitored > 0 ? kwh / monitored : 0;
      return { share, billedKwh: billed * share, total: billTotal * share };
    };
    const inLaws = allocation(northAndShed);
    const ours = allocation(south);

    return html`
      <div class="sec-head">
        <span class="idx">§</span><h2>Last Billing Period</h2>
        <span class="rule"></span>
        <span class="meta">${this._fmtRange(prevStart, prevEnd)}</span>
      </div>
      <div class="meter">
        ${haveData
          ? html`
              <div class="recon">
                <div class="recon-col">
                  <div class="recon-k">Monitored · actual</div>
                  <div class="recon-v ledger">
                    ${monitored.toFixed(1)} <small>kWh</small>
                  </div>
                  <div class="recon-k2">device statistics</div>
                </div>
                <div class="recon-col">
                  <div class="recon-k">Co-op bill</div>
                  <div class="recon-v">${billed.toFixed(1)} <small>kWh</small></div>
                  <div class="recon-k2">
                    ${billTotal > 0 ? html`$${billTotal.toFixed(2)}` : nothing}
                  </div>
                  <div class="recon-edit">
                    <input
                      type="number"
                      class="bill-input"
                      .value=${billed.toString()}
                      @change=${this._updateBilledKwh}
                      min="0"
                      step="0.1"
                      placeholder="Bill kWh"
                    />
                    <span class="edit-hint">edit to update</span>
                  </div>
                </div>
                <div class="recon-col">
                  <div class="recon-k">Variance vs bill</div>
                  <div class="recon-v ${within ? 'ledger' : 'alert'}">
                    ${sign}${varPct.toFixed(1)}%
                  </div>
                  <div class="recon-k2">${sign}${varKwh.toFixed(1)} kWh</div>
                </div>
              </div>
              <div class="var-note">
                ${within
                  ? html`Monitored total matched the co-op bill to
                      <b>within ${Math.abs(varPct).toFixed(1)}%</b> — gaps backfilled from
                      device statistics.`
                  : html`Monitored total is <b>${sign}${varPct.toFixed(1)}%</b> off the co-op
                      bill — worth a look.`}
              </div>
              ${northAndShed > 0 && south > 0
                ? html`<div class="allocation" aria-label="Last billing period allocation">
                    <div class="allocation-head">Last-period allocation · tax included</div>
                    <div class="allocation-row">
                      <span><i class="dot north"></i><i class="dot shed"></i>North + She-Shed</span>
                      <span>${northAndShed.toFixed(1)} kWh · ${(inLaws.share * 100).toFixed(1)}%</span>
                      <b>${inLaws.billedKwh.toFixed(1)} billed kWh · &#36;${inLaws.total.toFixed(2)}</b>
                    </div>
                    <div class="allocation-row">
                      <span><i class="dot south"></i>South</span>
                      <span>${south.toFixed(1)} kWh · ${(ours.share * 100).toFixed(1)}%</span>
                      <b>${ours.billedKwh.toFixed(1)} billed kWh · &#36;${ours.total.toFixed(2)}</b>
                    </div>
                  </div>`
                : nothing}
            `
          : html`<div class="var-note">
              Set <code>${this._config.last_bill_kwh_entity}</code> to the co-op's billed kWh to
              see the reconciliation.
            </div>`}
      </div>
    `;
  }

  /**
   * Invoices — generate the current invoice, and link out to stored invoice
   * PDFs (per-month deep link) and the co-op bill folder.
   */
  private _renderInvoices() {
    const base = this._config.invoice_url_base;
    // Invoices exist only for COMPLETED billing periods. The current window's
    // start is the in-progress (unbilled) period, so completed periods begin at
    // start−1 month, start−2, etc. The invoice file is keyed by each period's
    // START month (matching the script's `calc_period_start[:7]`), so the label
    // and the deep-link YYYY-MM must both use the period-start month.
    const { start } = this._billingWindow();
    const startDay = this._config.billing_start_day ?? 12;
    const months: { label: string; ym: string }[] = [];
    for (let i = 1; i <= 4; i++) {
      const periodStart = new Date(start.getFullYear(), start.getMonth() - i, startDay);
      const periodEnd = new Date(start.getFullYear(), start.getMonth() - i + 1, startDay);
      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      months.push({
        label: `${fmt(periodStart)} – ${fmt(periodEnd)}`,
        ym: `${periodStart.getFullYear()}-${String(periodStart.getMonth() + 1).padStart(2, '0')}`,
      });
    }

    return html`
      <div class="sec-head">
        <span class="idx">§</span><h2>Invoices</h2>
        <span class="rule"></span>
        <span class="meta">IN-LAWS · NORTH + SHE-SHED</span>
      </div>
      <div class="meter">
        <div class="actions">
          ${this._config.invoice_script
            ? html`<button class="btn primary" @click=${this._generateInvoice}>
                ⎙ Generate invoice
              </button>`
            : nothing}
          ${this._config.bills_url
            ? html`<a
                class="btn"
                href="${this._config.bills_url}"
                target="_blank"
                rel="noopener noreferrer"
                >↗ View co-op bills</a
              >`
            : nothing}
        </div>
        <div class="invoice-list">
          ${months.map(
            (m) => html`
              <div class="invoice-row">
                <span class="p">${m.label}</span>
                <span class="s">
                  ${base
                    ? html`<a href="${base}${m.ym}.pdf" target="_blank" rel="noopener noreferrer"
                        >invoice ↗</a
                      >`
                    : nothing}
                </span>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private _generateInvoice = () => {
    const script = this._config.invoice_script;
    if (!this.hass || !script) return;
    const [domain, service] = script.split('.');
    this.hass.callWS({
      type: 'call_service',
      domain,
      service,
      service_data: {},
    });
  };

  private _updateBilledKwh = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (!this.hass || isNaN(value) || value < 0) return;
    const entity = this._config.last_bill_kwh_entity;
    if (!entity) return;
    this.hass.callWS({
      type: 'call_service',
      domain: 'input_number',
      service: 'set_value',
      service_data: { entity_id: entity, value },
    });
  };

  /**
   * Integrated live-flow diagram: a Grid source node feeds the three site
   * nodes. Each connecting line animates with dashes whose speed is
   * proportional to that site's current draw (faster = more power); a
   * zero-draw site shows a dimmed, static line. The site nodes double as the
   * per-site readout (live W + period kWh) — replacing the old separate dials
   * so no data point is duplicated.
   *
   * Renders both horizontal (wide screens) and vertical (mobile) variants;
   * CSS controls which is visible.
   */
  private _renderFlow(totalPower: number) {
    const maxExpected = (this._config.max_expected_power as number) || 5000;

    // Horizontal: Grid (left) → 3 sites (right, stacked vertically at y=40/95/150)
    const horizontal = () => {
      const rows = [40, 95, 150];
      const line = (site: Site, y: number) => {
        const power = this._num(site.power);
        const frac = Math.min(1, Math.max(0, power / maxExpected));
        const dur = power < 2 ? 0 : (5 - frac * 4).toFixed(2);
        const d = `M80 95 C180 95, 210 ${y}, 304 ${y}`;
        return svg`
          <path class="fl-base" d="${d}" stroke="${site.color}" />
          ${dur === 0 ? nothing : svg`<path class="fl-flow" d="${d}" stroke="${site.color}" style="animation-duration:${dur}s" />`}
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
      return svg`
        <svg class="flow flow-h" viewBox="0 0 470 190" preserveAspectRatio="xMidYMid meet">
          ${SITES.map((s, i) => line(s, rows[i]))}
          <circle cx="52" cy="95" r="26" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="52" y="92" text-anchor="middle" class="fl-w" style="fill:var(--brass)">${(totalPower / 1000).toFixed(2)}</text>
          <text x="52" y="104" text-anchor="middle" class="fl-u">kW</text>
          <text x="52" y="140" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${SITES.map((s, i) => node(s, rows[i]))}
        </svg>
      `;
    };

    // Vertical: Grid (top) → vertical trunk → 3 sites on same horizontal line
    const vertical = () => {
      const gridX = 95, gridY = 35; // Grid node at top
      const siteY = 150; // All sites on same horizontal line
      const siteXs = [30, 95, 160]; // North left, South center, Shed right
      const trunkY = 100; // where vertical trunk meets horizontal splits

      const line = (site: Site, x: number) => {
        const power = this._num(site.power);
        const frac = Math.min(1, Math.max(0, power / maxExpected));
        const dur = power < 2 ? 0 : (5 - frac * 4).toFixed(2);
        // Vertical trunk from Grid, then curve horizontally to each site
        const d = `M${gridX} ${gridY + 28} L${gridX} ${trunkY} C${gridX} ${trunkY + 20}, ${x} ${siteY - 40}, ${x} ${siteY - 28}`;
        return svg`
          <path class="fl-base" d="${d}" stroke="${site.color}" />
          ${dur === 0 ? nothing : svg`<path class="fl-flow" d="${d}" stroke="${site.color}" style="animation-duration:${dur}s" />`}
        `;
      };

      const node = (site: Site, x: number) => {
        const power = this._num(site.power);
        const kwh = this._periodKwh(site);
        return svg`
          <circle cx="${x}" cy="${siteY}" r="22" fill="none" stroke="${site.color}" stroke-width="2.5" />
          <text x="${x}" y="${siteY - 2}" text-anchor="middle" class="fl-w">${Math.round(power)}</text>
          <text x="${x}" y="${siteY + 9}" text-anchor="middle" class="fl-u">W</text>
          <text x="${x}" y="${siteY + 36}" text-anchor="middle" class="fl-name" fill="${site.color}">${site.name.toUpperCase()}</text>
          <text x="${x}" y="${siteY + 48}" text-anchor="middle" class="fl-kwh">${kwh.toFixed(0)} kWh</text>
        `;
      };

      return svg`
        <svg class="flow flow-v" viewBox="0 0 190 210" preserveAspectRatio="xMidYMid meet">
          ${SITES.map((s, i) => line(s, siteXs[i]))}
          <circle cx="${gridX}" cy="${gridY}" r="24" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="${gridX}" y="${gridY - 3}" text-anchor="middle" class="fl-w" style="fill:var(--brass)">${(totalPower / 1000).toFixed(2)}</text>
          <text x="${gridX}" y="${gridY + 9}" text-anchor="middle" class="fl-u">kW</text>
          <text x="${gridX}" y="${gridY + 42}" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${SITES.map((s, i) => node(s, siteXs[i]))}
        </svg>
      `;
    };

    return html`
      <div class="flow-well">
        <div class="flow-cap">LIVE FLOW · <span>GRID → SITES</span></div>
        ${horizontal()}
        ${vertical()}
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
        gap: 12px;
        flex-wrap: wrap;
        padding-bottom: 16px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--hairline);
      }
      .brand { min-width: 0; }
      .acct { overflow: hidden; text-overflow: ellipsis; }
      .head-right { display: flex; align-items: center; gap: 10px; }
      .portal {
        display: inline-flex; align-items: center; gap: 6px;
        font-family: var(--font-mono); font-size: 10px; font-weight: 700;
        letter-spacing: 0.06em; color: var(--brass); border: 1px solid var(--brass-dim);
        border-radius: 5px; padding: 6px 10px; text-decoration: none; white-space: nowrap;
      }
      .portal:hover { background: rgba(217, 164, 65, 0.1); }
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
        cursor: pointer;
      }
      button.status { appearance: none; }
      .status:hover, .status:focus-visible { border-color: var(--brass-dim); outline: none; }
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
      svg.flow { width: 100%; margin-top: 8px; }
      svg.flow-h { height: 190px; display: block; }
      svg.flow-v { height: auto; display: none; }
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
      .fl-name { font-family: var(--font-display); font-size: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
      .fl-kwh { fill: var(--ink-dim); font-family: var(--font-mono); font-size: 9px; }

      /* The grid-status page becomes source-health context for the live flow. */
      .grid-status {
        display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
        margin-top: 16px; padding: 14px 16px;
        background: var(--well); border: 1px solid var(--hairline); border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,.25) inset;
      }
      .grid-status.alert { border-color: #5a2f2a; }
      .weather-status {
        display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
        margin-top: 12px; padding: 14px 16px;
        background: var(--well); border: 1px solid var(--hairline); border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,.25) inset;
      }
      .weather-status.alert { border-color: #5a2f2a; }
      .weather-status-head { min-width: 190px; }
      .weather-readings { display: flex; flex: 1; gap: 8px; flex-wrap: wrap; min-width: 180px; }
      .weather-alert { min-width: 145px; padding: 4px 12px; border-left: 1px solid var(--hairline); display: flex; flex-direction: column; gap: 4px; }
      .weather-alert:first-child { border-left: 0; }
      .weather-alert b { color: var(--needle); font: 700 12px var(--font-mono); }
      .weather-alert.clear b { color: var(--ledger); }
      .weather-alert span, .weather-detail { color: var(--ink-dim); font: 10px/1.45 var(--font-mono); }
      .weather-detail { flex: 1 0 100%; border-top: 1px solid var(--hairline); padding-top: 10px; }
      .weather-detail span { display: block; margin-top: 5px; color: var(--ink); }
      .grid-status-head { min-width: 190px; }
      .grid-cap, .grid-reading-k, .grid-updated {
        font-family: var(--font-mono); font-size: 9px; letter-spacing: .14em;
        text-transform: uppercase; color: var(--ink-faint);
      }
      .grid-state {
        display: inline-flex; align-items: center; gap: 7px; margin-top: 7px;
        font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .07em;
        color: var(--ledger);
      }
      .grid-state.alert, .grid-reading.alert b { color: var(--needle); }
      .grid-updated { margin-top: 7px; letter-spacing: .06em; }
      .grid-readings { display: flex; flex: 1; align-items: stretch; flex-wrap: wrap; }
      .grid-reading {
        flex: 1; min-width: 120px; padding: 1px 14px; border-left: 1px solid var(--hairline);
        display: flex; flex-direction: column; gap: 5px;
      }
      .grid-reading b { font-family: var(--font-mono); font-size: 13px; color: var(--ink); }
      .grid-reading small { color: var(--ink-dim); font-size: 10px; font-weight: 400; }
      .grid-map {
        position: relative; flex: 0 0 230px; height: 132px; overflow: hidden;
        border: 1px solid var(--hairline); border-radius: 5px; background: #111;
      }
      .grid-map iframe { width: 100%; height: 100%; border: 0; display: block; }
      .grid-map a {
        position: absolute; right: 6px; bottom: 6px; padding: 4px 6px; border-radius: 3px;
        background: rgba(20,22,27,.86); color: var(--ink); text-decoration: none;
        font-family: var(--font-mono); font-size: 9px; letter-spacing: .04em;
      }
      .grid-incidents { flex-basis: 100%; border-top: 1px solid var(--hairline); padding-top: 11px; }
      .impact-summary{box-sizing:border-box;width:100%;max-width:100%;overflow:hidden;flex:1 0 100%;min-width:0;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto;column-gap:10px;align-items:center;flex-direction:column;gap:5px;padding:12px;border:1px solid var(--hairline);border-radius:5px;background:#11151b;font-family:var(--font-mono)}.impact-summary span{grid-column:1;grid-row:1;font-size:9px;letter-spacing:.14em;color:var(--ink-faint)}.impact-summary b{grid-column:2;grid-row:1;font-size:11px;color:var(--ink)}.impact-summary small{grid-column:2;grid-row:2;font-size:10px;color:var(--ink-dim)}.impact-summary button{grid-column:3;grid-row:1 / span 2;align-self:center;padding:0;border:0;background:none;color:var(--brass);font:10px var(--font-mono);cursor:pointer}.grid-map.native-map{padding:0;background:#11151b}.grid-map.native-map button{position:absolute;right:6px;bottom:6px;z-index:1;border:1px solid var(--hairline);border-radius:3px;padding:4px 6px;color:var(--ink);background:rgba(20,22,27,.88);font:9px var(--font-mono);cursor:pointer}.territory-map{width:100%;height:100%;display:block;background:#11151b}.county{fill:#202730;stroke:#4a5562;stroke-width:1.2}.county.affected{fill:#572e2a;stroke:var(--needle)}.county-name,.outage-label,.map-clear{fill:var(--ink-dim);font-family:var(--font-mono);font-size:12px}.outage-label{fill:var(--ink);font-size:11px}.outage-marker{cursor:pointer}.outage-halo{fill:rgba(200,72,58,.32)}.outage-core{fill:var(--needle);stroke:#fff0df;stroke-width:1.5}.outage-marker.selected .outage-core{fill:var(--brass)}.map-modal{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:22px;background:rgba(4,5,7,.76)}.map-dialog{width:min(1100px,100%);max-height:min(760px,94vh);overflow:auto;border:1px solid var(--bezel);border-radius:10px;background:var(--panel);box-shadow:0 30px 70px #000}.map-head{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--hairline)}.map-title{margin-top:4px;font-family:var(--font-display);font-size:23px;color:var(--ink)}.map-head a,.map-head button{color:var(--brass);background:none;border:0;text-decoration:none;font-family:var(--font-mono);cursor:pointer}.map-head button{margin-left:15px;font-size:26px;line-height:1}.map-summary{display:flex;flex-wrap:wrap;padding:12px 20px;border-bottom:1px solid var(--hairline)}.map-summary span{padding:2px 16px;border-left:1px solid var(--hairline);color:var(--ink-dim);font:10px var(--font-mono)}.map-summary span:first-child{border-left:0;padding-left:0}.map-summary b{color:var(--needle);font-size:14px}.map-body{display:grid;grid-template-columns:minmax(0,1fr) 280px;min-height:480px}.map-canvas{min-height:420px;padding:18px}.map-aside{padding:18px;border-left:1px solid var(--hairline);background:var(--well)}.aside-cap{margin:0 0 9px;color:var(--ink-faint);font:9px var(--font-mono);letter-spacing:.14em;text-transform:uppercase}.map-incident{width:100%;margin-bottom:7px;padding:9px;text-align:left;border:1px solid var(--hairline);border-radius:4px;background:transparent;color:var(--ink);cursor:pointer}.map-incident.selected{border-color:var(--needle);background:rgba(200,72,58,.08)}.map-incident b,.map-incident span{display:block}.map-incident b{font:11px var(--font-mono)}.map-incident span,.selected-detail span{color:var(--ink-dim);font:10px var(--font-mono)}.selected-detail{display:grid;gap:3px;padding:10px 0 16px}.selected-detail b{font:12px var(--font-mono);color:var(--ink)}.map-counties{display:grid;gap:4px}.map-counties span,.map-county{display:flex;justify-content:space-between;color:var(--ink-dim);font:10px var(--font-mono)}.map-counties span.affected b,.map-county.affected b{color:var(--needle)}.map-county{width:100%;padding:4px 0;border:0;border-radius:3px;background:transparent;text-align:left;cursor:pointer}.map-county:hover,.map-county:focus{background:rgba(217,164,65,.14);color:var(--ink);outline:1px solid var(--brass-dim)}
      .incident { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; font-family: var(--font-mono); font-size: 11px; color: var(--ink-dim); }
      .incident b { color: var(--needle); letter-spacing: .05em; }
      .county-alerts { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
      .county-alerts span { font-family: var(--font-mono); font-size: 10px; color: var(--ink-dim); border: 1px solid var(--hairline); border-radius: 3px; padding: 4px 6px; }
      .county-alerts b { color: var(--needle); }
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

      /* Last-period reconciliation */
      .recon { display: flex; gap: 16px; flex-wrap: wrap; }
      .recon-col { flex: 1; min-width: 140px; }
      .recon-k {
        font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em;
        text-transform: uppercase; color: var(--ink-faint); margin-bottom: 6px;
      }
      .recon-v { font-family: var(--font-display); font-size: 26px; font-weight: 600; color: var(--ink); }
      .recon-v small { font-family: var(--font-mono); font-size: 12px; color: var(--ink-dim); font-weight: 400; }
      .recon-v.ledger { color: var(--ledger); }
      .recon-v.alert { color: var(--needle); }
      .recon-k2 { font-family: var(--font-mono); font-size: 12px; color: var(--ink-dim); margin-top: 4px; }
      .recon-edit { margin-top: 8px; }
      .bill-input {
        width: 100%; max-width: 120px; padding: 6px 8px; font-family: var(--font-mono);
        font-size: 12px; color: var(--ink); background: var(--well); border: 1px solid var(--hairline);
        border-radius: 4px;
      }
      .bill-input:focus { outline: none; border-color: var(--brass-dim); }
      .edit-hint { font-family: var(--font-mono); font-size: 9px; color: var(--ink-faint); margin-left: 6px; }
      .var-note { font-family: var(--font-mono); font-size: 11px; color: var(--ink-dim); margin-top: 16px; line-height: 1.6; }
      .var-note b { color: var(--ledger); font-weight: 700; }
      .var-note code { color: var(--brass); font-size: 11px; }

      /* Invoice actions + list */
      .actions { display: flex; gap: 10px; flex-wrap: wrap; }
      .btn {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
        padding: 10px 14px; border-radius: 6px; cursor: pointer; text-decoration: none;
        border: 1px solid var(--hairline); color: var(--ink); background: rgba(255, 255, 255, 0.02);
      }
      .btn:hover { border-color: var(--brass-dim); }
      .btn.primary {
        color: #241c08; background: linear-gradient(180deg, var(--brass), var(--brass-dim));
        border-color: var(--brass-dim);
      }
      .invoice-list { margin-top: 14px; font-family: var(--font-mono); font-size: 12px; }
      .invoice-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 9px 4px; border-bottom: 1px solid rgba(49, 56, 66, 0.5);
      }
      .invoice-row:last-child { border-bottom: none; }
      .invoice-row .p { color: var(--ink); }
      .invoice-row a { color: var(--brass); text-decoration: none; font-weight: 700; }
      .allocation { margin-top: 12px; border-top: 1px solid var(--hairline); font-family: var(--font-mono); }
      .allocation-head { padding: 10px 0 7px; color: var(--ink-faint); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
      .allocation-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 12px; align-items: center; padding: 8px 0; border-top: 1px solid color-mix(in srgb, var(--hairline) 65%, transparent); color: var(--ink-dim); font-size: 11px; }
      .allocation-row:first-of-type { border-top: 0; }
      .allocation-row b { color: var(--ink); font-weight: 600; text-align: right; }
      .dot { display: inline-block; width: 7px; height: 7px; margin: 0 4px 0 0; border-radius: 50%; vertical-align: 1px; }
      .dot.north { background: var(--north); }.dot.shed { background: var(--shed); }.dot.south { background: var(--south); }

      @media (max-width: 760px) {
        .hero { flex-direction: column; align-items: stretch; }
        .head-right { width: 100%; justify-content: space-between; }
        .grid-reading:first-child { border-left: none; }
      }
      @media (max-width: 680px) {
        .map-body { grid-template-columns: 1fr; }
        .map-canvas { min-height: 360px; padding: 12px; }
        .map-aside { border-left: 0; border-top: 1px solid var(--hairline); }
      }
      @media (max-width: 480px) {
        .register-sub { font-size: 11px; word-wrap: break-word; overflow-wrap: break-word; }
        .flow-well { padding: 12px; min-width: 0; }
        svg.flow-h { display: none; }
        svg.flow-v { display: block; }
        .grid-status { gap: 12px; }
        .grid-status-head { min-width: 0; width: 100%; }
        .weather-status { gap: 12px; }
        .weather-status-head { min-width: 0; width: 100%; }
        .weather-alert { border-left: 0; padding: 2px 0; }
        .grid-map { flex-basis: 100%; height: 180px; }
        .grid-readings { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 0; }
        .grid-reading { min-width: 0; padding: 1px 10px; }
        .grid-reading:nth-child(odd) { border-left: none; }
        .allocation-row { grid-template-columns: 1fr auto; gap: 5px 10px; }
        .allocation-row b { grid-column: 1 / -1; text-align: left; }
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
  name: 'Energy',
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
