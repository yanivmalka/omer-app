import { Field, Switch, Button, FontSizeControl } from '@omer/ds';

export const SettingsRows = () => (
  <div style={{ width: 380 }}>
    <Field label="נוסח" htmlFor="n"><select id="n" defaultValue="em"><option value="em">עדות המזרח</option><option value="sefard">ספרד</option><option value="ashk">אשכנז</option><option value="chabad">חב"ד</option></select></Field>
    <Field label="ניקוד" htmlFor="k"><Switch id="k" defaultChecked /></Field>
    <Field label="תזכורת" hint="התראה בצאת הכוכבים" htmlFor="r"><Switch id="r" /></Field>
    <Field label="גודל טקסט"><FontSizeControl value={1} /></Field>
  </div>
);
export const WithButton = () => (
  <div style={{ width: 380 }}>
    <Field label="מיקום נוכחי"><Button variant="ghost" size="small">אתר אותי</Button></Field>
    <Field label="נתוני מעקב" hint="ימים שסומנו, זמני קריאה ושמות שהוזכרו"><Button variant="ghost" size="small">מחק הכל</Button></Field>
  </div>
);
