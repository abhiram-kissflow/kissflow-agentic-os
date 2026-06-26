import { COPY } from './copy';
import { mountGlobe } from './visuals/globe';
import { mountDashboard } from './visuals/dashboard';

/**
 * Beat 5 — Proof.
 *
 * Hard numbers: 50+ Fortune 500 · 160+ countries · 1M+ users, alongside the
 * Finlytic "global reach" globe and the live "Agent activity" dashboard
 * (Task 8). This module owns the copy, the stat layout, and mounting the two
 * visuals; each visual self-guards reduced-motion and accepts an `imageUrl` to
 * swap in user-supplied art later.
 */
export function mountProof(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-proof';
  section.className = 'kf-section kf-proof';
  section.dataset.beat = 'proof';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const layout = document.createElement('div');
  layout.className = 'kf-proof__layout';

  const copyCol = document.createElement('div');
  copyCol.className = 'kf-proof__copy';

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

  copyCol.append(eyebrow, headline, stats);

  // Visual column: dotted brand globe behind the Agent-activity dashboard.
  const visualCol = document.createElement('div');
  visualCol.className = 'kf-proof__visual';

  const globeEl = document.createElement('div');
  globeEl.className = 'kf-visual kf-proof__globe';

  const dashboardEl = document.createElement('div');
  dashboardEl.className = 'kf-proof__dashboard';

  visualCol.append(globeEl, dashboardEl);
  layout.append(copyCol, visualCol);
  inner.append(layout);
  section.append(inner);

  mountGlobe(globeEl);
  mountDashboard(dashboardEl);

  return section;
}
