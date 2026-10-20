import { AppHeader, StatusBar } from '@omer/ds';

export const Default = () => (
  <div style={{ width: 400 }}>
    <AppHeader hebDate={'ליל י"ח אייר תשפ"ז'} />
    <StatusBar items={[{ label: 'ירושלים' }, { label: 'צאת הכוכבים היה', value: '19:52' }]} />
  </div>
);
export const MaxText = () => <div style={{ width: 400 }}><AppHeader hebDate={'ט"ז ניסן תשפ"ז'} fontScale={1.4} /></div>;
