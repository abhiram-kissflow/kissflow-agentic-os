import { COPY } from './copy';
import { asset } from '../asset';
import { mountConstellation } from './visuals/constellation';
import { mountDashboard } from './visuals/dashboard';

/** Customer marks pulled from kissflow.com, shown as an ambient grid. */
const CUSTOMERS = [
  { src: asset('/brand/customers/acko.svg'), alt: 'Acko' },
  { src: asset('/brand/customers/caratlane.svg'), alt: 'CaratLane' },
  { src: asset('/brand/customers/puma.webp'), alt: 'Puma' },
  { src: asset('/brand/customers/swiggy.png'), alt: 'Swiggy' },
  { src: asset('/brand/customers/flipkart.svg'), alt: 'Flipkart' },
  { src: asset('/brand/customers/sn_aboitiz.webp'), alt: 'SN Aboitiz' },
];

/**
 * Beat 5 — Proof.
 *
 * Hard numbers + the live agent constellation, closed by an ambient customer
 * grid: real marks that breathe in and out on a faint lattice, each lighting to
 * full color on hover. The portfolio reads as atmosphere, not a static strip.
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

  const visualCol = document.createElement('div');
  visualCol.className = 'kf-proof__visual';
  const constellationEl = document.createElement('div');
  constellationEl.className = 'kf-visual kf-proof__globe';
  const dashboardEl = document.createElement('div');
  dashboardEl.className = 'kf-proof__dashboard';
  visualCol.append(constellationEl, dashboardEl);

  layout.append(copyCol, visualCol);

  // Ambient customer grid — a faint lattice of marks that breathe in sequence.
  const portfolio = document.createElement('div');
  portfolio.className = 'kf-portfolio';
  const portfolioLabel = document.createElement('p');
  portfolioLabel.className = 'kf-portfolio__label';
  portfolioLabel.textContent = 'Trusted by forward-thinking enterprises';
  const grid = document.createElement('div');
  grid.className = 'kf-portfolio__grid';
  CUSTOMERS.forEach(({ src, alt }, i) => {
    const cell = document.createElement('div');
    cell.className = 'kf-portfolio__cell';
    cell.style.setProperty('--i', String(i));
    const img = document.createElement('img');
    img.className = 'kf-portfolio__logo';
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.setAttribute('onerror', "this.closest('.kf-portfolio__cell').style.display='none'");
    cell.append(img);
    grid.append(cell);
  });
  portfolio.append(portfolioLabel, grid);

  inner.append(layout, portfolio);
  section.append(inner);

  mountConstellation(constellationEl);
  mountDashboard(dashboardEl);

  return section;
}
