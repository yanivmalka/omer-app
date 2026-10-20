Toast from @omer/ds. Use via `window.OmerDS.Toast` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface ToastProps {
  message: string;
  visible?: boolean;
  inline?: boolean;
}
```

## Examples

### Completed

```jsx
() => <Toast inline message="נרשם כהושלם" />
```

### Copied

```jsx
() => <Toast inline message="הטקסט הועתק" />
```
