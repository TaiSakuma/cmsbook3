# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

Package manager: **yarn** (lockfile is `yarn.lock`).

```bash
yarn install            # install deps
yarn dev                # vite dev server on http://localhost:8081
yarn build              # production build into dist/
yarn serve              # preview the production build
yarn lint               # eslint over src/
yarn test               # run vitest (jsdom env)
yarn test path/to/file.spec.ts   # run a single test file
yarn test -t "name"     # run tests matching a name
```

Build base path comes from `VITE_PUBLIC_PATH` (`.env` / `.env.production`); the
dev server reads it via `loadEnv` in [vite.config.ts](vite.config.ts).

The TS path alias `@/*` maps to `src/*` (configured in both
[tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts)). The
`path` import is aliased to `path-browserify` for the browser bundle.

CI runs only `yarn test` (see [.github/workflows/unit-test.yml](.github/workflows/unit-test.yml)).

## Architecture

cmsbook3 is a Vue 3 + Vuetify 3 (Material Design 3 blueprint) single-page app
that renders a remote tree of Markdown content as a browsable "book". The app
itself ships no content — at runtime it fetches a `config.json` and then loads
chapters/sections/pages from a CMS-style URL.

### Bootstrap chain

[src/main.ts](src/main.ts) wires Pinia, the router, and Vuetify into the root
[App.vue](src/app/App.vue), which wraps everything in `<v-app>` plus a
`<provide-config>` boundary. [AppMain.vue](src/app/AppMain.vue) hosts the
navigation drawer, app bar, and `<router-view>`.

### Config flow (provide/inject, generic)

Runtime config is centralized in [src/utils/config](src/utils/config) and
follows a deliberately generic provide/inject pattern:

- [load-config.ts](src/utils/config/load-config.ts) — `useLoadConfigT<T>()` fetches `config.json` from `VITE_PUBLIC_PATH` using `@vueuse/core`'s `useFetch`, merges in defaults, and runs a validator. Exposes `loading`, `error`, `config`.
- [provide-config.ts](src/utils/config/provide-config.ts) — `useProvideConfigT<T>()` provides the config under a shared `injectionKey` ([key.ts](src/utils/config/key.ts)).
- [inject-config.ts](src/utils/config/inject-config.ts) — `useConfigT<T>()` is the consumer side.
- [index.ts](src/utils/config/index.ts) — concretizes the generics for the app's `Config` (`cmsbookUrl`, `indexFilename`) and exports `useConfig`, `useProvideConfig`, `useLoadConfig`.
- [ProvideConfig.vue](src/utils/config/ProvideConfig.vue) / [ProvideConfigExe.vue](src/utils/config/ProvideConfigExe.vue) — render-time wrappers that load + provide config and gate rendering on success.

When touching config, prefer extending the typed wrappers in `index.ts` over
calling the generic `*T` helpers directly.

### Routing

[src/plugins/router.ts](src/plugins/router.ts) defines:

- `/` → `HomeView`
- `/about`, `/theme` (lazy)
- `/:chapter` → `ChapterView`
- `/:chapter/:section/:page*` → `Page` (catch-all page renderer)
- `/*` → `PageNotFound`

`createWebHistory` uses `import.meta.env.VITE_PUBLIC_PATH` so the same build
can be served from any subpath.

### Page rendering pipeline

[src/views/page/](src/views/page/) is the heart of the app:

1. [markdown-source.ts](src/views/page/markdown-source.ts) — derives a path from the route params (defaulting trailing segment to `config.indexFilename`) and pulls raw Markdown via `useLoadFrom` from `cmsbookUrl`.
2. [parse.ts](src/views/page/parse.ts) → [src/utils/markdown.ts](src/utils/markdown.ts) — runs `marked` (GFM) with `marked-highlight` + `highlight.js` to produce HTML.
3. [edit-html.ts](src/views/page/edit-html.ts) — post-processes the HTML (e.g. resolves relative asset paths against the page's directory).
4. [content.ts](src/views/page/content.ts) — composes the above into a `content` ref consumed by [Page.vue](src/views/page/Page.vue).
5. [mathjax.ts](src/views/page/mathjax.ts) / [MathJax.vue](src/views/page/MathJax.vue) — typesets math after the DOM updates. MathJax itself is loaded by [public/load-mathjax.js](public/load-mathjax.js) referenced from [index.html](index.html).

Breadcrumbs and per-page navigation live under [src/views/page/breadcrumbs/](src/views/page/breadcrumbs/).

### Remote content layer

[src/utils/cmsbook3/](src/utils/cmsbook3/) is the only place that knows the
on-disk layout of a cmsbook tree:

- `useGetTitle()` → `/.cmsbook3/title.json`
- `useGetChapters()` → `/.cmsbook3/chapters.json`
- `useGetSectionsInChapter(chapterPath)` → `<chapter>/.cmsbook3/sections.json`
- `useLoadFrom()` ([load.ts](src/utils/cmsbook3/load.ts)) — generic axios GET against `config.cmsbookUrl + path`. All higher layers go through this.

Navigation drawer composition uses these in [src/components/navigation-drawer/list-contents.ts](src/components/navigation-drawer/list-contents.ts).

### Theming (Material Design 3 dynamic color)

[src/utils/dynamic-color/](src/utils/dynamic-color/) wraps
`@material/material-color-utilities` to derive light/dark color schemes from a
single source color. [src/utils/color-theme/](src/utils/color-theme/) bridges
those palettes onto Vuetify's theme system and toggles dark mode
([dark-mode.ts](src/utils/color-theme/dark-mode.ts) +
[ToggleDarkModeButton.vue](src/components/ToggleDarkModeButton.vue)). The
source color is currently hard-coded in
[color-theme.ts](src/utils/color-theme/color-theme.ts).

Vuetify is configured with the `md3` blueprint and the MDI icon set in
[src/plugins/vuetify.ts](src/plugins/vuetify.ts).

### Tests

Vitest runs in jsdom ([vitest.config.ts](vitest.config.ts), inherits the vite
config so the `@/` alias works). Specs live in `__tests__/` directories
colocated with the code they cover (see `src/utils/config/__tests__/`,
`src/views/page/__tests__/`, etc.). `tests-old/` is excluded.

## Conventions

- Composables follow Vue's `useXxx` naming and are colocated with their feature directory; prefer adding new logic as a composable next to the consumer rather than in a global utils dump.
- Shared logic that is genuinely generic (like config provide/inject) is exposed as a `*T` generic helper plus a concrete wrapper — keep that split if you extend it.
- Imports use the `@/...` alias rather than long relative paths.
- The repo uses ESLint + Prettier ([.eslintrc.ts](.eslintrc.ts)) — run `yarn lint` before committing.
