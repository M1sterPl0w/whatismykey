# Design

## Context

The app is a static Vite build served from `https://m1sterpl0w.github.io/whatismykey/`, with `base: '/whatismykey/'` in `vite.config.ts`. Asset file names carry hashes, so the list of files to store changes on every build. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Install and offline use on iPhone Safari and Android Chrome with little code.
- No manual list of files to keep in sync with the build.

**Non-Goals:**
- Push notifications, background sync, store listings, and any server code.

## Decisions

- **`vite-plugin-pwa` with `registerType: 'prompt'`.** It generates the manifest and a Workbox service worker that stores every built file (`globPatterns` for js, css, html, svg, png), and removes old caches on update. Alternative: a hand-written service worker. Rejected, because it would need its own list of hashed files and cache clean-up. `prompt` mode lets the user choose when to switch versions, which the spec requires.
- **Update notice in the UI.** `main.ts` uses the plugin's `virtual:pwa-register` helper. When a new worker is waiting, a small bar appears with a "Reload" button that activates it.
- **Icons generated once from one SVG source** (`public/icon.svg`: a guitar-pick or key shape in the rust accent on cream) into PNG at 180, 192 and 512 px, plus a maskable 512 px with padding. The PNGs are committed, so the build needs no image tools. Alternative: generating on every build with `@vite-pwa/assets-generator`. Rejected, to avoid a native image dependency in CI.
- **Theme colour as two `meta name="theme-color"` tags** with `media="(prefers-color-scheme: ...)"`. The manifest `theme_color` uses the light value.
- **iPhone tags written by hand in `index.html`**, since iOS ignores most of the manifest: apple touch icon, `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`, and a default status bar style.
- **Verification in a real browser.** The plugin's output is checked by building, serving `dist` at `/whatismykey/`, loading once, going offline and reloading, using Playwright from outside the repo.

## Risks / Trade-offs

- [A broken service worker can pin users on an old version] → `prompt` mode, no caching of the service worker file itself (the plugin handles this), and the offline test must pass before merging.
- [iOS may clear stored data for a site she doesn't open for weeks] → The app reinstalls its files on the next online visit; nothing she entered is lost because nothing is saved.
- [Wrong base path breaks install] → Spec scenario checks that manifest, icons and worker load at `/whatismykey/`.
