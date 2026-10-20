IconButton from @omer/ds. Use via `window.OmerDS.IconButton` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface IconButtonProps {
  /** Accessible Hebrew label (required — the button has no visible text other than the icon/glyph). */
  label: string;
  /** md = 42px header button; sm = 36px tool button (also used for the א−/א+ glyphs). */
  size?: "md" | "sm";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### HeaderTools

```jsx
() => (
  <div className="tools">
    <IconButton size="sm" label="הקטן טקסט">א−</IconButton>
    <IconButton size="sm" label="הגדל טקסט">א+</IconButton>
    <IconButton size="sm" label="בהיר או כהה"><Icon name="theme" size={18} /></IconButton>
    <IconButton label="הגדרות"><Icon name="settings" /></IconButton>
  </div>
)
```

### Disabled

```jsx
() => <div className="tools"><IconButton size="sm" label="הגדל טקסט" disabled>א+</IconButton><IconButton size="sm" label="הקטן טקסט">א−</IconButton></div>
```
