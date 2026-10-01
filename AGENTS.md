# AGENTS.md

Guidance for coding agents (Codex and others) when working in this repository.

## Project

Bellimal is a Ghost (≥6.0) theme: Handlebars templates, Tailwind CSS 3.4, Gulp. Brand: Atkinson Hyperlegible Mono everywhere, coral (`#e9805d`) on dark slate. Signature pieces: an interactive faux terminal on the homepage and a featured-image hero on every content template. Live site: https://alessandrobelli.it. Windows dev environment.

## Build, test, deploy

```bash
npm run build:css    # Tailwind: assets/css/input.css → assets/css/main.css
npm run dev:css      # same, in watch mode
npm test             # gulp build, then gscan (Ghost theme validation)
npm run test:ci      # gscan --fatal --verbose
```

- **After editing `input.css` (or a file it `@import`s), run `npm run build:css` and commit `assets/css/main.css`.** It is the only stylesheet the site loads. If a `.bml-*` rule doesn't seem to apply, suspect a stale `main.css` first.
- **Pushing to `main` deploys to the live site.** `.github/workflows/to-ghost.yml` uploads the repo as the theme via `TryGhost/action-deploy-theme`.
- Gulp (`npm run dev`, `npm run all`) only writes `assets/built/` (PostCSS copies, a `casper.js` bundle) and live-reloads `.hbs`. Templates load nothing from `assets/built/`; never edit it. `run-gulp.yml` targets `master` and never runs. `gulpfile.js` still says "Casper" (the upstream theme) in places.

## Design system

### Tokens

Defined twice; keep them in sync:
1. CSS custom properties in the `:root` (light) and `.dark` blocks at the top of `assets/css/input.css` — used by every `.bml-*` rule.
2. `tailwind.config.js` `extend.colors` — Tailwind utilities (`bg-card`, `text-accent`, …).

| Token           | Light     | Dark      | Use                                   |
| --------------- | --------- | --------- | ------------------------------------- |
| `--bg`          | `#ffffff` | `#1d232f` | Page background                       |
| `--panel`       | `#f5f6f8` | `#181d28` | Sidebar, chrome bars                  |
| `--card`        | `#ffffff` | `#232936` | Cards, raised surfaces                |
| `--terminal`    | `#0f1218` | `#0f1218` | Terminal, code blocks (always dark)   |
| `--line`        | `#e5e7eb` | `#2d3340` | Borders, dividers                     |
| `--text`        | `#1d232f` | `#e6e7ea` | Primary text                          |
| `--text-dim`    | `#4b5563` | `#b0b6c1` | Body text                             |
| `--text-mute`   | `#6e7480` | `#8a909c` | Captions, meta, labels                |
| `--accent`      | `#e9805d` | `#e9805d` | Coral backgrounds, borders, markers   |
| `--accent-text` | `#c4532f` | `#e9805d` | Coral **text**                        |

Also `--accent-soft` / `--accent-line` (12% / 30% coral) for tints and borders, and status colors `--prompt`, `--traffic-red|yellow|green`.

### Contrast (WCAG)

- Coral text uses `--accent-text`, never `--accent`: `#e9805d` on white is 2.7:1. `--accent-text` is 4.5:1 on white (AA) and 5.8:1 on dark `--bg`.
- Plain `--accent` as text only on surfaces that are dark in both modes. These "dark islands" redeclare tokens: `.bml-terminal` (all text tokens + `--accent-text`) and `.bml-post-hero` / `.bml-page-hero` (`--accent-text`, since text sits on the darkened image). `.bml-card__tag` (dark pill on the card image) uses `--accent` directly.
- Dark-mode targets on `--bg`: `--text-dim` 7.7:1 (AAA body text), `--text-mute` 4.9:1 (AA). Recheck ratios when changing any text or surface value.
- Tailwind's `text-accent` is the raw `#e9805d` — it fails on light surfaces.
- Legacy Tailwind colors (`orangeValencia`, `anthracite`, `dark*`) and the `.prose` rules near the top of `input.css` are pre-2026 leftovers; templates no longer use `.prose`. Don't build on them.

### Conventions

- Components: partial `partials/kebab-name.hbs`, classes `.bml-name__element--modifier`, styles in `input.css` using tokens (no hex literals), included with `{{> "name"}}`. `.kg-*` classes belong to Ghost.
- `.bml-prose` is the article body (post + page): mono 14px/1.85, dotted-underline coral links, terminal-style `<pre>`, centered italic figcaptions.
- Fonts: Atkinson Hyperlegible Mono only (400/700 + italics), Google Fonts in `default.hbs`. `font-body`, `font-heading`, `font-mono` all map to the same stack.
- Breakpoint: custom Tailwind screen `tab: 900px` splits sidebar and main; `mobile-menu.js` matches it.
- Image sizes `xxs`–`xl` for `{{img_url size=…}}` live in `package.json` `config.image_sizes`.
- Check light and dark mode after any visual change.

## Templates

Root templates (all `{{!< default}}`):
- `default.hbs` — shell: head (fonts, `css/main.css`), mobile topbar, sidebar drawer (`#sideNav`), `<main class="bml-main">`. Scripts load individually via `{{asset}}`: `prism.js` only on post/page, `terminal.js` only on home. An inline head script applies `.dark` to `<html>` before paint (`localStorage.darkMode`, else `prefers-color-scheme`); Tailwind uses `darkMode: "class"`.
- `home.hbs` — projects-first: (1) terminal, (2) CTA staple, (3) featured project — `tag:{{@custom.projects_tag}}+featured:true`, falling back to the latest project, (4) more-projects grid, only when 2+ projects exist (`{{#if posts.[1]}}`), (5) latest writing — `tag:-{{@custom.projects_tag}}` so projects don't repeat. A hidden `data-terminal-data` block at the bottom feeds `terminal.js`.
- `post.hbs` — hero, `.bml-prose` body, share row, `{{comments}}`, Continue Reading card (CSS hides whichever of prev/next renders second).
- `page.hbs` — same hero inside `{{#if @page.show_title_and_feature_image}}`, "Last updated" byline, `.bml-prose`, You Might Like.
- `tag.hbs` / `index.hbs` — `.bml-page-hero` + card grid + pagination. `author.hbs` — `.bml-author-hero` + card grid + pagination.
- `error.hbs` / `error-404.hbs` — terminal-themed error state; the 404 lists 3 recent posts.

Partials:
- `sidebar.hbs` + `navigation.hbs` — identity, SITE nav, TOPICS chips, ELSEWHERE links, theme toggle.
- `post-card.hbs` — the card for every grid. Keep `min-width: 0; overflow: hidden` on the article and `aspect-ratio: 16/9` on the image so cards never blow out grid cells.
- `featured-section.hbs` — homepage featured card (both branches of band 3).
- `responsive-img.hbs` — `<picture>` with AVIF/WebP/JPEG via `{{img_url format=…}}` + srcset. Args: `image`, `alt`, `sizes`, `imgClass`, `loading`, `fetchpriority`, `hidden`. Only Ghost-hosted images get transcoded; external URLs fall back to the JPEG source.
- `cta-staple.hbs` (home only), `pagination.hbs`, `share-block.hbs` (copy button handled by `share.js`), `you-might-like.hbs`, `icons/*.hbs` (accept a `class` param).

## JavaScript (`assets/js/`)

- `darkmode.js` (theme toggle), `mobile-menu.js` (drawer below 900px), `sidebar.js` (TOPICS collapse + show-more), `share.js` (copy link), `social-embeds.js` (X/Twitter embed dark-mode shim). Third-party scripts go in `assets/js/lib/`.
- `terminal.js` — homepage terminal. Commands live in the `commands = { … }` object; each handler gets `args`. Print with `printLine(text, opts)` (`{ cls: 'error' }` or `{ href }`) and add a line to `help`. Tab completion covers commands, nav, post and page slugs; history is capped at 50 entries in localStorage.
- New server data for the terminal: in `home.hbs`'s hidden block, add `<ul data-bml="key">` with `<li data-field="{{value}}">` items (attribute encoding handles quotes), then read with `readList('key', ['field', …])`. Single values: `<span data-bml="key">` + `readText('key')`.

## Ghost custom settings

Defined in `package.json` → `config.custom`, read as `{{@custom.key}}`.
- homepage: `hero_title` (terminal `whoami`), `hero_description` (HTML; terminal `cat focus.txt`), `projects_tag` (default `projects`; drives the three project bands), `cta_primary_label/url`, `cta_secondary_label/url`. `featured_tag` is defined but no template uses it.
- sidebar: `sidebar_status`, `sidebar_link{1,2,3}_text/url` (links 1 and 2 show GitHub and LinkedIn icons).
- site-wide: `contact_email` (terminal `contact`; falls back to `hello@example.com`).

Ghost only knows the `homepage` and `post` groups; `sidebar` and `site-wide` land under Site-wide (that's the gscan recommendation `npm test` prints). New defaults only apply on theme re-activation, so templates keep `{{#if}}…{{else}}fallback{{/if}}`.

## Gotchas

- **Global element rules are defaults only.** The `h1`–`h6` and `a:hover` rules near the top of `input.css` set `color: var(--accent-text)` at element specificity. They used to be `@apply … !important` (and `hover:` inside `a:hover` compiled to `a:hover:hover`), which silently overrode every `.bml-*` heading and hover color. Never add `!important` or Tailwind variants to element-level rules.
- **Ghost's `cards.min.css` loads after ours** (`card_assets: true`) and wins ties. Override with `.kg-card.kg-X …` selectors (0,3,1 beats Ghost's 0,2,1); see `bookmarks.css`.
- **`current` on nav items** exists only when Ghost renders `partials/navigation.hbs` through the `{{navigation}}` helper, not when iterating `@site.navigation`.
- **No block helpers inside `{{#get}}` filter strings**: `filter="a{{#if x}}+b{{/if}}"` throws. Only simple `{{var}}` interpolation works; branch with separate `{{#get}}` calls instead.
- **Dates:** `{{date updated_at format="…"}}`, never `{{updated_at format="…"}}` (500 error).
- **Limits:** gscan rejects `limit="all"`; Ghost 6 caps `{{#get}}` at 100.
- **gscan requires** `.kg-width-wide` / `.kg-width-full` styles (defined in `.bml-prose`) and that `page.hbs` honors `@page.show_title_and_feature_image`.
- **gscan rejects** sub-expressions like `(eq pagination.pages 1)` and `{{#or}}`. `pagination.hbs` uses `{{#if pagination.pages}}` and renders disabled chips on single-page archives.
- **`you-might-like.hbs`:** don't interpolate `{{id}}` into its filter; it breaks pages.
- **Author social links:** `{{twitter_url}}` / `{{facebook_url}}` are deprecated in Ghost 6; build `https://x.com/{{twitter}}` and `https://www.facebook.com/{{facebook}}` manually.
- **Search:** any `<button data-ghost-search>` wires Ghost's search modal and Cmd/Ctrl+K with no JS. None is mounted right now.
