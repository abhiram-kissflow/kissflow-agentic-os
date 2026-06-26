import '../styles/sections.css';

import { mountHero } from './hero';
import { mountOldway } from './oldway';
import { mountMetamorphosis } from './metamorphosis';
import { mountWings } from './wings';
import { mountProof } from './proof';
import { mountGovern } from './govern';
import { mountCta } from './cta';

export { COPY } from './copy';
export type { Copy, WingItem } from './copy';

/**
 * Scroll anchors for the seven beats, returned by `mountSections`. The scroll
 * timeline (Task 7) consumes these to pin the hero, fuse fragments at the
 * metamorphosis beat, focus a wing on `wing:focus`, and trigger lift-off at the
 * CTA. `wingTargets` are the four hover/focus cards in brand order.
 */
export interface SectionRefs {
  hero: HTMLElement;
  oldway: HTMLElement;
  metamorphosis: HTMLElement;
  wings: HTMLElement;
  proof: HTMLElement;
  govern: HTMLElement;
  cta: HTMLElement;
  wingTargets: HTMLElement[];
}

/**
 * Build all seven section beats and append them to `root` in scroll order.
 * Returns the per-beat anchors for the scroll timeline.
 */
export function mountSections(root: HTMLElement): SectionRefs {
  const hero = mountHero();
  const oldway = mountOldway();
  const metamorphosis = mountMetamorphosis();
  const wings = mountWings();
  const proof = mountProof();
  const govern = mountGovern();
  const cta = mountCta();

  root.append(
    hero,
    oldway,
    metamorphosis,
    wings.section,
    proof,
    govern,
    cta,
  );

  return {
    hero,
    oldway,
    metamorphosis,
    wings: wings.section,
    proof,
    govern,
    cta,
    wingTargets: wings.targets,
  };
}
