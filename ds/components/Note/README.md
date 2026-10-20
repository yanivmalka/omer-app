Note from @omer/ds. Use via `window.OmerDS.Note` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface NoteProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### UnderPrayer

```jsx
() => <Note>מכוונים למילה <Highlight soft>אֱלֹהִים</Highlight> — המילה ה־33 במזמור.</Note>
```

### Hint

```jsx
() => <Note>הקש על יום קודם כדי לשנות את הסימון. לחיצה ארוכה פותחת את היום בתצוגה.</Note>
```
