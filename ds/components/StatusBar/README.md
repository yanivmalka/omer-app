StatusBar from @omer/ds. Use via `window.OmerDS.StatusBar` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface StatusBarProps {
  items: { label?: string; value?: React.ReactNode; }[];
}
```

## Examples

### Evening

```jsx
() => <StatusBar items={[{ label: 'בני ברק' }, { label: 'צאת הכוכבים', value: '19:48' }]} />
```

### BeforeDawn

```jsx
() => <StatusBar items={[{ label: 'ירושלים' }, { label: 'אפשר לספור בברכה עד עלות השחר', value: '04:21' }, { value: 'מצב תצוגה מקדימה' }]} />
```
