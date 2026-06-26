# Kissflow — The Agentic OS for Business

A single immersive, interactive landing page that positions **Kissflow** as the
Agentic OS for Business. The hero is a **real-time WebGL light-ribbon butterfly**
(three.js + GSAP) that assembles, flutters, follows the cursor, spreads on
scroll, and lifts off at the closing call to action. Seven scrolling DOM beats
are choreographed over the live canvas with GSAP ScrollTrigger.

No video. No React. The hero is rendered every frame on the GPU.

## Quick start

```bash
npm install
npm run dev      # Vite dev server — open the printed localhost URL
```

Requires **Node ≥ 20** (the repo pins Node 22 via `.nvmrc`). Package manager is
**npm**.

### Other commands

```bash
npm run test     # vitest — pure-logic unit checks (tokens, geometry, copy rules…)
npm run build    # tsc type-check + vite production build → dist/
```

## What's in the page

1. **Hero** — the category statement over the live ribbon butterfly.
2. **The old way** — work scattered across a dozen tools.
3. **Metamorphosis** — "Four wings. One flight."
4. **Four wings** — Build · Automate · Agents · Govern.
5. **Proof** — a brand-blue point-cloud globe behind an animated agent-activity
   dashboard (50+ Fortune 500 · 160+ countries · 1M+ users).
6. **Govern** — a liquid-3D blob (orange→blue brand gradient) for guardrails.
7. **Take flight** — the closing CTA that triggers the ribbon lift-off.

## Architecture

```
src/
├── brand/tokens.ts        # exact brand hex + weights + hexToVec3
├── capability.ts          # WebGL + reduced-motion detection
├── renderer.ts            # WebGLRenderer on #stage (DPR cap 2)
├── preloader/             # black overlay → ribbon-glow → fade out
├── ribbons/               # flight-path geometry + flutter/magnetic shader + controller
├── interactions/          # magnetic pointer utility (CTAs + ribbon pointer)
├── sections/              # the 7 beats + single-source COPY + visuals/
├── scroll/                # GSAP ScrollTrigger timeline binding ribbons ↔ beats
├── components/            # nav + footer chrome (locked logo)
├── styles/                # fonts.css + sections.css
└── main.ts                # boot: capability gate → renderer + bloom, or static fallback
```

## Accessibility & fallback

The page gates on capability before any WebGL boots. When the browser **cannot
render WebGL** or the visitor **prefers reduced motion**, `main.ts` renders a
static brand fallback hero (black-butterfly mark + headline) and skips the
animation entirely. The proof/govern visuals carry the same guard independently.

## Brand law

These rules are load-bearing and partly enforced by tests (`src/sections/copy.test.ts`):

- **Brand hex (exact):** blue `#1F80FF` · magenta `#CF2C91` · orange `#F58220` ·
  green `#4AA147` · black `#000000`. Stage is black; type is white.
- **Category:** "Agentic OS for Business." The words **"low-code"** and
  **"no-code"** never appear.
- **Brand name:** always "Kissflow" — capital K, never all-caps, never italics.
- **Logo:** the locked butterfly + wordmark lockup appears **only in the nav and
  footer** (`src/components/`). It is rendered as a plain `<img>` at its native
  aspect ratio and is never recolored, rotated, or distorted. The expressive
  ribbon hero is a **distinct** light-form, not the logo.

Brand assets live in `public/brand/` (copied from the Kissflow Web Kit). The
horizontal **white** lockup is used for nav/footer on the black stage.

## Swap paths

### Fonts — Inter Tight → licensed Graphik

All type is set in **Inter Tight**, the open-source stand-in for the licensed
**Graphik** used in production. The CSS variable in `src/styles/fonts.css`
already names Graphik first:

```css
--kf-font: 'Graphik', 'Inter Tight', system-ui, sans-serif;
```

To switch: self-host the Graphik `.woff2` files, drop the `@font-face` block
documented in `fonts.css`, and remove the Google Fonts `@import`. Every surface
picks up Graphik automatically.

### Proof / Govern visuals — live effect → AI art

`mountGlobe`, `mountDashboard`, and `mountLiquid` (`src/sections/visuals/`) each
accept an optional `{ imageUrl }`. Pass a URL to swap the live three.js / DOM
effect for user-supplied AI art — the seam is already wired:

```ts
mountGlobe(el, { imageUrl: '/brand/ai/globe.png' });
```

## Tech stack

Vite · TypeScript · three.js · GSAP + ScrollTrigger · postprocessing
(UnrealBloom) · vitest.
