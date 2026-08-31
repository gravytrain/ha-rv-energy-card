import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { tokens } from './styles.js';

/**
 * <meter-register> — an odometer-style rolling readout, the signature element
 * of the RV Energy card. Mimics a physical kWh meter register window.
 *
 * Each digit is a vertical 0–9 strip; changing `value` animates a translateY
 * roll because Lit keeps the digit elements across renders. Reduced-motion is
 * respected (the roll transition is disabled).
 */
@customElement('meter-register')
export class MeterRegister extends LitElement {
  /** The number to display (e.g. cumulative kWh this period). */
  @property({ type: Number }) value = 0;

  /** Total digit count (leading zeros padded). Last `decimals` are the fractional window. */
  @property({ type: Number }) digits = 5;

  /** How many trailing digits are the decimal (brass) window. */
  @property({ type: Number }) decimals = 1;


  /** Unit label shown to the right, e.g. "kWh". */
  @property({ type: String }) unit = 'kWh';

  /** Per-digit target positions 0–9, recomputed when `value` changes. */
  @state() private _positions: number[] = [];

  protected willUpdate(changed: PropertyValues) {
    if (changed.has('value') || changed.has('digits') || changed.has('decimals')) {
      this._positions = this._computeDigits();
    }
  }

  private _computeDigits(): number[] {
    const scaled = Math.round(this.value * Math.pow(10, this.decimals));
    const total = Math.max(0, scaled);
    const str = String(total).padStart(this.digits, '0').slice(-this.digits);
    return str.split('').map((c) => parseInt(c, 10) || 0);
  }

  static styles = [
    tokens,
    css`
      :host {
        display: inline-block;
      }
      .odometer {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        gap: 3px;
      }
      .digit {
        position: relative;
        /* responsive: shrinks on narrow screens so all digits + unit fit */
        width: clamp(28px, 8.5vw, 40px);
        height: clamp(44px, 13vw, 62px);
        overflow: hidden;
        border: 1px solid var(--meter-black);
        border-radius: 4px;
        background: linear-gradient(
          180deg,
          var(--meter-dark) 0%,
          var(--meter-mid) 48%,
          var(--meter-mid) 52%,
          var(--meter-dark) 100%
        );
        box-shadow: 0 1px 0 var(--meter-highlight) inset;
      }
      .digit.dec {
        background: linear-gradient(180deg, var(--meter-accent-mid), var(--accent-ink) 52%, var(--meter-accent-dark));
      }
      /* the mechanical seam across the middle of the window */
      .digit::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: color-mix(in srgb, var(--meter-black) 60%, transparent);
        box-shadow: 0 1px 0 color-mix(in srgb, var(--ink) 4%, transparent);
        z-index: 2;
        pointer-events: none;
      }
      .strip {
        display: flex;
        flex-direction: column;
        transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
      }
      .cell {
        height: clamp(44px, 13vw, 62px);
        display: grid;
        place-items: center;
        font-family: var(--font-mono);
        font-weight: 800;
        font-size: clamp(27px, 8vw, 40px);
        line-height: 1;
        color: var(--ink);
        text-shadow: 0 1px 1px var(--meter-black);
      }
      .digit.dec .cell {
        color: var(--brass);
      }
      .unit {
        align-self: flex-end;
        font-family: var(--font-display);
        font-size: 15px;
        letter-spacing: 0.1em;
        color: var(--ink-dim);
        margin-left: 8px;
        padding-bottom: 8px;
      }
      @media (prefers-reduced-motion: reduce) {
        .strip {
          transition: none;
        }
      }
    `,
  ];

  render() {
    const decStart = this.digits - this.decimals;
    return html`
      <div class="odometer" role="img" aria-label="${this.value} ${this.unit}">
        ${this._positions.map((d, i) => {
          const isDec = i >= decStart;
          return html`
            <div class="digit ${isDec ? 'dec' : ''}">
              <div class="strip" style="transform: translateY(-${d * 10}%)">
                ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                  (n) => html`<div class="cell">${n}</div>`
                )}
              </div>
            </div>
          `;
        })}
        <span class="unit">${this.unit}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meter-register': MeterRegister;
  }
}
