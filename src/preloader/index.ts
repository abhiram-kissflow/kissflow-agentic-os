import { BRAND } from '../brand/tokens';

const STYLE_ID = 'kf-preloader-style';
const FADE_MS = 300;

/**
 * Full-screen black preloader overlay with a centered, brand-tinted
 * ribbon-glow CSS animation. Shown while the WebGL hero assembles.
 *
 * Usage:
 *   const pre = new Preloader();
 *   pre.start();                 // mount + animate
 *   await controller.assemble(); // hero signals ready
 *   await pre.done();            // fade out (300ms) + remove
 */
export class Preloader {
  private overlay: HTMLDivElement | null = null;

  start(): void {
    if (this.overlay) return;
    this.injectStyles();

    const overlay = document.createElement('div');
    overlay.className = 'kf-preloader';
    overlay.setAttribute('aria-hidden', 'true');

    const glow = document.createElement('div');
    glow.className = 'kf-preloader__glow';
    overlay.appendChild(glow);

    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  /** Fade the overlay out over 300ms, then remove it from the DOM. */
  done(): Promise<void> {
    const overlay = this.overlay;
    if (!overlay) return Promise.resolve();
    return new Promise<void>((resolve) => {
      overlay.style.transition = `opacity ${FADE_MS}ms ease`;
      // Force a reflow so the transition runs from full opacity.
      void overlay.offsetWidth;
      overlay.style.opacity = '0';
      globalThis.setTimeout(() => {
        overlay.remove();
        this.overlay = null;
        resolve();
      }, FADE_MS);
    });
  }

  private injectStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
.kf-preloader{
  position:fixed; inset:0; z-index:9999;
  display:flex; align-items:center; justify-content:center;
  background:${BRAND.black}; opacity:1;
}
.kf-preloader__glow{
  width:120px; height:120px; border-radius:50%;
  background:conic-gradient(from 0deg,
    ${BRAND.blue}, ${BRAND.magenta}, ${BRAND.orange}, ${BRAND.green}, ${BRAND.blue});
  filter:blur(14px);
  animation:kf-pre-spin 1.2s linear infinite, kf-pre-pulse 1.6s ease-in-out infinite;
}
@keyframes kf-pre-spin{ to{ transform:rotate(360deg); } }
@keyframes kf-pre-pulse{ 0%,100%{ opacity:.45; transform:scale(.85);} 50%{ opacity:1; transform:scale(1.05);} }
`;
    document.head.appendChild(style);
  }
}
