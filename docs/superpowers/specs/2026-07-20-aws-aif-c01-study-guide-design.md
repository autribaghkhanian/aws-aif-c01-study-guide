# AWS AIF-C01 Study Guide Site — Design

**Date**: 2026-07-20
**Status**: Approved by Autri (design conversation), pending spec review

## Purpose

Turn the AWS Certified AI Practitioner (AIF-C01) master study guide markdown into a static
website hosted on GitHub Pages. Priorities, in order:

1. **Study tool first** — fast, readable on a phone, easy to navigate before the exam.
2. **Portfolio-presentable** — public repo on Autri's GitHub profile, clean code, polished look.

Source content: `source/aws-ai-practitioner-master-study-guide.md` (kept in repo for provenance).

## Stack

- **Astro 5** static site, zero JS by default, content in markdown/MDX.
- **Tailwind CSS 4** for styling.
- **Pagefind** for client-side search (indexes the built site, runs offline).
- **GitHub Pages** deployment via the official `withastro/action` GitHub Actions workflow on
  every push to `main`.
- Repo: public `aws-aif-c01-study-guide` under `autribaghkhanian`; live at
  `https://autribaghkhanian.github.io/aws-aif-c01-study-guide/`. Astro `site` and `base` are
  configured accordingly; all internal links and assets must respect `base`.

## Pages (8)

| Route | Content |
|---|---|
| `/` | Exam overview: the 5 domains with weight bars (20/24/28/14/14%), links to each section, quick links to Services and High-Yield |
| `/domain-1` … `/domain-5` | One page per domain, full content from the source guide with proper heading hierarchy |
| `/services` | Consolidated service index (one-line service matching) |
| `/high-yield` | The 28 high-yield facts: readable list + toggleable flashcard mode |

## Navigation

- Header: site title, section nav (inline on desktop, hamburger/dropdown on mobile),
  dark-mode toggle, search button.
- Each domain page: on-page table of contents built from h2 headings — sidebar on desktop,
  collapsed `<details>` disclosure on mobile.
- Prev/next links at the bottom of every content page, ordered: Home → Domain 1-5 →
  Services → High-Yield.

## Mobile treatment of tables and diagrams

- **Wide comparison tables** (3+ columns: foundation model types, vector DB options,
  customization cost ladder, responsible-AI pillars, governance services, prompt-attack
  table, etc.) are authored once as structured data and rendered by a shared Astro component:
  a real `<table>` at `md:` and up, stacked labeled cards below.
- **2-column term/definition tables** stay as plain markdown tables at all widths.
- The **ASCII concept-hierarchy diagram** (AI ⊃ ML ⊃ DL ⊃ LLMs) and the **ML lifecycle flow**
  are redrawn as responsive nested-box / step diagrams in HTML + Tailwind. No images, no
  external diagram libraries.
- **Mnemonic hooks** ("ROUGE = summaries · BLEU = translation · BERTScore = meaning") become
  visually distinct callout boxes.

## Dark mode

- Follows `prefers-color-scheme` by default; manual toggle overrides and persists in
  `localStorage`; standard no-flash inline script in `<head>`.
- Tailwind `dark:` class strategy on `<html>`.

## Interactive features (the only JavaScript on the site)

1. **Theme toggle** — small inline script.
2. **Search** — Pagefind UI in a modal, index generated post-build.
3. **Flashcards** — on `/high-yield`, a mode toggle switches the fact list to tap-to-flip
   cards. Front = a prompt cue (e.g. "Which metric for imbalanced classes?"), back = the fact.
   The 28 facts + authored prompt cues live in a single JSON data file that drives both the
   list and card views. Prompt cues are the only newly authored content; they must be derived
   faithfully from the source facts.

## Content fidelity

- All source content is preserved; conversion reorganizes into pages and componentizes
  tables/diagrams but does not rewrite, summarize, or drop material.
- Section numbering (§1.1 etc.) and cross-references ("see §4.3") are kept, with
  cross-references becoming links where they point across pages.

## Repo contents

- Astro project (npm), `README.md` with screenshot + live-site link, MIT `LICENSE`,
  `.github/workflows/deploy.yml`, `source/` with the original guide, this spec under
  `docs/superpowers/specs/`.

## Verification

- `astro build` passes locally and in CI.
- Manual browser-preview check before pushing: mobile (375px) and desktop widths, light and
  dark themes, table-to-card behavior, TOC/nav, search results, flashcard flipping.
- All internal links work under the `/aws-aif-c01-study-guide/` base path.

## Out of scope

- Progress tracking, quizzes/scoring, accounts, analytics, custom domain, SEO work beyond
  basic titles/descriptions.
