Dialog from @omer/ds. Use via `window.OmerDS.Dialog` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface DialogProps {
  open: boolean;
  title?: React.ReactNode;
  onClose?: () => void;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}
```

## Examples

### ConfirmDelete

```jsx
() => (
  <Dialog open title="מחיקת נתוני המעקב"
    actions={<><Button variant="ghost">ביטול</Button><Button variant="danger">מחק הכל</Button></>}>
    <p style={{ margin: 0 }}>יימחקו הימים שסומנו, רישומי הקריאה, השמות שהזכרת בתפילה והנקודות. ההגדרות יישמרו.</p>
  </Dialog>
)
```
