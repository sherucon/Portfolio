# CLAUDE.md - Figma MCP working rules

This document is the operating manual for AI agents implementing Figma designs in this repository.
Read it before touching any UI.
It describes what exists, which patterns to reuse, and how to translate a Figma node into code through the Figma Model Context Protocol (MCP) server.

Primary Figma file:
`https://www.figma.com/design/PekTUYrUBmN9auCkEfqSzQ/Portfolio`

Figma URLs encode the file key and node id.
`figma.com/design/:fileKey/:name?node-id=2311-5` means `fileKey = PekTUYrUBmN9auCkEfqSzQ` and `nodeId = 2311:5`.
Always convert `-` to `:` in the node id.

---

## 0. Fast start

1. Read this file completely.
2. Identify the target `fileKey` and `nodeId`.
3. Open a Figma MCP session with `create_session` before any file tool.
4. Read the node with `get_metadata`, `get_screenshot`, and `get_design_context`.
5. Inspect the matching code area before writing code.
6. Reuse existing components, colors, fonts, spacing, and patterns.
7. Verify with TypeScript, lint, build, and real browser screenshots.
8. Leave changes uncommitted unless the user explicitly asks to commit.

The Figma response is a reference, not final code.
Never paste generated Figma code into the repo without adapting it to the conventions below.

---

## 1. Codebase snapshot

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15.5 App Router with React 19 |
| Language | TypeScript, `strict: true` |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss`, plus one global stylesheet |
| Build | `next build` with Turbopack for dev |
| Deploy | OpenNext for Cloudflare Workers, `wrangler`, R2 incremental cache |
| Package manager | npm, `package-lock.json` |
| Tests | None present |
| Component docs | None, no Storybook |
| State management | Local React state and refs only |
| Animations | CSS transitions and hand-written `requestAnimationFrame` loops |

Commands:

```bash
npm run dev                 # next dev --turbopack
npm run build               # next build
npm run lint                # next lint
npm run deploy              # opennextjs-cloudflare build && deploy
npx tsc --noEmit            # type check without emitting
```

Routes:

| Route | File | Composition |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | `Home`, `Work stacked`, `About stacked` |
| `/work` | `src/app/work/page.tsx` | `Work` with spacer |
| `/about` | `src/app/about/page.tsx` | `About` with spacer |
| `/contact` | `src/app/contact/page.tsx` | Placeholder only |

The navbar links to `/#home`, `/#work`, and `/#about`.
The single-page layout is the primary experience.

---

## 2. Design tokens

### 2.1 Where tokens live

There is no dedicated token package, no Style Dictionary, and no token transformation pipeline.
Tokens exist in three places:

1. `src/app/globals.css` `:root` custom properties and `@theme inline` mappings.
2. Reused Tailwind arbitrary values in components.
3. De facto constants repeated across components, mostly card surfaces and text greys.

```css
/* src/app/globals.css */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

The `--font-geist-sans` and `--font-geist-mono` mappings are leftovers from the starter and are not loaded.
The real body font is SF Pro Display.

### 2.2 Observed palette

Use these values instead of inventing new ones when they match the design.

| Role | Value | Used in |
| --- | --- | --- |
| Page background | `#ffffff` | `body`, sections |
| Card surface | `#f7f7f9` | Work cards, about cards, gallery tiles |
| Primary text | `#111`, `#171717`, `black` | Headings, names, strong copy |
| Secondary text | `#454545` | Home intro |
| Muted text | `#747474` | About body, icon links |
| Faint text | `#a1a1a1` | "Click around..." hint |
| Hairline | `#e8e8ea`, `#e0e0e2` | Rules, separators |
| Music panel | `#f8f8fa` | Now-playing background |
| Music list | `#ececee` to `#f3f3f4` | List gradient |
| Placeholder | `#ececee` | Artwork fallback |
| iMessage blue | `#0070e8` | Home contact bubble |
| Zoop blue | `#0079fd` | Zoop card |
| Green | `#7ec67e` | Paranoyar card |
| Yellow | `#ffea00` | Paranoyar card |
| Red | `#ff0000` | Zoop and BrewLSD details |
| Dark widget | `#0a1628`, `#0d1117` | GitHub streak fallback |

Rules:

- If a Figma color is within a few units of an existing value, use the existing value.
- If a new color appears more than twice, add it as a CSS custom property in `:root` and expose it through `@theme inline`.
- If a color is used once, use a Tailwind arbitrary value such as `bg-[#f7f7f9]`.
- Do not create a `tailwind.config.js` or `tailwind.config.ts`.
- Do not add a design token toolchain without explicit approval.

### 2.3 Typography

Fonts are loaded from a remote host in `src/app/globals.css`:

```css
@font-face {
  font-family: "SF Pro Display";
  src: url("https://portfolio.sherucon.me/sf-pro-display/SFPRODISPLAYREGULAR.OTF")
    format("opentype");
  font-weight: 400;
  font-display: swap;
}
```

Available faces:

| Class | Weight | Figma mapping |
| --- | --- | --- |
| `.graphik` | 400 | Regular |
| `.graphik-medium` | 500 | Medium |
| `.graphik-semibold` | 500 | Semibold designs fall back to Medium |
| `.graphik-bold` | 700 | Bold |
| `.helvetica` | system | Helvetica only |
| `.cactus` | 400 | Cactus Classical Serif, hero name only |

The `cactus` font comes from `next/font/google` and is exposed as `--font-cactus` in `src/app/layout.tsx`.

Important detail:

- There is no upright 600 face.
- A CSS request for weight 600 resolves to the 700 Bold file.
- Figma `Semibold` therefore renders as `.graphik-bold` or Tailwind `font-semibold`.
- Do not synthesize new weights.

Base typography:

```css
body {
  font-family: "SF Pro Display", Helvetica;
}
```

Figma text rules:

- Map SF Pro Display weights to the classes above.
- Keep body copy at `text-lg` inside about panels unless the design says otherwise.
- Keep text as real DOM text, not SVG paths, except inside the 1000x1000 work cards where the Figma export is already outlined.
- Do not add a new webfont unless the design requires it and the user approves.

### 2.4 Spacing, radius, and layout constants

| Pattern | Value | Where |
| --- | --- | --- |
| Page gutter | `mx-5 md:mx-8 lg:mx-16 xl:mx-50` | All section wrappers |
| Section gap | `gap-4` (16px) | Grids and stacked sections |
| Card padding | `p-5` (20px) | About, gallery, music |
| Large card padding | `p-5 sm:p-7 sm:pb-[42px]` | Home identity card |
| Standard card radius | `rounded-3xl` (24px) | About and gallery |
| Work card radius | `rounded-4xl` (32px) wrapper, 64 units inside SVG | Work |
| Section spacer | `h-10 md:h-[120px]` | `Spacer` |
| Mobile page spacer | `h-10` (40px) | `Spacer` |

Use the existing Tailwind scale when it matches.
Use arbitrary values when the Figma value differs by more than about 1px.
Never round a design value just to avoid an arbitrary class.

---

## 3. Component library

### 3.1 Location and architecture

All UI lives in `src/app/components/`.
The architecture is flat, one component per file, default exports, relative imports, and no barrel files.

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    about/page.tsx
    work/page.tsx
    contact/page.tsx
    components/
      about.tsx
      home.tsx
      work.tsx
      navbar.tsx
      spacer.tsx
      music-player.tsx
      gallery.tsx
      gallery-navbar.tsx
      losilluminados.tsx
      gh-streak.tsx
      gh-streak-widget.tsx
      medium-rss.tsx
      docsearch.tsx
      svg.ts
      paranoyar-card.tsx
      verity-card.tsx
      zoop-card.tsx
      potenad-card.tsx
      potenad-anim.tsx
      brewlsd-card.tsx
      github-icon.tsx
      x-icon.tsx
      mail-icon.tsx
      linkedin-icon.tsx
  types/
    github-calendar.d.ts
```

Rules:

- File names are kebab-case.
- Component names are PascalCase.
- Default exports are the norm.
- Imports are relative, not `@/` aliases, even though `@/*` is configured.
- Do not create `index.ts` barrel files.
- Do not create a component library package.

### 3.2 Inventory

| Component | Role | Boundary |
| --- | --- | --- |
| `layout.tsx` | Fonts, metadata, navbar, analytics | Server |
| `page.tsx` | Single-page composition | Server |
| `home.tsx` | Hero, identity card, iMessage contact card | Client |
| `work.tsx` | Work grid and section wrapper | Server |
| `about.tsx` | About copy and widget grid | Server |
| `navbar.tsx` | Floating glass tab bar | Client |
| `spacer.tsx` | Shared vertical rhythm | Server |
| `medium-rss.tsx` | Medium RSS fetch and article list | Async server |
| `gh-streak.tsx` | GitHub GraphQL fetch and streak color selection | Async server |
| `gh-streak-widget.tsx` | Streak visualization | Client |
| `gallery.tsx` | Photo carousel with crossfade and categories | Client |
| `gallery-navbar.tsx` | Category pills | Client |
| `losilluminados.tsx` | React Three Fiber glass model | Client |
| `music-player.tsx` | Native audio preview player | Client |
| `docsearch.tsx` | Typing animation inside Verity card | Client via parent |
| `*-card.tsx` | Five Figma-exported work cards | Client |
| `*-icon.tsx` | Social icons | Server-compatible |

### 3.3 Section and variant pattern

Top-level sections accept a `stacked` flag so the same component works on the single page and on its standalone route.

```tsx
// src/app/components/about.tsx
export default function About({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className="mx-5 my-0 md:mx-8 lg:mx-16 xl:mx-50">
      {!stacked && <Spacer />}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4">
        {/* left copy card */}
        {/* right widget grid */}
      </div>
      {!stacked && <Spacer />}
    </div>
  );
}
```

Rules for new sections:

- Follow the same wrapper: `mx-5 my-0 md:mx-8 lg:mx-16 xl:mx-50`.
- Accept `stacked` only if the section is also a standalone route.
- Reuse `Spacer` instead of hard-coded vertical margins at section boundaries.
- Keep the section background on the inner card, not on the wrapper.

### 3.4 Server and client boundaries

Default to a server component.

Add `"use client"` only when the component needs:

- `useState`, `useEffect`, `useRef`, or event handlers.
- Browser APIs such as `window`, `Audio`, canvas, or WebGL.
- Third-party client-only libraries.

Current client components:

`brewlsd-card.tsx`, `gallery.tsx`, `gh-streak-widget.tsx`, `home.tsx`, `losilluminados.tsx`, `music-player.tsx`, `navbar.tsx`, `paranoyar-card.tsx`, `particle-grid.tsx`, `potenad-anim.tsx`, `potenad-card.tsx`, `verity-card.tsx`, `zoop-card.tsx`.

Data fetching pattern:

```tsx
// src/app/components/medium-rss.tsx
export default async function MediumRSS() {
  let articles: Article[] = [];
  try {
    articles = await fetchArticles("singhshreyansh288");
  } catch {
    error = true;
  }
  return <div>{/* render */}</div>;
}
```

Rules:

- Fetch remote data in server components with `next: { revalidate }`.
- Never expose tokens to client components.
- Pass only serializable props across the boundary.
- Provide an error or empty state for every fetch.

`gh-streak.tsx` reads `process.env.GITHUB_TOKEN` and renders a fallback when the token is missing.
Follow that pattern for new secrets.

### 3.5 Documentation and tests

There is no Storybook and no component documentation site.
Do not add one for a single Figma task.

There are no unit tests.
New non-trivial logic should still get a small self-check or a manual browser verification.
Do not introduce a test framework without explicit approval.

---

## 4. Work card pipeline (Figma export)

This is the most important Figma-specific pattern in the repo.

Each work card is a single 1000x1000 inline SVG exported from Figma.
Examples:

- `src/app/components/paranoyar-card.tsx`
- `src/app/components/verity-card.tsx`
- `src/app/components/zoop-card.tsx`
- `src/app/components/potenad-card.tsx`
- `src/app/components/brewlsd-card.tsx`

Anatomy:

```tsx
"use client";

import * as React from "react";

const SVGComponent = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={1000}
      height={1000}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={["group/card", className].filter(Boolean).join(" ")}
      {...props}
    >
      <g clipPath="url(#clip0_2001_2)">
        <rect width={1000} height={1000} rx={64} fill="#F7F7F9" />
        {/* text as outlined paths */}
        {/* decorative artwork */}
        {/* interactive header button */}
      </g>
    </svg>
  );
};

export default SVGComponent;
```

Card conventions:

- Canvas is always `1000x1000`.
- Background is `#F7F7F9` with `rx={64}`.
- The outer wrapper in `work.tsx` is `aspect-square rounded-4xl overflow-hidden`.
- The component accepts `className` and spreads SVG props.
- The root class includes `group/card` so children can use `group-hover/card:*`.
- Text is converted to paths by Figma and rendered as `<path>`.
- Raster screenshots are embedded through `<pattern>` and `<image xlinkHref="https://portfolio.sherucon.me/...">`.
- Header title, subtitle, and divider sit at the top of the canvas.
- The circular arrow button is a `<g className="group/button cursor-pointer">` with an `onClick` that opens the project URL.
- Hover states use Tailwind classes directly on SVG elements, for example `group-hover/button:fill-[#ffffff]` and `group-hover/card:-translate-x-[38px]`.
- Overlays that need HTML use `<foreignObject>`, as in `verity-card.tsx` embedding `DocSearch`.
- All `id` values must be unique across the page.
  Keep the Figma-generated suffixes, or prefix them with the component name.

Rules for a new work card:

1. Export the Figma frame as SVG at 1000x1000.
2. Inline it as a React component in `src/app/components/<name>-card.tsx`.
3. Add `"use client"` if it has interactions.
4. Keep `group/card`, `className` merging, and prop spreading.
5. Replace local image references with the hosted asset URL.
6. Wire the top-right button to the project URL.
7. Add the card to the grid in `src/app/components/work.tsx` with the same wrapper classes.
8. Verify hover, click, and clipping at desktop and mobile widths.

Do not rebuild a work card from divs and CSS.
The card is a design artifact and should remain a single SVG.

Do not use `<img src="...svg">` for work cards.
Inline SVG is required for hover states, `foreignObject`, and text crispness.

---

## 5. Icon system

There are four icon mechanisms in the repo.

### 5.1 Inline React icon components

Files:

- `src/app/components/github-icon.tsx`
- `src/app/components/x-icon.tsx`
- `src/app/components/mail-icon.tsx`
- `src/app/components/linkedin-icon.tsx`

Pattern:

```tsx
export default function GithubIcon() {
  return (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="..." />
    </svg>
  );
}
```

Rules:

- `fill="currentColor"` so the parent link controls color.
- Size with Tailwind `w-6 h-6` unless the design says otherwise.
- Add `aria-hidden="true"` when the link already has an `aria-label`.
- The existing `color-[#747474]` class is not a real Tailwind utility and has no effect.
  Color comes from the parent `text-[#747474] hover:text-black`.

### 5.2 Public SVG files

`public/figma/` holds small Figma-exported assets used through `<img>`:

- `imessage-tail-incoming.svg`
- `imessage-tail-outgoing.svg`
- `envelope.svg`
- `send.svg`

`public/music/` holds transport icons used through `<img>`:

- `next.svg`
- `play.svg`

Rules:

- Use public SVGs when the asset does not need to change color or receive events.
- Reference them with an absolute path such as `/figma/send.svg`.
- Always provide `width` and `height` to avoid layout shift.
- Use an empty `alt` when adjacent text or an `aria-label` already describes the control.

### 5.3 Inline SVG inside work cards

All icons inside a work card are part of the card SVG.
Do not extract them into separate components unless they are reused outside the card.

### 5.4 lucide-react

`lucide-react` is used only in `src/app/components/gallery-navbar.tsx` for `Leaf`, `Mountain`, and `Cat`.

Rules:

- Do not add lucide icons to new designs unless the icon is genuinely generic and the design does not provide an export.
- Prefer Figma-exported SVGs for portfolio-specific artwork.
- Pass `size` and rely on `currentColor`.

Naming convention:

- React icon files: `<name>-icon.tsx`.
- Public assets: lowercase kebab-case, for example `imessage-tail-incoming.svg`.
- Work card files: `<project>-card.tsx`.

---

## 6. Styling approach

### 6.1 Methodology

- Tailwind utility classes are the default.
- One global stylesheet, `src/app/globals.css`.
- No CSS Modules.
- No styled-components or Emotion.
- No CSS-in-JS theme.
- No Tailwind config file.
- Complex, stateful widgets use BEM-like classes in `globals.css`.

The music player is the reference for the BEM pattern:

```css
.music-card { /* block */ }
.music-now { /* element */ }
.music-list__scroll { /* element */ }
.music-row:hover { /* state */ }
```

Add global CSS only when:

- The component has many interdependent pseudo-elements or masks.
- Container queries are required.
- A keyframe animation is shared.
- A third-party element needs styling that utilities cannot express cleanly.

Otherwise stay in Tailwind.

### 6.2 Global styles

`src/app/globals.css` contains:

- Tailwind import.
- Smooth scrolling and reduced-motion override.
- `@font-face` declarations and font utility classes.
- Root color variables and `@theme inline`.
- Body defaults.
- The full music player stylesheet.
- Keyframes such as `caretBlink`.

Rules:

- Keep global CSS scoped by a block class.
- Do not add bare element selectors beyond `html`, `body`, and font faces.
- Do not add new global resets.

### 6.3 Responsive design

Tailwind default breakpoints are used mobile-first:

| Prefix | Min width |
| --- | --- |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

Observed patterns:

- Page gutters step at `md`, `lg`, and `xl`.
- Work grid is one column, then `sm:grid-cols-2`.
- About right panel is a flex column, then `md:grid md:grid-cols-2`.
- The rainbow stripe appears at `min-[1440px]`.
- Hero name uses `clamp(3.5rem, 7.64vw, 6.875rem)`.
- Cards use `aspect-square` to stay square at any width.

Embedded widgets use container queries, not viewport breakpoints:

```css
.music-player-shell {
  container-type: inline-size;
}

@container (min-width: 440px) {
  .music-card {
    display: flex;
    height: 410px;
  }
}
```

Rules:

- Use viewport breakpoints for page layout.
- Use container queries for a component that can appear in different column widths.
- Never assume the component owns the full viewport.
- Verify at 390px, 768px, 1024px, 1440px, 1696px, and 1920px.

### 6.4 Motion

- Prefer CSS transitions and transforms.
- Use `prefers-reduced-motion` when animation is non-trivial.
- Hand-written `requestAnimationFrame` is acceptable for canvas or SVG sequences, as in `potenad-anim.tsx`.
- `gsap`, `motion`, and `leva` are installed but unused in `src`.
- Do not add a new animation dependency.
- Do not copy Figma Smart Animate literally; implement the closest CSS or rAF behavior.

### 6.5 Cursor

The repository intentionally uses the native cursor everywhere.
A custom cursor component used to exist and was removed.
Do not add `cursor: none`, custom cursor DOM, or `cursor-touch` classes.

---

## 7. Asset management

### 7.1 Storage

| Type | Location |
| --- | --- |
| Small local SVG | `public/figma/`, `public/music/` |
| Local cover art | `public/music/i-love.jpg` |
| Photos, work screenshots, 3D model | `https://portfolio.sherucon.me` (Cloudflare R2) |
| Music previews and artwork | iTunes CDN |
| Fonts | `https://portfolio.sherucon.me/sf-pro-display/` |

The R2 host is the project CDN.
Examples in code:

```tsx
const BASE_URL = "https://portfolio.sherucon.me";
const MODEL_URL = "https://portfolio.sherucon.me/losill.glb";
xlinkHref="https://portfolio.sherucon.me/work-cards/verity/doc1.webp"
```

### 7.2 Referencing

- Use plain `<img>` for raster images.
- Use inline SVG for icons and work cards that need interaction.
- Use `<image>` and `<pattern>` for raster content inside SVG.
- Use `object-cover` for photos.
- Use `width` and `height` attributes or an aspect-ratio wrapper to prevent layout shift.
- Do not use `next/image` in this repo.
  The codebase standard is `<img>`, and Next image optimization is not configured for remote hosts.
  Adding `next/image` requires `remotePatterns` and is out of scope unless the user asks.

### 7.3 Optimization and caching

- Photos are pre-sized and compressed before upload, often WebP.
- The 3D model is a compressed GLB.
- `public/_headers` sets immutable caching for `/_next/static/*`.
- `wrangler.jsonc` configures an R2 bucket for OpenNext incremental cache and an `IMAGES` binding for Cloudflare image optimization.
  The `IMAGES` binding is present but not used by the app.
- There is no automatic responsive image pipeline in application code.
- Gallery preloads the next image with `new Image()` before crossfading.

### 7.4 Adding assets from Figma

1. Export vector artwork as SVG when it must stay crisp or interactive.
2. Export photos and screenshots as WebP at roughly 2x the rendered size.
3. Put tiny one-off SVGs in `public/figma/`.
4. Put large media on the R2 host and reference the absolute URL.
5. Keep names lowercase and kebab-case.
6. Never commit a multi-megabyte raster when a compressed asset is enough.

---

## 8. Project structure and data flow

```
.
├── public/
│   ├── _headers
│   ├── figma/
│   └── music/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── about/page.tsx
│   │   ├── work/page.tsx
│   │   ├── contact/page.tsx
│   │   └── components/
│   └── types/
├── next.config.ts
├── postcss.config.mjs
├── wrangler.jsonc
└── open-next.config.ts
```

Patterns:

- Page files compose section components.
- Section components own their own wrapper and internal grid.
- Work cards and about widgets are independent and must not influence each other's row heights.
- The about right panel is its own grid so square tiles stay square.
- The single page imports the same sections with `stacked` so spacing differs, not content.

Data flow:

- Static content is hard-coded in components.
- Medium articles and GitHub streak are fetched on the server with revalidation.
- Music previews are fetched by the browser from iTunes.
- No API routes exist.
- No global store exists.

---

## 9. Figma MCP workflow

### 9.1 Read the design

1. Parse the URL.
2. Call `create_session` with the file key and a short task description.
3. If the file is new, call `create_new_file` first and use its key.
4. Call `get_metadata` to get the node tree, dimensions, and names.
5. Call `get_screenshot` to see the rendered node at its native size.
6. Call `get_design_context` for layout, colors, typography, and assets.
7. If writing back to Figma, call `search_design_system` and `get_libraries` first.
8. Load the relevant Figma skill before `use_figma` or `generate_figma_design`.

If the design contains a component that matches an existing repo component, inspect that component before reading the Figma code further.

### 9.2 Translate, do not transcribe

The MCP response may contain React or Tailwind-like output.
Treat it as a description.

Rules:

- Recreate layout with the repo's Tailwind patterns.
- Map colors to Section 2.
- Map fonts to SF Pro Display classes.
- Map spacing to the existing scale, using arbitrary values only when needed.
- Reuse `Spacer`, `rounded-3xl`, `rounded-4xl`, `#f7f7f9`, and the page gutter classes.
- Keep text selectable and real, except inside work cards.
- Preserve semantic elements: headings, paragraphs, links, buttons, lists.
- Add `aria-label` to icon-only controls.
- Preserve visible focus states.
- Match hover, active, and disabled states from the design.
- Do not introduce a new dependency to reproduce a simple visual effect.

Mapping examples:

| Figma | Code |
| --- | --- |
| Frame 640x410 with side-by-side panels | Flex container plus `@container` at 440px |
| Card fill `#F7F7F9`, radius 24 | `bg-[#f7f7f9] rounded-3xl` |
| Card fill `#F7F7F9`, radius 32 | `bg-[#f7f7f9] rounded-4xl` |
| SF Pro Display Medium 16 | `text-base graphik-medium` |
| SF Pro Display Semibold 12 | `text-xs font-semibold` (resolves to Bold 700) |
| 20px page gutter on mobile | `mx-5` |
| 64px square icon | `size-16` |
| Full-bleed 1:1 project card | `aspect-square overflow-hidden rounded-4xl` |

### 9.3 Choose the implementation surface

Use one of these three, in order:

1. Existing component with minor styling changes.
2. New section or widget composed from Tailwind primitives.
3. Single exported SVG, only for work cards or fixed illustration artwork.

Do not use an SVG for interactive UI that needs text, links, forms, or responsive layout.

### 9.4 Writing back to Figma

Only do this when the user asks to create or update a Figma design.

Rules:

- Load the `/figma-use` skill first.
- Call `search_design_system` before creating anything.
- Reuse existing components, variables, and styles.
- Do not create duplicate components or variables.
- Use `use_figma` for edits.
- Use `generate_figma_design` only for capturing a web page into Figma.
- Delete temporary screenshot references after refinement.
- Keep the Figma file organized with named frames and auto layout.

### 9.5 Verify

Stop any running dev server before a production build.

```bash
ps aux | grep -E "next dev|next-server" | grep -v grep | awk '{print $2}' | xargs -r kill
npx tsc --noEmit
npm run lint
npm run build
```

Then start the dev server and verify with a real browser:

```bash
npm run dev -- --port 3100
```

Verification checklist:

- Compare against the Figma screenshot at the node's native size.
- Check 390px, 768px, 1024px, 1440px, 1696px, and 1920px.
- Check hover, focus, active, and pressed states.
- Check keyboard tab order and visible focus.
- Check that text does not clip or overflow.
- Check that images have dimensions and do not shift layout.
- Check the console for errors and hydration warnings.
- Test real interaction, not only static rendering.

Headless Chrome notes:

- Localhost needs `--disable-web-security --disable-site-isolation-trials` because fonts and the GLB are cross-origin.
- Set `document.documentElement.style.scrollBehavior = "auto"` before `scrollIntoView`.
- Capture element-level screenshots with `Page.captureScreenshot` and a clip rectangle.
- Use `deviceScaleFactor: 2` for retina comparison.

Pitfalls:

- Do not run `next build` while `next dev` is running.
  It causes `ENOENT` errors in `.next`.
- Restart the dev server after a build.

### 9.6 Stop conditions

Stop and ask the user when:

- The Figma node is ambiguous or missing states.
- The design requires a new dependency or a new font.
- The design conflicts with an existing shared component.
- The change would touch the R2 bucket, Figma file, or deployment config.
- The user asks for a commit or push, which must be explicit.

---

## 10. Definition of done

A Figma implementation is done when:

- The result matches the target node at its native size.
- Responsive behavior is defined and verified at the widths above.
- Existing tokens, fonts, radii, and components are reused.
- New code follows the file and naming conventions.
- Server and client boundaries are correct.
- Interactions and states are implemented.
- Accessibility is preserved.
- No new dependency was added.
- No dead code or placeholder content remains.
- `npx tsc --noEmit` passes.
- `npm run lint` introduces no new errors.
- `npm run build` passes.
- Screenshots have been compared against Figma.
- Changes are left uncommitted unless requested.

---

## 11. Known pitfalls and repository facts

- `README.md` still contains a leftover merge-conflict marker `>>>>>>> d8fdc5c`.
  Do not treat it as documentation, and do not fix it as part of an unrelated task.
- `@media (prefers-color-scheme: dark)` in `globals.css` sets the background back to white.
  The site is effectively light-only.
- The icon class `color-[#747474]` is not a valid Tailwind utility.
  Icon color comes from the parent `text-*` class.
- `.graphik-semibold` is weight 500, not 600.
- Inline SVG `id` collisions break clipping and gradients.
  Keep Figma suffixes or prefix ids per component.
- Work card text is outlined.
  Do not try to make it selectable.
- `next/image` is not used.
  Lint warns about `<img>`, but that is the established pattern.
- The GitHub streak widget needs `GITHUB_TOKEN`.
  Without it, a fallback panel renders.
- Music preview URLs come from iTunes and can expire or change.
  Keep the artwork and playback fallbacks.
- `gsap`, `motion`, and `leva` are installed but unused.
  Do not extend them without a reason.
- `src/app/components/particle-grid.tsx` exists but is not imported by any route.
- There are pre-existing lint warnings in `gallery.tsx`, `home.tsx`, `medium-rss.tsx`, `spacer.tsx`, and `svg.ts`.
  Do not treat them as regressions.
- The navbar uses a custom liquid-glass treatment built from layered Tailwind shadows and rings.
  Reuse that pattern for floating controls instead of inventing a new glass style.
- The music player is the only container-query component.
  Follow its `container-type` and `@container` pattern for any card that must adapt to its column.
- The site is deployed through OpenNext on Cloudflare Workers.
  `public/_headers` and `wrangler.jsonc` are part of the runtime behavior.
