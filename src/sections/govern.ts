import { COPY } from './copy';

/**
 * Beat 6 — Govern.
 *
 * Autonomy with accountability: guardrails, policy, audit. Task 8 mounts the
 * Guardnet liquid-metal visual into this beat.
 */
export function mountGovern(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-govern';
  section.className = 'kf-section kf-govern';
  section.dataset.beat = 'govern';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'kf-eyebrow';
  eyebrow.textContent = COPY.govern.eyebrow;

  const headline = document.createElement('h2');
  headline.className = 'kf-headline';
  headline.textContent = COPY.govern.headline;

  const body = document.createElement('p');
  body.className = 'kf-body';
  body.textContent = COPY.govern.body;

  inner.append(eyebrow, headline, body);
  section.append(inner);
  return section;
}
