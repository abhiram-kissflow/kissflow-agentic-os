import { COPY } from './copy';

export interface WingsBeat {
  section: HTMLElement;
  /** The four hover/focus targets, in brand order (build/automate/agents/govern). */
  targets: HTMLElement[];
}

/**
 * Beat 4 — Four wings.
 *
 * Build · Automate · Agents · Govern, one per brand color. Each card is a
 * hover/focus target that emits a bubbling `wing:focus` CustomEvent
 * (`detail: { index, key }`). Task 7's timeline listens and focuses the
 * matching ribbon lobe.
 */
export function mountWings(): WingsBeat {
  const section = document.createElement('section');
  section.id = 'beat-wings';
  section.className = 'kf-section kf-wings';
  section.dataset.beat = 'wings';

  const inner = document.createElement('div');
  inner.className = 'kf-section__inner';

  const headline = document.createElement('h2');
  headline.className = 'kf-headline';
  headline.textContent = COPY.wings.headline;

  const grid = document.createElement('div');
  grid.className = 'kf-wings__grid';

  const targets: HTMLElement[] = [];

  COPY.wings.items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'kf-wing';
    card.dataset.wing = item.key;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${item.title}: ${item.body}`);

    const title = document.createElement('h3');
    title.className = 'kf-wing__title';
    title.textContent = item.title;

    const body = document.createElement('p');
    body.className = 'kf-wing__body';
    body.textContent = item.body;

    card.append(title, body);

    const emit = (): void => {
      card.dispatchEvent(
        new CustomEvent('wing:focus', {
          detail: { index, key: item.key },
          bubbles: true,
        }),
      );
    };
    card.addEventListener('pointerenter', emit);
    card.addEventListener('focus', emit);

    grid.append(card);
    targets.push(card);
  });

  inner.append(headline, grid);
  section.append(inner);
  return { section, targets };
}
