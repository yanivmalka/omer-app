import { Dialog, Button } from '@omer/ds';

export const ConfirmDelete = () => (
  <Dialog open title="מחיקת נתוני המעקב"
    actions={<><Button variant="ghost">ביטול</Button><Button variant="danger">מחק הכל</Button></>}>
    <p style={{ margin: 0 }}>יימחקו הימים שסומנו, רישומי הקריאה, השמות שהזכרת בתפילה והנקודות. ההגדרות יישמרו.</p>
  </Dialog>
);
