FontSizeControl from @omer/ds. Use via `window.OmerDS.FontSizeControl` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface FontSizeControlProps {
  value: number;
  onChange?: (v: number) => void;
  size?: "md" | "sm";
}
```

## Examples

### Default

```jsx
() => <FontSizeControl value={1} />
```

### AtMinimum

```jsx
() => <FontSizeControl value={0.8} />
```

### AtMaximum

```jsx
() => <FontSizeControl value={1.4} size="md" />
```
