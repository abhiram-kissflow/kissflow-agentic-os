import { describe, it, expect } from 'vitest';
import { BRAND, WEIGHTS, hexToVec3 } from './tokens';

describe('brand tokens', () => {
  it('exposes exact brand hexes', () => {
    expect(BRAND.blue).toBe('#1F80FF');
    expect(BRAND.magenta).toBe('#CF2C91');
  });
  it('weights sum to 1', () => {
    const sum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1);
  });
  it('hexToVec3 maps black to 0 and white-ish channels to ~1', () => {
    expect(hexToVec3('#000000')).toEqual([0, 0, 0]);
    expect(hexToVec3('#1F80FF')[2]).toBeCloseTo(1, 1);
  });
});
