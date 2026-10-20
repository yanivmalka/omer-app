# @omer/ds — ספירת העומר design system

Tokens, styles and React components extracted from `../index.html`, built to be synced into Claude Design (`/design-sync`; see `../.design-sync/NOTES.md`).

```bash
npm ci && npm run build   # dist/index.js, dist/*.d.ts, dist/styles.css
```

- `src/styles/tokens.css`: colors (light + dark), fonts, text scale.
- `src/styles/components.css`: the app's component CSS (same class names as `index.html`).
- `src/primitives.tsx`: OmerRoot, Button, IconButton, Tabs, Dialog…
- `src/omer-components.tsx`: DayHero, AnaBekoach, TrackerGrid, DedicationCard…
- `src/Menorah.tsx`: Psalm 67 drawn as a menorah.
- `src/omer.ts`: pure logic (gematria, count text, kavanot) and texts.

The app does not import this package yet. Keep both in sync when you change styles.
