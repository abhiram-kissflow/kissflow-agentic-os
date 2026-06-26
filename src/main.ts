// src/main.ts
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { BRAND } from './brand/tokens';
import { canRenderWebGL, prefersReducedMotion } from './capability';
import { createRenderer } from './renderer';
import { Preloader } from './preloader';
import { RibbonController } from './ribbons/controller';

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
 * Boot the real-time WebGL stage: renderer + bloom composer + ribbon hero.
 *
 * The ribbon controller drives the butterfly shader; an UnrealBloomPass on the
 * black stage turns the additive ribbon glow into soft light. On boot we run
 * `controller.assemble()` (knot → butterfly) and resolve the preloader once the
 * form has finished blooming.
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

  const controller = new RibbonController();
  scene.add(controller.mesh);

  // Post-processing: render the scene, then bloom the additive ribbon glow.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(globalThis.innerWidth, globalThis.innerHeight),
    0.9, // strength
    0.6, // radius
    0.0, // threshold (everything blooms on the black stage)
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const setComposerSize = (): void => {
    composer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
    camera.updateProjectionMatrix();
  };
  setComposerSize();
  globalThis.addEventListener('resize', setComposerSize);

  // Cursor-magnetic pointer in stage space (~-2.5..2.5 across the viewport).
  globalThis.addEventListener('pointermove', (e) => {
    const nx = (e.clientX / globalThis.innerWidth) * 2 - 1;
    const ny = -((e.clientY / globalThis.innerHeight) * 2 - 1);
    controller.setPointer(nx * 2.5, ny * 2.5);
  });

  const clock = new THREE.Clock();
  const tick = (): void => {
    controller.update(clock.getDelta());
    composer.render();
    globalThis.requestAnimationFrame(tick);
  };
  globalThis.requestAnimationFrame(tick);

  // Bloom the butterfly into view, then dismiss the preloader.
  void controller.assemble().then(() => preloader.done());

  console.log('Kissflow Agentic OS — stage ready');
}

if (!canRenderWebGL() || prefersReducedMotion()) {
  if (app) renderStaticFallback(app);
  console.log('Kissflow Agentic OS — static fallback');
} else if (canvas) {
  bootWebGL(canvas);
}
