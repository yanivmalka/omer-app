DedicationCard from @omer/ds. Use via `window.OmerDS.DedicationCard` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface DedicationCardProps {
  /** e.g. "לרפואת", "לעילוי נשמת", "להצלחת". */
  purpose: string;
  name: string;
  /** How many people already mentioned this name. */
  prayedCount?: number;
  /** The current user already mentioned it → locked button + thanks + undo. */
  prayed?: boolean;
  /** 1-based position when paging through today's names. */
  index?: number;
  total?: number;
  onPray?: () => void;
  onMore?: () => void;
  onUndo?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}
```

## Examples

### NotYetPrayed

```jsx
() => <div style={{ width: 400 }}><DedicationCard purpose="לרפואת" name="יעקב בן שרה" prayedCount={128} index={2} total={3} /></div>
```

### Prayed

```jsx
() => <div style={{ width: 400 }}><DedicationCard purpose="לעילוי נשמת" name="אברהם בן יצחק" prayedCount={57} prayed /></div>
```

### FirstToPray

```jsx
() => <div style={{ width: 400 }}><DedicationCard purpose="להצלחת" name="משפחת לוי" /></div>
```
