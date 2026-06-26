import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RibbonController } from '../ribbons/controller';
import type { SectionRefs } from '../sections';

/**
 * Pure scroll-progress mapping: vertical scroll position → 0..1 over the full
 * scrollable distance (`docHeight - viewH`), clamped to [0, 1]. Returns 0 when
 * the page is not scrollable (content shorter than the viewport).
 *
 * Kept pure and separate from the GSAP wiring so the mapping is unit-testable
 * without a DOM (see `timeline.test.ts`).
 */
export function scrollProgress(
  scrollY: number,
  docHeight: number,
  viewH: number,
): number {
  const scrollable = docHeight - viewH;
  if (scrollable <= 0) return 0;
  const p = scrollY / scrollable;
  if (p < 0) return 0;
  if (p > 1) return 1;
  return p;
}

/**
 * Stage-space pointer targets for each wing card, in `COPY.wings.items` order
 * (build · automate · agents · govern). Each pulls the ribbon toward the lobe
 * that lives in that brand color's quadrant — magenta TL, blue TR, orange BL,
 * green BR — so hovering a wing "focuses" its ribbon (via the magnetic pointer).
 */
const WING_POINTER_TARGETS: ReadonlyArray<readonly [number, number]> = [
  [1.6, 1.6], // build    → blue    (top-right)
  [-1.6, 1.6], // automate → magenta (top-left)
  [-1.6, -1.6], // agents   → orange  (bottom-left)
  [1.6, -1.6], // govern   → green   (bottom-right)
];

/**
 * Bind the ribbon hero to the seven DOM section beats via GSAP ScrollTrigger.
 *
 * - Whole-page scroll progress drives `controller.setScroll` (wings open as you
 *   descend).
 * - The hero is pinned while the butterfly holds frame.
 * - The metamorphosis beat fuses its scattered fragments into the form as it
 *   scrubs into view.
 * - A `wing:focus` event (emitted by the four-wings cards) nudges the magnetic
 *   pointer toward that lobe, focusing the matching ribbon.
 * - Reaching the CTA triggers `controller.liftoff()`.
 */
export function initTimeline(
  controller: RibbonController,
  refs: SectionRefs,
): void {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Whole-page scroll → wing spread.
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => controller.setScroll(self.progress),
  });

  // 2. The ribbon butterfly lives on the fixed #stage canvas, so it already
  // persists behind every section as you scroll — no DOM pin needed. (Pinning
  // the hero with pinSpacing:false collapsed the flow and stacked the sections.)

  // 3. Fuse the scattered fragments into the form at the metamorphosis beat.
  // Prefer explicit `.kf-fragment` shards, then the inner content blocks, then
  // the whole section — so the beat always has something to fuse into view.
  const fragments = Array.from(
    refs.metamorphosis.querySelectorAll<HTMLElement>(
      '.kf-fragment, .kf-section__inner > *',
    ),
  );
  const fuseTargets = fragments.length > 0 ? fragments : [refs.metamorphosis];
  gsap.fromTo(
    fuseTargets,
    { opacity: 0, y: 48, filter: 'blur(8px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: refs.metamorphosis,
        start: 'top 80%',
        end: 'center center',
        scrub: true,
      },
    },
  );

  // 4. Focus a ribbon lobe when a wing card is hovered or focused.
  refs.wings.addEventListener('wing:focus', (event) => {
    const { index } = (event as CustomEvent<{ index: number; key: string }>)
      .detail;
    const target = WING_POINTER_TARGETS[index] ?? ([0, 0] as const);
    controller.setPointer(target[0], target[1]);
  });

  // 5. Lift-off at the CTA beat.
  ScrollTrigger.create({
    trigger: refs.cta,
    start: 'top center',
    onEnter: () => controller.liftoff(),
  });
}
