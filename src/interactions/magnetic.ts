/**
 * Magnetic pointer interactions.
 *
 * `magneticOffset` is the pure math shared by DOM CTAs (`magnetize`) and the
 * ribbon pointer: within `radius` of the element center the pointer "pulls" the
 * element toward itself with a linear falloff; outside the radius the offset is
 * zero.
 */

export interface Offset {
  x: number;
  y: number;
}

/**
 * Pure magnetic offset.
 *
 * @param px      pointer x
 * @param py      pointer y
 * @param cx      element center x
 * @param cy      element center y
 * @param radius  influence radius (px)
 * @param strength multiplier on the pull (1 = full)
 * @returns offset to apply to the element (zero outside the radius)
 */
export function magneticOffset(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number,
  strength: number,
): Offset {
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.hypot(dx, dy);
  if (dist >= radius || radius <= 0) return { x: 0, y: 0 };
  // Linear falloff: full pull at the center, zero at the radius edge.
  const falloff = (1 - dist / radius) * strength;
  return { x: dx * falloff, y: dy * falloff };
}

export interface MagnetizeOptions {
  strength?: number;
  radius?: number;
}

/**
 * Make a DOM element magnetic: it eases toward the pointer when the pointer is
 * within `radius` of its center, and returns to rest when the pointer leaves.
 *
 * @returns a cleanup function that removes listeners and resets the transform.
 */
export function magnetize(
  el: HTMLElement,
  opts: MagnetizeOptions = {},
): () => void {
  const strength = opts.strength ?? 0.4;
  const radius = opts.radius ?? 120;

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const { x, y } = magneticOffset(e.clientX, e.clientY, cx, cy, radius, strength);
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    el.style.transform = 'translate(0px, 0px)';
  };

  window.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return () => {
    window.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    el.style.transform = '';
  };
}
