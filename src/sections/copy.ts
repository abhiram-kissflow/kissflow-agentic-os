/**
 * Single source of truth for every headline and body string on the page.
 *
 * This is the surface the eos (Elements of Style) pass operates on: prose is
 * tight, vigorous, and concrete — short sentences, active voice, no hedging.
 *
 * Brand law enforced by `copy.test.ts`:
 *  - never the words "low-code" or "no-code";
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
    body: 'Kissflow gathers the scattered pieces into one living system. Build, automate, agents, and govern move together.',
  },

  wings: {
    headline: 'One platform. Four powers.',
    items: [
      {
        key: 'build',
        title: 'Build',
        body: 'Compose enterprise-grade applications in days, not quarters.',
      },
      {
        key: 'automate',
        title: 'Automate',
        body: 'Turn process into flow. Route work, approvals, and data without the busywork.',
      },
      {
        key: 'agents',
        title: 'Agents',
        body: 'Put AI agents to work inside your processes, acting with context and judgment.',
      },
      {
        key: 'govern',
        title: 'Govern',
        body: 'Hold control as you scale. Roles, policy, and audit live in the core.',
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
    headline: 'Autonomy you can answer for.',
    body: 'Every agent acts inside guardrails you set. Permissions, policy, and a full audit trail — so speed never costs you control.',
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
