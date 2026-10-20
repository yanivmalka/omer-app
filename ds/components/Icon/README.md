Icon from @omer/ds. Use via `window.OmerDS.Icon` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface IconProps {
  name: "settings" | "theme" | "chevron-right" | "chevron-left" | "chevron-down" | "menorah" | "play" | "pause";
  size?: number;
}
```

## Examples

### AllIcons

```jsx
() => (
  <div className="row" style={{ gap: 18, color: 'var(--ink)' }}>
    {names.map(n => <span key={n} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><Icon name={n} size={24} /><small className="note">{n}</small></span>)}
  </div>
)
```

### Gold

```jsx
() => <div className="row" style={{ color: 'var(--gold)' }}><Icon name="menorah" size={32} /><Icon name="play" size={32} /></div>
```

## Related

`IconButton`
