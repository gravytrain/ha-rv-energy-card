# RV Energy Card

A dark-themed energy dashboard card for Home Assistant, covering the RV sites
(North, South, She-Shed). Matches the Double E Reserve / Home Overview design system.

**Billing and period numbers are pulled from Home Assistant long-term statistics**
(device-sourced, gap-proof) rather than the lossy live utility-meter sensors — so
the numbers match the co-op bill even if HA was down during the period. Until the
Refoss backfill job is installed, the card gracefully falls back to the live
`*_billing_period` sensors and flags the section as `LIVE (est.)`.

## Installation

1. Add this repository as a custom repository in HACS (category: Lovelace)
2. Install "RV Energy Card"
3. Add to your dashboard:

```yaml
type: custom:rv-energy-card
billing_start_day: 12
use_statistics: true
```

## Features

- **Header** — billing-period range, day counter, and a live grid-status badge
  (green `GRID OK`, red pulsing `N OUT` from the Aiken Co-op outage sensor)
- **Status banner** — total site power now, today's kWh, period kWh + cost, with a
  per-site power stat cluster (North blue / South green / She-Shed purple)
- **Live Power** — SVG circular gauges per site (instantaneous watts + today's kWh)
- **This Billing Period** — headline cost, projected end-of-period, and a per-site
  table (kWh / cost / today). Sourced from statistics when available; the badge
  shows `AUTHORITATIVE` vs `LIVE (est.)` so you always know which.

## Configuration

| Key | Default | Description |
|-----|---------|-------------|
| `billing_start_day` | `12` | Day of month the billing period starts |
| `use_statistics` | `true` | Pull period kWh from long-term statistics (gap-proof). Set `false` to force live sensors |
| `show_flow` | `true` | Show the live power gauges section |
| `show_billing` | `true` | Show the billing period section |
| `total_power_entity` | `sensor.total_site_power` | Combined site power |
| `grid_status_entity` | `sensor.aiken_co_op_outage_status` | Grid/outage status |
| `customers_out_entity` | `sensor.aiken_co_op_customers_out` | Customers-out count (drives the badge) |
| `base_rate_entity` | `input_number.base_electricity_rate` | Base $/kWh |
| `pca_rate_entity` | `input_number.current_pca_rate` | PCA $/kWh adder |
| `north_max_power` / `south_max_power` / `shed_max_power` | `5000` | Gauge full-scale watts per site |

## Data sources

| Value | Source |
|-------|--------|
| Live power / today / month | Live HA sensors (real-time UI) |
| Billing-period kWh | `recorder/statistics_during_period` `change` over the billing window, on the device-sourced statistic ids (falls back to live `*_billing_period` sensors) |
| Rate | `base_electricity_rate` + `current_pca_rate` input_numbers |

> Design rule: live sensors drive the real-time UI only; anything money depends on
> (billing, cost) reads from the device-sourced statistics. See the Refoss backfill
> design in the homeassistant-redesign repo for how those statistics are populated.
