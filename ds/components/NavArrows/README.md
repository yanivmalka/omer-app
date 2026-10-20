NavArrows from @omer/ds. Use via `window.OmerDS.NavArrows` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface NavArrowsProps {
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
}
```

## Examples

### Middle

```jsx
() => <NavArrows />
```

### FirstDay

```jsx
() => <NavArrows prevDisabled />
```

### LastDay

```jsx
() => <NavArrows nextDisabled />
```
