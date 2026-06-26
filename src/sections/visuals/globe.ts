import * as THREE from 'three';
import { BRAND, hexToVec3 } from '../../brand/tokens';
import { prefersReducedMotion } from '../../capability';

/** Options shared by every Task 8 visual. */
export interface VisualOptions {
  /**
   * Optional AI-art image URL. When supplied, the live three.js / DOM effect is
   * skipped and the image is shown instead — the seam where user-supplied art
   * swaps in later.
   */
  imageUrl?: string;
}

/** Cleanup handle: stops the loop, drops listeners, frees GPU resources. */
export type VisualHandle = () => void;

const POINT_COUNT = 2600;

/**
 * Mount the Finlytic "global reach" globe into `el`: a dotted point-cloud
 * sphere in brand blue with a magenta fresnel rim glow, drifting slowly.
 *
 * Falls back to a static brand panel when the user prefers reduced motion, and
 * to a plain `<img>` when `imageUrl` is supplied.
 */
export function mountGlobe(el: HTMLElement, opts: VisualOptions = {}): VisualHandle {
  if (opts.imageUrl) return mountImage(el, opts.imageUrl, 'Global reach');
  if (prefersReducedMotion()) return mountStaticGlobe(el);

  const canvas = document.createElement('canvas');
  canvas.className = 'kf-visual__canvas';
  el.append(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.1;

  const group = new THREE.Group();
  scene.add(group);

  // Point-cloud globe — a Fibonacci sphere of glowing blue dots.
  const positions = new Float32Array(POINT_COUNT * 3);
  const radius = 1;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < POINT_COUNT; i++) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dotMat = new THREE.PointsMaterial({
    color: new THREE.Color(BRAND.blue),
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(dotGeo, dotMat));

  // Magenta fresnel rim — a slightly larger additive shell that lights the edge.
  const rimMat = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
    uniforms: {
      uColor: { value: new THREE.Vector3(...hexToVec3(BRAND.magenta)) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 3.0);
        gl_FragColor = vec4(uColor * fresnel, fresnel);
      }
    `,
  });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(1.18, 48, 48), rimMat));

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

  // Render only while on screen — keeps idle cost near zero.
  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0 },
  );
  io.observe(el);

  let raf = 0;
  const clock = new THREE.Clock();
  const tick = (): void => {
    const dt = clock.getDelta();
    group.rotation.y += dt * 0.18;
    group.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.12;
    if (visible) renderer.render(scene, camera);
    raf = globalThis.requestAnimationFrame(tick);
  };
  raf = globalThis.requestAnimationFrame(tick);

  return () => {
    globalThis.cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    dotGeo.dispose();
    dotMat.dispose();
    rimMat.dispose();
    renderer.dispose();
    canvas.remove();
  };
}

/** Swap the live effect for a user-supplied image. */
function mountImage(el: HTMLElement, src: string, alt: string): VisualHandle {
  const img = document.createElement('img');
  img.className = 'kf-visual__image';
  img.src = src;
  img.alt = alt;
  el.append(img);
  return () => img.remove();
}

/** Motion-free brand panel for reduced-motion users. */
function mountStaticGlobe(el: HTMLElement): VisualHandle {
  const panel = document.createElement('div');
  panel.className = 'kf-visual__static kf-visual__static--globe';
  panel.setAttribute('role', 'img');
  panel.setAttribute('aria-label', 'Global reach');
  el.append(panel);
  return () => panel.remove();
}
