Tabs from @omer/ds. Use via `window.OmerDS.Tabs` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface TabsProps {
  items: { id: string; label: string; }[];
  value: string;
  onChange?: (id: string) => void;
}
```

## Examples

### Siddur

```jsx
() => <div style={{ width: 380 }}><Tabs items={items} value="sid" /></div>
```

### Tracker

```jsx
() => <div style={{ width: 380 }}><Tabs items={items} value="trk" /></div>
```
