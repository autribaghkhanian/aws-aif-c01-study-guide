# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static study site for the AWS Certified AI Practitioner (AIF-C01) exam: Astro 5 + Tailwind CSS 4 + MDX + Pagefind, deployed to GitHub Pages. Live at https://autribaghkhanian.github.io/aws-aif-c01-study-guide/. Priorities: study tool first (fast, mobile-friendly), portfolio-presentable second. Design spec: `docs/superpowers/specs/2026-07-20-aws-aif-c01-study-guide-design.md`.

## Commands

```sh
npm run dev        # dev server on :4321 — search is INACTIVE here (no index yet)
npm run build      # astro build, then pagefind indexes dist/
npm run preview    # serve dist/ — use this to test search
npm run check      # astro check (type-checking; the only verification — no tests or linter)
```

Search only exists after a build: Pagefind indexes the built `dist/`, so in dev the search modal shows a fallback note. That is expected, not a bug.

Pushing to `main` deploys to production via `.github/workflows/deploy.yml` — `main` is live.

## Architecture

**Base path is the #1 gotcha.** The site deploys under `/aws-aif-c01-study-guide/` (`base` in `astro.config.mjs`). Every internal link and asset URL must go through the `url()` helper in `src/lib/site.ts`. A bare `/domain-1/` href works in dev and 404s in production.

**`NAV` in `src/lib/site.ts` is the single source of truth for site structure.** The header nav, mobile menu, and `PrevNext` prev/next ordering all derive from it. Adding a page means adding a `NAV` entry; ordering there is the reading order.

**Page anatomy.** Domain pages (`src/pages/domain-*.mdx`, `services.mdx`) declare `layout: ../layouts/ContentLayout.astro` in frontmatter with `title`/`subtitle`/`description`. ContentLayout builds the table of contents from **h2 headings only** — a section must be `##` to appear in the TOC. `index.astro` and `high-yield.astro` use `BaseLayout` directly.

**Zero-JS by design.** The only JavaScript is three small inline-script islands: the no-flash theme script in `BaseLayout` head + `ThemeToggle`, `SearchModal` (lazy-loads Pagefind UI on first open), and the flashcard/list mode toggle in `high-yield.astro`. Don't add framework components or client-side libraries for new features; keep them static HTML or a small inline script.

**Tables.** Wide comparison tables (3+ columns) are authored as data via `<ComparisonTable caption columns rows>` — real `<table>` at `md:` and up, stacked labeled cards on mobile. Cells are rendered with `set:html`, so they may contain inline HTML. Two-column term/definition tables stay as plain markdown. Diagrams (`HierarchyDiagram`, `StepFlow`) are HTML + Tailwind, never images.

**Content accuracy.** `source/aws-ai-practitioner-master-study-guide.md` is the original master guide, kept for provenance — don't edit it when changing the site. The MDX pages started as a faithful conversion of it (reorganized and componentized, with §1.1 section numbering and cross-references preserved as links). When editing or rewriting content, it's fine to deviate from the source — restructuring, expanding, or adding supplemental material — **as long as every claim is accurate and sourceable**. This is exam study material, so correctness is non-negotiable: never invent or guess at a fact, service name, metric, or number. If you're unsure whether something is correct, or what to write, stop and ask the user rather than filling the gap.

**High-yield facts.** `src/data/high-yield.json` (28 entries: `id`, `prompt`, `fact`) drives both the list view and the flashcards on `/high-yield` — `prompt` is the card front, `fact` the back. Edit facts there, not in the page.

**Dark mode.** Tailwind class strategy: `.dark` toggled on `<html>`, defined via `@custom-variant dark` in `src/styles/global.css` (Tailwind 4 CSS-first config — there is no `tailwind.config.js`). Pagefind dark-mode overrides must target the `.pagefind-ui` element itself, not an ancestor (it sets its CSS-variable defaults on that element).
