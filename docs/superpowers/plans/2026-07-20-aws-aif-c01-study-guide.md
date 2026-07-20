# AWS AIF-C01 Study Guide Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `source/aws-ai-practitioner-master-study-guide.md` into a static Astro + Tailwind site on GitHub Pages, per the approved spec at `docs/superpowers/specs/2026-07-20-aws-aif-c01-study-guide-design.md`.

**Architecture:** Astro 5 static site; content pages are MDX using shared components (responsive comparison tables, callouts, step-flow diagrams); three JS islands (theme toggle, Pagefind search modal, flashcards); deployed by `withastro/action` to GitHub Pages.

**Tech Stack:** Astro ^5, @astrojs/mdx ^4, Tailwind CSS ^4 (`@tailwindcss/vite`), @tailwindcss/typography, Pagefind ^1, Node 22, npm.

## Global Constraints

- Repo root: `/Users/autri/Programming/aws-aif-c01-study-guide`. All paths below are relative to it.
- `astro.config.mjs` must set `site: 'https://autribaghkhanian.github.io'` and `base: '/aws-aif-c01-study-guide'`.
- Every internal href/asset goes through the `url()` helper from `src/lib/site.ts`. Never hardcode `/aws-aif-c01-study-guide` in pages or components.
- Nav order (drives header, prev/next): Home → Domain 1 → Domain 2 → Domain 3 → Domain 4 → Domain 5 → Service Index → High-Yield Facts.
- JavaScript is limited to three islands: theme toggle, search modal, flashcards. Nothing else ships JS.
- Verification per task = `npm run build` (plus `npx astro check` where stated) and the exact grep checks given. No test framework (YAGNI for a static content site); the build is the gate.
- Commit after every task. Commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

### Content conversion rules (apply to Tasks 5–10)

Source of truth: `source/aws-ai-practitioner-master-study-guide.md` (line refs below are into that file).

1. **Fidelity:** copy prose verbatim as markdown. Do not rewrite, summarize, or drop material. Keep bold/italic emphasis.
2. **Headings:** each `## N.M Title` in the source becomes `## N.M Title` in the page (drop any `§` and parenthetical asides from the heading text only if needed for slug stability — keep the aside as an italic first paragraph instead). h3s in the source stay h3s.
3. **Wide tables (3+ columns)** become `<ComparisonTable caption columns rows>` with cell text verbatim; inline `**bold**` in cells becomes `<strong>` in the HTML cell strings. 2-column tables stay GFM markdown tables.
4. **Callouts:** any source line starting with `Hook:`, `Hooks:`, `Mapping:`, `Mapping cue:`, `Choosing cue:`, or `**Exam fact**:` becomes `<Callout title="...">` — title "Memory hook" for hooks/mapping/choosing, "Exam fact" for exam facts. Body text verbatim.
5. **Diagrams:** §1.1 ASCII hierarchy → `<HierarchyDiagram />`. Linear flows (§1.6 lifecycle, §1.7 pipeline, §2.3 FM lifecycle, §3.7 cost ladder) → `<StepFlow steps={[...]} />` with titles/notes taken verbatim from the source.
6. **Cross-references:** "see §X.Y" / "Domain N crossover" become links to the owning page + heading anchor (slug = heading text lowercased, non-alphanumerics stripped, spaces → `-`, e.g. "4.3 Bias & Variance" → `#43-bias--variance`). Verify each anchor exists in dist with grep before committing.
7. **MDX imports:** each content page starts with frontmatter (`layout`, `title`, `subtitle`, `description`) followed by imports of only the components it uses.

Frontmatter template for content pages:

```mdx
---
layout: ../layouts/ContentLayout.astro
title: "Domain 1 — Fundamentals of AI and ML"
subtitle: "20% of the exam"
description: "Concept hierarchy, learning approaches, core algorithms, the ML lifecycle, MLOps, and performance metrics."
---
import ComparisonTable from '../components/ComparisonTable.astro';
import Callout from '../components/Callout.astro';
```

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/styles/global.css`, `src/pages/index.astro` (placeholder)

**Interfaces:**
- Produces: `npm run dev|build|preview` scripts; `src/styles/global.css` imported by layouts; dark variant driven by `.dark` on `<html>`.

- [ ] **Step 1: Write config files**

`package.json`:

```json
{
  "name": "aws-aif-c01-study-guide",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.3.0",
    "astro": "^5.12.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "@tailwindcss/typography": "^0.5.16",
    "@tailwindcss/vite": "^4.1.11",
    "pagefind": "^1.3.0",
    "tailwindcss": "^4.1.11",
    "typescript": "^5.8.0"
  }
}
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://autribaghkhanian.github.io',
  base: '/aws-aif-c01-study-guide',
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`.gitignore`:

```
node_modules/
dist/
.astro/
```

`src/styles/global.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

html {
  scroll-behavior: smooth;
}

/* Pagefind UI dark-mode variables (modal added in the search task) */
.dark {
  --pagefind-ui-primary: #fbbf24;
  --pagefind-ui-text: #e2e8f0;
  --pagefind-ui-background: #0f172a;
  --pagefind-ui-border: #334155;
  --pagefind-ui-tag: #1e293b;
}
```

`src/pages/index.astro` (placeholder, replaced in Task 4):

```astro
---
import '../styles/global.css';
---
<html lang="en"><head><title>AIF-C01 Study Guide</title></head>
<body><h1 class="text-2xl font-bold">Scaffold OK</h1></body></html>
```

- [ ] **Step 2: Install and build**

Run: `npm install && npm run build`
Expected: Astro builds 1 page; Pagefind indexes ≥1 page; exit 0.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "Scaffold Astro 5 + Tailwind 4 + MDX + Pagefind project"
```

---

### Task 2: Site chrome — nav data, base layout, header, theme toggle

**Files:**
- Create: `src/lib/site.ts`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/ThemeToggle.astro`

**Interfaces:**
- Produces: `url(path: string): string` (base-aware href builder); `NAV: { href, label, short }[]` in nav order; `<BaseLayout title description?>` with `<slot />`.

- [ ] **Step 1: Write `src/lib/site.ts`**

```ts
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
```

- [ ] **Step 2: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
interface Props { title: string; description?: string }
const {
  title,
  description = 'AWS Certified AI Practitioner (AIF-C01) master study guide',
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <script is:inline>
      const theme =
        localStorage.getItem('theme') ??
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    </script>
  </head>
  <body class="min-h-dvh bg-white text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-200">
    <Header />
    <slot />
    <footer class="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-600">
      Personal study notes for the AWS Certified AI Practitioner exam (AIF-C01). Not affiliated with AWS.
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Write `src/components/ThemeToggle.astro`**

```astro
<button
  id="theme-toggle"
  type="button"
  aria-label="Toggle dark mode"
  class="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
>
  <svg class="size-5 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
  <svg class="hidden size-5 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
</button>
<script>
  document.getElementById('theme-toggle')!.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });
</script>
```

- [ ] **Step 4: Write `src/components/Header.astro`**

```astro
---
import { NAV, url, normalizePath } from '../lib/site';
import ThemeToggle from './ThemeToggle.astro';
const current = normalizePath(Astro.url.pathname);
---
<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
  <div class="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3">
    <a href={url('/')} class="mr-auto text-sm font-bold tracking-tight text-amber-600 dark:text-amber-400">
      AWS AIF-C01
    </a>
    <nav class="hidden items-center gap-0.5 md:flex" aria-label="Sections">
      {NAV.map((item) => (
        <a
          href={url(item.href)}
          title={item.label}
          aria-current={current === normalizePath(url(item.href)) ? 'page' : undefined}
          class="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 aria-[current=page]:bg-amber-100 aria-[current=page]:font-semibold aria-[current=page]:text-amber-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:aria-[current=page]:bg-amber-900/40 dark:aria-[current=page]:text-amber-200"
        >
          {item.short}
        </a>
      ))}
    </nav>
    <details class="relative md:hidden">
      <summary class="cursor-pointer list-none rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <nav class="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900" aria-label="Sections">
        {NAV.map((item) => (
          <a
            href={url(item.href)}
            aria-current={current === normalizePath(url(item.href)) ? 'page' : undefined}
            class="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 aria-[current=page]:bg-amber-100 aria-[current=page]:font-semibold dark:text-slate-300 dark:hover:bg-slate-800 dark:aria-[current=page]:bg-amber-900/40"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </details>
    <ThemeToggle />
  </div>
</header>
```

- [ ] **Step 5: Point placeholder index at BaseLayout**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="AWS AIF-C01 Study Guide">
  <main class="mx-auto max-w-3xl px-4 py-10">
    <h1 class="text-2xl font-bold">Chrome OK</h1>
  </main>
</BaseLayout>
```

- [ ] **Step 6: Verify**

Run: `npx astro check && npm run build && grep -c "theme-toggle" dist/index.html`
Expected: check passes (0 errors), build succeeds, grep prints ≥1.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "Add site chrome: base layout, header nav, dark-mode toggle"
```

---

### Task 3: Content components and content layout

**Files:**
- Create: `src/components/Callout.astro`, `src/components/ComparisonTable.astro`, `src/components/StepFlow.astro`, `src/components/HierarchyDiagram.astro`, `src/components/Toc.astro`, `src/components/PrevNext.astro`, `src/layouts/ContentLayout.astro`

**Interfaces:**
- Consumes: `NAV`, `url`, `normalizePath` from `src/lib/site.ts`; `BaseLayout`.
- Produces:
  - `<Callout title?: string>` (default title "Memory hook"), slot body.
  - `<ComparisonTable caption: string, columns: string[], rows: string[][]>` — `rows[i][0]` is the row name; cells may contain inline HTML (`<strong>`), rendered with `set:html`. Table at `md:`+, stacked cards below.
  - `<StepFlow steps: {title: string, note?: string}[], cycle?: boolean>`.
  - `<HierarchyDiagram />` (self-contained AI ⊃ ML ⊃ DL ⊃ GenAI nested boxes).
  - `ContentLayout` — MDX layout consuming `frontmatter {title, subtitle?, description}` and `headings`; renders h1, mobile TOC disclosure, desktop TOC sidebar (depth-2 headings), prose slot, `<PrevNext />`.

- [ ] **Step 1: Write `src/components/Callout.astro`**

```astro
---
interface Props { title?: string }
const { title = 'Memory hook' } = Astro.props;
---
<aside class="not-prose my-5 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3 dark:border-amber-500 dark:bg-amber-950/40">
  <p class="mb-1 text-xs font-bold tracking-wide text-amber-700 uppercase dark:text-amber-400">{title}</p>
  <div class="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
    <slot />
  </div>
</aside>
```

- [ ] **Step 2: Write `src/components/ComparisonTable.astro`**

```astro
---
interface Props {
  caption: string;
  columns: string[];
  rows: string[][];
}
const { caption, columns, rows } = Astro.props;
---
<figure class="not-prose my-6">
  <figcaption class="sr-only">{caption}</figcaption>
  <div class="hidden overflow-x-auto md:block">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b-2 border-slate-300 text-left dark:border-slate-700">
          {columns.map((col) => (
            <th class="px-3 py-2 font-semibold" set:html={col} />
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells) => (
          <tr class="border-b border-slate-200 align-top dark:border-slate-800">
            {cells.map((cell, i) =>
              i === 0 ? (
                <th scope="row" class="px-3 py-2 text-left font-semibold whitespace-nowrap" set:html={cell} />
              ) : (
                <td class="px-3 py-2 leading-relaxed" set:html={cell} />
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div class="space-y-3 md:hidden">
    {rows.map((cells) => (
      <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
        <p class="mb-2 border-b border-slate-200 pb-2 font-semibold dark:border-slate-800" set:html={cells[0]} />
        <dl class="space-y-2 text-sm">
          {cells.slice(1).map((cell, i) => (
            <div>
              <dt class="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400" set:html={columns[i + 1]} />
              <dd class="mt-0.5 leading-relaxed" set:html={cell} />
            </div>
          ))}
        </dl>
      </div>
    ))}
  </div>
</figure>
```

- [ ] **Step 3: Write `src/components/StepFlow.astro`**

```astro
---
interface Props {
  steps: { title: string; note?: string }[];
  cycle?: boolean;
}
const { steps, cycle = false } = Astro.props;
---
<ol class="not-prose my-6 flex flex-col gap-1.5 md:flex-row md:flex-wrap md:items-center">
  {steps.map((step, i) => (
    <li class="flex flex-col gap-1.5 md:flex-row md:items-center">
      <div class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900 md:max-w-48">
        <p class="text-sm font-semibold">
          <span class="mr-1 text-amber-600 dark:text-amber-400">{i + 1}.</span>{step.title}
        </p>
        {step.note && <p class="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{step.note}</p>}
      </div>
      {i < steps.length - 1 && (
        <span aria-hidden="true" class="pl-3 text-slate-400 md:px-0.5">
          <span class="md:hidden">↓</span>
          <span class="hidden md:inline">→</span>
        </span>
      )}
    </li>
  ))}
  {cycle && (
    <li class="pl-3 text-xs text-slate-500 italic md:pl-1 dark:text-slate-400">↺ loops back to the start</li>
  )}
</ol>
```

- [ ] **Step 4: Write `src/components/HierarchyDiagram.astro`**

```astro
<figure class="not-prose my-6">
  <div class="rounded-xl border-2 border-sky-300 bg-sky-50/70 p-3 sm:p-4 dark:border-sky-800 dark:bg-sky-950/40">
    <p class="font-semibold text-sky-900 dark:text-sky-200">Artificial Intelligence</p>
    <p class="mt-0.5 text-xs text-sky-800/80 dark:text-sky-300/80">
      systems performing tasks that normally require humans: perception, reasoning, decision-making
    </p>
    <div class="mt-3 rounded-xl border-2 border-emerald-300 bg-emerald-50/70 p-3 sm:p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
      <p class="font-semibold text-emerald-900 dark:text-emerald-200">Machine Learning</p>
      <p class="mt-0.5 text-xs text-emerald-800/80 dark:text-emerald-300/80">
        learns from data to improve at specific tasks, instead of following explicit rules
      </p>
      <div class="mt-3 rounded-xl border-2 border-violet-300 bg-violet-50/70 p-3 sm:p-4 dark:border-violet-800 dark:bg-violet-950/40">
        <p class="font-semibold text-violet-900 dark:text-violet-200">Deep Learning</p>
        <p class="mt-0.5 text-xs text-violet-800/80 dark:text-violet-300/80">
          multi-layered neural networks that automatically learn/extract features from large datasets
        </p>
        <div class="mt-3 rounded-xl border-2 border-amber-300 bg-amber-50/70 p-3 sm:p-4 dark:border-amber-700 dark:bg-amber-950/40">
          <p class="font-semibold text-amber-900 dark:text-amber-200">LLMs / Generative AI</p>
        </div>
      </div>
    </div>
  </div>
  <figcaption class="mt-2 text-xs text-slate-500 dark:text-slate-400">
    Related AI fields: <strong>Computer Vision</strong> (interpret images/video) · <strong>NLP</strong> (translation, generation, sentiment, interpretation)
  </figcaption>
</figure>
```

- [ ] **Step 5: Write `src/components/Toc.astro`**

```astro
---
interface Props { headings: { slug: string; text: string }[] }
const { headings } = Astro.props;
---
<nav aria-label="Table of contents">
  <ul class="space-y-0.5 text-sm">
    {headings.map((h) => (
      <li>
        <a
          href={`#${h.slug}`}
          class="block rounded px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {h.text}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

- [ ] **Step 6: Write `src/components/PrevNext.astro`**

```astro
---
import { NAV, url, normalizePath } from '../lib/site';
const current = normalizePath(Astro.url.pathname);
const idx = NAV.findIndex((n) => normalizePath(url(n.href)) === current);
const prev = idx > 0 ? NAV[idx - 1] : undefined;
const next = idx >= 0 && idx < NAV.length - 1 ? NAV[idx + 1] : undefined;
---
<nav class="mt-10 flex flex-wrap gap-3 border-t border-slate-200 pt-5 dark:border-slate-800" aria-label="Previous and next section">
  {prev && (
    <a href={url(prev.href)} class="group max-w-full rounded-lg border border-slate-200 px-4 py-2 hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-500">
      <span class="block text-xs text-slate-500 dark:text-slate-400">← Previous</span>
      <span class="block text-sm font-medium group-hover:text-amber-700 dark:group-hover:text-amber-300">{prev.label}</span>
    </a>
  )}
  {next && (
    <a href={url(next.href)} class="group ml-auto max-w-full rounded-lg border border-slate-200 px-4 py-2 text-right hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-500">
      <span class="block text-xs text-slate-500 dark:text-slate-400">Next →</span>
      <span class="block text-sm font-medium group-hover:text-amber-700 dark:group-hover:text-amber-300">{next.label}</span>
    </a>
  )}
</nav>
```

- [ ] **Step 7: Write `src/layouts/ContentLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import Toc from '../components/Toc.astro';
import PrevNext from '../components/PrevNext.astro';

interface Heading { depth: number; slug: string; text: string }
interface Props {
  frontmatter: { title: string; subtitle?: string; description?: string };
  headings?: Heading[];
}
const { frontmatter, headings = [] } = Astro.props;
const toc = headings.filter((h) => h.depth === 2);
---
<BaseLayout title={`${frontmatter.title} · AIF-C01 Study Guide`} description={frontmatter.description}>
  <div class="mx-auto flex max-w-5xl gap-10 px-4 py-8">
    <main class="min-w-0 flex-1">
      <h1 class="text-3xl font-bold tracking-tight">{frontmatter.title}</h1>
      {frontmatter.subtitle && (
        <p class="mt-1 text-slate-500 dark:text-slate-400">{frontmatter.subtitle}</p>
      )}
      {toc.length > 0 && (
        <details class="mt-5 rounded-lg border border-slate-200 px-3 py-2 lg:hidden dark:border-slate-800">
          <summary class="cursor-pointer text-sm font-semibold">On this page</summary>
          <div class="mt-2"><Toc headings={toc} /></div>
        </details>
      )}
      <article class="prose prose-slate mt-6 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 dark:prose-h2:border-slate-800">
        <slot />
      </article>
      <PrevNext />
    </main>
    {toc.length > 0 && (
      <aside class="hidden w-60 shrink-0 lg:block">
        <div class="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">
          <p class="mb-2 px-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">On this page</p>
          <Toc headings={toc} />
        </div>
      </aside>
    )}
  </div>
</BaseLayout>
```

- [ ] **Step 8: Verify with a temporary MDX page**

Create `src/pages/domain-1.mdx` containing only the frontmatter template (title "Domain 1 — Fundamentals of AI and ML", subtitle "20% of the exam"), the imports, `<HierarchyDiagram />`, one `<Callout>test</Callout>`, one `<StepFlow steps={[{title: 'A'}, {title: 'B'}]} />`, one two-row `<ComparisonTable caption="t" columns={['A','B','C']} rows={[['1','2','3'],['4','5','6']]} />`, and two `## test` headings. (Task 5 replaces this file with real content.)

Run: `npx astro check && npm run build && grep -c "md:hidden" dist/domain-1/index.html`
Expected: 0 errors; grep ≥1 (mobile card branch rendered).

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "Add content components: comparison table, callout, step flow, hierarchy diagram, TOC, prev/next"
```

---

### Task 4: Home page

**Files:**
- Create: `src/pages/index.astro` (replace placeholder)

**Interfaces:**
- Consumes: `BaseLayout`, `url` from `src/lib/site.ts`.

- [ ] **Step 1: Write the page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { url } from '../lib/site';

const domains = [
  { href: '/domain-1/', num: 1, title: 'Fundamentals of AI and ML', weight: 20, blurb: 'Concept hierarchy, learning approaches, core algorithms, the ML lifecycle, MLOps, performance metrics, and when AI fits.' },
  { href: '/domain-2/', num: 2, title: 'Fundamentals of Generative AI', weight: 24, blurb: 'Tokens, embeddings, and vectors; foundation model types and lifecycle; AWS GenAI services; cost trade-offs.' },
  { href: '/domain-3/', num: 3, title: 'Applications of Foundation Models', weight: 28, blurb: 'Model selection, inference parameters, prompt engineering, RAG and vector databases, fine-tuning, agents, evaluation.', biggest: true },
  { href: '/domain-4/', num: 4, title: 'Guidelines for Responsible AI', weight: 14, blurb: 'The six pillars, bias and variance, transparency and explainability, AWS responsible-AI tooling, legal risks.' },
  { href: '/domain-5/', num: 5, title: 'Security, Compliance, and Governance', weight: 14, blurb: 'Prompt-level attacks, shared responsibility, encryption, data protection, governance services and standards.' },
];
---
<BaseLayout title="AWS AIF-C01 Study Guide">
  <main class="mx-auto max-w-3xl px-4 py-10">
    <p class="text-sm font-semibold tracking-wide text-amber-600 uppercase dark:text-amber-400">AWS Certified AI Practitioner</p>
    <h1 class="mt-1 text-4xl font-bold tracking-tight">AIF-C01 Study Guide</h1>
    <p class="mt-4 text-slate-600 dark:text-slate-400">
      Foundational level: no code, no math derivations — the exam tests <strong>concept recognition</strong>,
      <strong>service matching</strong>, and <strong>trade-off reasoning</strong> across five domains.
    </p>

    <ul class="mt-8 space-y-3">
      {domains.map((d) => (
        <li>
          <a href={url(d.href)} class="block rounded-xl border border-slate-200 p-4 transition-colors hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-500">
            <div class="flex items-baseline justify-between gap-3">
              <h2 class="font-semibold">
                <span class="mr-2 text-amber-600 dark:text-amber-400">Domain {d.num}</span>{d.title}
              </h2>
              <span class="shrink-0 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {d.weight}%{d.biggest && <span class="ml-1 font-normal text-amber-600 dark:text-amber-400">· biggest</span>}
              </span>
            </div>
            <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div class="h-full rounded-full bg-amber-400 dark:bg-amber-500" style={`width: ${d.weight}%`}></div>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{d.blurb}</p>
          </a>
        </li>
      ))}
    </ul>

    <div class="mt-8 grid gap-3 sm:grid-cols-2">
      <a href={url('/services/')} class="rounded-xl border border-slate-200 p-4 hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-500">
        <h2 class="font-semibold">Consolidated Service Index</h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">One-line service matching for every AWS service on the exam.</p>
      </a>
      <a href={url('/high-yield/')} class="rounded-xl border border-slate-200 p-4 hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-500">
        <h2 class="font-semibold">High-Yield Facts</h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">28 last-pass facts — as a list or tap-to-flip flashcards.</p>
      </a>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Verify**

Run: `npm run build && grep -c "Domain 3" dist/index.html`
Expected: build passes; grep ≥1.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "Add home page with domain weight overview"
```

---

### Task 5: Domain 1 page

**Files:**
- Create: `src/pages/domain-1.mdx` (replace Task 3 stub)

**Interfaces:**
- Consumes: `ContentLayout`, `ComparisonTable`, `Callout`, `StepFlow`, `HierarchyDiagram`.

- [ ] **Step 1: Convert source lines 7–146** per the global conversion rules. Specific mappings:
  - §1.1: concept-pair bullets stay; ASCII block (lines 11–21) → `<HierarchyDiagram />`.
  - §1.3 Data Types table (lines 36–44, 3 cols) → `<ComparisonTable>`.
  - §1.4 mapping cue (line 53) → `<Callout>`.
  - §1.6 lifecycle bold chain (line 77) → `<StepFlow cycle steps={...} />` with the 8 stages; the per-stage bullets stay as the following list.
  - §1.7 pipeline structure (line 114) → `<StepFlow steps={...} />` (4 pipelines).
  - §1.8 mapping (line 127) → `<Callout>`.
  - Cross-refs: "see §4.3" (line 26) → `[see §4.3](…/domain-4/#43-bias--variance…)`; "(Domain 2 crossover)" (line 51) → link to `/domain-2/`.
  - Frontmatter: title "Domain 1 — Fundamentals of AI and ML", subtitle "20% of the exam".

- [ ] **Step 2: Verify**

Run: `npx astro check && npm run build && grep -c "DBSCAN" dist/domain-1/index.html && grep -o 'id="1[0-9]-' dist/domain-1/index.html | sort -u | wc -l`
Expected: build passes; DBSCAN present; 9 h2 section ids (1.1–1.9).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "Add Domain 1: Fundamentals of AI and ML"
```

---

### Task 6: Domain 2 page

**Files:**
- Create: `src/pages/domain-2.mdx`

Same shape as Task 5. Convert source lines 148–223:
- §2.2 FM types table (lines 161–167, 3 cols) → `<ComparisonTable>`.
- §2.3 lifecycle chain (line 171) → `<StepFlow steps={...} />` (7 stages) + the key-contrast line stays as a paragraph.
- §2.6 AWS services table (2 cols) stays markdown; choosing cue (line 202) → `<Callout>`.
- §2.8 reference architecture stays prose.
- Cross-refs: "see Domain 4" (line 196) → link `/domain-4/#45-aws-responsible-ai-tooling`; "see Domain 5" (line 208) → `/domain-5/#52-shared-responsibility-model`; "see §2.8" appears in Domain 5 not here.
- Frontmatter: title "Domain 2 — Fundamentals of Generative AI", subtitle "24% of the exam".

- [ ] Convert, then run: `npx astro check && npm run build && grep -c "PartyRock" dist/domain-2/index.html` (expected ≥1), commit `"Add Domain 2: Fundamentals of Generative AI"`.

---

### Task 7: Domain 3 page

**Files:**
- Create: `src/pages/domain-3.mdx`

Convert source lines 225–360:
- §3.2 hook (line 248) → `<Callout>`.
- §3.4 techniques table (2 cols) stays markdown.
- §3.6 vector store table (lines 294–300, 4 cols) → `<ComparisonTable>`; exam fact (line 302) → `<Callout title="Exam fact">`.
- §3.7 cost ladder (line 306) → `<StepFlow steps={[{title:'In-context learning'},{title:'RAG'},{title:'Fine-tuning'},{title:'Pre-training'}]} />` prefixed by the "Low → high effort/cost" sentence; method table (lines 308–313, 5 cols) → `<ComparisonTable>`.
- §3.9 hook (line 353) → `<Callout>`.
- Frontmatter: title "Domain 3 — Applications of Foundation Models", subtitle "28% of the exam — the biggest domain".

- [ ] Convert, then run: `npx astro check && npm run build && grep -c "BERTScore" dist/domain-3/index.html` (expected ≥1), commit `"Add Domain 3: Applications of Foundation Models"`.

---

### Task 8: Domain 4 page

**Files:**
- Create: `src/pages/domain-4.mdx`

Convert source lines 363–451:
- §4.1 six pillars table (lines 367–374, 3 cols) → `<ComparisonTable>`.
- §4.5 tooling table (2 cols) stays markdown; hooks line (line 418) → `<Callout>`.
- Cross-refs: "see §4.3 for overfitting/underfitting" appears in Domain 1 (already linked); "see §3.7" (line 449) → `/domain-3/#37-customizing-foundation-models--the-cost-ladder`.
- Frontmatter: title "Domain 4 — Guidelines for Responsible AI", subtitle "14% of the exam".

- [ ] Convert, then run: `npx astro check && npm run build && grep -c "Veracity" dist/domain-4/index.html` (expected ≥1), commit `"Add Domain 4: Guidelines for Responsible AI"`.

---

### Task 9: Domain 5 page

**Files:**
- Create: `src/pages/domain-5.mdx`

Convert source lines 453–547:
- §5.1 attack table (lines 458–464, 3 cols) → `<ComparisonTable>`.
- §5.5 hook (line 492) → `<Callout>`.
- §5.6 problem→solution table (2 cols) stays markdown.
- §5.8 governance services table (lines 512–519, 3 cols) → `<ComparisonTable>`.
- Cross-refs: "see §2.8" (line 485) → `/domain-2/#28-reference-architecture-genai-image-app-well-architected`; "see Domain 4" style refs → owning page.
- Frontmatter: title "Domain 5 — Security, Compliance, and Governance", subtitle "14% of the exam".

- [ ] Convert, then run: `npx astro check && npm run build && grep -c "Jailbreaking" dist/domain-5/index.html` (expected ≥1), commit `"Add Domain 5: Security, Compliance, and Governance"`.

---

### Task 10: Service index page

**Files:**
- Create: `src/pages/services.mdx`

Convert source lines 550–561: the five bold category paragraphs become h2 sections ("Core AI services", "GenAI", "SageMaker pipeline features", "Responsible AI", "Security & governance"); within each, split the `·`-separated service list into a markdown list, one service per bullet, `**Service**` bold + description verbatim. The starred-services footnote stays. The SageMaker pipeline order (line 556) also gets a `<StepFlow>` of the 8 stages.
Frontmatter: title "Consolidated Service Index", subtitle "One-line service matching".

- [ ] Convert, then run: `npx astro check && npm run build && grep -c "Textract" dist/services/index.html` (expected ≥1), commit `"Add consolidated service index"`.

---

### Task 11: High-yield facts page with flashcards

**Files:**
- Create: `src/data/high-yield.json`, `src/pages/high-yield.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PrevNext`.
- Produces: `high-yield.json` — array of `{ id: number, prompt: string, fact: string }`; facts verbatim from source lines 566–593; prompts are quiz-style cues derived from each fact (the only newly authored content).

- [ ] **Step 1: Write `src/data/high-yield.json`** — all 28 facts verbatim, each with an authored prompt phrased as a question answerable by the fact (e.g. fact 7 → prompt "Which metric for imbalanced classes, what do AUC-ROC 0.5 and >0.9 mean, and which metrics are for regression?").

- [ ] **Step 2: Write `src/pages/high-yield.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PrevNext from '../components/PrevNext.astro';
import facts from '../data/high-yield.json';
---
<BaseLayout title="High-Yield Facts · AIF-C01 Study Guide" description="28 last-pass review facts for the AWS AI Practitioner exam, as a list or flashcards.">
  <main class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-bold tracking-tight">High-Yield Facts</h1>
    <p class="mt-1 text-slate-500 dark:text-slate-400">28 last-pass review facts. Switch to flashcards to quiz yourself.</p>

    <div class="mt-5 inline-flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-800" role="group" aria-label="View mode">
      <button id="mode-list" type="button" aria-pressed="true" class="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 aria-pressed:bg-amber-100 aria-pressed:text-amber-900 dark:text-slate-400 dark:aria-pressed:bg-amber-900/40 dark:aria-pressed:text-amber-200">List</button>
      <button id="mode-cards" type="button" aria-pressed="false" class="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 aria-pressed:bg-amber-100 aria-pressed:text-amber-900 dark:text-slate-400 dark:aria-pressed:bg-amber-900/40 dark:aria-pressed:text-amber-200">Flashcards</button>
    </div>

    <ol id="fact-list" class="mt-6 space-y-2.5">
      {facts.map((f) => (
        <li class="flex gap-3 rounded-lg border border-slate-200 p-3 text-sm leading-relaxed dark:border-slate-800">
          <span class="font-mono text-xs text-slate-400 tabular-nums dark:text-slate-500">{String(f.id).padStart(2, '0')}</span>
          <span>{f.fact}</span>
        </li>
      ))}
    </ol>

    <div id="fact-cards" hidden class="mt-6 grid gap-3 sm:grid-cols-2">
      {facts.map((f) => (
        <button type="button" aria-expanded="false" class="flashcard min-h-36 rounded-lg border border-slate-200 p-4 text-left align-top text-sm leading-relaxed hover:border-amber-400 aria-expanded:border-amber-400 aria-expanded:bg-amber-50/50 dark:border-slate-800 dark:hover:border-amber-500 dark:aria-expanded:border-amber-500 dark:aria-expanded:bg-amber-950/20">
          <span class="card-front block">
            <span class="mb-1.5 block font-mono text-xs text-slate-400 tabular-nums dark:text-slate-500">{String(f.id).padStart(2, '0')}</span>
            <span class="font-medium">{f.prompt}</span>
            <span class="mt-2 block text-xs text-slate-400 italic dark:text-slate-500">tap to reveal</span>
          </span>
          <span class="card-back block" hidden>
            <span class="mb-1.5 block font-mono text-xs text-amber-600 tabular-nums dark:text-amber-400">{String(f.id).padStart(2, '0')}</span>
            <span>{f.fact}</span>
          </span>
        </button>
      ))}
    </div>

    <PrevNext />
  </main>
  <script>
    const listBtn = document.getElementById('mode-list')!;
    const cardsBtn = document.getElementById('mode-cards')!;
    const list = document.getElementById('fact-list')!;
    const cards = document.getElementById('fact-cards')!;

    function setMode(cardMode: boolean) {
      list.hidden = cardMode;
      cards.hidden = !cardMode;
      listBtn.setAttribute('aria-pressed', String(!cardMode));
      cardsBtn.setAttribute('aria-pressed', String(cardMode));
    }
    listBtn.addEventListener('click', () => setMode(false));
    cardsBtn.addEventListener('click', () => setMode(true));

    for (const card of document.querySelectorAll<HTMLButtonElement>('.flashcard')) {
      card.addEventListener('click', () => {
        const showing = card.getAttribute('aria-expanded') === 'true';
        card.setAttribute('aria-expanded', String(!showing));
        card.querySelector<HTMLElement>('.card-front')!.hidden = !showing;
        card.querySelector<HTMLElement>('.card-back')!.hidden = showing;
      });
    }
  </script>
</BaseLayout>
```

- [ ] **Step 3: Verify**

Run: `npx astro check && npm run build && grep -c "flashcard" dist/high-yield/index.html`
Expected: build passes; grep ≥28.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add high-yield facts page with flashcard mode"
```

---

### Task 12: Pagefind search modal

**Files:**
- Create: `src/components/SearchModal.astro`
- Modify: `src/components/Header.astro` (add `<SearchModal />` between the mobile `<details>` menu and `<ThemeToggle />`)

**Interfaces:**
- Consumes: `url` helper; Pagefind assets emitted to `dist/pagefind/` by the build script (already wired in Task 1).

- [ ] **Step 1: Write `src/components/SearchModal.astro`**

```astro
---
import { url } from '../lib/site';
---
<button
  id="search-open"
  type="button"
  aria-label="Search"
  class="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
>
  <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
</button>
<dialog
  id="search-dialog"
  class="m-auto w-[calc(100%-2rem)] max-w-xl rounded-xl border border-slate-200 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-900/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
>
  <div class="p-4">
    <div id="pagefind-search"></div>
    <p id="search-dev-note" hidden class="mt-2 text-xs text-slate-500 dark:text-slate-400">
      Search index not found — it is generated by <code>npm run build</code> and available via <code>npm run preview</code> or on the live site.
    </p>
    <form method="dialog" class="mt-3 text-right">
      <button class="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">Close</button>
    </form>
  </div>
</dialog>
<link rel="stylesheet" href={url('/pagefind/pagefind-ui.css')} />
<script is:inline define:vars={{ pagefindDir: url('/pagefind/') }}>
  const openBtn = document.getElementById('search-open');
  const dialog = document.getElementById('search-dialog');
  let initialized = false;
  openBtn.addEventListener('click', async () => {
    dialog.showModal();
    if (initialized) return;
    initialized = true;
    try {
      await import(pagefindDir + 'pagefind-ui.js');
      new PagefindUI({ element: '#pagefind-search', showSubResults: true, showImages: false });
      document.querySelector('#pagefind-search input')?.focus();
    } catch {
      document.getElementById('search-dev-note').hidden = false;
    }
  });
</script>
```

- [ ] **Step 2: Add to Header** — import and place `<SearchModal />` immediately before `<ThemeToggle />`.

- [ ] **Step 3: Verify**

Run: `npm run build && ls dist/pagefind/pagefind-ui.js && grep -c "search-dialog" dist/index.html`
Expected: file exists; grep ≥1. Interactive search behavior is checked in Task 13 against `npm run preview`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add Pagefind search modal"
```

---

### Task 13: Full browser verification pass

**Files:** none created; fixes applied to whichever file a defect points at.

- [ ] **Step 1:** `npm run build`, then start `npm run preview` (serves dist with the Pagefind index at `http://localhost:4321/aws-aif-c01-study-guide/`).
- [ ] **Step 2:** In the browser preview, at desktop width (1280) and mobile (375), in light and dark themes, verify:
  - home page domain bars and links;
  - header nav (inline on desktop, Menu dropdown on mobile), active-page highlight;
  - a wide table (Domain 2 §2.2) renders as a table on desktop and stacked cards on mobile;
  - TOC sidebar on desktop, "On this page" disclosure on mobile; anchor links land on sections;
  - prev/next chain walks Home → D1 → … → High-Yield in order;
  - theme toggle flips and persists across a reload;
  - search finds "BERTScore" and the result link navigates correctly under the base path;
  - flashcards: mode toggle swaps views, tapping flips prompt → fact;
  - no console errors on any page.
- [ ] **Step 3:** Capture a desktop screenshot of the home page and save as `docs/screenshot.png` (browser tooling; if the tooling cannot write a file, skip the image and note it in the README task).
- [ ] **Step 4:** Fix any defects found, re-verify, commit fixes: `git add -A && git commit -m "Fix issues found in browser verification"` (skip commit if nothing found).

---

### Task 14: README, LICENSE, deploy workflow

**Files:**
- Create: `README.md`, `LICENSE`, `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write `LICENSE`** — MIT, `Copyright (c) 2026 Autri Baghkhanian`.

- [ ] **Step 3: Write `README.md`** — project title; one-line description; live-site link `https://autribaghkhanian.github.io/aws-aif-c01-study-guide/`; screenshot (`docs/screenshot.png`, if captured); features list (8 pages, responsive comparison tables, dark mode, Pagefind search, flashcards); stack (Astro 5, Tailwind 4, Pagefind, GitHub Pages via Actions); local dev commands (`npm install`, `npm run dev`, `npm run build && npm run preview`); note that content lives in `source/` and pages under `src/pages/`; MIT license line.

- [ ] **Step 4: Verify + commit**

Run: `npm run build` (still green).

```bash
git add -A && git commit -m "Add README, MIT license, and GitHub Pages deploy workflow"
```

---

### Task 15: Publish — GitHub repo, Pages, live verification

- [ ] **Step 1: Create the public repo and push** (already authorized by Autri):

```bash
gh repo create aws-aif-c01-study-guide --public --source . --push \
  --description "AWS Certified AI Practitioner (AIF-C01) study guide — responsive Astro + Tailwind site with search and flashcards"
gh repo edit autribaghkhanian/aws-aif-c01-study-guide --add-topic aws --add-topic astro --add-topic tailwindcss --add-topic study-guide --add-topic aws-certification
```

- [ ] **Step 2: Enable Pages with Actions as the source**

```bash
gh api -X POST repos/autribaghkhanian/aws-aif-c01-study-guide/pages -f build_type=workflow
```

(If it returns 409 "already exists", run the same with `-X PUT` instead.)

- [ ] **Step 3: Trigger/watch the workflow** — the initial push already triggered it:

```bash
gh run list --repo autribaghkhanian/aws-aif-c01-study-guide --limit 1
gh run watch --repo autribaghkhanian/aws-aif-c01-study-guide <run-id> --exit-status
```

Expected: workflow concludes `success`. If Pages was enabled after the push, re-run with `gh workflow run deploy.yml`.

- [ ] **Step 4: Verify the live site** — load `https://autribaghkhanian.github.io/aws-aif-c01-study-guide/` in the browser: home renders, one domain page renders with styles (CSS under the base path), search works. Report the live URL to Autri.
