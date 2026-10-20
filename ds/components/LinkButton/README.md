LinkButton from @omer/ds. Use via `window.OmerDS.LinkButton` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface LinkButtonProps {
  icon?: "settings" | "theme" | "chevron-right" | "chevron-left" | "chevron-down" | "menorah" | "play" | "pause";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### ToMenorah

```jsx
() => <LinkButton icon="menorah">בצורת המנורה</LinkButton>
```

### BackToSiddur

```jsx
() => <LinkButton icon="chevron-right">חזרה לנוסח</LinkButton>
```
