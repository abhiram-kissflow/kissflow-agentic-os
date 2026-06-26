# Kissflow Agentic OS Landing — Implementation Plan

> **For agentic workers:** This plan is executed by a **Workflow** (parallel stages + adversarial
> verify). Steps use checkbox (`- [ ]`) syntax. Each task ends with an independently verifiable
> deliverable (type-check, build, or a vitest assertion).

**Goal:** A single immersive, interactive landing page positioning Kissflow as "the Agentic OS for
Business," with a real-time brand light-ribbon butterfly hero.

**Architecture:** Vite + TypeScript single page. three.js renders a GPU ribbon system that traces a
butterfly flight path (assemble → flutter → cursor-magnetic → scroll-spread → lift-off). GSAP
ScrollTrigger choreographs 7 DOM section beats over the WebGL canvas. No React, no video.

**Tech Stack:** Vite, TypeScript, three.js, GSAP + ScrollTrigger, postprocessing (UnrealBloom),
vitest (unit checks). Inter Tight (Graphik substitute).

## Global Constraints

- **Brand colors (exact hex):** Blue `#1F80FF` · Magenta `#CF2C91` · Orange `#F58220` · Green
  `#4AA147` · Black `#000000`. Weighting blue 40 / magenta 30 / orange 15 / green 15. Black stage, white type.
- **Category:** "Agentic OS for Business." Never use "low-code" or "no-code" anywhere.
- **No video.** Hero is real-time WebGL only.
- **Logo law:** locked butterfly+wordmark used only in nav/footer, never rotated/recolored/distorted.
  Hero light-form is expressive and distinct from the logo.
- **Brand name:** always "Kissflow" (capital K, no all-caps, no italics).
- **Font:** Inter Tight for all type; documented swap path to licensed Graphik.
- **Perf:** target 60fps on a mid-tier laptop; `prefers-reduced-motion` / no-WebGL → static fallback.
- **Node:** ≥ 20. Package manager: npm. One-command dev: `npm run dev`.

---

### Task 1: Project scaffold + brand tokens

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.ts`
- Create: `src/brand/tokens.ts`
- Create: `vitest.config.ts`, `src/brand/tokens.test.ts`

**Interfaces:**
- Produces: `BRAND` — `{ blue:'#1F80FF', magenta:'#CF2C91', orange:'#F58220', green:'#4AA147', black:'#000000' }`;
  `BRAND_ORDER: readonly (keyof typeof BRAND)[]` = `['blue','magenta','orange','green']`;
  `WEIGHTS: Record<'blue'|'magenta'|'orange'|'green', number>` = `{blue:.4,magenta:.3,orange:.15,green:.15}`;
  `hexToVec3(hex:string): [number,number,number]` (0–1 linear-ish, simple /255).

- [ ] **Step 1: Init project + deps**

```bash
cd ~/Documents/kissflow-agentic-os
npm init -y
npm i three gsap
npm i -D vite typescript @types/three vitest
```

- [ ] **Step 2: Write `src/brand/tokens.ts`**

```ts
export const BRAND = {
  blue: '#1F80FF', magenta: '#CF2C91', orange: '#F58220',
  green: '#4AA147', black: '#000000',
} as const;

export const BRAND_ORDER = ['blue', 'magenta', 'orange', 'green'] as const;
export const WEIGHTS = { blue: 0.4, magenta: 0.3, orange: 0.15, green: 0.15 } as const;

export function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}
```

- [ ] **Step 3: Write `src/brand/tokens.test.ts`**

```ts
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
```

- [ ] **Step 4: Minimal `index.html` + `src/main.ts` (black stage, canvas mount)**

```html
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kissflow — The Agentic OS for Business</title>
<style>html,body{margin:0;background:#000;color:#fff;font-family:'Inter Tight',system-ui,sans-serif}</style>
</head><body><canvas id="stage"></canvas><main id="app"></main>
<script type="module" src="/src/main.ts"></script></body></html>
```

```ts
// src/main.ts
import { BRAND } from './brand/tokens';
document.body.style.background = BRAND.black;
console.log('Kissflow Agentic OS — stage ready');
```

- [ ] **Step 5: Add scripts to `package.json`** (`"dev":"vite"`, `"build":"tsc && vite build"`, `"test":"vitest run"`), then verify

Run: `npm run test && npm run build`
Expected: tests PASS; build succeeds, `dist/` produced.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold Vite+TS+three project with brand tokens"
```

---

### Task 2: App shell, preloader, fallback gate

**Files:**
- Create: `src/main.ts` (replace), `src/renderer.ts`, `src/preloader/index.ts`, `src/capability.ts`
- Create: `src/capability.test.ts`

**Interfaces:**
- Consumes: `BRAND` from Task 1.
- Produces: `canRenderWebGL(): boolean`; `prefersReducedMotion(): boolean`;
  `createRenderer(canvas): THREE.WebGLRenderer`; `Preloader` with `start()` and `done(): Promise<void>`.

- [ ] **Step 1: Write `src/capability.ts`**

```ts
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
export function canRenderWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}
```

- [ ] **Step 2: Write `src/capability.test.ts`** (pure-logic guard)

```ts
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
```

- [ ] **Step 3: Implement `src/renderer.ts`** (WebGLRenderer on `#stage`, DPR cap 2, resize handler, black clear).
- [ ] **Step 4: Implement `src/preloader/index.ts`** — full-screen black overlay with a centered ribbon-glow CSS animation; `done()` resolves after the hero signals ready, then fades the overlay out (300ms) and removes it.
- [ ] **Step 5: Rewrite `src/main.ts`** to: gate on `canRenderWebGL()` — if false OR `prefersReducedMotion()`, render the **static fallback** (brand black-butterfly hero image + headline) and skip WebGL. Otherwise boot renderer + preloader.
- [ ] **Step 6: Verify**

Run: `npm run test && npm run build`
Expected: PASS + build OK.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: app shell, preloader, WebGL/reduced-motion fallback gate"
```

---

### Task 3: Ribbon geometry + flutter shader (hero core)

**Files:**
- Create: `src/ribbons/geometry.ts`, `src/ribbons/shader/ribbon.vert.glsl`, `src/ribbons/shader/ribbon.frag.glsl`
- Create: `src/ribbons/flightpath.ts`, `src/ribbons/flightpath.test.ts`

**Interfaces:**
- Consumes: `BRAND`, `BRAND_ORDER`, `hexToVec3`.
- Produces: `butterflyFlightPaths(count:number): THREE.CurvePath<THREE.Vector3>[]` — N Bézier curves
  whose envelope reads as a 4-lobe butterfly silhouette (one lobe per brand color); pure + deterministic.
  `buildRibbons(paths): THREE.Mesh` — tube/ribbon geometry with the flutter ShaderMaterial,
  uniforms `{ uTime, uPointer:vec2, uAssemble:0..1, uSpread:0..1, uColor:vec3[4] }`.

- [ ] **Step 1: Write `src/ribbons/flightpath.test.ts`** (deterministic geometry math)

```ts
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
```

- [ ] **Step 2: Run test → FAIL** (`butterflyFlightPaths` not defined).
- [ ] **Step 3: Implement `src/ribbons/flightpath.ts`** — deterministic CubicBezierCurve3 lobes
  (quadrant-aligned to magenta TL / blue TR / orange BL / green BR), parameterized by `count`.
- [ ] **Step 4: Run test → PASS.**
- [ ] **Step 5: Write GLSL** — vertex: layered-sine flutter along the tube + pointer-magnetic
  displacement (`uPointer`, `uAssemble`, `uSpread`); fragment: per-lobe brand color + soft additive
  glow (bloom-friendly). Wire `buildRibbons` in `geometry.ts` with `THREE.ShaderMaterial`,
  `transparent`, `AdditiveBlending`.
- [ ] **Step 6: Verify** `npm run test && npm run build` → PASS + build OK.
- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: ribbon flight-path geometry + flutter/magnetic shader"
```

---

### Task 4: Ribbon controller (states) + bloom

**Files:**
- Create: `src/ribbons/controller.ts`, `src/ribbons/controller.test.ts`
- Modify: `src/main.ts` (instantiate controller, render loop, post-processing)

**Interfaces:**
- Consumes: `buildRibbons`, `butterflyFlightPaths`.
- Produces: `RibbonController` with `mesh:THREE.Mesh`; `setPointer(x:number,y:number)`;
  `setScroll(p01:number)`; `update(dt:number)`; `state: 'assembling'|'idle'|'liftoff'`;
  `assemble(): Promise<void>` (drives `uAssemble` 0→1, resolves when complete).

- [ ] **Step 1: Write `controller.test.ts`** — assert `setScroll` clamps to [0,1] and maps to `uSpread`;
  `assemble()` resolves and leaves `uAssemble===1`; `update` advances `uTime`. (Use a fake mesh with a
  `material.uniforms` stub; logic is pure.)
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement `controller.ts`** (state machine over the shader uniforms; uses a small lerp helper).
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Wire into `main.ts`** — EffectComposer + UnrealBloomPass on the black stage; render loop
  calls `controller.update(dt)`; `pointermove` → `controller.setPointer`; on boot run
  `controller.assemble()` then `preloader.done()`.
- [ ] **Step 6: Verify** `npm run test && npm run build` → PASS + build OK.
- [ ] **Step 7: Commit** `git commit -m "feat: ribbon controller state machine + bloom, wired to loop"`

---

### Task 5: Magnetic interactions utility

**Files:**
- Create: `src/interactions/magnetic.ts`, `src/interactions/magnetic.test.ts`

**Interfaces:**
- Produces: `magnetize(el:HTMLElement, opts?:{strength?:number, radius?:number}): ()=>void`
  (returns cleanup); `magneticOffset(px:number,py:number,cx:number,cy:number,radius:number,strength:number): {x:number,y:number}`
  (pure math used by both DOM CTAs and the ribbon pointer).

- [ ] **Step 1: Write `magnetic.test.ts`**

```ts
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
```

- [ ] **Step 2: Run → FAIL.** **Step 3: Implement** (linear falloff inside radius). **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `git commit -m "feat: magnetic pointer interaction utility"`

---

### Task 6: Section content + copy (eos-style)

**Files:**
- Create: `src/sections/index.ts` and one module per beat:
  `hero.ts`, `oldway.ts`, `metamorphosis.ts`, `wings.ts`, `proof.ts`, `govern.ts`, `cta.ts`
- Create: `src/sections/copy.ts`, `src/sections/copy.test.ts`
- Create: `src/styles/sections.css`

**Interfaces:**
- Consumes: `BRAND`, `magnetize`.
- Produces: `mountSections(root:HTMLElement): SectionRefs` (returns scroll anchors per beat);
  `COPY` — typed object of all headline/body strings (single source for the eos pass).

- [ ] **Step 1: Write `copy.test.ts`** — assert brand/category rules in copy:

```ts
import { describe, it, expect } from 'vitest';
import { COPY } from './copy';
const all = JSON.stringify(COPY).toLowerCase();
describe('copy rules', () => {
  it('never says low-code or no-code', () => {
    expect(all).not.toMatch(/low.?code|no.?code/);
  });
  it('uses the Agentic OS category and capital-K Kissflow', () => {
    expect(JSON.stringify(COPY)).toMatch(/Agentic OS/);
    expect(JSON.stringify(COPY)).not.toMatch(/KISSFLOW|kissflow[^.]/);
  });
});
```

- [ ] **Step 2: Run → FAIL** (no `copy.ts`).
- [ ] **Step 3: Write `copy.ts`** — final eos-reviewed strings. Hero: `"The Agentic OS for Business."`
  / sub `"Build enterprise-grade applications. Run by agents. Governed by design."`; old-way, metamorphosis
  (`"Four wings. One flight."`), four wings (Build/Automate/Agents/Govern), proof counters
  (50+ Fortune 500 · 160+ countries · 1M+ users), govern, CTA (`"Take flight"` → book a demo).
- [ ] **Step 4: Implement each `sections/*.ts`** — semantic DOM, black-stage layout, big Inter Tight type,
  scroll anchors; CTAs wrapped with `magnetize`. Four-wings beat exposes 4 hover targets that emit
  `wing:focus` events (consumed by the timeline in Task 7).
- [ ] **Step 5: Run → PASS** + `npm run build`.
- [ ] **Step 6: Commit** `git commit -m "feat: 7 section beats + eos-reviewed copy"`

---

### Task 7: Scroll timeline (ScrollTrigger) tying ribbons ↔ sections

**Files:**
- Create: `src/scroll/timeline.ts`, `src/scroll/timeline.test.ts`
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `RibbonController`, `SectionRefs`.
- Produces: `initTimeline(controller, refs): void` — maps scroll progress to `controller.setScroll`,
  pins the hero, fuses fragments at the metamorphosis beat, focuses a wing on `wing:focus`,
  triggers `liftoff` at the CTA. `scrollProgress(scrollY, docHeight, viewH): number` (pure, 0–1).

- [ ] **Step 1: Write `timeline.test.ts`** for `scrollProgress` (0 at top, 1 at bottom, clamped).
- [ ] **Step 2: Run → FAIL. Step 3: Implement. Step 4: Run → PASS.**
- [ ] **Step 5: Wire GSAP ScrollTrigger** in `timeline.ts`; call `initTimeline` from `main.ts`.
- [ ] **Step 6: Verify** `npm run build` + manual: `npm run dev`, scroll through all 7 beats.
- [ ] **Step 7: Commit** `git commit -m "feat: scroll timeline binding ribbons to section beats"`

---

### Task 8: Proof (globe + dashboard) and Govern (liquid-3D) visuals

**Files:**
- Create: `src/sections/visuals/globe.ts`, `src/sections/visuals/dashboard.ts`, `src/sections/visuals/liquid.ts`
- Modify: `src/sections/proof.ts`, `src/sections/govern.ts`

**Interfaces:**
- Consumes: `BRAND`. Produces: `mountGlobe(el)`, `mountDashboard(el)`, `mountLiquid(el)` — each a
  self-contained mini three.js scene or CSS/canvas effect, brand-recolored (Finlytic globe+dashboard,
  Guardnet liquid-metal). Each accepts an optional `imageUrl` to swap in user-supplied AI art later.

- [ ] **Step 1: Implement `globe.ts`** — dotted/point-cloud globe in brand blue with magenta rim glow.
- [ ] **Step 2: Implement `dashboard.ts`** — CSS/DOM "Agent activity" dashboard mock (rows, status pills in brand colors), animated counters.
- [ ] **Step 3: Implement `liquid.ts`** — metaball/displacement blob shader, orange→blue brand gradient, slow drift.
- [ ] **Step 4: Mount into `proof.ts` / `govern.ts`; guard each with the reduced-motion fallback (static brand panel).**
- [ ] **Step 5: Verify** `npm run build` + `npm run dev` visual check.
- [ ] **Step 6: Commit** `git commit -m "feat: globe+dashboard proof and liquid-3D govern visuals"`

---

### Task 9: Brand chrome, fonts, README, final verify

**Files:**
- Create: `src/styles/fonts.css` (Inter Tight via @fontsource or CDN; documented Graphik swap),
  `src/components/nav.ts`, `src/components/footer.ts`, `README.md`
- Add: brand logo assets copied from the kit into `public/brand/`

**Interfaces:**
- Consumes: `BRAND`. Produces: `mountNav(root)`, `mountFooter(root)` — locked logo used correctly.

- [ ] **Step 1: Copy logos** from `~/Documents/Complete_Kissflow_Kit-1/Web-Kit/PNG/` into `public/brand/`
  (horizontal white for nav on black). Add the static black-butterfly hero image for the fallback.
- [ ] **Step 2: Implement `fonts.css`** (Inter Tight 400/500/600/700) + nav/footer with the locked logo.
- [ ] **Step 3: Write `README.md`** — what it is, `npm i && npm run dev`, the Graphik/AI-image swap notes, brand-law note.
- [ ] **Step 4: Final verify**

Run: `npm run test && npm run build && npm run dev`
Expected: all tests PASS; build OK; page loads — preloader → ribbon butterfly assembles → flutter →
cursor-magnetic → scroll through 7 beats → lift-off CTA. Reduced-motion shows static fallback.

- [ ] **Step 5: Commit** `git commit -m "feat: brand chrome, fonts, fallback assets, README"`

---

## Self-Review (coverage)

- Spec §2 (7 beats) → Tasks 6, 7, 8. §3 (ribbon system, preloader, fallback) → Tasks 2,3,4.
  §4 (modules) → Tasks 1–9 mirror the module table. §5 (brand) → Tasks 1, 9. §6 (copy/eos) → Task 6.
  §8 (success criteria) → Task 9 final verify. §9 (YAGNI) → no backend/CMS/auth tasks present.
- No "low-code/no-code" — enforced by `copy.test.ts`. No video — no video task exists.
- Type names consistent across tasks (`RibbonController`, `SectionRefs`, `butterflyFlightPaths`,
  `magneticOffset`, `mountSections`, `COPY`).
