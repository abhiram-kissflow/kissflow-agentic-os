import { COPY } from './copy';
import { asset } from '../asset';

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
  backdrop.src = asset('/brand/art/metamorphosis.png');
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

  // The transformation blueprint: [Traditional BPM] → inject → [Agentic OS].
  const blueprint = document.createElement('div');
  blueprint.className = 'kf-blueprint';
  blueprint.innerHTML = `
    <div class="kf-blueprint__node kf-blueprint__node--before">
      <span class="kf-blueprint__label">${COPY.metamorphosis.before}</span>
      <span class="kf-blueprint__sub">${COPY.metamorphosis.beforeSub}</span>
    </div>
    <div class="kf-blueprint__arrow">
      <span class="kf-blueprint__inject">${COPY.metamorphosis.inject}</span>
      <span class="kf-blueprint__line" aria-hidden="true"></span>
    </div>
    <div class="kf-blueprint__node kf-blueprint__node--after">
      <span class="kf-blueprint__label">${COPY.metamorphosis.after}</span>
      <span class="kf-blueprint__sub">${COPY.metamorphosis.afterSub}</span>
    </div>
  `;

  inner.append(eyebrow, headline, body, blueprint);
  section.append(inner);
  return section;
}
