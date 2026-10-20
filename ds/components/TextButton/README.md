TextButton from @omer/ds. Use via `window.OmerDS.TextButton` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface TextButtonProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### BackToToday

```jsx
() => <TextButton>חזרה לספירה הנוכחית</TextButton>
```

### Undo

```jsx
() => <TextButton>ביטול הסימון</TextButton>
```
