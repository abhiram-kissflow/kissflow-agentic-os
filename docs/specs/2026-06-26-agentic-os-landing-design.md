# Kissflow Agentic OS — Landing Page Design Spec

**Date:** 2026-06-26
**Status:** Approved design, pending implementation plan
**Output:** Standalone prototype repo (`~/Documents/kissflow-agentic-os`)

---

## 1. Goal

A single immersive landing page that pitches Kissflow's rebrand:

> **Kissflow — the Agentic OS for Business. Build enterprise-grade applications, securely.**

It exists to demonstrate a new visual + narrative direction (concept pitch), not to ship to
production. Success = a runnable, on-brand, technically impressive page that lands **one** clear
category (Agentic OS) and showcases a signature fluttering 3D butterfly.

### Why this design (context)
A knowledge-graph analysis of the current kissflow.com surfaced one dominant blind spot:
**category confusion** — the site fractured into four competing positionings instead of one. This
design turns that flaw into the hero metaphor: the butterfly's **four wings = four capabilities of
one operating system**. Spine line: *"Four wings. One flight."* The Agentic OS rebrand retires the
old low-code/no-code framing entirely — it is never used as a category or label anywhere on the page.

---

## 2. Narrative (single page, 7 scroll beats)

1. **Genesis (hero)** — black brand stage. Seedance cinematic clip of a butterfly coalescing
   from glowing brand-color particles, fluttering, then cross-dissolving into the **live three.js
   butterfly**. Headline resolves: *"The Agentic OS for Business."* Primary CTA. Cursor-reactive.
2. **The old way** — four disconnected fragments drift apart (visual nod to today's fragmentation). Tension.
3. **Metamorphosis** — scroll fuses the fragments into the butterfly. *"Four wings. One flight."*
4. **The four wings (interactive)** — hover/tap each wing; camera focuses, copy reveals:
   - Magenta — **Build** (enterprise-grade applications)
   - Blue — **Automate** (processes & operations)
   - Orange — **Agents** (AI agents that act)
   - Green — **Govern** (security & control)
5. **Proof** — animated counters: 50+ Fortune 500 · 160+ countries · 1M+ users. Customer logos.
6. **Agentic, but governed** — trust beat: agents that act *securely*. Answers the enterprise objection.
7. **Take flight (CTA)** — butterfly lifts off → book-a-demo link.

---

## 3. The butterfly system (hybrid)

### Intro — Seedance video
- I author a production-ready Seedance prompt. User generates the clip externally and hands the
  file back.
- I conform it with **`/video-use`**: trim, color-match to exact brand hex, 16:9, clean loop point.
- Titles / framing motion-graphics via **`/hyperframes`** (HTML → video) where needed.

### Live — three.js procedural butterfly
- Two wing meshes echoing the 4-petal mark **as a creature** — deliberately distinct from the
  locked logo (brand law: the logo mark may not be rotated/recolored/distorted).
- GLSL vertex shader: wing-flap (sine) + flight-bob. Mouse parallax. Scroll-driven camera +
  wing-spread. Brand-color particle trail. UnrealBloom on black stage.

### Handoff
- Seedance clip plays on a fullscreen plane, cross-dissolves to the WebGL butterfly at a matched pose.

### Fallback
- `prefers-reduced-motion` or low-power/no-WebGL → the brand's static black-butterfly hero image.

---

## 4. Architecture (lean — karpathy guidelines)

**Stack:** Vite + TypeScript + three.js + GSAP/ScrollTrigger + postprocessing (UnrealBloom).
**No React** — single immersive page, YAGNI.

**Modules (each one job, independently testable):**
| Module | Responsibility | Depends on |
|---|---|---|
| `brand/` | Design tokens (color, type, spacing) — single source of truth | — |
| `butterfly/geometry.ts` | Wing mesh construction | three.js |
| `butterfly/shader/` | GLSL flutter (vertex) + brand-tint (fragment) | — |
| `butterfly/controller.ts` | State: idle, cursor-track, scroll-spread, take-off | geometry, shader |
| `video/intro.ts` | Seedance plane + cross-dissolve handoff to WebGL | controller |
| `scroll/timeline.ts` | ScrollTrigger choreography across the 7 beats | controller, sections |
| `sections/*` | DOM content per beat (copy, counters, wing UI) | brand |
| `main.ts` | Compose: renderer, scene, loop, fallback gate | all |

Static deploy. Runs locally with one command (`npm run dev`).

---

## 5. Brand system (exact, from Brand Guideline PDF)

- **Colors:** Blue `#1F80FF` + Magenta `#CF2C91` primary (40/30 weighting); Orange `#F58220` /
  Green `#4AA147` accents (15/15); Black `#000000` stage; white type.
- **Type:** Graphik is licensed/paid → **substitute Inter Tight** for the prototype (near-identical
  grotesque), with a documented swap path to licensed Graphik. No italics. "Kissflow" capital-K.
- **Logo:** locked butterfly+wordmark used correctly in nav/footer only; the hero creature is the
  expressive, separate butterfly.

---

## 6. Copy

Tight, concrete, declarative. **`/eos-style`** pass on every headline. One category (Agentic OS),
no buzzword soup, no four-way positioning.

---

## 7. Build orchestration (Workflow)

After this spec + the implementation plan are approved, the build runs as a **Workflow**:
parallel stages — brand tokens · butterfly geometry+shader · scroll system · section content ·
eos copy · video integration — then an adversarial verify/review pass, then assembly. User stays
in the loop between phases.

---

## 8. Success criteria

- 60fps butterfly on a mid-tier laptop.
- Seamless Seedance → WebGL handoff.
- Brand-exact colors and type; logo law respected.
- Lands exactly one category: Agentic OS.
- `prefers-reduced-motion` / no-WebGL fallback works.
- Runs locally with a single command.

---

## 9. Out of scope (YAGNI)

No CMS, backend, auth, multi-page, real booking (link only), i18n, or product-app integration.
Pure concept landing page.

---

## 10. Open dependencies

- **Seedance clip** — user-generated from the prompt I provide; build proceeds with a placeholder
  video until delivered.
- **Graphik license** — deferred; Inter Tight used meanwhile.
