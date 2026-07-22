# RV Energy Card

A **Meter Register** energy dashboard card for Home Assistant, covering the RV
sites (North, South, She-Shed). The design is grounded in the physical kWh meter
and the Aiken Electric Co-op paper bill — graphite housing, brass dial, red
needle, pale ledger-green readout — with an odometer-style rolling kWh register
as its signature element.

Built with **Lit** and bundled with **esbuild** (like native/community cards),
so DOM updates are granular and the register can animate its roll.

## Development

```bash
npm install
npm run build     # bundles src/ + Lit → dist/rv-energy-card.js (committed; HACS serves it)
npm run watch     # rebuild on change
```

Source lives in `src/` (TypeScript). Do not edit `dist/` by hand.

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

- **Integrated grid service** — co-op status, outage count, data freshness, and
  selected grid-page readings sit directly beneath the live flow rather than on a
  separate dashboard page.
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
| `show_grid_status` | `true` | Show the integrated grid-service readout |
| `grid_metrics` | Affected / Restored / Planned | Other grid readings: `[{ entity, name?, unit?, show_when? }]` |
| `grid_map_url` | `https://map.aikenco-op.org/` | Live outage map; only embedded for a grid issue |
| `grid_map_link` | `https://map.aikenco-op.org/` | Optional URL opened from the map preview |
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

### Migrating grid-page data

The card now carries the useful parts of the former Grid Status page as an
exception view: the live Aiken Co-op map, affected/restored/planned counts, active
incident details, and counties currently affected. It opens automatically for an
issue; while normal, click the header's `GRID OK` badge to open or close it on
demand.

Keep the co-op status and customers-out entities in their dedicated settings, and
use `grid_metrics` only for further readings. Each metric uses its entity's
friendly name and unit by default, or can be labelled explicitly:

```yaml
type: custom:rv-energy-card
grid_metrics:
  - entity: sensor.aiken_co_op_outage_count
    name: Active outages
    show_when: nonzero
  - entity: sensor.aiken_co_op_last_refresh
    name: Co-op data refresh
    show_when: issue
  - entity: sensor.grid_voltage
    name: Supply voltage
    unit: V
    show_when: issue
```

`show_when` defaults to `issue`, so the top-right badge remains the entire
normal-state experience. Use `nonzero` for a reading that is only useful when it
has a non-zero value, or `always` for the rare reading that belongs on screen all
the time. The map is an alert-only inline preview, not a separate dashboard card.
