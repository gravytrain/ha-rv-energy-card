import { css } from 'lit';

/**
 * Meter Register design tokens — grounded in the physical kWh meter and the
 * Aiken Electric Co-op paper bill (graphite housing, brass dial, red needle,
 * pale ledger-green readout). Shared across the card and its sub-components.
 */
export const tokens = css`
  :host {
    --housing: var(--home-ui-housing, var(--ha-card-background, var(--card-background-color, #14161b)));
    --panel: var(--home-ui-panel, var(--secondary-background-color, #1c2027));
    --panel-2: var(--home-ui-panel-2, var(--primary-background-color, #23282f));
    --well: var(--home-ui-well, var(--primary-background-color, #171a20));
    --bezel: var(--home-ui-bezel, var(--ha-card-border-color, var(--divider-color, #2c323b)));
    --hairline: var(--home-ui-hairline, var(--divider-color, #333a44));
    --brass: var(--home-ui-accent, var(--accent-color, #d9a441));
    --brass-dim: var(--home-ui-accent-muted, var(--primary-color, #a67f34));
    --needle: var(--home-ui-danger, var(--error-color, #c8483a));
    --ledger: var(--home-ui-success, var(--success-color, #9fbf8f));
    --ink: var(--home-ui-text, var(--primary-text-color, #e7e3d8));
    --ink-dim: var(--home-ui-text-muted, var(--secondary-text-color, #9aa0ab));
    --ink-faint: var(--home-ui-text-faint, var(--disabled-text-color, #6b7280));
    --north: var(--home-ui-rv-north, var(--home-ui-info, #5b9bd5));
    --south: var(--home-ui-rv-south, var(--success-color, #6bbf7b));
    --shed: var(--home-ui-rv-shed, #a681c4);
    --accent-ink: var(--home-ui-accent-ink, #241c08);
    --shadow: var(--home-ui-shadow, #000);
    --meter-black: var(--home-ui-meter-black, #000);
    --meter-dark: var(--home-ui-meter-dark, #0a0b0e);
    --meter-mid: var(--home-ui-meter-mid, #202329);
    --meter-highlight: var(--home-ui-meter-highlight, #3a414c);
    --meter-accent-mid: var(--home-ui-meter-accent-mid, #3a2a0c);
    --meter-accent-dark: var(--home-ui-meter-accent-dark, #120d04);

    --font-display: var(--home-ui-font-display, var(--ha-font-family-heading, 'Oswald', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif));
    --font-mono: var(--home-ui-font-mono, 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace);
    --font-body: var(--home-ui-font-body, var(--ha-font-family-body, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif));
  }
`;
