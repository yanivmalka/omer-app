import { Button } from '@omer/ds';

export const Variants = () => (
  <div className="row">
    <Button>סמן כהושלם</Button>
    <Button variant="ghost">שתף</Button>
    <Button variant="done">✓ הושלם</Button>
    <Button variant="locked" disabled>✓ הזכרת בתפילתך</Button>
    <Button variant="danger">מחק הכל</Button>
  </div>
);

export const Small = () => (
  <div className="row">
    <Button size="small">סמן כהושלם</Button>
    <Button size="small" variant="ghost">לא ספרתי כלל</Button>
    <Button size="small" variant="ghost">אתר אותי</Button>
  </div>
);
