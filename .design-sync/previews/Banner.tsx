import { Banner, Button } from '@omer/ds';

export const Warning = () => (
  <div style={{ width: 400 }}>
    <Banner tone="warn" title="האם ספרת אמש?">אם שכחת — ספור היום עד השקיעה <b>בלי ברכה</b> (יום 12), והערב תמשיך בברכה.
      <div className="row" style={{ marginTop: 8 }}><Button size="small">סמן כהושלם</Button><Button size="small" variant="ghost">לא ספרתי כלל</Button></div>
    </Banner>
  </div>
);
export const Info = () => <div style={{ width: 400 }}><Banner>הספירה הבאה מתחילה במוצאי יום טוב ראשון של פסח. בינתיים אפשר לעיין בכל ימי הספירה.</Banner></div>;
