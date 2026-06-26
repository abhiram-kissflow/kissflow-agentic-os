import * as THREE from 'three';
import { BRAND_ORDER } from '../brand/tokens';

/**
 * Deterministic butterfly flight-path geometry.
 *
 * Four wing lobes, one per brand color, each anchored in a screen quadrant so
 * the envelope of the N curves reads as a 4-lobe butterfly silhouette:
 *
 *   magenta  top-left    blue   top-right
 *   orange   bottom-left green  bottom-right
 *
 * The lobe order follows `BRAND_ORDER` (blue, magenta, orange, green) so the
 * shader can color lobe `i` with `uColor[i % 4]`.
 *
 * Pure + deterministic: no `Math.random`, only index-driven trig, so the same
 * `count` always yields the same curves (asserted in flightpath.test.ts).
 */

const Vec3 = THREE.Vector3;

// Quadrant sign (x, y) per brand-order lobe.
const LOBE_SIGNS: ReadonlyArray<readonly [number, number]> = [
  [1, 1], //  blue    → top-right
  [-1, 1], // magenta → top-left
  [-1, -1], // orange → bottom-left
  [1, -1], // green   → bottom-right
];

/**
 * One teardrop wing lobe living entirely inside its quadrant. Built from two
 * mirrored cubic Béziers (out then back) so the arc-length midpoint sits at the
 * wing tip. Every control point shares the quadrant's signs, so — by the convex
 * hull property of Béziers — every point on the lobe stays in that quadrant.
 */
function wingLobe(
  sx: number,
  sy: number,
  scale: number,
  depth: number,
): THREE.CurvePath<THREE.Vector3> {
  const path = new THREE.CurvePath<THREE.Vector3>();

  const inner = new Vec3(sx * 0.15 * scale, sy * 0.1 * scale, 0);
  const tip = new Vec3(sx * 1.6 * scale, sy * 1.45 * scale, depth);

  // out: inner → tip, bulging along the upper edge of the wing
  path.add(
    new THREE.CubicBezierCurve3(
      inner.clone(),
      new Vec3(sx * 0.3 * scale, sy * 1.5 * scale, depth * 0.5),
      new Vec3(sx * 1.3 * scale, sy * 1.75 * scale, depth),
      tip.clone(),
    ),
  );
  // back: tip → inner, bulging along the lower edge of the wing
  path.add(
    new THREE.CubicBezierCurve3(
      tip.clone(),
      new Vec3(sx * 1.75 * scale, sy * 1.3 * scale, depth),
      new Vec3(sx * 0.5 * scale, sy * 0.3 * scale, depth * 0.5),
      inner.clone(),
    ),
  );

  return path;
}

export function butterflyFlightPaths(
  count: number,
): THREE.CurvePath<THREE.Vector3>[] {
  const paths: THREE.CurvePath<THREE.Vector3>[] = [];
  const lobes = BRAND_ORDER.length; // 4

  for (let i = 0; i < count; i++) {
    const lobe = i % lobes;
    const [sx, sy] = LOBE_SIGNS[lobe];
    const layer = Math.floor(i / lobes);

    // Deterministic per-layer variation, small enough to stay in-quadrant.
    const scale = 1 + 0.12 * Math.sin(layer * 1.7 + lobe);
    const depth = 0.4 * Math.sin(i * 0.9);

    paths.push(wingLobe(sx, sy, scale, depth));
  }

  return paths;
}
