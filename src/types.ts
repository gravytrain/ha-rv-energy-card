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

export interface RvEnergyCardConfig {
  type: string;
  billing_start_day?: number;
  use_statistics?: boolean;
  show_flow?: boolean;
  show_billing?: boolean;
  total_power_entity?: string;
  grid_status_entity?: string;
  customers_out_entity?: string;
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
  portal_url?: string; // Aiken co-op login portal
  bills_url?: string; // folder link to stored co-op bill PDFs
  invoice_url_base?: string; // e.g. http://becknas.becknet:9000/invoices/invoice- (YYYY-MM.pdf appended)
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
