import { COPY } from './copy';

/**
 * Beat — The Unfair Advantage.
 *
 * Why a BPM platform, not a raw model, becomes a credible Agentic OS: it
 * already has the guardrails, pipes, and context an agent needs to act safely
 * inside an enterprise. Three points, rendered as a plain typographic row (no
 * card chrome) so the argument reads as prose, not a feature grid.
 */
export function mountAdvantage(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'beat-advantage';
  section.className = 'kf-section kf-advantage';
  section.dataset.beat = 'advantage';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'kf-eyebrow';
  eyebrow.textContent = COPY.advantage.eyebrow;

  const headline = document.createElement('h2');
  headline.className = 'kf-headline';
  headline.textContent = COPY.advantage.headline;

  const body = document.createElement('p');
  body.className = 'kf-body';
  body.textContent = COPY.advantage.body;

  const list = document.createElement('div');
  list.className = 'kf-advantage__list';

  COPY.advantage.items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'kf-advantage__item';

    const num = document.createElement('span');
    num.className = 'kf-advantage__index';
    num.textContent = String(i + 1).padStart(2, '0');

    const text = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'kf-advantage__title';
    title.textContent = item.title;
    const desc = document.createElement('p');
    desc.className = 'kf-advantage__desc';
    desc.textContent = item.body;
    text.append(title, desc);

    row.append(num, text);
    list.append(row);
  });

  inner.append(eyebrow, headline, body, list);
  section.append(inner);
  return section;
}
