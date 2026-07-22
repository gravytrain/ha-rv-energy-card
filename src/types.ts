/** Minimal Home Assistant frontend types used by the card. */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & {
    unit_of_measurement?: string;
    friendly_name?: string;
  };
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  user?: { name?: string };
}

/** A named reading migrated from the grid-status dashboard. */
export interface GridMetricConfig {
  /** Home Assistant entity supplying the reading. */
  entity: string;
  /** Label shown in the card. Defaults to the entity's friendly name. */
  name?: string;
  /** Optional unit override (otherwise the entity unit is used). */
  unit?: string;
  /** When to reveal the reading; defaults to `issue` to avoid normal-state noise. */
  show_when?: 'issue' | 'always' | 'nonzero';
}

export interface OutageDetail {
  outageRecID?: string;
  outageName?: string;
  outagePoint?: { lat?: number; lng?: number };
  customersOutInitially?: number;
  customersOutNow?: number;
  customersRestored?: number;
  crewAssigned?: boolean;
  outageStartTime?: string;
  estimatedTimeOfRestoral?: string | null;
  cause?: string | null;
  outageWorkStatus?: string | null;
  streetsAffected?: string | null;
  outageModifiedTime?: string;
  verified?: boolean;
  isPlanned?: boolean;
}

export interface CountyStatus {
  name?: string;
  customersOutNow?: number;
  customersServed?: number;
}

export interface RvEnergyCardConfig {
  type: string;
  billing_start_day?: number;
  use_statistics?: boolean;
  show_flow?: boolean;
  show_billing?: boolean;
  total_power_entity?: string;
  grid_status_entity?: string;
  customers_out_entity?: string;
  /** Show grid health next to site demand instead of on a separate page. */
  show_grid_status?: boolean;
  /** Additional readings from the grid-status dashboard. */
  grid_metrics?: GridMetricConfig[];
  /** Optional outage-map image, shown only when the grid has an issue. */
  grid_map_url?: string;
  /** Optional destination for the outage map. */
  grid_map_link?: string;
  base_rate_entity?: string;
  pca_rate_entity?: string;
  meter_multiplier?: number;
  // billing reconciliation + invoices
  show_last_period?: boolean;
  show_invoices?: boolean;
  last_bill_kwh_entity?: string; // co-op billed kWh for the previous period
  last_bill_energy_entity?: string; // co-op energy charge $ for the previous period
  last_bill_local_tax_entity?: string; // co-op local option tax $
  last_bill_sc_tax_entity?: string; // co-op SC sales tax $
  portal_url?: string; // utility login portal (set in dashboard config)
  bills_url?: string; // folder link to stored bill PDFs (set in dashboard config)
  invoice_url_base?: string; // base URL for invoice PDFs; "YYYY-MM.pdf" appended (set in dashboard config)
  invoice_script?: string; // script to (re)generate the current invoice
  [key: string]: unknown;
}

/** One statistics row from recorder/statistics_during_period. */
export interface StatisticRow {
  start: number;
  end: number;
  change?: number;
  sum?: number;
  state?: number;
}
