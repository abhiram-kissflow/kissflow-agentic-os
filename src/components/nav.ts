import { magnetize } from '../interactions/magnetic';
import { asset } from '../asset';

/**
 * Top navigation chrome.
 *
 * Brand law: this is one of only two places the locked Kissflow lockup
 * (butterfly + wordmark) may appear — here in the nav and in the footer. The
 * mark is rendered as a plain `<img>` at its native aspect ratio and is never
 * recolored, rotated, or distorted; the horizontal *white* lockup is used so it
 * reads on the black stage. The expressive ribbon hero is a distinct light-form,
 * not the logo.
 *
 * The bar is fixed over the WebGL stage and the scrolling beats. The single CTA
 * is magnetized so it leans toward the cursor, echoing the hero interaction.
 */
export function mountNav(root: HTMLElement): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'kf-nav';
  nav.setAttribute('aria-label', 'Primary');

  const brand = document.createElement('a');
  brand.className = 'kf-nav__brand';
  brand.href = '#beat-hero';
  brand.setAttribute('aria-label', 'Kissflow — home');

  const logo = document.createElement('img');
  logo.className = 'kf-nav__logo';
  logo.src = asset('/brand/kissflow-horizontal-white.png');
  logo.alt = 'Kissflow';
  logo.width = 132;
  logo.height = 32;
  logo.decoding = 'async';
  brand.append(logo);

  const cta = document.createElement('a');
  cta.className = 'kf-nav__cta kf-cta-button kf-cta-button--ghost';
  cta.href = '#beat-cta';
  cta.dataset.action = 'book-demo';
  cta.textContent = 'Book a demo';
  magnetize(cta, { strength: 0.4, radius: 110 });

  nav.append(brand, cta);
  root.append(nav);
  return nav;
}
