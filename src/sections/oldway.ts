import { COPY } from './copy';

/**
 * Beat 2 — The old way.
 *
 * Names the pain: scattered tools, hand-patched gaps. Sets up the
 * metamorphosis that follows.
 */
export function mountOldway(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-oldway';
  section.className = 'kf-section kf-oldway';
  section.dataset.beat = 'oldway';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'kf-eyebrow';
  eyebrow.textContent = COPY.oldway.eyebrow;

  const headline = document.createElement('h2');
  headline.className = 'kf-headline';
  headline.textContent = COPY.oldway.headline;

  const body = document.createElement('p');
  body.className = 'kf-body';
  body.textContent = COPY.oldway.body;

  inner.append(eyebrow, headline, body);
  section.append(inner);
  return section;
}
