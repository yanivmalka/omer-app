TrackerGrid from @omer/ds. Use via `window.OmerDS.TrackerGrid` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface TrackerGridProps {
  /** day (1–49) → 'y' counted / 'n' missed. */
  statuses: Record<number, DayStatus>;
  /** Days after this are disabled (future). */
  current?: number;
  /** Tonight's day gets a gold ring. */
  tonight?: number;
  onDayClick?: (day: number) => void;
  showLegend?: boolean;
}
```

## Examples

### MidOmer

```jsx
() => <div style={{ width: 380 }}><TrackerGrid statuses={statuses} current={21} tonight={21} /></div>
```

### AllCounted

```jsx
() => {
  const all: Record<number, 'y'> = {}; for (let i = 1; i <= 49; i++) all[i] = 'y';
  return <div style={{ width: 380 }}><TrackerGrid statuses={all} current={49} /></div>;
}
```
