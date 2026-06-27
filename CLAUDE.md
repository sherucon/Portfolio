# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (`sherucon`) built on **Next.js 15 App Router** with **React 19**, **TypeScript**, and **Tailwind CSS v4**. Dev uses Turbopack.

## Commands

```bash
npm run dev      # dev server (Turbopack) at http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # next lint (ESLint 9, eslint-config-next)
```

There is no test suite configured.

## Environment

`gh-streak.tsx` reads `GITHUB_TOKEN` (a GitHub PAT for the GraphQL API) from `.env.local`. It is read in a **server component only** — never expose it to client code. Without it the GitHub streak widget renders empty.

## Architecture

- **Routing**: App Router under `src/app/`. Routes are `/` (`page.tsx`), `/about`, `/work`, `/contact`. `layout.tsx` is the only shared shell — it renders `<Cursor />` + `<Navbar />` then the page. There is no other global state or provider.
- **Path alias**: `@/*` → `./src/*` (see `tsconfig.json`).
- **Server vs client split** — important when adding data fetching:
  - Server components do all external fetching: `gh-streak.tsx` (GitHub GraphQL, uses `GITHUB_TOKEN`) and `medium-rss.tsx` (Medium RSS, parsed by hand-rolled regex helpers — no XML dependency). Both use Next's `fetch(..., { next: { revalidate } })` for caching.
  - Everything interactive is a `"use client"` component: `navbar`, `cursor`, `gallery`, `gallery-navbar`, `gh-streak-widget`, `losilluminados`. Pattern: a server component fetches data and passes it to a `*-widget` client child for rendering (e.g. `gh-streak` → `gh-streak-widget`).
- **3D / WebGL**: `losilluminados.tsx` uses `@react-three/fiber` + `drei` + `@react-three/postprocessing` (Bloom) to render an STL model with a glass `MeshPhysicalMaterial`. `leva` is available for live-tuning material/light params during development.
- **Remote assets**: large media (background video, gallery images, the STL model) are served from Cloudflare R2 at `https://r2.sherucon.tech`, not bundled. Gallery image lists and folder names are hard-coded in `gallery.tsx`.

## Conventions

- **Fonts**: custom Graphik faces are declared via `@font-face` in `src/app/globals.css` and applied through utility classes (`graphik`, `graphik-medium`, `graphik-semibold`, `graphik-bold`, `helvetica`) rather than `next/font`.
- **Styling**: Tailwind v4 (imported via `@import "tailwindcss"` in `globals.css`). Inline `style` objects are used for dynamic effects (e.g. `mixBlendMode` toggled on video autoplay state in `page.tsx`).
- Components live flat in `src/app/components/`; shared types in `src/types/`.
