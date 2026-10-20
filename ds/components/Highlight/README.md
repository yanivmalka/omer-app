Highlight from @omer/ds. Use via `window.OmerDS.Highlight` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface HighlightProps {
  soft?: boolean;
  children?: React.ReactNode;
}
```

## Examples

### InPsalm

```jsx
() => (
  <p className="hl-wrap" style={{ margin: 0, maxWidth: 420 }}>יוֹדוּךָ עַמִּים <Highlight>אֱלֹהִים</Highlight> יוֹדוּךָ עַמִּים כֻּלָּם.</p>
)
```

### Soft

```jsx
() => <p className="hl-wrap" style={{ margin: 0 }}>הלילה מכוונים לאות <Highlight soft>נ</Highlight></p>
```
