import { css } from 'lit';

/**
 * Meter Register design tokens — grounded in the physical kWh meter and the
 * Aiken Electric Co-op paper bill (graphite housing, brass dial, red needle,
 * pale ledger-green readout). Shared across the card and its sub-components.
 */
export const tokens = css`
  :host {
    --housing: #14161b;
    --panel: #1c2027;
    --panel-2: #23282f;
    --bezel: #2c323b;
    --hairline: #333a44;
    --brass: #d9a441;
    --brass-dim: #a67f34;
    --needle: #c8483a;
    --ledger: #9fbf8f;
    --ink: #e7e3d8;
    --ink-dim: #8a8f99;
    --ink-faint: #5a616c;
    --north: #5b9bd5;
    --south: #6bbf7b;
    --shed: #a681c4;

    --font-display: 'Oswald', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
`;
