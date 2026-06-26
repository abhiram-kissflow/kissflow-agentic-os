import { COPY } from './copy';
import { magnetize } from '../interactions/magnetic';

/**
 * Beat 7 — Take flight (closing CTA).
 *
 * The lift-off beat: the scroll timeline (Task 7) triggers the ribbon
 * `liftoff` here. The button is magnetized and books a demo.
 */
export function mountCta(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-cta';
  section.className = 'kf-section kf-cta';
  section.dataset.beat = 'cta';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const headline = document.createElement('h2');
  headline.className = 'kf-headline';
  headline.textContent = COPY.cta.headline;

  const body = document.createElement('p');
  body.className = 'kf-body';
  body.textContent = COPY.cta.body;

  const button = document.createElement('a');
  button.className = 'kf-cta-button kf-cta-button--primary';
  button.href = '/demo';
  button.dataset.action = 'book-demo';
  button.textContent = `${COPY.cta.button} — ${COPY.cta.action}`;
  magnetize(button, { strength: 0.5, radius: 160 });

  inner.append(headline, body, button);
  section.append(inner);
  return section;
}
