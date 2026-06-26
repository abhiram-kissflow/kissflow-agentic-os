import { COPY } from './copy';

/**
 * Beat 3 — Metamorphosis.
 *
 * "Four wings. One flight." The scattered fragments fuse here; the scroll
 * timeline (Task 7) drives the ribbon fragments together on this beat.
 */
export function mountMetamorphosis(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-metamorphosis';
  section.className = 'kf-section kf-metamorphosis';
  section.dataset.beat = 'metamorphosis';

  // Particle-butterfly backdrop (AI art) sits behind the copy on the black stage.
  const backdrop = document.createElement('img');
  backdrop.className = 'kf-metamorphosis__backdrop';
  backdrop.src = '/brand/art/metamorphosis.png';
  backdrop.alt = '';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.setAttribute('onerror', "this.style.display='none'");
  section.append(backdrop);

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'kf-eyebrow';
  eyebrow.textContent = COPY.metamorphosis.eyebrow;

  const headline = document.createElement('h2');
  headline.className = 'kf-headline';
  headline.textContent = COPY.metamorphosis.headline;

  const body = document.createElement('p');
  body.className = 'kf-body';
  body.textContent = COPY.metamorphosis.body;

  inner.append(eyebrow, headline, body);
  section.append(inner);
  return section;
}
