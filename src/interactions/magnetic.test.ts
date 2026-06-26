import { describe, it, expect } from 'vitest';
import { magneticOffset } from './magnetic';
describe('magneticOffset', () => {
  it('is zero outside the radius', () => {
    expect(magneticOffset(100, 0, 0, 0, 50, 1)).toEqual({ x: 0, y: 0 });
  });
  it('pulls toward pointer within radius', () => {
    const o = magneticOffset(10, 0, 0, 0, 50, 1);
    expect(o.x).toBeGreaterThan(0);
    expect(o.y).toBe(0);
  });
});
