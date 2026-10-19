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
No utility framework. Use components first; for your own layout glue use the tokens (all defined in `_ds_bundle.css`):
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
