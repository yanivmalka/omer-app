import { Tabs } from '@omer/ds';

const items = [{ id: 'sid', label: 'סדר הספירה' }, { id: 'men', label: 'מנורה' }, { id: 'trk', label: 'המעקב שלי' }];
export const Siddur = () => <div style={{ width: 380 }}><Tabs items={items} value="sid" /></div>;
export const Tracker = () => <div style={{ width: 380 }}><Tabs items={items} value="trk" /></div>;
