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
  OutageHistoryPoint,
  CountyStatus,
  WeatherAlert,
  BillingLedgerBill,
} from './types.js';

const CARD_VERSION = '0.15.0';
const DAY_MS = 86400000;
const HOUR_MS = 3600000;

/** A co-op bill window: [start, end) between two meter-read dates, local midnight. */
interface BillPeriod {
  start: Date;
  end: Date;
  billId: string;
  /** True when the dates came from the bill-date helpers, not the fixed start-day fallback. */
  fromBill: boolean;
}

interface Site {
  key: 'north' | 'south' | 'shed';
  name: string;
  color: string;
  power: string;
  /** Durable external statistic populated from retained Refoss interval data. */
  stat: string;
  /** Pre-migration statistic, retained only for billing periods before Aug 12. */
  legacyStat: string;
  /** Live lifetime entity when the Refoss integration exposes it. */
  liveCumulative: string;
  /** Recorder-independent cumulative value owned by the backfill. */
  cumulativeFallback: string;
  fallbackPeriod: string;
  today: string;
}

const SITES: Site[] = [
  {
    key: 'north',
    name: 'North',
    color: 'var(--north)',
    power: 'sensor.north_site_power',
    stat: 'refoss:north_rv_energy',
    legacyStat: 'sensor.refoss_smart_energy_monitor_total_energy_north_site',
    liveCumulative: 'sensor.refoss_smart_energy_monitor_total_energy_north_site',
    cumulativeFallback: 'input_number.refoss_sum_north_rv',
    fallbackPeriod: 'sensor.refoss_smart_energy_monitor_north_site_billing_period',
    today: 'sensor.north_site_today_energy',
  },
  {
    key: 'south',
    name: 'South',
    color: 'var(--south)',
    power: 'sensor.south_site_power',
    stat: 'refoss:south_rv_energy',
    legacyStat: 'sensor.refoss_smart_energy_monitor_south_site_total_energy',
    liveCumulative: 'sensor.refoss_smart_energy_monitor_south_site_total_energy',
    cumulativeFallback: 'input_number.refoss_sum_south_rv',
    fallbackPeriod: 'sensor.refoss_smart_energy_monitor_south_site_billing_period',
    today: 'sensor.south_site_today_energy',
  },
  {
    key: 'shed',
    name: 'She-Shed',
    color: 'var(--shed)',
    power: 'sensor.em_channel_3_power',
    stat: 'refoss:shed_energy',
    legacyStat: 'sensor.shed_refoss_smart_energy_monitor_she_shed_total_energy',
    liveCumulative: 'sensor.shed_refoss_smart_energy_monitor_she_shed_total_energy',
    cumulativeFallback: 'input_number.refoss_sum_shed',
    fallbackPeriod: 'sensor.refoss_smart_energy_monitor_she_shed_billing_period',
    today: 'sensor.em_channel_3_today_energy',
  },
];

const DEFAULT_NWS_URL =
  'https://forecast.weather.gov/MapClick.php?lat=33.6500&lon=-81.3600';

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
  @state() private _invoiceStatus?: string;
  @state() private _ledgerBusy = false;
  /** Bill id the last-period statistics belong to, so results for old dates are never shown. */
  @state() private _lastPeriodKey?: string;
  /** Whether the statistics span the entire bill window. */
  @state() private _lastPeriodComplete = false;
  /** The part of the bill window every site's statistics cover. */
  @state() private _lastPeriodFrom?: Date;
  @state() private _lastPeriodThrough?: Date;
  /** Ledger bill awaiting a second click to confirm voiding. */
  @state() private _confirmVoid?: string;

  private _statsTimer?: number;
  private _statsLoaded = false;
  private _lastPeriodRequest = 0;
  private _loadedPeriodKey?: string;

  setConfig(config: RvEnergyCardConfig) {
    this._config = {
      billing_start_day: 11,
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
      weather_url: DEFAULT_NWS_URL,
      show_weather_alerts: true,
      base_rate_entity: 'input_number.base_electricity_rate',
      pca_rate_entity: 'input_number.current_pca_rate',
      show_last_period: true,
      show_invoices: true,
      last_bill_start_entity: 'input_datetime.last_coop_bill_start',
      last_bill_end_entity: 'input_datetime.last_coop_bill_end',
      meter_multiplier: 40,
      last_bill_kwh_entity: 'input_number.last_coop_bill_kwh',
      last_bill_energy_entity: 'input_number.last_coop_bill_energy_charge',
      last_bill_local_tax_entity: 'input_number.last_coop_bill_local_tax',
      last_bill_sc_tax_entity: 'input_number.last_coop_bill_sc_tax',
      invoice_script: 'script.generate_monthly_invoice',
      billing_ledger_entity: 'sensor.energy_billing_ledger',
      // Installation-specific URLs (portal, stored bills, invoice PDF base) are
      // intentionally NOT defaulted here — set them in your dashboard card config.
      // They point at private infrastructure and must not be baked into the repo.
      ...config,
    };
  }

  protected updated(changed: PropertyValues) {
    if (!changed.has('hass') || !this.hass || !this._config.use_statistics) return;
    const periodKey = this._lastBillPeriod()?.billId ?? 'none';
    if (!this._statsLoaded) {
      this._statsLoaded = true;
      this._loadedPeriodKey = periodKey;
      this._loadStatistics();
      // Refresh the authoritative baseline every 60s; live creep fills the gaps.
      this._statsTimer = window.setInterval(() => this._loadStatistics(), 60000);
    } else if (periodKey !== this._loadedPeriodKey) {
      // Bill dates were edited: requery immediately instead of waiting for the timer.
      this._loadedPeriodKey = periodKey;
      this._loadStatistics();
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

  /** Parse a YYYY-MM-DD string as local midnight (never via Date's UTC parsing). */
  private _localDate(value?: string): Date | undefined {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return undefined;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  private _isoDate(value: Date): string {
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${value.getFullYear()}-${month}-${day}`;
  }

  private _days(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / DAY_MS);
  }

  /** Legacy fixed-day cycle, used only on installs without the bill-date helpers. */
  private _fixedDayWindow(): { start: Date; end: Date } {
    const startDay = this._config.billing_start_day ?? 12;
    const now = new Date();
    const start =
      now.getDate() >= startDay
        ? new Date(now.getFullYear(), now.getMonth(), startDay)
        : new Date(now.getFullYear(), now.getMonth() - 1, startDay);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, startDay);
    return { start, end };
  }

  private _hasBillDateEntities(): boolean {
    const states = this.hass?.states ?? {};
    return !!(states[this._config.last_bill_start_entity ?? ''] && states[this._config.last_bill_end_entity ?? '']);
  }

  /**
   * The co-op bill being reconciled. Its SERVICE FROM/TO dates are meter-read
   * dates (one bill's TO is the next bill's FROM), so the window is [from, to)
   * at local midnight. Undefined while the entered dates are incomplete.
   */
  private _lastBillPeriod(): BillPeriod | undefined {
    if (this._hasBillDateEntities()) {
      const states = this.hass!.states;
      const start = this._localDate(states[this._config.last_bill_start_entity!].state);
      const end = this._localDate(states[this._config.last_bill_end_entity!].state);
      if (!start || !end || start >= end) return undefined;
      return { start, end, billId: `${this._isoDate(start)}_${this._isoDate(end)}`, fromBill: true };
    }
    const { start: end } = this._fixedDayWindow();
    const start = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate());
    return { start, end, billId: `${this._isoDate(start)}_${this._isoDate(end)}`, fromBill: false };
  }

  /**
   * The in-progress (unbilled) period. It starts at the last bill's read date;
   * the next read is estimated one cycle later because the co-op's read day drifts.
   */
  private _billingWindow(): { start: Date; end: Date } {
    const last = this._lastBillPeriod();
    if (last?.fromBill && last.end.getTime() <= Date.now()) {
      const cycleDays = this._days(last.start, last.end);
      const end = new Date(last.end.getFullYear(), last.end.getMonth(), last.end.getDate() + cycleDays);
      return { start: last.end, end };
    }
    return this._fixedDayWindow();
  }

  /** Whether hourly rows span the whole [start, end) window, and which part they cover. */
  private _coverage(
    rows: StatisticRow[],
    start: Date,
    end: Date,
  ): { complete: boolean; from?: Date; through?: Date } {
    const usable = rows.filter((row) => Number.isFinite(row.sum)).sort((a, b) => a.start - b.start);
    if (!usable.length) return { complete: false };
    // The query starts one hour early, so a covering series has a row at or before `start`.
    const firstStart = usable[0].start;
    const lastEnd = usable[usable.length - 1].start + HOUR_MS;
    return {
      complete: firstStart <= start.getTime() && lastEnd >= end.getTime(),
      from: new Date(Math.max(firstStart, start.getTime())),
      through: new Date(Math.min(lastEnd, end.getTime())),
    };
  }

  /**
   * Calculate usage from cumulative hourly sums without treating a statistic's
   * initial lifetime offset as energy consumed inside the requested period.
   */
  private _usageFromSums(rows: StatisticRow[], start: Date, end: Date): number | undefined {
    const startMs = start.getTime();
    const endMs = end.getTime();
    const usable = rows
      .filter((row) => Number.isFinite(row.sum) && row.start < endMs)
      .sort((a, b) => a.start - b.start);
    const inside = usable.filter((row) => row.start >= startMs);
    const last = inside[inside.length - 1];
    if (!last || last.sum == null) return undefined;

    const earlier = usable.filter((row) => row.start < startMs);
    const before = earlier[earlier.length - 1];
    if (before?.sum != null) return Math.max(0, last.sum - before.sum);

    // The recovered refoss:* series begins exactly at the Aug 12 boundary but
    // retains its older lifetime sum. Its first hourly `state` is that hour's
    // measured kWh, so include that interval rather than the lifetime offset.
    const first = inside[0];
    if (first?.sum == null || !Number.isFinite(first.state)) return undefined;
    return Math.max(0, last.sum - first.sum + (first.state ?? 0));
  }

  private async _loadStatistics() {
    if (!this.hass) return;
    const { start, end } = this._billingWindow();
    const ids = SITES.map((s) => s.stat);
    try {
      const queryStart = new Date(start.getTime() - HOUR_MS);
      // A late bill can leave the estimated end in the past; never cut off live data.
      const queryEnd = new Date(Math.max(end.getTime(), Date.now()));
      const result = await this.hass.callWS<Record<string, StatisticRow[]>>({
        type: 'recorder/statistics_during_period',
        start_time: queryStart.toISOString(),
        end_time: queryEnd.toISOString(),
        statistic_ids: ids,
        period: 'hour',
        types: ['sum', 'state'],
      });
      const stats: Partial<Record<Site['key'], number>> = {};
      const anchor: Partial<Record<Site['key'], number>> = {};
      for (const site of SITES) {
        const rows = result?.[site.stat];
        if (Array.isArray(rows) && rows.length) {
          const usage = this._usageFromSums(rows, start, queryEnd);
          if (usage == null) continue;
          stats[site.key] = usage;
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

    // Also load the monitored total for the bill's exact service window.
    const period = this._lastBillPeriod();
    if (this._config.show_last_period && !period) {
      this._lastPeriodKey = undefined;
      this._lastPeriodMonitored = undefined;
      this._lastPeriodStats = {};
      this._lastPeriodComplete = false;
      this._lastPeriodFrom = undefined;
      this._lastPeriodThrough = undefined;
    } else if (this._config.show_last_period && period) {
      const request = ++this._lastPeriodRequest;
      try {
        const prevStart = period.start;
        const prevEnd = period.end;
        const previousIds = SITES.flatMap((site) => [site.stat, site.legacyStat]);
        // Include the hour immediately before the boundary so cumulative sums
        // can be differenced without counting a statistic's lifetime offset.
        const prevQueryStart = new Date(prevStart.getTime() - 60 * 60 * 1000);
        const prev = await this.hass.callWS<Record<string, StatisticRow[]>>({
          type: 'recorder/statistics_during_period',
          start_time: prevQueryStart.toISOString(),
          end_time: prevEnd.toISOString(),
          statistic_ids: previousIds,
          period: 'hour',
          types: ['sum', 'state'],
        });
        if (request !== this._lastPeriodRequest) return; // dates changed mid-query
        let total = 0;
        let complete = true;
        let from: Date | undefined;
        let through: Date | undefined;
        const bySite: Partial<Record<Site['key'], number>> = {};
        for (const site of SITES) {
          // Prefer whichever cumulative source covers more of the requested
          // window. During migration this lets older periods use legacy history
          // without ever adding the two lifetime series together.
          const candidates = [
            { rows: prev?.[site.stat], scale: 1 },
            { rows: prev?.[site.legacyStat], scale: site.key === 'shed' ? 0.001 : 1 },
          ];
          const startMs = prevStart.getTime();
          const exclusiveEnd = prevEnd.getTime();
          let selected: StatisticRow[] = [];
          let scale = 1;
          let selectedCoverage = 0;
          for (const candidate of candidates) {
            const rows = Array.isArray(candidate.rows)
              ? candidate.rows.filter((row) => row.start < exclusiveEnd)
              : [];
            const coverage = rows.filter((row) => row.start >= startMs).length;
            if (coverage > selectedCoverage) {
              selected = rows;
              scale = candidate.scale;
              selectedCoverage = coverage;
            }
          }
          const coverage = this._coverage(selected, prevStart, prevEnd);
          complete = complete && coverage.complete;
          if (coverage.from && (!from || coverage.from > from)) from = coverage.from;
          if (coverage.through && (!through || coverage.through < through)) through = coverage.through;
          if (!selected.length) continue;
          const usage = this._usageFromSums(selected, prevStart, prevEnd);
          if (usage == null) continue;
          const sum = usage * scale;
          total += sum;
          bySite[site.key] = sum;
        }
        this._lastPeriodMonitored = total;
        this._lastPeriodStats = bySite;
        this._lastPeriodComplete = complete;
        this._lastPeriodFrom = from;
        this._lastPeriodThrough = through;
        this._lastPeriodKey = period.billId;
      } catch {
        if (request !== this._lastPeriodRequest) return;
        this._lastPeriodMonitored = undefined;
        this._lastPeriodStats = {};
        this._lastPeriodComplete = false;
        this._lastPeriodFrom = undefined;
        this._lastPeriodThrough = undefined;
        this._lastPeriodKey = undefined;
      }
    }
  }

  /** Live cumulative total-energy reading for a site, normalized to kWh. */
  private _liveCumulative(site: Site): number {
    // The backfill-owned helper is restart-proof and is the canonical
    // cumulative anchor. Only consult the legacy integration entity when the
    // helper has not been created yet (older installs/migration fallback).
    const durable = this.hass?.states[site.cumulativeFallback];
    if (durable) {
      const value = parseFloat(durable.state);
      if (!isNaN(value)) return value;
    }
    const live = this.hass?.states[site.liveCumulative];
    if (live) {
      let value = parseFloat(live.state);
      if (!isNaN(value)) {
        if (site.key === 'shed') value = value / 1000; // legacy shed sensor is Wh
        return value;
      }
    }
    return this._num(site.cumulativeFallback);
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
    // Co-op service dates are meter-read dates: a bill's TO date is the next
    // bill's FROM date, so the exclusive end is shown exactly as printed.
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
    const detail = primary?.headline || primary?.description || 'No NWS weather alerts are active for the area.';
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

  private _fmtOutageDuration(value?: string): string {
    const start = value ? new Date(value).getTime() : NaN;
    if (!Number.isFinite(start)) return 'duration unavailable';
    const minutes = Math.max(0, Math.floor((Date.now() - start) / 60000));
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    if (days) return `${days}d ${hours}h`;
    if (hours) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  }

  private _outagePercent(out: number, served: number): string {
    if (!Number.isFinite(served) || served <= 0) return '—';
    const percent = Math.max(0, out / served * 100);
    return `${percent.toFixed(percent < 1 ? 2 : 1)}%`;
  }

  private _outageHistory(): OutageHistoryPoint[] {
    const entity = this.hass?.states[this._config.customers_out_entity ?? 'sensor.aiken_co_op_customers_out'];
    const history = entity?.attributes.hourlyCustomersOut;
    if (!Array.isArray(history)) return [];
    return history.filter((point): point is OutageHistoryPoint => {
      if (!point || typeof point !== 'object') return false;
      const row = point as OutageHistoryPoint;
      return Number.isFinite(Number(row.customers)) && !!row.eventTime && Number.isFinite(new Date(row.eventTime).getTime());
    }).sort((a, b) => new Date(a.eventTime!).getTime() - new Date(b.eventTime!).getTime());
  }

  private _renderOutageTrend() {
    const history = this._outageHistory();
    if (history.length < 2) return nothing;
    const width = 600, height = 54, baseline = 50;
    const values = history.map((point) => Math.max(0, Number(point.customers)));
    const peak = Math.max(0, ...values);
    const scalePeak = Math.max(1, peak);
    const points = values.map((value, index) => {
      const x = index / (values.length - 1) * width;
      const y = baseline - value / scalePeak * 44;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const area = `M0,${baseline} L${points.replaceAll(' ', ' L')} L${width},${baseline} Z`;
    const first = new Date(history[0].eventTime!);
    const last = new Date(history[history.length - 1].eventTime!);
    const label = (date: Date) => date.toLocaleString('en-US', { weekday: 'short', hour: 'numeric' });
    return html`
      <div class="outage-trend">
        <div class="trend-head"><span>OUTAGE TREND · LAST 48 HOURS</span><b>Peak ${peak.toLocaleString()} members</b></div>
        ${svg`<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="Customers without power over the last 48 hours; peak ${peak.toLocaleString()}">
          <path class="trend-area" d=${area}></path>
          <polyline class="trend-line" points=${points}></polyline>
        </svg>`}
        <div class="trend-axis"><span>${label(first)}</span><span>Latest hour · ${values[values.length - 1].toLocaleString()} out</span><span>${label(last)}</span></div>
      </div>`;
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
  private _outageKey(outage: OutageDetail, index: number): string {
    return String(outage.outageRecID ?? outage.outageName ?? `outage-${index}`);
  }
  private _selectOutage = (key?: string) => {
    this._selectedOutage = key;
    if (key) this._selectedCounty = undefined;
  };
  private _selectCounty = (name?: string) => {
    this._selectedCounty = name;
    if (name) this._selectedOutage = undefined;
  };
  private _clearMapFocus = () => {
    this._selectedOutage = undefined;
    this._selectedCounty = undefined;
  };

  private _renderTerritoryMap(compact = false) {
    if (compact) {
      const outage = this._outages()[0];
      const county = this._outageCounties()[0];
      return html`<div class="impact-summary"><span>ACTIVE IMPACT</span><b>${county ? `${county.name} County - ${Number(county.customersOutNow).toLocaleString()} / ${Number(county.customersServed ?? 0).toLocaleString()} members out (${this._outagePercent(Number(county.customersOutNow), Number(county.customersServed))})` : outage ? `${Number(outage.customersOutNow ?? 0).toLocaleString()} members out` : 'No active outages reported'}</b>${outage ? html`<small>${outage.outageName ?? 'ACTIVE OUTAGE'} - active ${this._fmtOutageDuration(outage.outageStartTime)} - since ${this._fmtIncidentTime(outage.outageStartTime)}</small>` : nothing}<button @click=${this._openMap}>Open live map</button></div>`;
    }
    return html`<rv-outage-map .counties=${this._allCounties()} .outages=${this._outages()} .selectedOutage=${this._selectedOutage ?? ''} .selectedCounty=${this._selectedCounty ?? ''} .homeLocation=${this._homeLocation()} .outagePolygons=${this._polygons('sensor.aiken_co_op_outage_polygons')} .plannedOutagePolygons=${this._polygons('sensor.aiken_co_op_planned_outage_polygons')} .serviceArea=${this._serviceArea()} @outage-selected=${(event: CustomEvent<string>) => this._selectOutage(event.detail)} @county-selected=${(event: CustomEvent<string>) => this._selectCounty(event.detail)}></rv-outage-map>`;
  }

  private _renderFullMap() {
    const outages = this._outages();
    const totalOut = this._num(this._config.customers_out_entity);
    const totalServed = this._num('sensor.aiken_co_op_customers_served');
    const affected = this._num('sensor.aiken_co_op_customers_affected');
    const restored = this._num('sensor.aiken_co_op_customers_restored');
    const planned = this._num('sensor.aiken_co_op_planned_outages');
    const selectedIndex = outages.findIndex((outage, index) =>
      this._outageKey(outage, index) === this._selectedOutage
    );
    const selected = selectedIndex >= 0 ? outages[selectedIndex] : undefined;
    return html`
      <div class="map-modal" role="dialog" aria-modal="true" @click=${this._closeMap}>
        <section class="map-dialog" @click=${(event: Event) => event.stopPropagation()}>
          <header class="map-head">
            <div><div class="grid-cap">AIKEN CO-OP · LIVE OUTAGES</div><div class="map-title">Grid Territory</div></div>
            <div>
              <button class="map-reset" @click=${this._clearMapFocus} ?disabled=${!this._selectedOutage && !this._selectedCounty}>Show all</button>
              <a href="${this._config.grid_map_link}" target="_blank" rel="noopener noreferrer">Vendor map ↗</a>
              <button aria-label="Close outage map" @click=${this._closeMap}>×</button>
            </div>
          </header>
          <div class="map-summary">
            <span><b>${totalOut.toLocaleString()}</b> OUT NOW</span>
            ${totalServed > 0 ? html`<span><b>${this._outagePercent(totalOut, totalServed)}</b> OF MEMBERS</span>` : nothing}
            ${affected > totalOut ? html`<span><b>${affected.toLocaleString()}</b> AFFECTED</span>` : nothing}
            ${restored > 0 ? html`<span><b>${restored.toLocaleString()}</b> RESTORED</span>` : nothing}
            ${planned > 0 ? html`<span><b>${planned.toLocaleString()}</b> PLANNED</span>` : nothing}
          </div>
          ${this._renderOutageTrend()}
          <div class="map-body">
            <div class="map-canvas">${this._renderTerritoryMap()}</div>
            <aside class="map-aside">
              <div class="aside-cap">Active outages · select to zoom</div>
              ${outages.length ? outages.map((outage, index) => {
                const key = this._outageKey(outage, index);
                return html`
                  <button class="map-incident ${key === this._selectedOutage ? 'selected' : ''}"
                    aria-pressed=${key === this._selectedOutage} @click=${() => this._selectOutage(key)}>
                    <b>${outage.outageName ?? 'ACTIVE OUTAGE'}</b>
                    <span>${Number(outage.customersOutNow ?? 0).toLocaleString()} out · ${this._fmtOutageDuration(outage.outageStartTime)}</span>
                  </button>`;
              }) : html`<div class="map-empty">No active incidents reported.</div>`}
              ${selected ? html`
                <div class="selected-detail">
                  <span>Started</span><b>${this._fmtIncidentTime(selected.outageStartTime)}</b>
                  <span>Duration</span><b>${this._fmtOutageDuration(selected.outageStartTime)}</b>
                  <span>Estimated restoration</span><b>${selected.estimatedTimeOfRestoral ? this._fmtIncidentTime(selected.estimatedTimeOfRestoral) : 'In Review'}</b>
                  ${Number(selected.customersRestored ?? 0) > 0 || Number(selected.customersOutInitially ?? 0) > Number(selected.customersOutNow ?? 0) ? html`<span>Restoration progress</span><b>${Number(selected.customersRestored ?? 0).toLocaleString()} restored · ${Number(selected.customersOutNow ?? 0).toLocaleString()} still out</b>` : nothing}
                  ${selected.cause ? html`<span>Cause</span><b>${selected.cause}</b>` : nothing}
                  ${selected.streetsAffected ? html`<span>Area</span><b>${selected.streetsAffected}</b>` : nothing}
                </div>` : nothing}
              <div class="aside-cap">County status · select to zoom</div>
              <div class="map-counties">
                ${this._allCounties().sort((a, b) => Number(b.customersOutNow) - Number(a.customersOutNow)).map((county) => html`
                  <button class="map-county ${Number(county.customersOutNow) > 0 ? 'affected' : ''} ${this._selectedCounty === county.name ? 'selected' : ''}"
                    aria-pressed=${this._selectedCounty === county.name} @click=${() => this._selectCounty(county.name)}>
                    ${county.name}<b>${Number(county.customersOutNow).toLocaleString()} / ${Number(county.customersServed ?? 0).toLocaleString()} · ${this._outagePercent(Number(county.customersOutNow), Number(county.customersServed))}</b>
                  </button>`)}
              </div>
            </aside>
          </div>
        </section>
      </div>`;
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
    const daysElapsed = Math.max(1, Math.round((now.getTime() - start.getTime()) / DAY_MS));
    // Past the estimated read date the new bill just hasn't been entered yet.
    const daysTotal = Math.max(this._days(start, end), daysElapsed);

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
              ${this._config.show_weather_alerts ? html`<a
                class="status ${weatherAlert ? 'alert' : ''}"
                href="${this._config.weather_url ?? DEFAULT_NWS_URL}"
                target="_blank"
                rel="noopener noreferrer"
                title="Open National Weather Service forecast and alerts"
                aria-label="Open National Weather Service forecast and alerts"
              ><span class="live-dot"></span>${weatherAlert ? 'WX ALERT' : 'WX CLEAR'} &#8599;</a>` : nothing}
            </div>
          </div>

          <div class="hero">
            <div class="register-block">
              <div class="register-label">Cumulative — this billing period</div>
              <meter-register
                .value=${periodKwh}
                .digits=${7}
                .decimals=${3}
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
   * Bill reconciliation: the six values typed from the co-op bill, the device
   * statistics for exactly those service dates, the variance, and the split.
   */
  private _renderLastPeriod(_rate: number) {
    const period = this._lastBillPeriod();
    const billed = this._num(this._config.last_bill_kwh_entity);
    // Real dollar amounts entered from the paper bill (energy + both taxes).
    const billEnergy = this._num(this._config.last_bill_energy_entity);
    const billLocal = this._num(this._config.last_bill_local_tax_entity);
    const billSc = this._num(this._config.last_bill_sc_tax_entity);
    const billTotal = billEnergy + billLocal + billSc;
    const statsReady = !!period && this._lastPeriodKey === period.billId;
    const monitored = statsReady ? this._lastPeriodMonitored ?? 0 : 0;
    const haveData = statsReady && monitored > 0 && billed > 0;
    const varKwh = monitored - billed;
    const varPct = billed > 0 ? (varKwh / billed) * 100 : 0;
    // Register reads are whole numbers × MULTI, so the billed kWh itself is
    // only accurate to ± one multiplier step.
    const resolution = this._config.meter_multiplier ?? 0;
    const withinResolution = resolution > 0 && Math.abs(varKwh) < resolution;
    const within = withinResolution || Math.abs(varPct) <= 2;
    const sign = varKwh >= 0 ? '+' : '';
    const stats = statsReady ? this._lastPeriodStats : {};
    const northAndShed = (stats.north ?? 0) + (stats.shed ?? 0);
    const south = stats.south ?? 0;
    const allocation = (kwh: number) => {
      const share = monitored > 0 ? kwh / monitored : 0;
      return { share, billedKwh: billed * share, total: billTotal * share };
    };
    const inLaws = allocation(northAndShed);
    const ours = allocation(south);
    const ledgerBill = this._ledgerBill();
    const immutable = ledgerBill
      ? ['approved', 'invoice_requested', 'issued'].includes(ledgerBill.status)
      : false;
    const canReconcile = haveData && this._lastPeriodComplete;
    const meta = period
      ? `${this._fmtRange(period.start, period.end)} · ${this._days(period.start, period.end)} DAYS`
      : 'ENTER SERVICE DATES';

    let statusNote;
    if (!period) {
      statusNote = html`Enter the bill's <b>Service from</b> and <b>to</b> dates (the meter-read
        dates under SERVICE) to load the monitored usage for that window.`;
    } else if (!statsReady) {
      statusNote = html`Loading device statistics for ${this._fmtRange(period.start, period.end)}…`;
    } else if (!this._lastPeriodComplete) {
      const stamp = (value: Date) =>
        value.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' });
      statusNote = html`Device statistics only cover
        ${this._lastPeriodFrom && this._lastPeriodThrough
          ? html`<b class="warn">${stamp(this._lastPeriodFrom)} → ${stamp(this._lastPeriodThrough)}</b> of`
          : html`<b class="warn">none</b> of`}
        this window. Check the service dates; it can't be reconciled until it is fully covered.`;
    } else if (billed <= 0) {
      statusNote = html`Enter the bill's kWh to compare it with the monitored usage.`;
    } else if (within) {
      statusNote = withinResolution
        ? html`Monitored usage matches the bill within the meter's
            <b>±${resolution} kWh</b> reading resolution (×${resolution} multiplier).`
        : html`Monitored usage matches the bill to <b>within ${Math.abs(varPct).toFixed(1)}%</b>.`;
    } else {
      statusNote = html`Monitored usage is <b class="warn">${sign}${varPct.toFixed(1)}%</b>
        (${sign}${varKwh.toFixed(1)} kWh) off the bill${resolution > 0
          ? html` — more than the meter's ±${resolution} kWh reading resolution`
          : nothing}. Check that the service dates match the bill.`;
    }

    return html`
      <div class="sec-head">
        <span class="idx">§</span><h2>Bill Reconciliation</h2>
        <span class="rule"></span>
        <span class="meta">${meta}</span>
      </div>
      <div class="meter">
        ${this._renderBillEntry()}
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
                </div>
                <div class="recon-col">
                  <div class="recon-k">Variance vs bill</div>
                  <div class="recon-v ${within ? 'ledger' : 'alert'}">
                    ${sign}${varPct.toFixed(1)}%
                  </div>
                  <div class="recon-k2">${sign}${varKwh.toFixed(1)} kWh</div>
                </div>
              </div>
            `
          : nothing}
        <div class="var-note">${statusNote}</div>
        ${haveData && northAndShed > 0 && south > 0
          ? html`<div class="allocation" aria-label="Bill allocation">
              <div class="allocation-head">Bill allocation · tax included</div>
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
        ${period
          ? html`<div class="ledger-actions">
              <span class="ledger-state ${ledgerBill?.status ?? 'empty'}">
                LEDGER · ${(ledgerBill?.status ?? 'not saved').replace(/_/g, ' ').toUpperCase()}
              </span>
              <button
                class="btn"
                @click=${this._saveAndReconcileBill}
                ?disabled=${this._ledgerBusy || !canReconcile}
              >
                ${immutable
                  ? '＋ Correct as revision'
                  : ledgerBill
                    ? '↻ Reconcile again'
                    : '＋ Save & reconcile'}
              </button>
              <button
                class="btn primary"
                @click=${this._approveBill}
                ?disabled=${this._ledgerBusy || ledgerBill?.status !== 'reconciled'}
              >✓ Approve snapshot</button>
            </div>`
          : nothing}
      </div>
    `;
  }

  /** The six values copied from each co-op bill, written straight to their helpers. */
  private _renderBillEntry() {
    const state = (entity?: string) => this.hass?.states[entity ?? '']?.state ?? '';
    const numberValue = (entity?: string) => {
      const value = parseFloat(state(entity));
      return Number.isFinite(value) ? String(value) : '';
    };
    const dateValue = (entity?: string) => (this._localDate(state(entity)) ? state(entity) : '');
    const dates = this._hasBillDateEntities();
    const field = (label: string, entity: string | undefined, step: string) => html`
      <label class="bill-field">
        <span>${label}</span>
        <input
          type="number"
          class="bill-input"
          min="0"
          step=${step}
          data-entity=${entity ?? ''}
          .value=${numberValue(entity)}
          ?disabled=${!entity || !this.hass?.states[entity] || this._ledgerBusy}
          @change=${this._setBillNumber}
        />
      </label>
    `;
    return html`
      <div class="bill-entry" aria-label="Co-op bill values">
        ${dates
          ? html`
              <label class="bill-field">
                <span>Service from</span>
                <input
                  type="date"
                  class="bill-input"
                  data-entity=${this._config.last_bill_start_entity}
                  .value=${dateValue(this._config.last_bill_start_entity)}
                  ?disabled=${this._ledgerBusy}
                  @change=${this._setBillDate}
                />
              </label>
              <label class="bill-field">
                <span>Service to</span>
                <input
                  type="date"
                  class="bill-input"
                  data-entity=${this._config.last_bill_end_entity}
                  .value=${dateValue(this._config.last_bill_end_entity)}
                  ?disabled=${this._ledgerBusy}
                  @change=${this._setBillDate}
                />
              </label>
            `
          : nothing}
        ${field('kWh', this._config.last_bill_kwh_entity, '1')}
        ${field('Energy $', this._config.last_bill_energy_entity, '0.01')}
        ${field('Local tax $', this._config.last_bill_local_tax_entity, '0.01')}
        ${field('SC tax $', this._config.last_bill_sc_tax_entity, '0.01')}
      </div>
      ${dates
        ? nothing
        : html`<div class="var-note">
            Create <code>${this._config.last_bill_start_entity}</code> and
            <code>${this._config.last_bill_end_entity}</code> (date-only input_datetime helpers) to
            reconcile on the bill's own service dates instead of a fixed start day.
          </div>`}
    `;
  }

  /**
   * Invoices — generate the in-laws' invoice from the approved snapshot, and
   * list recent ledger bills with their own service dates.
   */
  private _renderInvoices() {
    const plan = this._invoicePlan();
    const canGenerate = plan?.bill.status === 'approved';
    const history = this._ledgerHistory()
      .filter((bill) => bill.status !== 'void')
      .slice(0, 6);
    const base = this._config.invoice_url_base;
    // invoice_url_base ends in a filename prefix ("…/invoices/invoice-"); its
    // directory is the NAS listing, which also holds pre-ledger invoices.
    const listing = base ? base.slice(0, base.lastIndexOf('/') + 1) : undefined;

    return html`
      <div class="sec-head">
        <span class="idx">§</span><h2>Invoices</h2>
        <span class="rule"></span>
        <span class="meta">IN-LAWS · NORTH + SHE-SHED</span>
      </div>
      <div class="meter">
        <div class="actions">
          ${this._config.invoice_script
            ? html`<button
                class="btn primary"
                @click=${this._generateInvoice}
                ?disabled=${!canGenerate || this._ledgerBusy}
                title=${canGenerate
                  ? `Generate from the approved snapshot: $${plan!.amount.toFixed(2)}`
                  : 'Save, reconcile, and approve the bill snapshot first'}
              >
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
          ${listing
            ? html`<a class="btn" href="${listing}" target="_blank" rel="noopener noreferrer"
                >↗ All invoices</a
              >`
            : nothing}
          ${plan
            ? html`<span class="invoice-preview">
                North ${plan.north.toFixed(1)} + She-Shed ${plan.shed.toFixed(1)} =
                ${(plan.north + plan.shed).toFixed(1)} billed kWh · $${plan.amount.toFixed(2)}
              </span>`
            : nothing}
        </div>
        ${this._invoiceStatus ? html`<div class="invoice-status">${this._invoiceStatus}</div>` : nothing}
        <div class="invoice-list">
          ${history.length
            ? history.map((bill) => this._renderHistoryRow(bill))
            : html`<div class="invoice-row"><span class="p">No bills in the ledger yet.</span></div>`}
        </div>
      </div>
    `;
  }

  private _renderHistoryRow(bill: BillingLedgerBill) {
    const start = this._localDate(bill.period_start);
    const end = this._localDate(bill.period_end);
    const revision = bill.bill_id.match(/-(r\d+)$/)?.[1];
    const variance = bill.variance_pct ?? bill.reconciliation?.variance_pct;
    const voidable = ['draft', 'reconciled', 'approved'].includes(bill.status);
    const confirming = this._confirmVoid === bill.bill_id;
    return html`
      <div class="invoice-row">
        <span class="p">
          ${start && end ? this._fmtRange(start, end) : bill.bill_id}
          ${revision ? html`<small>${revision.toUpperCase()}</small>` : nothing}
        </span>
        <span class="m">
          ${Number(bill.billed_kwh).toFixed(0)} kWh · $${Number(bill.bill_total).toFixed(2)}${variance != null
            ? ` · ${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%`
            : ''}
        </span>
        <span class="s">
          <span class="ledger-state ${bill.status}">${bill.status.replace(/_/g, ' ').toUpperCase()}</span>
          ${bill.invoice_url
            ? html`<a href="${bill.invoice_url}" target="_blank" rel="noopener noreferrer">invoice ↗</a>`
            : nothing}
          ${voidable
            ? html`<button
                class="link-btn ${confirming ? 'confirm' : ''}"
                @click=${() => this._voidBill(bill.bill_id)}
                ?disabled=${this._ledgerBusy}
              >${confirming ? 'confirm void' : 'void'}</button>`
            : nothing}
        </span>
      </div>
    `;
  }

  /** Ledger bills, newest first: compact history rows merged with the full latest record. */
  private _ledgerHistory(): BillingLedgerBill[] {
    const entityId = this._config.billing_ledger_entity;
    const attributes = entityId ? this.hass?.states[entityId]?.attributes : undefined;
    if (!attributes) return [];
    const isBill = (bill: unknown): bill is BillingLedgerBill =>
      !!bill && typeof bill === 'object' && typeof (bill as BillingLedgerBill).bill_id === 'string';
    const rows: BillingLedgerBill[] = Array.isArray(attributes.bills) ? attributes.bills.filter(isBill) : [];
    const latest = isBill(attributes.latest_bill) ? attributes.latest_bill : undefined;
    const merged = rows.map((row) => (latest && row.bill_id === latest.bill_id ? { ...row, ...latest } : row));
    if (latest && !rows.some((row) => row.bill_id === latest.bill_id)) merged.unshift(latest);
    return merged;
  }

  /** Highest non-void revision of the ledger bill matching the entered service dates. */
  private _ledgerBill(): BillingLedgerBill | undefined {
    const period = this._lastBillPeriod();
    if (!period) return undefined;
    return this._ledgerHistory()
      .filter((bill) => bill.status !== 'void' && this._billRevision(period.billId, bill.bill_id) > 0)
      .sort(
        (a, b) => this._billRevision(period.billId, b.bill_id) - this._billRevision(period.billId, a.bill_id),
      )[0];
  }

  private _billRevision(baseId: string, billId: string): number {
    if (billId === baseId) return 1;
    const match = billId.match(new RegExp(`^${baseId}-r(\\d+)$`));
    return match ? Number(match[1]) : 0;
  }

  private _nextBillRevisionId(baseId: string): string {
    // Voided ids count too: the ledger never reuses an id.
    const maxRevision = this._ledgerHistory().reduce(
      (max, bill) => Math.max(max, this._billRevision(baseId, bill.bill_id)),
      1,
    );
    return `${baseId}-r${maxRevision + 1}`;
  }

  private _callLedger(service: string, serviceData: Record<string, unknown>) {
    if (!this.hass) throw new Error('Home Assistant is unavailable');
    return this.hass.callWS({
      type: 'call_service',
      domain: 'energy_billing_ledger',
      service,
      service_data: serviceData,
    });
  }

  private _saveAndReconcileBill = async () => {
    if (!this.hass || this._ledgerBusy) return;
    const period = this._lastBillPeriod();
    const { north, south, shed } = this._lastPeriodStats;
    const billedKwh = this._num(this._config.last_bill_kwh_entity);
    if (
      !period ||
      this._lastPeriodKey !== period.billId ||
      !this._lastPeriodComplete ||
      north == null ||
      south == null ||
      shed == null ||
      billedKwh <= 0
    ) {
      this._invoiceStatus =
        'Cannot reconcile: enter the service dates and kWh, and wait for complete statistics.';
      return;
    }
    const existing = this._ledgerBill();
    const idTaken = this._ledgerHistory().some((bill) => this._billRevision(period.billId, bill.bill_id) > 0);
    const billId =
      existing && ['draft', 'reconciled'].includes(existing.status)
        ? existing.bill_id
        : idTaken
          ? this._nextBillRevisionId(period.billId)
          : period.billId;
    this._ledgerBusy = true;
    this._invoiceStatus = 'Saving utility bill and reconciliation snapshot…';
    try {
      await this._callLedger('upsert_bill', {
        bill_id: billId,
        period_start: this._isoDate(period.start),
        period_end: this._isoDate(period.end),
        billed_kwh: billedKwh,
        energy_charge: this._num(this._config.last_bill_energy_entity),
        local_tax: this._num(this._config.last_bill_local_tax_entity),
        state_tax: this._num(this._config.last_bill_sc_tax_entity),
      });
      await this._callLedger('reconcile', {
        bill_id: billId,
        north_kwh: Math.round(north * 1e6) / 1e6,
        south_kwh: Math.round(south * 1e6) / 1e6,
        shed_kwh: Math.round(shed * 1e6) / 1e6,
        base_rate: this._num(this._config.base_rate_entity),
        pca_rate: this._num(this._config.pca_rate_entity),
      });
      this._invoiceStatus = `Reconciled ${billedKwh.toFixed(1)} billed kWh against ${(north + south + shed).toFixed(1)} monitored kWh.`;
    } catch (error) {
      this._invoiceStatus = `Ledger update failed: ${error instanceof Error ? error.message : 'check Home Assistant logs'}`;
    } finally {
      this._ledgerBusy = false;
    }
  };

  private _approveBill = async () => {
    const bill = this._ledgerBill();
    if (!bill || this._ledgerBusy) return;
    this._ledgerBusy = true;
    try {
      await this._callLedger('approve', { bill_id: bill.bill_id });
      this._invoiceStatus = 'Reconciliation snapshot approved. Invoice generation is unlocked.';
    } catch (error) {
      this._invoiceStatus = `Approval failed: ${error instanceof Error ? error.message : 'check Home Assistant logs'}`;
    } finally {
      this._ledgerBusy = false;
    }
  };

  /**
   * What the invoice bills, from the frozen snapshot: each in-laws site's
   * monitored kWh scaled to the bill's kWh (proportional_bill_v1), so the PDF
   * total equals the ledger's allocated share of the bill.
   */
  private _invoicePlan():
    | { bill: BillingLedgerBill; north: number; shed: number; amount: number }
    | undefined {
    const bill = this._ledgerBill();
    const snapshot = bill?.reconciliation;
    if (!bill || !snapshot || !(snapshot.monitored_kwh > 0) || !(bill.billed_kwh > 0)) return undefined;
    const scale = bill.billed_kwh / snapshot.monitored_kwh;
    return {
      bill,
      north: snapshot.north_kwh * scale,
      shed: snapshot.shed_kwh * scale,
      amount: bill.bill_total * ((snapshot.north_kwh + snapshot.shed_kwh) / snapshot.monitored_kwh),
    };
  }

  private _generateInvoice = async () => {
    const script = this._config.invoice_script;
    if (!this.hass || !script || this._ledgerBusy) return;
    const plan = this._invoicePlan();
    if (plan?.bill.status !== 'approved') {
      this._invoiceStatus = 'Invoice not generated: save, reconcile, and approve the bill snapshot first.';
      return;
    }
    const { bill } = plan;
    const [domain, service] = script.split('.');
    const roundKwh = (value: number) => Math.round(value * 1000) / 1000;
    const serviceData: Record<string, unknown> = {
      period_start: bill.period_start,
      period_end: bill.period_end,
      north_kwh_override: roundKwh(plan.north),
      shed_kwh_override: roundKwh(plan.shed),
      snapshot_kwh: bill.billed_kwh,
    };
    // Rates derive from the frozen bill amounts, not helpers edited since approval.
    if (bill.energy_charge != null) serviceData.snapshot_energy = bill.energy_charge;
    if (bill.local_tax != null) serviceData.snapshot_local_tax = bill.local_tax;
    if (bill.state_tax != null) serviceData.snapshot_sc_tax = bill.state_tax;
    const billedKwh = (plan.north + plan.shed).toFixed(1);
    this._ledgerBusy = true;
    this._invoiceStatus = `Generating invoice for ${billedKwh} billed kWh…`;
    try {
      await this.hass.callWS({ type: 'call_service', domain, service, service_data: serviceData });
      await this._callLedger('mark_invoice_requested', { bill_id: bill.bill_id });
      const base = this._config.invoice_url_base;
      if (base) {
        await this._callLedger('record_invoice', {
          bill_id: bill.bill_id,
          invoice_url: `${base}${bill.period_start.slice(0, 7)}.pdf`,
          revision: 1,
        });
        this._invoiceStatus = `Invoice issued: $${plan.amount.toFixed(2)} for ${billedKwh} billed kWh.`;
      } else {
        this._invoiceStatus = `Invoice requested: $${plan.amount.toFixed(2)} for ${billedKwh} billed kWh.`;
      }
    } catch {
      this._invoiceStatus = 'Invoice request failed. Check the Home Assistant script trace.';
    } finally {
      this._ledgerBusy = false;
    }
  };

  private async _voidBill(billId: string) {
    if (!this.hass || this._ledgerBusy) return;
    if (this._confirmVoid !== billId) {
      this._confirmVoid = billId;
      return;
    }
    this._confirmVoid = undefined;
    this._ledgerBusy = true;
    try {
      await this._callLedger('void_bill', { bill_id: billId, reason: 'Voided from the RV Energy card' });
      this._invoiceStatus = `Voided ${billId}.`;
    } catch (error) {
      this._invoiceStatus = `Void failed: ${error instanceof Error ? error.message : 'check Home Assistant logs'}`;
    } finally {
      this._ledgerBusy = false;
    }
  }

  private _setBillNumber = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const entity = input.dataset.entity;
    const value = parseFloat(input.value);
    if (!this.hass || !entity || !Number.isFinite(value) || value < 0) return;
    this.hass
      .callWS({
        type: 'call_service',
        domain: 'input_number',
        service: 'set_value',
        service_data: { entity_id: entity, value },
      })
      .catch(() => {
        this._invoiceStatus = `Could not save ${entity}; check its min/max.`;
      });
  };

  private _setBillDate = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const entity = input.dataset.entity;
    if (!this.hass || !entity || !this._localDate(input.value)) return;
    this.hass
      .callWS({
        type: 'call_service',
        domain: 'input_datetime',
        service: 'set_datetime',
        service_data: { entity_id: entity, date: input.value },
      })
      .catch(() => {
        this._invoiceStatus = `Could not save ${entity}.`;
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
        background: linear-gradient(180deg, var(--panel) 0%, color-mix(in srgb, var(--panel) 72%, var(--housing)) 100%);
        border: 1px solid var(--bezel);
        border-radius: 10px;
        box-shadow: 0 1px 0 var(--meter-highlight) inset, 0 18px 40px -22px var(--meter-black);
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
      .portal:hover { background: color-mix(in srgb, var(--brass) 10%, transparent); }
      .brand { display: flex; align-items: center; gap: 14px; }
      .glyph {
        width: 40px; height: 40px; border-radius: 7px;
        background: radial-gradient(circle at 35% 30%, var(--brass) 0%, var(--brass-dim) 70%, color-mix(in srgb, var(--brass-dim) 65%, var(--meter-accent-dark)) 100%);
        display: grid; place-items: center; color: var(--accent-ink); font-size: 22px;
        box-shadow: 0 0 0 1px var(--meter-black) inset, 0 2px 6px -1px var(--meter-black);
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
        color: var(--ledger); border: 1px solid color-mix(in srgb, var(--ledger) 42%, var(--bezel)); background: color-mix(in srgb, var(--ledger) 8%, transparent);
        cursor: pointer;
        text-decoration: none;
      }
      button.status { appearance: none; }
      .status:hover, .status:focus-visible { border-color: var(--brass-dim); outline: none; }
      .status.alert {
        color: var(--needle); border-color: color-mix(in srgb, var(--needle) 42%, var(--bezel)); background: color-mix(in srgb, var(--needle) 9%, transparent);
      }
      .live-dot {
        width: 7px; height: 7px; border-radius: 50%; background: currentColor;
        box-shadow: 0 0 0 0 currentColor; animation: live-pulse 2s infinite;
      }
      @keyframes live-pulse {
        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ledger) 50%, transparent); }
        70% { box-shadow: 0 0 0 6px transparent; }
        100% { box-shadow: 0 0 0 0 transparent; }
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
        background: var(--well); border-radius: 8px;
        box-shadow: 0 2px 5px color-mix(in srgb, var(--meter-black) 35%, transparent) inset, 0 0 0 1px var(--meter-black) inset;
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
        box-shadow: 0 2px 5px color-mix(in srgb, var(--meter-black) 25%, transparent) inset;
      }
      .grid-status.alert { border-color: color-mix(in srgb, var(--needle) 42%, var(--bezel)); }
      .weather-status {
        display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
        margin-top: 12px; padding: 14px 16px;
        background: var(--well); border: 1px solid var(--hairline); border-radius: 8px;
        box-shadow: 0 2px 5px color-mix(in srgb, var(--meter-black) 25%, transparent) inset;
      }
      .weather-status.alert { border-color: color-mix(in srgb, var(--needle) 42%, var(--bezel)); }
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
        border: 1px solid var(--hairline); border-radius: 5px; background: var(--meter-dark);
      }
      .grid-map iframe { width: 100%; height: 100%; border: 0; display: block; }
      .grid-map a {
        position: absolute; right: 6px; bottom: 6px; padding: 4px 6px; border-radius: 3px;
        background: color-mix(in srgb, var(--housing) 86%, transparent); color: var(--ink); text-decoration: none;
        font-family: var(--font-mono); font-size: 9px; letter-spacing: .04em;
      }
      .grid-incidents { flex-basis: 100%; border-top: 1px solid var(--hairline); padding-top: 11px; }
      .map-head .map-reset { margin: 0 15px 0 0; padding: 5px 8px; border: 1px solid var(--brass-dim); border-radius: 4px; font-size: 10px; }
      .map-head .map-reset:disabled { opacity: .38; cursor: default; }
      .map-county.selected { background: color-mix(in srgb, var(--brass) 14%, transparent); color: var(--ink); outline: 1px solid var(--brass-dim); }
      .outage-trend { padding: 10px 20px 8px; border-bottom: 1px solid var(--hairline); background: var(--well); }
      .trend-head, .trend-axis { display: flex; justify-content: space-between; align-items: center; gap: 10px; font: 9px var(--font-mono); color: var(--ink-faint); }
      .trend-head { margin-bottom: 4px; letter-spacing: .1em; }
      .trend-head b { color: var(--needle); letter-spacing: 0; }
      .outage-trend svg { display: block; width: 100%; height: 54px; overflow: visible; }
      .trend-area { fill: color-mix(in srgb, var(--needle) 16%, transparent); }
      .trend-line { fill: none; stroke: var(--needle); stroke-width: 2; vector-effect: non-scaling-stroke; }
      .trend-axis { margin-top: 2px; }
      .trend-axis span:nth-child(2) { color: var(--ink-dim); }
      .impact-summary{box-sizing:border-box;width:100%;max-width:100%;overflow:hidden;flex:1 0 100%;min-width:0;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto;column-gap:10px;align-items:center;flex-direction:column;gap:5px;padding:12px;border:1px solid var(--hairline);border-radius:5px;background:var(--meter-dark);font-family:var(--font-mono)}.impact-summary span{grid-column:1;grid-row:1;font-size:9px;letter-spacing:.14em;color:var(--ink-faint)}.impact-summary b{grid-column:2;grid-row:1;font-size:11px;color:var(--ink)}.impact-summary small{grid-column:2;grid-row:2;font-size:10px;color:var(--ink-dim)}.impact-summary button{grid-column:3;grid-row:1 / span 2;align-self:center;padding:0;border:0;background:none;color:var(--brass);font:10px var(--font-mono);cursor:pointer}.grid-map.native-map{padding:0;background:var(--meter-dark)}.grid-map.native-map button{position:absolute;right:6px;bottom:6px;z-index:1;border:1px solid var(--hairline);border-radius:3px;padding:4px 6px;color:var(--ink);background:color-mix(in srgb, var(--housing) 88%, transparent);font:9px var(--font-mono);cursor:pointer}.territory-map{width:100%;height:100%;display:block;background:var(--meter-dark)}.county{fill:var(--panel-2);stroke:var(--bezel);stroke-width:1.2}.county.affected{fill:color-mix(in srgb, var(--needle) 38%, var(--panel));stroke:var(--needle)}.county-name,.outage-label,.map-clear{fill:var(--ink-dim);font-family:var(--font-mono);font-size:12px}.outage-label{fill:var(--ink);font-size:11px}.outage-marker{cursor:pointer}.outage-halo{fill:color-mix(in srgb, var(--needle) 32%, transparent)}.outage-core{fill:var(--needle);stroke:var(--ink);stroke-width:1.5}.outage-marker.selected .outage-core{fill:var(--brass)}.map-modal{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:22px;background:color-mix(in srgb, var(--meter-black) 76%, transparent)}.map-dialog{width:min(1100px,100%);max-height:min(760px,94vh);overflow:auto;border:1px solid var(--bezel);border-radius:10px;background:var(--panel);box-shadow:0 30px 70px var(--meter-black)}.map-head{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--hairline)}.map-title{margin-top:4px;font-family:var(--font-display);font-size:23px;color:var(--ink)}.map-head a,.map-head button{color:var(--brass);background:none;border:0;text-decoration:none;font-family:var(--font-mono);cursor:pointer}.map-head button{margin-left:15px;font-size:26px;line-height:1}.map-summary{display:flex;flex-wrap:wrap;padding:12px 20px;border-bottom:1px solid var(--hairline)}.map-summary span{padding:2px 16px;border-left:1px solid var(--hairline);color:var(--ink-dim);font:10px var(--font-mono)}.map-summary span:first-child{border-left:0;padding-left:0}.map-summary b{color:var(--needle);font-size:14px}.map-body{display:grid;grid-template-columns:minmax(0,1fr) 280px;min-height:480px}.map-canvas{min-height:420px;padding:18px}.map-aside{padding:18px;border-left:1px solid var(--hairline);background:var(--well)}.aside-cap{margin:0 0 9px;color:var(--ink-faint);font:9px var(--font-mono);letter-spacing:.14em;text-transform:uppercase}.map-incident{width:100%;margin-bottom:7px;padding:9px;text-align:left;border:1px solid var(--hairline);border-radius:4px;background:transparent;color:var(--ink);cursor:pointer}.map-incident.selected{border-color:var(--needle);background:color-mix(in srgb, var(--needle) 8%, transparent)}.map-incident b,.map-incident span{display:block}.map-incident b{font:11px var(--font-mono)}.map-incident span,.selected-detail span{color:var(--ink-dim);font:10px var(--font-mono)}.selected-detail{display:grid;gap:3px;padding:10px 0 16px}.selected-detail b{font:12px var(--font-mono);color:var(--ink)}.map-counties{display:grid;gap:4px}.map-counties span,.map-county{display:flex;justify-content:space-between;color:var(--ink-dim);font:10px var(--font-mono)}.map-counties span.affected b,.map-county.affected b{color:var(--needle)}.map-county{width:100%;padding:4px 0;border:0;border-radius:3px;background:transparent;text-align:left;cursor:pointer}.map-county:hover,.map-county:focus{background:color-mix(in srgb, var(--brass) 14%, transparent);color:var(--ink);outline:1px solid var(--brass-dim)}
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
      .sec-head .meta {
        font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--ink-dim); text-align: right;
      }
      .prov {
        font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
        padding: 3px 8px; border-radius: 4px;
      }
      .prov.ok { color: var(--ledger); border: 1px solid color-mix(in srgb, var(--ledger) 42%, var(--bezel)); }
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
      .bill-entry {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 10px;
        margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--hairline);
      }
      .bill-field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
      .bill-field span {
        font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--ink-faint);
      }
      .bill-input {
        width: 100%; box-sizing: border-box; padding: 6px 8px; font-family: var(--font-mono);
        font-size: 12px; color: var(--ink); background: var(--well); border: 1px solid var(--hairline);
        border-radius: 4px; color-scheme: dark;
      }
      .bill-input:focus { outline: none; border-color: var(--brass-dim); }
      .bill-input:disabled { opacity: .5; }
      .var-note { font-family: var(--font-mono); font-size: 11px; color: var(--ink-dim); margin-top: 16px; line-height: 1.6; }
      .var-note b { color: var(--ledger); font-weight: 700; }
      .var-note b.warn { color: var(--needle); }
      .var-note code { color: var(--brass); font-size: 11px; }

      /* Invoice actions + list */
      .actions { display: flex; gap: 10px; flex-wrap: wrap; }
      .btn {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
        padding: 10px 14px; border-radius: 6px; cursor: pointer; text-decoration: none;
        border: 1px solid var(--hairline); color: var(--ink); background: color-mix(in srgb, var(--ink) 2%, transparent);
      }
      .btn:hover { border-color: var(--brass-dim); }
      /* Some Linux cursor themes omit the not-allowed glyph entirely. Keep a
         visible arrow while opacity and the native disabled state convey it. */
      .btn:disabled { cursor: default; opacity: .48; }
      .btn.primary {
        color: var(--accent-ink); background: linear-gradient(180deg, var(--brass), var(--brass-dim));
        border-color: var(--brass-dim);
      }
      .invoice-list { margin-top: 14px; font-family: var(--font-mono); font-size: 12px; }
      .invoice-preview, .invoice-status { color: var(--ink-dim); font: 11px var(--font-mono); }
      .invoice-status { margin-top: 10px; }
      .ledger-actions {
        display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
        margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--hairline);
      }
      .ledger-state {
        margin-right: auto; color: var(--ink-dim); font: 700 10px var(--font-mono);
        letter-spacing: .08em;
      }
      .ledger-state.approved, .ledger-state.issued { color: var(--ledger); }
      .ledger-state.reconciled { color: var(--brass); }
      .invoice-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 9px 4px; border-bottom: 1px solid color-mix(in srgb, var(--hairline) 50%, transparent);
      }
      .invoice-row:last-child { border-bottom: none; }
      .invoice-row .p { color: var(--ink); }
      .invoice-row .p small { color: var(--brass); font-size: 10px; margin-left: 6px; }
      .invoice-row .m { color: var(--ink-dim); margin-left: auto; padding: 0 14px; text-align: right; }
      .invoice-row .s { display: inline-flex; align-items: center; gap: 12px; }
      .invoice-row .s .ledger-state { margin-right: 0; }
      .invoice-row a { color: var(--brass); text-decoration: none; font-weight: 700; }
      .link-btn {
        background: none; border: none; padding: 0; cursor: pointer; color: var(--ink-faint);
        font: 700 11px var(--font-mono); text-decoration: underline dotted;
      }
      .link-btn.confirm { color: var(--needle); }
      .link-btn:disabled { opacity: .48; cursor: default; }
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
        .invoice-row { flex-wrap: wrap; gap: 4px; }
        .invoice-row .m { margin-left: 0; padding: 0; text-align: left; flex-basis: 100%; }
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
    return { billing_start_day: 11, use_statistics: true };
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
