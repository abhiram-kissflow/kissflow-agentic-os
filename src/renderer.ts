import * as THREE from 'three';
import { BRAND } from './brand/tokens';

/**
 * Create the WebGLRenderer bound to the `#stage` canvas.
 * - Caps device pixel ratio at 2 (perf on hi-DPI displays).
 * - Black clear color (brand stage).
 * - Installs a window resize handler that keeps the drawing buffer in sync.
 */
export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });

  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight, false);
  renderer.setClearColor(new THREE.Color(BRAND.black), 1);

  const onResize = (): void => {
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight, false);
  };
  globalThis.addEventListener('resize', onResize);

  return renderer;
}
