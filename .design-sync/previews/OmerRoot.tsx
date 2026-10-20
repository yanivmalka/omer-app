import { OmerRoot, Button, Note } from '@omer/ds';

const Sample = () => (
  <div style={{ padding: 16 }}>
    <div style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700 }}>ספירת העומר</div>
    <Note>ט"ז אייר תשפ"ז · ירושלים</Note>
    <div className="row" style={{ marginTop: 10 }}><Button>סמן כהושלם</Button><Button variant="ghost">שתף</Button></div>
  </div>
);
export const Light = () => <OmerRoot theme="light"><Sample /></OmerRoot>;
export const Dark = () => <OmerRoot theme="dark"><Sample /></OmerRoot>;
