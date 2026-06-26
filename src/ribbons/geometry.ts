import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BRAND, BRAND_ORDER, hexToVec3 } from '../brand/tokens';
import ribbonVert from './shader/ribbon.vert.glsl?raw';
import ribbonFrag from './shader/ribbon.frag.glsl?raw';

const TUBULAR_SEGMENTS = 160;
const RADIAL_SEGMENTS = 6;
const RADIUS = 0.035;

/**
 * Uniform shape produced by `buildRibbons`. Kept explicit so the Task 4
 * controller can drive the shader without casting through `any`.
 */
export interface RibbonUniforms {
  uTime: { value: number };
  uPointer: { value: THREE.Vector2 };
  uAssemble: { value: number };
  uSpread: { value: number };
  uColor: { value: THREE.Vector3[] };
  [uniform: string]: THREE.IUniform;
}

/**
 * Build a single merged ribbon mesh from the butterfly flight paths.
 *
 * Each path becomes a thin tube; an `aLobe` attribute tags every vertex with
 * its brand-color lobe so the fragment shader can recolor it. The flutter
 * ShaderMaterial is additive + transparent so the ribbons glow into the bloom
 * pass instead of shading like solid geometry.
 *
 * Uniforms: `uTime`, `uPointer` (vec2), `uAssemble` (0..1), `uSpread` (0..1),
 * `uColor` (vec3[4], one per brand lobe).
 */
export function buildRibbons(
  paths: THREE.CurvePath<THREE.Vector3>[],
): THREE.Mesh {
  const geometries: THREE.BufferGeometry[] = [];

  paths.forEach((path, i) => {
    const lobe = i % BRAND_ORDER.length;
    const geo = new THREE.TubeGeometry(
      path,
      TUBULAR_SEGMENTS,
      RADIUS,
      RADIAL_SEGMENTS,
      false,
    );
    const vertCount = geo.attributes.position.count;
    const lobeAttr = new Float32Array(vertCount).fill(lobe);
    geo.setAttribute('aLobe', new THREE.BufferAttribute(lobeAttr, 1));
    geometries.push(geo);
  });

  const merged = mergeGeometries(geometries, false);
  if (!merged) {
    throw new Error('buildRibbons: failed to merge ribbon geometries');
  }

  const uColor = BRAND_ORDER.map(
    (key) => new THREE.Vector3(...hexToVec3(BRAND[key])),
  );

  const uniforms: RibbonUniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uAssemble: { value: 0 },
    uSpread: { value: 0 },
    uColor: { value: uColor },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: ribbonVert,
    fragmentShader: ribbonFrag,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(merged, material);
  mesh.frustumCulled = false;
  return mesh;
}
