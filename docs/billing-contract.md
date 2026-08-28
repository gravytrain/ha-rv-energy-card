# Energy billing workflow contract

This contract separates the two durable records:

- Home Assistant owns bill metadata, reconciliation snapshots, approval state,
  and invoice references in `.storage/energy_billing_ledger`.
- The NAS owns immutable PDF artifacts and their SHA-256 hashes.

All billing periods use a half-open interval: `period_start <= timestamp < period_end`.
Dates are local calendar dates in `America/New_York`; kWh values are decimal numbers.

## Bill identity and state

The canonical ID is `YYYY-MM-DD_YYYY-MM-DD`. A corrected utility bill gets an
explicit suffix such as `-r2`; an approved or issued ledger entry is never edited.

The normal transition is:

`draft -> reconciled -> approved -> invoice_requested -> issued`

The frozen reconciliation records all three site usages, total monitored usage,
the utility's billed usage and charges, the rates visible at reconciliation time,
variance, and the `proportional_bill_v1` allocation result.

## NAS API extension

The existing `POST /hooks/generate-invoice` remains supported during migration.
The extended service should add:

### `POST /utility-bills`

Accept `multipart/form-data` with a PDF field named `file` plus:

- `bill_id`, `period_start`, `period_end`
- `billed_kwh`, `energy_charge`, `local_tax`, `state_tax`

It stores the original bytes once, calculates SHA-256, and returns HTTP 201:

```json
{
  "bill_id": "2026-07-12_2026-08-12",
  "utility_invoice_url": "/artifacts/2026-07-12_2026-08-12/utility-original.pdf",
  "utility_invoice_sha256": "64 lowercase hex characters"
}
```

If that ID exists with identical bytes, return the existing record. If the bytes
differ, return HTTP 409 and require a revision ID.

### `GET /utility-bills/{bill_id}`

Return bill metadata plus the artifact manifest. Do not return extracted/OCR data
as authoritative until a person has reviewed it.

### `POST /invoices/generate`

Accept only an approved, frozen payload:

```json
{
  "bill_id": "2026-07-12_2026-08-12",
  "allocation_policy": "proportional_bill_v1",
  "period_start": "2026-07-12",
  "period_end": "2026-08-12",
  "north_kwh": 518.0466,
  "south_kwh": 740.1111,
  "shed_kwh": 134.541,
  "billed_kwh": 1396.4,
  "bill_total": 0,
  "base_rate": 0,
  "pca_rate": 0
}
```

The service derives the tenant share, writes a new revision (never overwrites),
and returns the invoice URL, revision number, SHA-256, and a manifest URL.

## Artifact layout

```text
energy-billing/YYYY/YYYY-MM-DD_YYYY-MM-DD/
  utility-original.pdf
  utility-original.json
  reconciliation.json
  tenant-invoice-r1.pdf
  manifest.json
```

`manifest.json` records every artifact's relative path, size, SHA-256, creation
time, content type, and revision. Writes use a temporary file plus atomic rename.
