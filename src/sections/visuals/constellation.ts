import * as THREE from 'three';
import { BRAND } from '../../brand/tokens';
import { prefersReducedMotion } from '../../capability';
import { softPointTexture } from './point-texture';
import type { VisualOptions, VisualHandle } from './globe';

const NODE_COUNT = 160;
const ARC_COUNT = 26;
const ARC_SEGMENTS = 40;

/**
 * Agent constellation: ~160 nodes on a slowly rotating sphere, joined by
 * brand-color arcs with pulses that travel across them — agents firing across a
 * global network. Replaces the generic glowing-earth globe in the proof beat.
 *
 * Cursor tilts the sphere; render pauses when offscreen. Reduced motion falls
 * back to a static brand panel.
 */
export function mountConstellation(el: HTMLElement, _opts: VisualOptions = {}): VisualHandle {
  if (prefersReducedMotion()) return mountStatic(el);

  const canvas = document.createElement('canvas');
  canvas.className = 'kf-visual__canvas';
  el.append(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.4;

  const group = new THREE.Group();
  scene.add(group);

  // Nodes — a Fibonacci sphere of blue points.
  const radius = 1.2;
  const nodes: THREE.Vector3[] = [];
  const positions = new Float32Array(NODE_COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const v = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius);
    nodes.push(v);
    v.toArray(positions, i * 3);
  }
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const nodeMat = new THREE.PointsMaterial({
    color: new THREE.Color(BRAND.blue),
    size: 0.07,
    map: softPointTexture(),
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(nodeGeo, nodeMat));

  // Arcs — quadratic curves bowed outward between random node pairs, each with
  // a pulse that travels along it. Pulse colors cycle through the brand accents.
  const pulseColors = [BRAND.magenta, BRAND.orange, BRAND.green, BRAND.blue];
  const arcs: { pulse: THREE.Points; pts: THREE.Vector3[]; speed: number; t: number }[] = [];
  const arcDisposables: THREE.BufferGeometry[] = [];
  // Deterministic pseudo-random so the layout is stable across reloads.
  let seed = 1337;
  const rand = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < ARC_COUNT; i++) {
    const a = nodes[Math.floor(rand() * NODE_COUNT)];
    const b = nodes[Math.floor(rand() * NODE_COUNT)];
    const mid = a.clone().add(b).multiplyScalar(0.5).setLength(radius * (1.25 + rand() * 0.25));
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = curve.getPoints(ARC_SEGMENTS);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    arcDisposables.push(lineGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(BRAND.blue),
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Line(lineGeo, lineMat));

    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    arcDisposables.push(pulseGeo);
    const pulse = new THREE.Points(
      pulseGeo,
      new THREE.PointsMaterial({
        color: new THREE.Color(pulseColors[i % pulseColors.length]),
        size: 0.16,
        map: softPointTexture(),
        sizeAttenuation: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    group.add(pulse);
    arcs.push({ pulse, pts, speed: 0.12 + rand() * 0.22, t: rand() });
  }

  // Cursor tilt.
  let tiltX = 0;
  let tiltY = 0;
  const onPointer = (e: PointerEvent): void => {
    const r = el.getBoundingClientRect();
    tiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
    tiltX = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
  };
  el.addEventListener('pointermove', onPointer);

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

  const tmp = new THREE.Vector3();
  let raf = 0;
  const clock = new THREE.Clock();
  const tick = (): void => {
    const dt = clock.getDelta();
    group.rotation.y += dt * 0.12;
    group.rotation.x += (tiltX - group.rotation.x) * 0.05;
    group.rotation.y += (tiltY - 0) * 0.0; // tiltY folds into spin via cursor feel
    for (const arc of arcs) {
      arc.t = (arc.t + dt * arc.speed) % 1;
      const idx = Math.min(ARC_SEGMENTS, Math.floor(arc.t * ARC_SEGMENTS));
      tmp.copy(arc.pts[idx]);
      const attr = arc.pulse.geometry.getAttribute('position') as THREE.BufferAttribute;
      attr.setXYZ(0, tmp.x, tmp.y, tmp.z);
      attr.needsUpdate = true;
    }
    if (visible) renderer.render(scene, camera);
    raf = globalThis.requestAnimationFrame(tick);
  };
  raf = globalThis.requestAnimationFrame(tick);

  return () => {
    globalThis.cancelAnimationFrame(raf);
    el.removeEventListener('pointermove', onPointer);
    ro.disconnect();
    io.disconnect();
    nodeGeo.dispose();
    nodeMat.dispose();
    arcDisposables.forEach((g) => g.dispose());
    renderer.dispose();
    canvas.remove();
  };
}

function mountStatic(el: HTMLElement): VisualHandle {
  const panel = document.createElement('div');
  panel.className = 'kf-visual__static kf-visual__static--globe';
  panel.setAttribute('role', 'img');
  panel.setAttribute('aria-label', 'Global agent network');
  el.append(panel);
  return () => panel.remove();
}
