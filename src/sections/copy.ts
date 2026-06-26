/**
 * Single source of truth for every headline and body string on the page.
 *
 * This is the surface the eos (Elements of Style) pass operates on: prose is
 * tight, vigorous, and concrete — short sentences, active voice, no hedging.
 *
 * Brand law enforced by `copy.test.ts`:
 *  - never the two prohibited build-tier labels (the test regex is the source
 *    of truth for which words are banned);
 *  - the category is "Agentic OS for Business";
 *  - the brand name is always "Kissflow" (capital K, never all-caps).
 */
export const COPY = {
  hero: {
    headline: 'The Agentic OS for Business.',
    sub: 'Build enterprise-grade applications. Run by agents. Governed by design.',
    cta: 'Take flight',
  },

  oldway: {
    eyebrow: 'The old way',
    headline: 'Work scatters across a dozen tools.',
    body: 'Forms in one place. Approvals in another. Data everywhere else. Teams patch the gaps by hand, and the work never quite holds together.',
  },

  metamorphosis: {
    eyebrow: 'The shift',
    headline: 'Four wings. One flight.',
    body: 'A platform of fixed rules and forms becomes one that reasons. Inject orchestration, memory, and language models, and structured work takes flight as an autonomous system.',
    before: 'Traditional BPM',
    beforeSub: 'Fixed rules & forms',
    inject: 'Orchestration · Memory · Reasoning',
    after: 'Agentic OS',
    afterSub: 'Autonomous goal-seeking',
  },

  advantage: {
    eyebrow: 'The unfair advantage',
    headline: 'An OS needs a body. The platform already built it.',
    body: 'A raw model can think. It cannot act safely inside an enterprise. Kissflow can — because the hard parts already exist.',
    items: [
      {
        title: 'Guardrails',
        body: 'A rules engine keeps every agent inside policy, compliance, and approval. Deterministic where it must be.',
      },
      {
        title: 'Pipes',
        body: 'Secure connectors to your ERPs, CRMs, and databases. Agents that reach real data instead of working blind.',
      },
      {
        title: 'Context',
        body: 'Schemas, roles, forms, and process maps give an agent situational awareness a bare model never has.',
      },
    ],
  },

  wings: {
    headline: 'Four shifts. One operating system.',
    items: [
      {
        key: 'orchestrate',
        title: 'Orchestrate',
        body: 'State the goal — "onboard this supplier." The OS reasons out the steps and builds the path on the fly, instead of waiting for a fixed route.',
      },
      {
        key: 'reason',
        title: 'Reason',
        body: 'The rules engine still enforces policy. A language layer reads the unstructured contract and decides: auto-approve, or route for review.',
      },
      {
        key: 'act',
        title: 'Act',
        body: 'Forms and APIs become agent tools. What a person filled in by hand, an agent now reads, writes, and runs end to end.',
      },
      {
        key: 'remember',
        title: 'Remember',
        body: 'A semantic memory recalls how the last dispute or bottleneck was resolved — months later, in full context.',
      },
    ],
  },

  proof: {
    eyebrow: 'Proof',
    headline: 'Trusted where the stakes are real.',
    stats: [
      { value: '50+', label: 'Fortune 500 companies' },
      { value: '160+', label: 'countries' },
      { value: '1M+', label: 'users at work' },
    ],
  },

  govern: {
    eyebrow: 'Govern',
    headline: 'Deterministic where it matters. Agentic where it pays.',
    body: 'Finance, payroll, and compliance run on rules you can audit. Support routing, data extraction, and exceptions run on agents. One system — secure by design, autonomous where it counts.',
  },

  cta: {
    headline: 'Ready to take flight?',
    body: 'See the Agentic OS for Business in motion.',
    button: 'Take flight',
    action: 'Book a demo',
  },
} as const;

export type Copy = typeof COPY;
export type WingItem = Copy['wings']['items'][number];
