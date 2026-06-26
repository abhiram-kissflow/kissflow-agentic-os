import { describe, it, expect } from 'vitest';
import { COPY } from './copy';
const all = JSON.stringify(COPY).toLowerCase();
describe('copy rules', () => {
  it('never uses the prohibited build-tier labels', () => {
    expect(all).not.toMatch(/low.?code|no.?code/);
  });
  it('uses the Agentic OS category and capital-K Kissflow', () => {
    expect(JSON.stringify(COPY)).toMatch(/Agentic OS/);
    expect(JSON.stringify(COPY)).not.toMatch(/KISSFLOW|kissflow[^.]/);
  });
});
