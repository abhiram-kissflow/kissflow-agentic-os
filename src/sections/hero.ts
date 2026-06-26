import { COPY } from './copy';
import { magnetize } from '../interactions/magnetic';

/**
 * Beat 1 — Hero.
 *
 * The category statement over the live ribbon butterfly. The CTA is wrapped
 * with `magnetize` so it leans toward the cursor. Returns the section element
 * so the scroll timeline (Task 7) can pin it.
 */
export function mountHero(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-hero';
  section.className = 'kf-section kf-hero';
  section.dataset.beat = 'hero';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const headline = document.createElement('h1');
  headline.className = 'kf-headline';
  headline.textContent = COPY.hero.headline;

  const sub = document.createElement('p');
  sub.className = 'kf-body';
  sub.textContent = COPY.hero.sub;

  const cta = document.createElement('a');
  cta.className = 'kf-cta-button kf-cta-button--primary';
  cta.href = '#beat-cta';
  cta.textContent = COPY.hero.cta;
  magnetize(cta, { strength: 0.5, radius: 140 });

  inner.append(headline, sub, cta);
  section.append(inner);
  return section;
}
