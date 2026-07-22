import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as L from 'leaflet';
import serviceCounties from './aiken-coop-counties.geojson';
import type { CountyStatus, OutageDetail } from './types.js';

type VendorPolygon = { outageRecId?: string; outageRecID?: string; outNow?: number; points?: { type?: string; coordinates?: unknown } };

@customElement('rv-outage-map')
export class RvOutageMap extends LitElement {
  @property({ attribute: false }) counties: CountyStatus[] = [];
  @property({ attribute: false }) outages: OutageDetail[] = [];
  @property({ type: String }) selectedCounty = '';
  @property({ attribute: false }) homeLocation?: { lat: number; lng: number };
  @property({ attribute: false }) outagePolygons: unknown[] = [];
  @property({ attribute: false }) plannedOutagePolygons: unknown[] = [];
  @property({ attribute: false }) serviceArea?: GeoJSON.GeoJsonObject;
  private _map?: L.Map;
  private _layers?: L.LayerGroup;
  private _viewKey = '';

  protected updated() { this._syncMap(); }
  disconnectedCallback() { super.disconnectedCallback(); this._map?.remove(); this._map = undefined; }
  private _key(name?: string) { return (name ?? '').replace(/ county$/i, '').trim().toLowerCase(); }
  private _fmt(value?: string) {
    const date = value ? new Date(value) : undefined;
    return !date || Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
  private _vendorFeatures(items: unknown[]): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = [];
    for (const item of items) {
      const row = item as VendorPolygon, points = row?.points;
      if (!points?.coordinates) continue;
      const type = points.type === 'Polygon' ? 'MultiPolygon' : (points.type ?? 'MultiPolygon');
      const coordinates = points.type === 'Polygon' ? [points.coordinates] : points.coordinates;
      features.push({ type: 'Feature', geometry: { type, coordinates } as GeoJSON.Geometry, properties: { outageRecId: row.outageRecId ?? row.outageRecID, outNow: Number(row.outNow ?? 0) } });
    }
    return { type: 'FeatureCollection', features };
  }
  private _syncMap() {
    const host = this.renderRoot.querySelector<HTMLElement>('#outage-leaflet-map');
    if (!host) return;
    if (!this._map) {
      this._map = L.map(host, { zoomControl: true, scrollWheelZoom: true, preferCanvas: false });
      this._map.createPane('outage-boundaries').style.zIndex = '450';
      this._map.createPane('outage-footprints').style.zIndex = '560';
      this._map.createPane('outage-markers').style.zIndex = '650';
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(this._map);
    }
    this._layers?.remove();
    this._layers = L.layerGroup().addTo(this._map);
    const counties = new Map(this.counties.map((county) => [this._key(county.name), county]));
    const boundaryRenderer = L.canvas({ pane: 'outage-boundaries', padding: 0.5 });
    if (this.serviceArea) L.geoJSON(this.serviceArea, { pane: 'outage-boundaries', style: { color: '#7eaf83', weight: 2, dashArray: '5 5', fill: false } }).bindTooltip('Aiken Co-op service area', { sticky: true }).addTo(this._layers);
    const boundary = L.geoJSON(serviceCounties as GeoJSON.GeoJsonObject, {
      pane: 'outage-boundaries',
      ...({ renderer: boundaryRenderer } as unknown as L.GeoJSONOptions),
      style: (feature) => {
        const county = counties.get(this._key(feature?.properties?.NAME as string | undefined));
        const affected = Number(county?.customersOutNow ?? 0) > 0;
        const selected = this._key(this.selectedCounty) === this._key(feature?.properties?.NAME as string | undefined);
        return { color: selected ? '#d9a441' : affected ? '#c8483a' : '#35506b', weight: selected ? 5 : affected ? 3 : 2, fill: true, fillColor: affected ? '#c8483a' : selected ? '#d9a441' : '#6d8faa', fillOpacity: affected ? 0.62 : selected ? 0.42 : 0.16 };
      },
    }).addTo(this._layers);
    boundary.bringToFront();
    const activeFootprints = L.geoJSON(this._vendorFeatures(this.outagePolygons), {
      pane: 'outage-footprints', style: { color: '#e64a3b', weight: 3, fillColor: '#e64a3b', fillOpacity: 0.35 },
      onEachFeature: (feature, layer) => layer.bindTooltip('Outage area · ' + Number(feature.properties?.outNow ?? 0).toLocaleString() + ' out', { sticky: true }),
    }).addTo(this._layers);
    L.geoJSON(this._vendorFeatures(this.plannedOutagePolygons), {
      pane: 'outage-footprints', style: { color: '#6bbf7b', weight: 3, dashArray: '6 4', fillColor: '#6bbf7b', fillOpacity: 0.2 },
      onEachFeature: (_feature, layer) => layer.bindTooltip('Planned outage area', { sticky: true }),
    }).addTo(this._layers);
    const bounds = boundary.getBounds();
    if (activeFootprints.getBounds().isValid()) bounds.extend(activeFootprints.getBounds());
    const home = this.homeLocation;
    if (home) L.marker([home.lat, home.lng], { pane: 'outage-markers', icon: L.divIcon({ className: 'home-marker', html: 'Home' }) }).bindTooltip('Home', { permanent: false, direction: 'top' }).addTo(this._layers);
    for (const outage of this.outages) {
      const point = outage.outagePoint;
      if (!Number.isFinite(Number(point?.lat)) || !Number.isFinite(Number(point?.lng))) continue;
      const marker = L.circleMarker([Number(point!.lat), Number(point!.lng)], { pane: 'outage-markers', radius: 9, color: '#fff0df', weight: 2, fillColor: '#c8483a', fillOpacity: 1 }).addTo(this._layers);
      marker.bindPopup('<b>' + (outage.outageName ?? 'ACTIVE OUTAGE') + '</b><br>' + Number(outage.customersOutNow ?? 0).toLocaleString() + ' customers out<br>' + (outage.crewAssigned ? 'Crew assigned' : 'Awaiting crew') + '<br>Started ' + this._fmt(outage.outageStartTime) + '<br>ETR ' + (outage.estimatedTimeOfRestoral ?? 'TBD'));
      bounds.extend(marker.getLatLng());
    }
    const viewKey = JSON.stringify({ counties: this.counties.map((county) => [county.name, county.customersOutNow]), outages: this.outages.map((outage) => [outage.outageName, outage.outagePoint]), outagePolygons: this.outagePolygons.length, plannedOutagePolygons: this.plannedOutagePolygons.length });
    if (bounds.isValid() && viewKey !== this._viewKey) { this._map.fitBounds(bounds, { padding: [24, 24], maxZoom: 9 }); this._viewKey = viewKey; }
    requestAnimationFrame(() => this._map?.invalidateSize());
  }
  render() { return html`<div id="outage-leaflet-map" aria-label="OpenStreetMap view of the Aiken Co-op service territory"></div>`; }
  static styles = css`
    :host,#outage-leaflet-map{display:block;height:100%;min-height:420px;background:#d7dde2;font-family:system-ui,sans-serif}.leaflet-container{position:relative;overflow:hidden}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane svg{z-index:200;pointer-events:auto}.leaflet-pane,.leaflet-layer,.leaflet-zoom-animated,.leaflet-tile,.leaflet-marker-icon,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas{position:absolute;left:0;top:0}.leaflet-pane>svg,.leaflet-pane>canvas{width:100%;height:100%}.leaflet-tile-container{pointer-events:none}.leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-control{position:relative;z-index:800}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control-zoom{margin:10px;border:1px solid #777;border-radius:4px;overflow:hidden;box-shadow:0 1px 5px #777}.leaflet-control-zoom a{display:block;width:26px;height:26px;line-height:26px;text-align:center;background:#fff;color:#111;text-decoration:none;font-size:18px}.leaflet-control-zoom a+a{border-top:1px solid #ccc}.leaflet-control-attribution{margin:0;padding:2px 5px;background:rgba(255,255,255,.75);font-size:11px;color:#333}.leaflet-control-attribution a{color:#0078a8}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:5px;background:#20242b;color:#e7e3d8;box-shadow:0 3px 14px rgba(0,0,0,.4)}.leaflet-popup-content{margin:12px 14px;line-height:1.45}.leaflet-popup-tip{width:12px;height:12px;margin:-6px auto 0;background:#20242b;transform:rotate(45deg)}.leaflet-popup-close-button{position:absolute;right:4px;top:0;color:#d9a441;font-size:18px;text-decoration:none}.leaflet-tooltip{position:absolute;padding:5px 7px;border:1px solid #d9a441;border-radius:3px;background:#14161b;color:#e7e3d8;font:11px system-ui,sans-serif;box-shadow:0 2px 7px rgba(0,0,0,.4)}.home-marker{width:auto!important;height:auto!important;margin:-12px 0 0 -18px!important;padding:4px 7px;border:2px solid #fff0df;border-radius:14px;background:#c8483a;color:#fff;font:700 10px system-ui,sans-serif;box-shadow:0 1px 5px rgba(0,0,0,.5);white-space:nowrap}
  `;
}
