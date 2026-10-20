Field from @omer/ds. Use via `window.OmerDS.Field` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface FieldProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  children?: React.ReactNode;
}
```

## Examples

### SettingsRows

```jsx
() => (
  <div style={{ width: 380 }}>
    <Field label="נוסח" htmlFor="n"><select id="n" defaultValue="em"><option value="em">עדות המזרח</option><option value="sefard">ספרד</option><option value="ashk">אשכנז</option><option value="chabad">חב"ד</option></select></Field>
    <Field label="ניקוד" htmlFor="k"><Switch id="k" defaultChecked /></Field>
    <Field label="תזכורת" hint="התראה בצאת הכוכבים" htmlFor="r"><Switch id="r" /></Field>
    <Field label="גודל טקסט"><FontSizeControl value={1} /></Field>
  </div>
)
```

### WithButton

```jsx
() => (
  <div style={{ width: 380 }}>
    <Field label="מיקום נוכחי"><Button variant="ghost" size="small">אתר אותי</Button></Field>
    <Field label="נתוני מעקב" hint="ימים שסומנו, זמני קריאה ושמות שהוזכרו"><Button variant="ghost" size="small">מחק הכל</Button></Field>
  </div>
)
```
