AskItem from @omer/ds. Use via `window.OmerDS.AskItem` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface AskItemProps {
  label: React.ReactNode;
  detail?: React.ReactNode;
  value?: "y" | "n";
  onChange?: (v: "y" | "n") => void;
  yesLabel?: string;
  noLabel?: string;
}
```

## Examples

### Rows

```jsx
() => (
  <div style={{ width: 380 }}>
    <AskList>
      <AskItem label='יום י"ב (12)' value="y" />
      <AskItem label='יום י"ג (13)' detail="נרשמה פתיחה ב־21:04, 3 דקות, 80% גלילה" />
      <AskItem label='יום י"ד (14)' value="n" />
    </AskList>
  </div>
)
```
