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

  // Trusted-by strip: real customer marks pulled from kissflow.com.
  const trusted = document.createElement('div');
  trusted.className = 'kf-proof__trusted';
  const trustedLabel = document.createElement('p');
  trustedLabel.className = 'kf-proof__trusted-label';
  trustedLabel.textContent = 'Trusted by enterprise teams worldwide';
  const logos = document.createElement('div');
  logos.className = 'kf-proof__logos';
  [
    { src: '/brand/customers/puma.webp', alt: 'Puma Energy' },
    { src: '/brand/customers/sn_aboitiz.webp', alt: 'SN Aboitiz Power' },
  ].forEach(({ src, alt }) => {
    const img = document.createElement('img');
    img.className = 'kf-proof__logo';
    img.src = src;
    img.alt = alt;
    img.setAttribute('onerror', "this.style.display='none'");
    logos.append(img);
  });
  trusted.append(trustedLabel, logos);

  copyCol.append(eyebrow, headline, stats, trusted);

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

  mountGlobe(globeEl, { imageUrl: '/brand/art/proof-globe.png' });
  mountDashboard(dashboardEl);

  return section;
}
