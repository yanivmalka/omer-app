OmerRoot from @omer/ds. Use via `window.OmerDS.OmerRoot` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface OmerRootProps {
  /** 'auto' follows the device; 'light' / 'dark' force a theme. */
  theme?: "auto" | "light" | "dark";
  /** User text scale, 0.8–1.4 (the app's א−/א+). Prayer text scales fully, UI chrome ~45%. */
  fontScale?: number;
  /** Wraps content in the app's centered 680px column with page padding. */
  page?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### Light

```jsx
() => <OmerRoot theme="light"><Sample /></OmerRoot>
```

### Dark

```jsx
() => <OmerRoot theme="dark"><Sample /></OmerRoot>
```
