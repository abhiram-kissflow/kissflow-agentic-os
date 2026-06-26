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

1. **Genesis (hero)** — black brand stage. Brand-colored **ribbons of light** (blue-led, with
   magenta/orange/green) stream in and **trace a butterfly flight path**, fluttering and settling
   into an implied butterfly silhouette. The assembly doubles as the **preloader**; on completion
   the headline resolves: *"The Agentic OS for Business."* Ribbons are **cursor-magnetic**
   (mouse-follow) and react to scroll. No video — fully real-time WebGL. Primary CTA.
2. **The old way** — four disconnected fragments drift apart (visual nod to today's fragmentation). Tension.
3. **Metamorphosis** — scroll fuses the fragments into the butterfly. *"Four wings. One flight."*
4. **The four wings (interactive)** — hover/tap each wing; camera focuses, copy reveals:
   - Magenta — **Build** (enterprise-grade applications)
   - Blue — **Automate** (processes & operations)
   - Orange — **Agents** (AI agents that act)
   - Green — **Govern** (security & control)
5. **Proof / platform** — a glowing brand-recolored globe + a live product-dashboard mockup
   (Finlytic DNA) behind animated counters: 50+ Fortune 500 · 160+ countries · 1M+ users. Logos.
6. **Agentic, but governed** — trust beat: liquid-3D forms (Guardnet DNA), agents that act
   *securely*. Answers the enterprise objection.
7. **Take flight (CTA)** — ribbons lift off into the butterfly → book-a-demo link.

### Visual DNA (from motionsites.ai audit, recolored to Kissflow brand)
- **Hero ribbons** = blend of *Digitwist AI Builder* (deep blue depth, "Build Faster / AI agent")
  + *Synapse Dark Hero* (light-streak ribbons on black).
- **Platform/proof** = *Finlytic AI Agent* (globe + dashboard).
- **Govern** = *Guardnet* (liquid-metal 3D).

---

## 3. The butterfly system (real-time, no video)

The butterfly is **implied through motion**, not a literal mesh or a pre-rendered clip — ribbons of
brand-colored light flutter along a butterfly flight path. This is the out-of-the-box, interactive,
image/shader-driven approach (no Seedance, no video files).

### Hero ribbon system (three.js)
- GPU ribbon/curve geometry (or instanced particles along Bézier flight paths) in the four brand
  colors, blue-led. Flutter via a GLSL vertex shader (layered sines). UnrealBloom on black stage.
- **Cursor-magnetic:** ribbons bend toward the pointer (mouse-follow / magnetic effect, per the
  motionsites technique).
- **Scroll-driven:** ribbons spread, re-form, and lift across the 7 beats (GSAP ScrollTrigger).
- **Preloader:** the on-load assembly of the ribbons into the butterfly silhouette *is* the loader;
  fade to content on completion.

### Brand-law note
The locked logo mark (butterfly + wordmark) is never rotated, recolored, or distorted — it appears
only in nav/footer. The hero is an *expressive light-form inspired by* the mark, kept distinct.

### Fallback
- `prefers-reduced-motion` or low-power/no-WebGL → the brand's static black-butterfly hero image
  with a subtle CSS gradient drift.

---

## 4. Architecture (lean — karpathy guidelines)

**Stack:** Vite + TypeScript + three.js + GSAP/ScrollTrigger + postprocessing (UnrealBloom).
**No React** — single immersive page, YAGNI.

**Modules (each one job, independently testable):**
| Module | Responsibility | Depends on |
|---|---|---|
| `brand/` | Design tokens (color, type, spacing) — single source of truth | — |
| `ribbons/geometry.ts` | Ribbon/curve geometry along butterfly flight paths | three.js |
| `ribbons/shader/` | GLSL flutter (vertex) + brand-tint + bloom (fragment) | — |
| `ribbons/controller.ts` | State: assemble, idle-flutter, cursor-magnetic, scroll-spread, lift-off | geometry, shader |
| `preloader/` | Ribbon-assembly loader → fade to content | controller |
| `interactions/magnetic.ts` | Pointer-follow magnetic effect (ribbons + CTAs) | — |
| `scroll/timeline.ts` | ScrollTrigger choreography across the 7 beats | controller, sections |
| `sections/*` | DOM content per beat (copy, counters, wing UI, globe/dashboard, liquid-3D) | brand |
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
parallel stages — brand tokens · ribbon geometry+shader · magnetic interactions + preloader ·
scroll system · section content (globe/dashboard, liquid-3D) · eos copy — then an adversarial
verify/review pass, then assembly. User stays in the loop between phases.
`/hyperframes` is optional and used only if any stat sequence is better rendered as a motion
graphic; the page itself ships as live, interactive WebGL.

---

## 8. Success criteria

- 60fps ribbon hero on a mid-tier laptop.
- Hero ribbons assemble (preloader) → flutter → respond to cursor (magnetic) and scroll.
- Brand-exact colors and type; logo law respected.
- Lands exactly one category: Agentic OS (no low/no-code, no video).
- `prefers-reduced-motion` / no-WebGL fallback works.
- Runs locally with a single command.

---

## 9. Out of scope (YAGNI)

No CMS, backend, auth, multi-page, real booking (link only), i18n, or product-app integration.
Pure concept landing page.

---

## 10. Open dependencies

- **Graphik license** — deferred; Inter Tight used meanwhile.
- **Optional AI section imagery** — if the user later supplies Higgsfield/AI-generated 3D images
  for the globe/dashboard or liquid-3D beats, they drop in; otherwise those beats ship code-driven.
- No video / Seedance dependency.
