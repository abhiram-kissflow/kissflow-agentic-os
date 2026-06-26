import { describe, it, expect } from 'vitest';
import { butterflyFlightPaths } from './flightpath';
describe('butterfly flight paths', () => {
  it('returns one path per brand color lobe', () => {
    expect(butterflyFlightPaths(4)).toHaveLength(4);
  });
  it('is deterministic (no Math.random)', () => {
    const a = butterflyFlightPaths(4)[0].getPointAt(0.5);
    const b = butterflyFlightPaths(4)[0].getPointAt(0.5);
    expect(a.equals(b)).toBe(true);
  });
  it('silhouette spans all four quadrants', () => {
    const pts = butterflyFlightPaths(4).map(p => p.getPointAt(0.5));
    expect(pts.some(v => v.x < 0 && v.y > 0)).toBe(true); // magenta TL
    expect(pts.some(v => v.x > 0 && v.y > 0)).toBe(true); // blue TR
    expect(pts.some(v => v.x < 0 && v.y < 0)).toBe(true); // orange BL
    expect(pts.some(v => v.x > 0 && v.y < 0)).toBe(true); // green BR
  });
});
