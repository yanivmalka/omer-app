SegmentedChoice from @omer/ds. Use via `window.OmerDS.SegmentedChoice` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface SegmentedChoiceProps {
  value?: "y" | "n";
  onChange?: (v: "y" | "n") => void;
  yesLabel?: string;
  noLabel?: string;
}
```

## Examples

### Unset

```jsx
() => <div className="ask-item"><SegmentedChoice /></div>
```

### Counted

```jsx
() => <div className="ask-item"><SegmentedChoice value="y" /></div>
```

### Missed

```jsx
() => <div className="ask-item"><SegmentedChoice value="n" /></div>
```
