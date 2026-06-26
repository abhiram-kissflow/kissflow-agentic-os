// src/main.ts
import * as THREE from 'three';
import { BRAND } from './brand/tokens';
import { canRenderWebGL, prefersReducedMotion } from './capability';
import { createRenderer } from './renderer';
import { Preloader } from './preloader';

document.body.style.background = BRAND.black;

const canvas = document.getElementById('stage') as HTMLCanvasElement | null;
const app = document.getElementById('app') as HTMLElement | null;

/**
 * Static, motion-free hero shown when WebGL is unavailable or the user
 * prefers reduced motion. Brand black stage, black-butterfly mark + headline.
 */
function renderStaticFallback(root: HTMLElement): void {
  if (canvas) canvas.style.display = 'none';

  const section = document.createElement('section');
  section.className = 'kf-fallback';
  section.innerHTML = `
    <img class="kf-fallback__mark"
         src="/brand/hero-butterfly.png"
         alt="Kissflow"
         onerror="this.style.display='none'" />
    <h1 class="kf-fallback__headline">The Agentic OS for Business.</h1>
    <p class="kf-fallback__sub">Build enterprise-grade applications. Run by agents. Governed by design.</p>
  `;

  const style = document.createElement('style');
  style.textContent = `
.kf-fallback{
  min-height:100vh; display:flex; flex-direction:column;
  align-items:center; justify-content:center; text-align:center;
  background:${BRAND.black}; color:#fff; padding:2rem;
  font-family:'Inter Tight',system-ui,sans-serif;
}
.kf-fallback__mark{ width:min(280px,60vw); height:auto; margin-bottom:2rem; }
.kf-fallback__headline{ font-size:clamp(2rem,6vw,4.5rem); font-weight:700; margin:0; letter-spacing:-0.02em; }
.kf-fallback__sub{ font-size:clamp(1rem,2vw,1.4rem); font-weight:400; opacity:.8; margin:1rem 0 0; max-width:42ch; }
`;
  root.appendChild(style);
  root.appendChild(section);
}

/**
 * Boot the real-time WebGL stage: renderer + preloader. The ribbon hero
 * (Tasks 3–4) signals ready; for now we resolve the preloader once the
 * renderer has drawn its first black frame.
 */
function bootWebGL(stage: HTMLCanvasElement): void {
  const preloader = new Preloader();
  preloader.start();

  const renderer = createRenderer(stage);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BRAND.black);
  const camera = new THREE.PerspectiveCamera(
    50,
    globalThis.innerWidth / globalThis.innerHeight,
    0.1,
    100,
  );
  camera.position.z = 5;

  let ready = false;
  const tick = (): void => {
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      void preloader.done();
    }
    globalThis.requestAnimationFrame(tick);
  };
  globalThis.requestAnimationFrame(tick);

  console.log('Kissflow Agentic OS — stage ready');
}

if (!canRenderWebGL() || prefersReducedMotion()) {
  if (app) renderStaticFallback(app);
  console.log('Kissflow Agentic OS — static fallback');
} else if (canvas) {
  bootWebGL(canvas);
}
