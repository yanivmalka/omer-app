MiniBar from @omer/ds. Use via `window.OmerDS.MiniBar` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface MiniBarProps {
  day: number;
  nusach?: "em" | "sefard" | "ashk" | "chabad";
  /** Slides in when the hero scrolls out of view. */
  visible?: boolean;
  /** Render in normal flow instead of fixed to the top. */
  inline?: boolean;
  fontScale?: number;
  onFontScale?: (v: number) => void;
  onToggleTheme?: () => void;
  onSettings?: () => void;
  onCountClick?: () => void;
}
```

## Examples

### Inline

```jsx
() => <div style={{ width: 400 }}><MiniBar day={33} inline /></div>
```

### AshkenazLongCount

```jsx
() => <div style={{ width: 400 }}><MiniBar day={48} nusach="ashk" inline /></div>
```
