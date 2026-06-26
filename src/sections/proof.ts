import { COPY } from './copy';

/**
 * Beat 5 — Proof.
 *
 * Hard numbers: 50+ Fortune 500 · 160+ countries · 1M+ users. Task 8 mounts
 * the Finlytic globe + dashboard visual into this beat; this module owns the
 * copy and stat layout.
 */
export function mountProof(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-proof';
  section.className = 'kf-section kf-proof';
  section.dataset.beat = 'proof';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'kf-eyebrow';
  eyebrow.textContent = COPY.proof.eyebrow;

  const headline = document.createElement('h2');
  headline.className = 'kf-headline';
  headline.textContent = COPY.proof.headline;

  const stats = document.createElement('div');
  stats.className = 'kf-proof__stats';

  COPY.proof.stats.forEach((stat) => {
    const cell = document.createElement('div');
    cell.className = 'kf-stat';

    const value = document.createElement('p');
    value.className = 'kf-stat__value';
    value.textContent = stat.value;

    const label = document.createElement('p');
    label.className = 'kf-stat__label';
    label.textContent = stat.label;

    cell.append(value, label);
    stats.append(cell);
  });

  inner.append(eyebrow, headline, stats);
  section.append(inner);
  return section;
}
