Menorah from @omer/ds. Use via `window.OmerDS.Menorah` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

Psalm 67 (למנצח) drawn as a seven-branched menorah, ported from the app's menorahHTML().
Verse 2 on the left branch … verse 8 on the right; center branch "ישמחו…מישור" with its end on the base;
"למנצח בנגינות מזמור שיר" split above the branch tops; "שויתי ה׳ לנגדי תמיד" on top;
אנא בכח names on both sides (right top→down, left bottom→up). Past words gold, today's word boxed.

## Props

```ts
interface MenorahProps {
  /** Omer day 1–49: highlights the branch (verse), the word, the week's name and the day's letter. */
  day: number;
  /** Available width in px (the panel's inner width). The menorah always fits the width — never scrolls sideways. */
  width?: number;
  /** User text scale 0.8–1.4; larger text makes the menorah taller, not wider. */
  fontScale?: number;
  nikud?: boolean;
  /** Show the caption + explanatory note under the drawing. */
  caption?: boolean;
}
```

## Examples

### Day33

```jsx
() => <Panel><Menorah day={33} width={360} /></Panel>
```

### FirstDay

```jsx
() => <Panel><Menorah day={1} width={360} caption={false} /></Panel>
```

### LastDayWide

```jsx
() => <Panel><Menorah day={49} width={520} /></Panel>
```
