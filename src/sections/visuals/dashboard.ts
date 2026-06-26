import { prefersReducedMotion } from '../../capability';
import type { VisualHandle, VisualOptions } from './globe';

interface AgentRow {
  agent: string;
  task: string;
  /** Status key maps to a brand-colored pill via CSS. */
  status: 'running' | 'approved' | 'review' | 'flagged';
  statusLabel: string;
}

const ROWS: AgentRow[] = [
  { agent: 'Invoice Triage', task: 'Reconciling 1,204 ledgers', status: 'running', statusLabel: 'Running' },
  { agent: 'Vendor Onboarding', task: 'KYC + risk scoring', status: 'approved', statusLabel: 'Approved' },
  { agent: 'Spend Approval', task: 'Routing to controller', status: 'review', statusLabel: 'In review' },
  { agent: 'Anomaly Watch', task: 'Flagged 3 outliers', status: 'flagged', statusLabel: 'Flagged' },
  { agent: 'Forecast Sync', task: 'Updating Q3 model', status: 'running', statusLabel: 'Running' },
];

interface Counter {
  label: string;
  target: number;
  suffix: string;
}

const COUNTERS: Counter[] = [
  { label: 'Tasks today', target: 18420, suffix: '' },
  { label: 'Auto-resolved', target: 96, suffix: '%' },
  { label: 'Avg. handling', target: 1.4, suffix: 's' },
];

/**
 * Mount the Finlytic "Agent activity" dashboard mock into `el`: a DOM/CSS panel
 * of agent rows with brand-colored status pills and counters that tick up on
 * mount. No canvas — pure DOM so it stays crisp and cheap.
 *
 * Reduced motion shows the same panel with final counter values (no animation);
 * `imageUrl` swaps in a static image.
 */
export function mountDashboard(el: HTMLElement, opts: VisualOptions = {}): VisualHandle {
  if (opts.imageUrl) return mountImage(el, opts.imageUrl, 'Agent activity dashboard');

  const reduced = prefersReducedMotion();

  const panel = document.createElement('div');
  panel.className = 'kf-dash';

  const head = document.createElement('div');
  head.className = 'kf-dash__head';
  const title = document.createElement('span');
  title.className = 'kf-dash__title';
  title.textContent = 'Agent activity';
  const live = document.createElement('span');
  live.className = 'kf-dash__live';
  live.textContent = 'Live';
  head.append(title, live);

  const counterRow = document.createElement('div');
  counterRow.className = 'kf-dash__counters';
  const counterValues: { el: HTMLElement; c: Counter }[] = [];
  COUNTERS.forEach((c) => {
    const cell = document.createElement('div');
    cell.className = 'kf-dash__counter';
    const value = document.createElement('p');
    value.className = 'kf-dash__counter-value';
    value.textContent = formatCounter(reduced ? c.target : 0, c);
    const label = document.createElement('p');
    label.className = 'kf-dash__counter-label';
    label.textContent = c.label;
    cell.append(value, label);
    counterRow.append(cell);
    counterValues.push({ el: value, c });
  });

  const rows = document.createElement('div');
  rows.className = 'kf-dash__rows';
  ROWS.forEach((row) => {
    const r = document.createElement('div');
    r.className = 'kf-dash__row';

    const name = document.createElement('span');
    name.className = 'kf-dash__agent';
    name.textContent = row.agent;

    const task = document.createElement('span');
    task.className = 'kf-dash__task';
    task.textContent = row.task;

    const pill = document.createElement('span');
    pill.className = 'kf-dash__pill';
    pill.dataset.status = row.status;
    pill.textContent = row.statusLabel;

    r.append(name, task, pill);
    rows.append(r);
  });

  panel.append(head, counterRow, rows);
  el.append(panel);

  let raf = 0;
  if (!reduced) {
    const start = performance.now();
    const duration = 1400;
    const animate = (now: number): void => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      counterValues.forEach(({ el: valueEl, c }) => {
        valueEl.textContent = formatCounter(c.target * eased, c);
      });
      if (t < 1) raf = globalThis.requestAnimationFrame(animate);
    };
    raf = globalThis.requestAnimationFrame(animate);
  }

  return () => {
    globalThis.cancelAnimationFrame(raf);
    panel.remove();
  };
}

function formatCounter(value: number, c: Counter): string {
  const n = Number.isInteger(c.target)
    ? Math.round(value).toLocaleString('en-US')
    : value.toFixed(1);
  return `${n}${c.suffix}`;
}

function mountImage(el: HTMLElement, src: string, alt: string): VisualHandle {
  const img = document.createElement('img');
  img.className = 'kf-visual__image';
  img.src = src;
  img.alt = alt;
  el.append(img);
  return () => img.remove();
}
