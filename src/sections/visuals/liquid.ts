import * as THREE from 'three';
import { BRAND, hexToVec3 } from '../../brand/tokens';
import { prefersReducedMotion } from '../../capability';
import type { VisualHandle, VisualOptions } from './globe';

// Ashima 3D simplex noise — public-domain GLSL, used for the liquid surface.
const SIMPLEX = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/**
 * Mount the Guardnet "liquid-metal" govern visual into `el`: a noise-displaced
 * blob that drifts and folds like mercury, shaded along an orange→blue brand
 * gradient with a bright fresnel rim.
 *
 * Reduced motion shows a static brand panel; `imageUrl` swaps in an image.
 */
export function mountLiquid(el: HTMLElement, opts: VisualOptions = {}): VisualHandle {
  if (opts.imageUrl) return mountImage(el, opts.imageUrl, 'Governance liquid metal');
  if (prefersReducedMotion()) return mountStaticLiquid(el);

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
  camera.position.z = 3.4;

  const uniforms = {
    uTime: { value: 0 },
    uOrange: { value: new THREE.Vector3(...hexToVec3(BRAND.orange)) },
    uBlue: { value: new THREE.Vector3(...hexToVec3(BRAND.blue)) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: `
      ${SIMPLEX}
      uniform float uTime;
      varying float vDisp;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float n = snoise(position * 1.5 + vec3(0.0, 0.0, uTime * 0.25));
        n += 0.5 * snoise(position * 3.0 - vec3(uTime * 0.18));
        vDisp = n;
        vec3 displaced = position + normal * n * 0.32;
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uOrange;
      uniform vec3 uBlue;
      varying float vDisp;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float g = clamp(vDisp * 0.5 + 0.5, 0.0, 1.0);
        vec3 base = mix(uOrange, uBlue, g);
        float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.0);
        vec3 color = base * (0.45 + 0.55 * fresnel);
        gl_FragColor = vec4(color, 0.92);
      }
    `,
  });

  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 48), material);
  scene.add(blob);

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
    uniforms.uTime.value = clock.elapsedTime;
    blob.rotation.y += dt * 0.12;
    blob.rotation.x += dt * 0.05;
    if (visible) renderer.render(scene, camera);
    raf = globalThis.requestAnimationFrame(tick);
  };
  raf = globalThis.requestAnimationFrame(tick);

  return () => {
    globalThis.cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    blob.geometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
  };
}

function mountImage(el: HTMLElement, src: string, alt: string): VisualHandle {
  const img = document.createElement('img');
  img.className = 'kf-visual__image';
  img.src = src;
  img.alt = alt;
  el.append(img);
  return () => img.remove();
}

function mountStaticLiquid(el: HTMLElement): VisualHandle {
  const panel = document.createElement('div');
  panel.className = 'kf-visual__static kf-visual__static--liquid';
  panel.setAttribute('role', 'img');
  panel.setAttribute('aria-label', 'Governance liquid metal');
  el.append(panel);
  return () => panel.remove();
}
