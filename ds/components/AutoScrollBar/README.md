AutoScrollBar from @omer/ds. Use via `window.OmerDS.AutoScrollBar` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface AutoScrollBarProps {
  playing?: boolean;
  /** 1–5 (SCROLL_SPEEDS). The −/name/+ speed control shows only while playing. */
  speed?: number;
  inline?: boolean;
  onToggle?: () => void;
  onSpeed?: (v: number) => void;
}
```

## Examples

### Stopped

```jsx
() => <AutoScrollBar inline />
```

### Playing

```jsx
() => <AutoScrollBar inline playing speed={3} />
```

### Fastest

```jsx
() => <AutoScrollBar inline playing speed={5} />
```
