export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

export interface NavEntry {
  href: string;
  label: string;
  short: string;
}

export const NAV: NavEntry[] = [
  { href: '/', label: 'Home', short: 'Home' },
  { href: '/domain-1/', label: 'Domain 1 — Fundamentals of AI and ML', short: 'D1' },
  { href: '/domain-2/', label: 'Domain 2 — Fundamentals of Generative AI', short: 'D2' },
  { href: '/domain-3/', label: 'Domain 3 — Applications of Foundation Models', short: 'D3' },
  { href: '/domain-4/', label: 'Domain 4 — Guidelines for Responsible AI', short: 'D4' },
  { href: '/domain-5/', label: 'Domain 5 — Security, Compliance, and Governance', short: 'D5' },
  { href: '/services/', label: 'Consolidated Service Index', short: 'Services' },
  { href: '/high-yield/', label: 'High-Yield Facts', short: 'High-Yield' },
];

export function normalizePath(p: string): string {
  return p.replace(/\/+$/, '') || '/';
}
