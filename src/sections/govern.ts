import { COPY } from './copy';
import { mountCage } from './visuals/cage';

/**
 * Beat 6 — Govern.
 *
 * Autonomy with accountability: guardrails, policy, audit, paired with the
 * Guardnet liquid-metal visual (Task 8). The visual self-guards reduced-motion
 * and accepts an `imageUrl` to swap in user-supplied art later.
 */
export function mountGovern(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-govern';
  section.className = 'kf-section kf-govern';
  section.dataset.beat = 'govern';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const layout = document.createElement('div');
  layout.className = 'kf-govern__layout';

  const copyCol = document.createElement('div');
  copyCol.className = 'kf-govern__copy';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'kf-eyebrow';
  eyebrow.textContent = COPY.govern.eyebrow;

  const headline = document.createElement('h2');
  headline.className = 'kf-headline';
  headline.textContent = COPY.govern.headline;

  const body = document.createElement('p');
  body.className = 'kf-body';
  body.textContent = COPY.govern.body;

  copyCol.append(eyebrow, headline, body);

  const visualCol = document.createElement('div');
  visualCol.className = 'kf-visual kf-govern__visual';

  layout.append(copyCol, visualCol);
  inner.append(layout);
  section.append(inner);

  mountCage(visualCol);

  return section;
}
