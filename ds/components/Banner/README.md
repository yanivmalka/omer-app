Banner from @omer/ds. Use via `window.OmerDS.Banner` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface BannerProps {
  tone?: "info" | "warn";
  title?: React.ReactNode;
  children?: React.ReactNode;
}
```

## Examples

### Warning

```jsx
() => (
  <div style={{ width: 400 }}>
    <Banner tone="warn" title="האם ספרת אמש?">אם שכחת — ספור היום עד השקיעה <b>בלי ברכה</b> (יום 12), והערב תמשיך בברכה.
      <div className="row" style={{ marginTop: 8 }}><Button size="small">סמן כהושלם</Button><Button size="small" variant="ghost">לא ספרתי כלל</Button></div>
    </Banner>
  </div>
)
```

### Info

```jsx
() => <div style={{ width: 400 }}><Banner>הספירה הבאה מתחילה במוצאי יום טוב ראשון של פסח. בינתיים אפשר לעיין בכל ימי הספירה.</Banner></div>
```
