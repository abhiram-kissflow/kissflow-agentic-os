import { asset } from '../asset';

/**
 * Footer chrome.
 *
 * Brand law: the second and final place the locked Kissflow lockup may appear.
 * The horizontal white lockup is used as a plain `<img>` at its native aspect
 * ratio — never recolored, rotated, or distorted. The category line repeats the
 * positioning ("the Agentic OS for Business"); the copy avoids the prohibited
 * build-tier labels enforced by copy.test.ts.
 */
export function mountFooter(root: HTMLElement): HTMLElement {
  const footer = document.createElement('footer');
  footer.id = 'site-footer';
  footer.className = 'kf-footer';
  footer.setAttribute('aria-label', 'Footer');

  const inner = document.createElement('div');
  inner.className = 'kf-footer__inner';

  const brand = document.createElement('div');
  brand.className = 'kf-footer__brand';

  const logo = document.createElement('img');
  logo.className = 'kf-footer__logo';
  logo.src = asset('/brand/kissflow-horizontal-white.png');
  logo.alt = 'Kissflow';
  logo.width = 148;
  logo.height = 36;
  logo.decoding = 'async';

  const tagline = document.createElement('p');
  tagline.className = 'kf-footer__tagline';
  tagline.textContent = 'The Agentic OS for Business.';

  brand.append(logo, tagline);

  const meta = document.createElement('p');
  meta.className = 'kf-footer__meta';
  const year = new Date().getFullYear();
  meta.textContent = `© ${year} Kissflow Inc. All rights reserved.`;

  inner.append(brand, meta);
  footer.append(inner);
  root.append(footer);
  return footer;
}
