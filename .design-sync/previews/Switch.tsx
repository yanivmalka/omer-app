import { Switch } from '@omer/ds';

export const OnOff = () => <div className="row" style={{ gap: 16 }}><Switch defaultChecked aria-label="ניקוד" /><Switch aria-label="תזכורת" /></div>;
export const Disabled = () => <Switch disabled aria-label="תזכורת" />;
