---
name: browser-smoke
description: Exercise cmsbook3's user-visible features in a browser via Playwright MCP. Use after dependency bumps (Node, Vite, Vitest, Vue, Vuetify), routing changes, theming changes, or large refactors that could regress page rendering or navigation. Reports per-step ✅/❌/⚠️ and an aggregate summary.
---

# cmsbook3 browser smoke test

A repeatable browser-driven smoke test for cmsbook3. Catches regressions the unit tests don't cover (the unit suite is intentionally small — see `src/**/__tests__/`).

## Concrete URLs and content references

This skill describes the test methodology. **Concrete test URLs**, the backend content directory path, expected chapter labels, and re-discovery commands live in `pages.local.md` adjacent to this file. That file is gitignored.

Read `pages.local.md` before running the suite. If it is missing, ask the user to populate it using the template at the bottom of this file.

In the steps below, placeholders like `<codeAndMathPage>` refer to keys defined in `pages.local.md`.

## Preconditions

- Dev server up at `http://localhost:8081` (run by the user via `pnpm dev`). If not, ask — do not start it yourself; the user owns that process.
- Backend reachable at the URL configured in `public/config.json` (`cmsbookUrl`). Quick probe: `curl -sS -o /dev/null -w "%{http_code}\n" "$cmsbookUrl/.cmsbook3/title.json"` should return `200`.
- Playwright MCP tools available: `mcp__playwright__browser_navigate`, `_click`, `_snapshot`, `_console_messages`, `_take_screenshot`, `_wait_for`, `_evaluate`, `_resize`, `_close`. Load via `ToolSearch` if not already loaded.

If a precondition is missing, stop and ask.

## Test sequence

Run in order. Each step gets ✅ pass / ❌ fail / ⚠️ flake-suspect. The browser tab is reused across steps.

### 1. Boot — `/`

Navigate to `http://localhost:8081/`.

- Page redirects from `/` (HomeView pushes the home target — target is data-driven from the backend).
- `<title>` resolves to a non-empty string (not `"loading..."`).
- Top tablist contains the chapter labels listed in `pages.local.md` `expectedChapterLabels`.

### 2. First-tab click

Click the tab named `<sectionListChapter>`.

- URL pattern: `/<chapter>/index/index.md`.
- Tab `[selected]` attribute moves to the clicked tab.
- Drawer populates with sections.
- Breadcrumbs show `<chapter> / index / index.md`.

### 3. Section drawer click

Click the drawer item named `<externalLinkSection>`.

- URL matches `<externalLinkPage>`.
- Drawer item `[active]`.
- Page renders an `<h1>` matching the section name.

### 4. External link styling

Stay on the page from step 3. Inspect the external link.

- Has `target="_blank"`.
- An mdi-open-in-new icon appears after the link's text content.

### 5. Code highlighting

Navigate to `<codeAndMathPage>`.

- At least one `<code class="hljs language-…">` element exists.
- Inside, syntax tokens are wrapped in `<span class="hljs-…">` (use `browser_evaluate` if a snapshot can't show the spans clearly).

### 6. MathJax ⚠️

Same page (`<codeAndMathPage>`). Wait briefly.

- One or more `<mjx-container>` elements present.
- ⚠️ **Known race**: first-ever navigation may fail with `window.MathJax.typesetPromise is not a function` (visible in console). If absent on first try, navigate to another page and back, then re-check. Report whether it appeared on first try or on retry.

### 7. Dark mode toggle

Click the moon/sun button (`ToggleDarkModeButton` in drawer bottom).

- `<html>` class flips (VueUse `useDark` adds/removes a class on the configured selector).
- localStorage key for color scheme is set.
- Icon swaps between `mdi-weather-sunny` and `mdi-weather-night`.

### 8. Dark mode persists

Reload the page.

- Same theme persists.
- Toggle back, reload again, verify the opposite state also persists.

### 9. Mobile drawer auto-hide

Resize viewport to 375×667 with `browser_resize`.

- Drawer auto-closes (Vuetify `useDisplay().mobile` flips true; `useDrawer` watches it).
- `v-app-bar-nav-icon` becomes visible in the app bar.

### 10. Mobile drawer reopen

Click the nav-icon button.

- Drawer slides in over content.

Reset viewport to 1280×720 before continuing.

### 11. Lazy `/about`

Navigate to `/about`.

- Heading "This is an about page" visible.

### 12. Lazy `/theme`

Navigate to `/theme`.

- Heading "Theme" visible.

### 13. Missing markdown

Navigate to `<missingMarkdownPath>` (a path with an existing chapter+section but a non-existent file).

- Page renders an `<h1>` containing "Error: cannot get:".

### 14. Catch-all ⚠️

Navigate to `/totally-bogus-xyz` (a literal that matches no defined route).

- Expected: `PageNotFound` with "Page not found." text.
- ⚠️ **Known issue**: router defines `/* → PageNotFound` using vue-router 3 syntax. In vue-router 4 this likely does not match; the route may fall through to `/:chapter` and render a chapter view that 404s on its sections fetch. Report what actually happens — that's the diagnostic value.

### 15. Scroll restoration ⚠️

Navigate to a long page (`<codeAndMathPage>` is usually a good choice).

- Scroll to bottom: `browser_evaluate` with `() => window.scrollTo(0, document.body.scrollHeight)`.
- Click any drawer item to navigate away.
- `browser_navigate_back` (or `window.history.back()`).
- Expected: scroll position restored to bottom.
- ⚠️ Timing-sensitive; insert `browser_wait_for { time: 0.5 }` after `back` before asserting `scrollY`.

### 16. MD3 palette (informational)

`browser_evaluate`:

```js
() => getComputedStyle(document.documentElement).getPropertyValue('--v-theme-primary')
```

- Read in current theme.
- Toggle dark mode.
- Re-read.
- Verify the values differ.
- Informational only — exact value varies; difference confirms the dynamic palette is being applied to Vuetify.

## Reporting format

Report per step inline as you go. End with a summary line:

> Smoke: 12 ✅, 0 ❌, 4 ⚠️ (steps 6, 14, 15, 16 — known flakes/informational). Continue?

If any ❌ appears, **stop and report** before moving to the next planned action (commit, next hop, etc.). Do not silently proceed.

## Known pre-existing issues (do NOT flag as new failures)

These exist on `main` and are unrelated to dependency or runtime upgrades:

- **404 on `/undefined/.cmsbook3/sections.json`** — race in `src/plugins/pinia/stores/main.ts` where `getSectionsInChapter` is called before the chapter param resolves.
- **404 on the PHP backend's redirect target's `.cmsbook3/sections.json`** — the bare backend root may redirect to a non-v3 path; the v3 client tries to fetch v3 metadata for that non-v3 chapter. The exact path is in `pages.local.md` `phpRedirectChapter` if relevant.
- **MathJax `typesetPromise is not a function`** — `mathjax.ts` calls typeset before `public/load-mathjax.js` finishes loading the MathJax script. First page after cold start may not typeset.
- **Catch-all `/*` route** — vue-router 3 pattern; vue-router 4 expects `/:pathMatch(.*)*`. PageNotFound is likely dead code today.

## Element-finding tactics

`mcp__playwright__browser_click` needs element refs from a snapshot. Workflow:

1. `browser_snapshot` — capture accessibility tree (refs look like `e30`).
2. Locate the target by role + accessible name in the snapshot text.
3. Pass the `ref` (e.g. `e30`) to `browser_click` as the `target` parameter.

Common roles:

- Top tabs: role `tab`, accessible names match chapter labels.
- Drawer items: role `link`, accessible names match section names.
- Dark mode toggle: button role inside the drawer bottom region.

If a click fails with `does not match`, re-snapshot — refs change on each navigation.

## Template for `pages.local.md`

If `pages.local.md` doesn't exist, ask the user to create it adjacent to this file using this shape:

```markdown
# Local pages — gitignored

# Backend content directory (where the markdown lives on disk)
contentDir: <absolute path>

# Chapter to use for tab/section tests (must have an `index/index.md`)
sectionListChapter: <chapter label>

# Section under that chapter that has at least one external link
externalLinkSection: <section label>
externalLinkPage: <full URL path, e.g. /chapter/section/web.md>

# Page that contains BOTH fenced code blocks and LaTeX math
codeAndMathPage: <full URL path>

# Path with existing chapter+section but a non-existent file
missingMarkdownPath: <full URL path>

# Expected chapter labels in the top tablist (in display order)
expectedChapterLabels: [Chapter1, Chapter2, ...]

# Optional: chapter the bare backend root redirects to (for the known 404 noise)
phpRedirectChapter: <chapter name or "" if not applicable>

# Re-discovery commands if backend content moves and these pages stop matching
findMath: cd <contentDir> && grep -rl --include='*.md' -E '\$\$|\\\(|\\\[' .
findCode: cd <contentDir> && grep -rl --include='*.md' -E '^```[a-zA-Z]' .
```
