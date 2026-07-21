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
