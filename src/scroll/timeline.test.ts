import { describe, it, expect } from 'vitest';
import { scrollProgress } from './timeline';

describe('scrollProgress', () => {
  it('is 0 at the top of the page', () => {
    expect(scrollProgress(0, 4000, 1000)).toBe(0);
  });

  it('is 1 at the bottom of the page', () => {
    // scrollable distance = docHeight - viewH = 3000
    expect(scrollProgress(3000, 4000, 1000)).toBe(1);
  });

  it('maps the midpoint to 0.5', () => {
    expect(scrollProgress(1500, 4000, 1000)).toBeCloseTo(0.5);
  });

  it('clamps below 0 and above 1', () => {
    expect(scrollProgress(-500, 4000, 1000)).toBe(0);
    expect(scrollProgress(99999, 4000, 1000)).toBe(1);
  });

  it('returns 0 when the document is not scrollable', () => {
    expect(scrollProgress(0, 1000, 1000)).toBe(0);
    expect(scrollProgress(50, 800, 1000)).toBe(0);
  });
});
