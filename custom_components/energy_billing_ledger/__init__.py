"""A small, durable utility-bill reconciliation ledger for Home Assistant."""

from __future__ import annotations

from copy import deepcopy
from datetime import date, datetime, timezone
import logging
from typing import Any

import voluptuous as vol

from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.entity_component import EntityComponent
from homeassistant.helpers.storage import Store
from homeassistant.components.sensor import SensorEntity

from .const import (
    DOMAIN,
    SENSOR_ENTITY_ID,
    STATUS_APPROVED,
    STATUS_DRAFT,
    STATUS_INVOICE_REQUESTED,
    STATUS_ISSUED,
    STATUS_RECONCILED,
    STORAGE_KEY,
    STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)
CONFIG_SCHEMA = vol.Schema({DOMAIN: vol.Schema({})}, extra=vol.ALLOW_EXTRA)

DATE = vol.All(cv.date)
MONEY = vol.All(vol.Coerce(float), vol.Range(min=0))
KWH = vol.All(vol.Coerce(float), vol.Range(min=0))
TEXT = vol.All(cv.string, vol.Length(max=2048))
SHA256 = vol.All(cv.string, vol.Match(r"^(?:[0-9a-fA-F]{64})?$"))

UPSERT_SCHEMA = vol.Schema(
    {
        vol.Required("bill_id"): cv.string,
        vol.Required("period_start"): DATE,
        vol.Required("period_end"): DATE,
        vol.Required("billed_kwh"): KWH,
        vol.Optional("energy_charge", default=0): MONEY,
        vol.Optional("local_tax", default=0): MONEY,
        vol.Optional("state_tax", default=0): MONEY,
        vol.Optional("utility_invoice_url", default=""): TEXT,
        vol.Optional("utility_invoice_sha256", default=""): SHA256,
    }
)
RECONCILE_SCHEMA = vol.Schema(
    {
        vol.Required("bill_id"): cv.string,
        vol.Required("north_kwh"): KWH,
        vol.Required("south_kwh"): KWH,
        vol.Required("shed_kwh"): KWH,
        vol.Optional("base_rate", default=0): vol.Coerce(float),
        vol.Optional("pca_rate", default=0): vol.Coerce(float),
        vol.Optional("note", default=""): TEXT,
    }
)
APPROVE_SCHEMA = vol.Schema(
    {vol.Required("bill_id"): cv.string, vol.Optional("note", default=""): TEXT}
)
REQUEST_SCHEMA = vol.Schema({vol.Required("bill_id"): cv.string})
RECORD_SCHEMA = vol.Schema(
    {
        vol.Required("bill_id"): cv.string,
        vol.Required("invoice_url"): TEXT,
        vol.Optional("invoice_sha256", default=""): SHA256,
        vol.Optional("revision", default=1): vol.All(vol.Coerce(int), vol.Range(min=1)),
    }
)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _date_string(value: date | str) -> str:
    return value.isoformat() if isinstance(value, date) else value


class BillingLedger:
    """Own storage and enforce the bill state transitions."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = {"schema_version": 1, "bills": {}}
        self.sensor: BillingLedgerSensor | None = None

    async def load(self) -> None:
        stored = await self.store.async_load()
        if stored:
            self.data = stored

    async def save(self) -> None:
        await self.store.async_save(self.data)
        if self.sensor:
            self.sensor.async_write_ha_state()

    def require(self, bill_id: str) -> dict[str, Any]:
        try:
            return self.data["bills"][bill_id]
        except KeyError as err:
            raise vol.Invalid(f"Unknown bill_id: {bill_id}") from err

    async def upsert(self, call: ServiceCall) -> None:
        values = dict(call.data)
        bill_id = values.pop("bill_id")
        period_start = _date_string(values.pop("period_start"))
        period_end = _date_string(values.pop("period_end"))
        if period_start >= period_end:
            raise vol.Invalid("period_start must be before period_end")

        old = self.data["bills"].get(bill_id)
        if old and old.get("status") in {STATUS_APPROVED, STATUS_INVOICE_REQUESTED, STATUS_ISSUED}:
            raise vol.Invalid("Approved or issued bills are immutable; create a new bill revision")

        timestamp = _now()
        bill = {
            "bill_id": bill_id,
            "status": STATUS_DRAFT,
            "period_start": period_start,
            "period_end": period_end,
            **values,
            "bill_total": round(
                values["energy_charge"] + values["local_tax"] + values["state_tax"], 2
            ),
            "created_at": old.get("created_at", timestamp) if old else timestamp,
            "updated_at": timestamp,
        }
        self.data["bills"][bill_id] = bill
        await self.save()

    async def reconcile(self, call: ServiceCall) -> None:
        values = dict(call.data)
        bill = self.require(values.pop("bill_id"))
        if bill["status"] not in {STATUS_DRAFT, STATUS_RECONCILED}:
            raise vol.Invalid("Only draft or reconciled bills can be reconciled")
        north = values["north_kwh"]
        south = values["south_kwh"]
        shed = values["shed_kwh"]
        monitored = north + south + shed
        billed = bill["billed_kwh"]
        variance = monitored - billed
        in_laws = north + shed
        share = in_laws / monitored if monitored else 0
        bill["reconciliation"] = {
            **values,
            "monitored_kwh": round(monitored, 6),
            "variance_kwh": round(variance, 6),
            "variance_pct": round(variance / billed * 100, 4) if billed else None,
            "allocation_policy": "proportional_bill_v1",
            "in_laws_share": round(share, 8),
            "in_laws_billed_kwh": round(billed * share, 6),
            "in_laws_bill_total": round(bill["bill_total"] * share, 2),
            "reconciled_at": _now(),
        }
        bill["status"] = STATUS_RECONCILED
        bill["updated_at"] = _now()
        await self.save()

    async def approve(self, call: ServiceCall) -> None:
        bill = self.require(call.data["bill_id"])
        if bill["status"] != STATUS_RECONCILED or "reconciliation" not in bill:
            raise vol.Invalid("Bill must be reconciled before approval")
        bill["approval"] = {
            "approved_at": _now(),
            "approved_by": call.context.user_id,
            "note": call.data.get("note", ""),
        }
        bill["status"] = STATUS_APPROVED
        bill["updated_at"] = _now()
        await self.save()

    async def mark_requested(self, call: ServiceCall) -> None:
        bill = self.require(call.data["bill_id"])
        if bill["status"] != STATUS_APPROVED:
            raise vol.Invalid("Only an approved bill can be sent for invoice generation")
        bill["status"] = STATUS_INVOICE_REQUESTED
        bill["invoice_requested_at"] = _now()
        bill["updated_at"] = _now()
        await self.save()

    async def record_invoice(self, call: ServiceCall) -> None:
        bill = self.require(call.data["bill_id"])
        if bill["status"] not in {STATUS_APPROVED, STATUS_INVOICE_REQUESTED}:
            raise vol.Invalid("Only an approved bill can receive an invoice artifact")
        artifact = {
            "revision": call.data["revision"],
            "url": call.data["invoice_url"],
            "sha256": call.data.get("invoice_sha256", ""),
            "issued_at": _now(),
        }
        revisions = bill.setdefault("invoice_revisions", [])
        if any(item["revision"] == artifact["revision"] for item in revisions):
            raise vol.Invalid("That invoice revision already exists")
        revisions.append(artifact)
        bill["status"] = STATUS_ISSUED
        bill["updated_at"] = _now()
        await self.save()


class BillingLedgerSensor(SensorEntity):
    """Expose the latest bill plus a compact history to the dashboard."""

    _attr_has_entity_name = False
    _attr_name = "Energy Billing Ledger"
    _attr_unique_id = "energy_billing_ledger"
    _attr_icon = "mdi:file-document-check-outline"
    _attr_should_poll = False
    entity_id = SENSOR_ENTITY_ID

    def __init__(self, ledger: BillingLedger) -> None:
        self.ledger = ledger

    @property
    def native_value(self) -> str:
        latest = self._latest()
        return latest.get("status", "empty") if latest else "empty"

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        bills = sorted(
            self.ledger.data["bills"].values(),
            key=lambda item: (item.get("period_start", ""), item.get("updated_at", "")),
            reverse=True,
        )
        history = [
            {
                "bill_id": bill["bill_id"],
                "status": bill["status"],
                "period_start": bill["period_start"],
                "period_end": bill["period_end"],
                "billed_kwh": bill["billed_kwh"],
                "bill_total": bill["bill_total"],
                "variance_pct": bill.get("reconciliation", {}).get("variance_pct"),
                "invoice_url": (
                    bill.get("invoice_revisions", [{}])[-1].get("url")
                    if bill.get("invoice_revisions")
                    else None
                ),
            }
            for bill in bills[:24]
        ]
        return {
            "latest_bill": deepcopy(bills[0]) if bills else None,
            "bills": history,
            "bill_count": len(bills),
            "schema_version": self.ledger.data["schema_version"],
        }

    def _latest(self) -> dict[str, Any] | None:
        bills = self.ledger.data["bills"].values()
        return max(bills, key=lambda item: item.get("period_start", ""), default=None)


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up storage, services, and the summary sensor."""
    ledger = BillingLedger(hass)
    await ledger.load()
    sensor = BillingLedgerSensor(ledger)
    ledger.sensor = sensor

    component = EntityComponent(_LOGGER, Platform.SENSOR, hass)
    await component.async_add_entities([sensor])
    hass.data[DOMAIN] = ledger

    hass.services.async_register(DOMAIN, "upsert_bill", ledger.upsert, schema=UPSERT_SCHEMA)
    hass.services.async_register(DOMAIN, "reconcile", ledger.reconcile, schema=RECONCILE_SCHEMA)
    hass.services.async_register(DOMAIN, "approve", ledger.approve, schema=APPROVE_SCHEMA)
    hass.services.async_register(
        DOMAIN, "mark_invoice_requested", ledger.mark_requested, schema=REQUEST_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, "record_invoice", ledger.record_invoice, schema=RECORD_SCHEMA
    )
    return True
