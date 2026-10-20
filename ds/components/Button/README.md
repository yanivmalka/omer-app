Button from @omer/ds. Use via `window.OmerDS.Button` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface ButtonProps {
  /** primary = gold pill; ghost = outlined; done = completed (green outline); locked = already-done, gold wash; danger = dest */
  variant?: "primary" | "ghost" | "done" | "locked" | "danger";
  size?: "md" | "small";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### Variants

```jsx
() => (
  <div className="row">
    <Button>סמן כהושלם</Button>
    <Button variant="ghost">שתף</Button>
    <Button variant="done">✓ הושלם</Button>
    <Button variant="locked" disabled>✓ הזכרת בתפילתך</Button>
    <Button variant="danger">מחק הכל</Button>
  </div>
)
```

### Small

```jsx
() => (
  <div className="row">
    <Button size="small">סמן כהושלם</Button>
    <Button size="small" variant="ghost">לא ספרתי כלל</Button>
    <Button size="small" variant="ghost">אתר אותי</Button>
  </div>
)
```
