# design-sync notes — ספירת העומר

## Setup
- The design system is **extracted** from `index.html` into `design-system/` (package `@omer/ds`, global `window.OmerDS`). The app itself still runs on vanilla `index.html` — the two copies of the CSS must be kept in sync by hand until the app imports `design-system/dist/styles.css`.
- Build: `cd design-system && npm ci && npm run build` (esbuild → `dist/index.js`, tsc → `.d.ts`, CSS concatenated into `dist/styles.css`).
- Converter run: `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules design-system/node_modules --entry design-system/dist/index.js --out ./ds-bundle`.
- Groups come from category-only stubs in `.design-sync/docs/<Name>.md` (`docsDir`); a new component needs a stub or it lands in `general`.
- Playwright for the render check: `playwright@1.56.0` in `.ds-sync/` matches the cloud container's `/opt/pw-browsers/chromium-1194`.

## Upload status
- First upload done 2026-10-20 from a local session into project **Omer DS** (`46511edc-ba99-408a-91bb-109c4b62206d`, pinned in config.json). 36 components, 186 files, all previews graded good. Next syncs: fetch `_ds_sync.json` from the project into `.design-sync/.cache/remote-sync.json` and run the driver with `--remote` (atomic path since the project is now pinned).
- Local render check: playwright@latest (1.64.1) in `.ds-sync/` matches the cached chromium-1248 on this machine (1.56.0 matches the cloud container only).

## Fixes learned
- Base resets inside `.omer-root` must use `:where()` (zero specificity). A plain `.omer-root button{color:inherit}` beat `.btn` and made gold buttons unreadable in dark mode.
- `Dialog` autofocuses its `.dlg` container so the first button doesn't show a focus ring on open.
- `OmerRoot` mirrors `--fs` onto `<html>` (rem sizes follow html) but keeps `data-theme` on its own div, so light and dark roots can sit side by side.

## Known render warns
- `[RENDER_THIN] Dialog`: height 0 because the modal `<dialog>` renders in the top layer. The screenshot shows it correctly (`cardMode: single`, 560x320). Benign.

## Re-sync risks
- **CSS drift:** `design-system/src/styles/components.css` was copied from `index.html` lines 37–250 on 2026-10-19. Changes to the app's `<style>` are not picked up automatically.
- **Logic drift:** `design-system/src/omer.ts` and `Menorah.tsx` are ports of `index.html` DATA/NUMBERS and `menorahHTML()`. Re-port them if those change.
- **Fonts:** Frank Ruhl Libre / Assistant load from Google Fonts at runtime (`[FONT_REMOTE]`). Nothing is self-hosted.
- **Filtered props:** `.d.ts` extraction filters inherited DOM props, so `ButtonProps` does not list `onClick`/`disabled` even though they work. Add `dtsPropsFor` if the design agent misuses them.
- **Grades don't travel:** the review grades from the first run live in the gitignored `.design-sync/.cache/`. The first run on another machine re-captures the 36 authored previews and needs them graded again. The previews themselves are committed, so this is review, not authoring.
