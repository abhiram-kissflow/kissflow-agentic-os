import * as THREE from 'three';
import { BRAND, hexToVec3 } from '../../brand/tokens';
import { prefersReducedMotion } from '../../capability';
import { softPointTexture } from './point-texture';
import type { VisualOptions, VisualHandle } from './globe';

const PARTICLE_COUNT = 320;
const BOUND = 1.25; // particles stay inside this sphere radius (the guardrail)

/**
 * Caged energy: agent particles move freely but stay bounded inside a rigid
 * wireframe icosahedron. The clean geometric shell is the deterministic
 * guardrail; the restless brand-colored points are the agents — autonomy held
 * inside limits. Replaces the generic liquid-metal blob in the govern beat.
 */
export function mountCage(el: HTMLElement, _opts: VisualOptions = {}): VisualHandle {
  if (prefersReducedMotion()) return mountStatic(el);

  const canvas = document.createElement('canvas');
  canvas.className = 'kf-visual__canvas';
  el.append(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.6;

  const group = new THREE.Group();
  scene.add(group);

  // The guardrail — a wireframe icosahedron shell, blue (deterministic).
  const shellGeo = new THREE.IcosahedronGeometry(BOUND + 0.18, 1);
  const wire = new THREE.WireframeGeometry(shellGeo);
  const shell = new THREE.LineSegments(
    wire,
    new THREE.LineBasicMaterial({
      color: new THREE.Color(BRAND.blue),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    }),
  );
  group.add(shell);

  // The agents — points with velocities, reflected back inside the bound sphere.
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  let seed = 90210;
  const rand = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = rand() * BOUND;
    positions[i * 3 + 1] = rand() * BOUND;
    positions[i * 3 + 2] = rand() * BOUND;
    velocities[i * 3] = rand() * 0.6;
    velocities[i * 3 + 1] = rand() * 0.6;
    velocities[i * 3 + 2] = rand() * 0.6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Two-tone agents: a magenta core glow over orange points via additive size.
  const mat = new THREE.PointsMaterial({
    size: 0.1,
    map: softPointTexture(),
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: new THREE.Color(BRAND.orange),
  });
  const points = new THREE.Points(geo, mat);
  group.add(points);

  // A faint magenta inner haze so the swarm reads as energy, not confetti.
  const hazeMat = new THREE.PointsMaterial({
    size: 0.3,
    map: softPointTexture(),
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: new THREE.Color(...hexToVec3(BRAND.magenta)),
  });
  group.add(new THREE.Points(geo, hazeMat));

  let width = 0;
  let height = 0;
  const resize = (): void => {
    width = el.clientWidth || 1;
    height = el.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
  io.observe(el);

  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  let raf = 0;
  const clock = new THREE.Clock();
  const tick = (): void => {
    const dt = Math.min(clock.getDelta(), 0.05);
    group.rotation.y += dt * 0.1;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      let x = positions[ix] + velocities[ix] * dt;
      let y = positions[ix + 1] + velocities[ix + 1] * dt;
      let z = positions[ix + 2] + velocities[ix + 2] * dt;
      v.set(x, y, z);
      // Reflect back inside the guardrail sphere — agents never escape the bound.
      if (v.length() > BOUND) {
        const n = v.clone().normalize();
        const dot = velocities[ix] * n.x + velocities[ix + 1] * n.y + velocities[ix + 2] * n.z;
        velocities[ix] -= 2 * dot * n.x;
        velocities[ix + 1] -= 2 * dot * n.y;
        velocities[ix + 2] -= 2 * dot * n.z;
        v.setLength(BOUND);
        x = v.x;
        y = v.y;
        z = v.z;
      }
      positions[ix] = x;
      positions[ix + 1] = y;
      positions[ix + 2] = z;
    }
    pos.needsUpdate = true;
    if (visible) renderer.render(scene, camera);
    raf = globalThis.requestAnimationFrame(tick);
  };
  raf = globalThis.requestAnimationFrame(tick);

  return () => {
    globalThis.cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    shellGeo.dispose();
    wire.dispose();
    geo.dispose();
    mat.dispose();
    hazeMat.dispose();
    renderer.dispose();
    canvas.remove();
  };
}

function mountStatic(el: HTMLElement): VisualHandle {
  const panel = document.createElement('div');
  panel.className = 'kf-visual__static kf-visual__static--liquid';
  panel.setAttribute('role', 'img');
  panel.setAttribute('aria-label', 'Agents bounded by guardrails');
  el.append(panel);
  return () => panel.remove();
}
