Switch from @omer/ds. Use via `window.OmerDS.Switch` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface SwitchProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### OnOff

```jsx
() => <div className="row" style={{ gap: 16 }}><Switch defaultChecked aria-label="ניקוד" /><Switch aria-label="תזכורת" /></div>
```

### Disabled

```jsx
() => <Switch disabled aria-label="תזכורת" />
```
