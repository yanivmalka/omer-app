AppHeader from @omer/ds. Use via `window.OmerDS.AppHeader` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface AppHeaderProps {
  title?: string;
  /** Hebrew date line under the title, e.g. "ליל ט"ז אייר תשפ"ז". */
  hebDate?: string;
  fontScale?: number;
  onFontScale?: (v: number) => void;
  onToggleTheme?: () => void;
  onSettings?: () => void;
}
```

## Examples

### Default

```jsx
() => (
  <div style={{ width: 400 }}>
    <AppHeader hebDate={'ליל י"ח אייר תשפ"ז'} />
    <StatusBar items={[{ label: 'ירושלים' }, { label: 'צאת הכוכבים היה', value: '19:52' }]} />
  </div>
)
```

### MaxText

```jsx
() => <div style={{ width: 400 }}><AppHeader hebDate={'ט"ז ניסן תשפ"ז'} fontScale={1.4} /></div>
```
