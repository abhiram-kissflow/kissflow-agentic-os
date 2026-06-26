import { describe, it, expect } from 'vitest';
import { prefersReducedMotion } from './capability';
describe('capability', () => {
  it('reduced-motion defaults false when matchMedia absent', () => {
    const orig = globalThis.matchMedia; // @ts-expect-error
    globalThis.matchMedia = undefined;
    expect(prefersReducedMotion()).toBe(false);
    globalThis.matchMedia = orig;
  });
});
