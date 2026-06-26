import * as THREE from 'three';

let cached: THREE.CanvasTexture | null = null;

/**
 * A soft radial-gradient sprite (white core → transparent edge) used as the
 * `map` for point materials, so particles render as glowing dots instead of the
 * default hard squares. Built once and shared across visuals.
 */
export function softPointTexture(): THREE.CanvasTexture {
  if (cached) return cached;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.7)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  cached = new THREE.CanvasTexture(canvas);
  return cached;
}
