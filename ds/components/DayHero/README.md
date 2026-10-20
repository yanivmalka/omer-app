DayHero from @omer/ds. Use via `window.OmerDS.DayHero` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface DayHeroProps {
  /** Omer day 1–49. Drives the gematria number, short count, full count text and the kavanot. */
  day: number;
  nusach?: "em" | "sefard" | "ashk" | "chabad";
  /** Show vowel points (ניקוד). */
  nikud?: boolean;
  /** Muted status line, e.g. "הלילה סופרים" or "הערב, מ־19:42, נספור". */
  when?: string;
  onPrev?: () => void;
  onNext?: () => void;
  /** Action row (usually <Button>s). */
  actions?: React.ReactNode;
  /** "אתמול ספרו" line; pass true to derive it from `day`, or a node. Shown without the word "היום" and without the final per */
  yesterday?: React.ReactNode;
  /** Banners below the hero content. */
  children?: React.ReactNode;
}
```

## Examples

### Tonight

```jsx
() => (
  <DayHero day={33} when="הלילה סופרים" yesterday
    actions={<><Button>סמן כהושלם</Button><Button variant="ghost" size="small">שתף</Button></>} />
)
```

### Completed

```jsx
() => (
  <DayHero day={7} nusach="ashk" when="הלילה סופרים" yesterday
    actions={<><Button variant="done">✓ הושלם</Button><Button variant="ghost" size="small">שתף</Button></>} />
)
```

### MissedWarning

```jsx
() => (
  <DayHero day={18} when="היום — נספר אמש">
    <Banner tone="warn" title="ממשיכים לספור בלי ברכה.">לפי הרשום, חסר יום שלם בספירה. נוהגים לשמוע את הברכה מהש"ץ ולענות אמן. במקרה של ספק — שאל רב.</Banner>
  </DayHero>
)
```

### FirstNight

```jsx
() => (
  <DayHero day={1} nusach="sefard" nikud={false} when="הלילה סופרים" yesterday
    actions={<Button>סמן כהושלם</Button>} />
)
```
