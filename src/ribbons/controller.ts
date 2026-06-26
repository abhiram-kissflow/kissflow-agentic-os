import * as THREE from 'three';
import { buildRibbons } from './geometry';
import type { RibbonUniforms } from './geometry';
import { butterflyFlightPaths } from './flightpath';

/**
 * Lifecycle states of the hero ribbon form.
 * - `assembling`: collapsing knot blooming out into the butterfly (uAssemble 0→1).
 * - `idle`: full butterfly, fluttering + cursor-magnetic.
 * - `liftoff`: the CTA beat — the form lifts and disperses.
 */
export type RibbonState = 'assembling' | 'idle' | 'liftoff';

/** Number of layered ribbons (4 lobes × N layers) that make up the butterfly. */
const RIBBON_COUNT = 16;

/** Seconds for the assemble (knot → butterfly) transition to complete. */
const ASSEMBLE_DURATION = 1.6;

function clamp01(v: number): number {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

/**
 * State machine driving the ribbon shader uniforms.
 *
 * The controller owns no rendering of its own — it only advances the uniforms
 * on the ribbon mesh's `ShaderMaterial` each frame:
 *   - `update(dt)` advances `uTime` (flutter) and progresses an in-flight
 *     `assemble()` toward completion.
 *   - `setScroll(p)` clamps to [0,1] and feeds `uSpread` (wings open as you scroll).
 *   - `setPointer(x,y)` feeds `uPointer` (cursor-magnetic pull, gated by uAssemble).
 *
 * `assemble()` returns a promise that resolves once `uAssemble` reaches 1, so the
 * preloader can fade out exactly when the butterfly has finished blooming.
 */
export class RibbonController {
  readonly mesh: THREE.Mesh;
  state: RibbonState = 'assembling';

  private uniforms: RibbonUniforms;
  private assembling = false;
  private assembleResolve: (() => void) | null = null;

  /**
   * @param mesh Optional pre-built ribbon mesh (the test injects a lightweight
   * fake). When omitted, the controller builds the real butterfly geometry.
   */
  constructor(mesh?: THREE.Mesh) {
    this.mesh = mesh ?? buildRibbons(butterflyFlightPaths(RIBBON_COUNT));
    this.uniforms = (this.mesh.material as THREE.ShaderMaterial)
      .uniforms as RibbonUniforms;
  }

  /** Cursor position in stage space; drives the magnetic pull uniform. */
  setPointer(x: number, y: number): void {
    this.uniforms.uPointer.value.set(x, y);
  }

  /** Scroll progress 0..1 (clamped) → wing spread. */
  setScroll(p01: number): void {
    this.uniforms.uSpread.value = clamp01(p01);
  }

  /** Advance flutter time and any in-flight assemble transition. */
  update(dt: number): void {
    this.uniforms.uTime.value += dt;

    if (this.assembling) {
      const next = Math.min(
        1,
        this.uniforms.uAssemble.value + dt / ASSEMBLE_DURATION,
      );
      this.uniforms.uAssemble.value = next;
      if (next >= 1) {
        this.assembling = false;
        this.state = 'idle';
        const resolve = this.assembleResolve;
        this.assembleResolve = null;
        resolve?.();
      }
    }
  }

  /**
   * Bloom the collapsed knot out into the full butterfly. Resolves once
   * `uAssemble` reaches 1 (driven frame-by-frame from `update`).
   */
  assemble(): Promise<void> {
    this.state = 'assembling';
    this.assembling = true;
    this.uniforms.uAssemble.value = 0;
    return new Promise<void>((resolve) => {
      this.assembleResolve = resolve;
    });
  }

  /** Enter the lift-off beat (CTA). */
  liftoff(): void {
    this.state = 'liftoff';
  }
}
