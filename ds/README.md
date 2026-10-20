# ספירת העומר (@omer/ds) — how to build with it

Hebrew, RTL, mobile-first PWA for counting the Omer. Every screen is right-to-left Hebrew; write all UI copy in Hebrew.

## Setup — always wrap in `OmerRoot`
`<OmerRoot>` sets `dir="rtl"`, `lang="he"`, the theme tokens, page background and text scale. Without it you get LTR layout and no theme colors.
```jsx
<OmerRoot theme="auto" fontScale={1} page>   {/* theme: 'auto' | 'light' | 'dark'; page = centered 680px column */}
  ...
</OmerRoot>
```
`fontScale` (0.8–1.4) is the user's א−/א+ setting: prayer text scales fully, UI chrome ~45% as much.

## Styling idiom — CSS variables + the app's class names
No utility framework. Use components first; for your own layout glue use the tokens (all defined in `components/bundle.css`, and listed with usage notes in `tokens.json`):
- Color: `var(--bg)` page, `var(--surface)` cards, `var(--surface-2)` wells, `var(--ink)` text, `var(--muted)` secondary text, `var(--line)` borders, `var(--gold)` accent / primary, `var(--gold-strong)` gold text, `var(--gold-wash)` highlight fill, `var(--warn)` halachic warnings, `var(--ok)` done.
- Type: `var(--serif)` (Frank Ruhl Libre) for prayer text, numbers and titles; `var(--sans)` (Assistant) for UI.
- Radii: `var(--radius-card)` 22px cards, `var(--radius-box)` 14px tiles, `var(--radius-pill)` pills.
- Layout helper classes: `row` (flex, wrap, 8px gap), `tools` (6px icon row), `note` (small muted text), `hl` / `hl-soft` (today highlight).
Never hard-code hex colors — dark mode comes from the variables.

## Domain rules the components already encode
- The day changes at צאת הכוכבים. Day numbers are shown in gematria (`gem(n)`), the count text via `countText(n, nusach)`; nusach is `'em' | 'sefard' | 'ashk' | 'chabad'`.
- "אתמול ספרו" line has no word "היום" and no final period (`DayHero yesterday`).
- Marking done shows only "נרשם כהושלם" (`Toast`).
- Arrows are SVG: in RTL the right arrow is previous, the left is next (`NavArrows`).
- Gold = tonight / counted; dashed red = missed; faded = future.
- Name of G-d is written ה׳ / יְיָ, never spelled out.

## Components to reach for
Screens: `AppHeader`, `StatusBar`, `DayHero` (includes `KavanotGrid`), `Tabs` + `Panel`, `MiniBar`, `AutoScrollBar`.
Siddur: `Siddur` > `CollapsibleGroup` / `PrayerSection` (variant `text` | `blessing` | `count`), `AnaBekoach`, `Menorah`.
Tracking: `TrackerGrid`, `DedicationCard`, `Quote`, `HesedSummary`.
Controls: `Button` (variant `primary` | `ghost` | `done` | `locked` | `danger`, size `small`), `IconButton` + `Icon`, `LinkButton`, `TextButton`, `FontSizeControl`, `Switch` inside `Field`, `Banner` (tone `warn`), `Badge`, `Dialog`, `Toast`.
Pure helpers are exported too: `gem`, `countText`, `shortCount`, `kav`, `stripNikud`, `SEF`, `ANA`, `PS`.

## Example
```jsx
<OmerRoot page>
  <AppHeader hebDate={'ליל י"ח אייר תשפ"ז'} />
  <StatusBar items={[{ label: 'ירושלים' }, { label: 'צאת הכוכבים', value: '19:52' }]} />
  <DayHero day={33} when="הלילה סופרים" yesterday
    actions={<><Button>סמן כהושלם</Button><Button variant="ghost" size="small">שתף</Button></>} />
  <Tabs items={[{ id: 'sid', label: 'סדר הספירה' }, { id: 'men', label: 'מנורה' }, { id: 'trk', label: 'המעקב שלי' }]} value="sid" />
  <Panel><Siddur><PrayerSection title="הספירה" variant="count">{countText(33, 'em')}</PrayerSection></Siddur></Panel>
</OmerRoot>
```

# OmerDS (@omer/ds@0.1.0)

This design system is the published @omer/ds React library, bundled as a single
browser global. All 36 components are the real upstream code.

## Where things are

- `components/bundle.js` — the whole-DS bundle; loads every component to `window.OmerDS`. First line is a `/* @ds-bundle: … */` metadata header.
- `components/bundle.css` — the single stylesheet entry: the tokens, fonts, and component styles. Link this one file.
- `components/<Name>/README.md` (example JSX + variants), `<Name>.d.ts` (types), `preview.html` (variant grid).
- `tokens.json` — the tokens, names verbatim from upstream (`tokens.css` is compiled from it).
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<Name>/README.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="components/bundle.css">
<script src="components/bundle.js"></script>
```

Components are then available at `window.OmerDS.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { AnaBekoach } = window.OmerDS;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<AnaBekoach />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<OmerRoot theme={"light"}>{children}</OmerRoot>
```

## Tokens

19 CSS custom properties from @omer/ds. Names are
preserved verbatim from upstream. They are declared inside `components/bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (2): `--surface`, `--surface-2`
- **radius** (3): `--radius-card`, `--radius-box`, `--radius-pill`
- **other** (14): `--bg`, `--ink`, `--muted`, …

## Components

### siddur
- `AnaBekoach` — The full   prayer for a day: 7 lines + , acronym column on the right this week's line washed gold, tonight's word and letter highlighted (on
- `Menorah` — Psalm 67 () drawn as a seven-branched menorah, ported from the app's menorahHTML().
- `PrayerSection` — One block of the siddur: muted heading + large serif prayer text (scales fully with --fs). Wrap a list of them in Siddur.
- `Siddur` — Container that applies siddur typography to its PrayerSections and CollapsibleGroups.

### day
- `AppHeader` — Top app header: serif title + Hebrew date on the right /+, theme and settings buttons on the left.
- `AutoScrollBar` — Floating bottom pill for auto-scrolling the siddur: gold play/pause + /speed/+ control.
- `DayHero` — The main tonight card: gold gematria day number, short count, full count text in the chosen nusach, the three kavanot, actions and banners.
- `KavanotGrid` — Three gold-wash tiles with tonight's intentions:  (sefira),   (letter/name),  (word).
- `MiniBar` — Compact sticky top bar shown while scrolling: gematria day + short count, /+, theme, settings.
- `StatusBar` — Muted info line under the header (location    time  preview mode). value renders bold ink.

### forms
- `AskItem` — One row of the     list: day label + yes/no choice. Stack several inside AskList.
- `AskList` — Vertical stack for AskItem rows.
- `Field` — Settings row: label (+ small muted hint) on the right, control on the left, hairline divider below. Native select/input inside are styled au
- `SegmentedChoice` — Two-option yes/no pill pair ( /  ) used in the missed-days dialog.
- `Switch` — On/off toggle (gold when on), RTL knob. Use inside Field.

### feedback
- `Badge` — Achievement chip ( badges). Unearned badges are faded earned ones get gold border + wash.
- `Banner` — Inline notice box. warn  halachic warning (e.g. continuing without a bracha) with a red bold lead-in title.
- `Highlight` — Gold highlight for the word/letter of the day inside prayer text. soft  bold gold text only, no box.
- `Note` — Small muted explanatory text under a section.

### actions
- `Button` — Pill button  the app's main action control ( , ,  ).
- `FontSizeControl` —  / + text-size buttons range 0.81.4 in steps of 0.1, each button disabled at its edge.
- `IconButton` — Round outlined button holding an Icon or a short glyph such as +.
- `LinkButton` — Small outlined pill link with optional icon  e.g.  ,  .
- `NavArrows` — Previous/next day arrows. RTL: right arrow  previous, left arrow  next.
- `TextButton` — Underlined gold text button for secondary actions    ,  .

### layout
- `CollapsibleGroup` — Collapsible outlined group (details)    /  . Chevron rotates when open.
- `Dialog` — Modal sheet (native dialog, showModal). Clicking the backdrop closes it. Put action Buttons in actions (left-aligned row in RTL).
- `Panel` — Large rounded surface card that holds a tab's content.
- `Tabs` — Segmented pill tab bar (the app's   /  /  ). Equal-width columns, one per item.
- `Toast` — Bottom-center ink pill confirming an action ( ). Fixed by default inline renders it in flow.

### tracking
- `DedicationCard` — Dedication card (  ): purpose + name, prayer counter,   /   actions, optional paging.
- `HesedSummary` —   : points (10 per name), badge row, next-badge hint and a table of names mentioned.
- `Quote` — Centered serif quote of the day with a small muted source.
- `TrackerGrid` — 77 grid of round day cells (rows labeled by sefira): gold  counted, dashed red  missed, faded  future.

### foundations
- `Icon` — Stroke icons from the app (SVG, so they never flip in RTL). In RTL, chevron-right  previous, chevron-left  next.
- `OmerRoot` — Root wrapper for every Omer screen: sets dirrtl, langhe, the theme tokens, background and the text scale. Without it components lose colors,
