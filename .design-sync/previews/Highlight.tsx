import { Highlight } from '@omer/ds';

export const InPsalm = () => (
  <p className="hl-wrap" style={{ margin: 0, maxWidth: 420 }}>יוֹדוּךָ עַמִּים <Highlight>אֱלֹהִים</Highlight> יוֹדוּךָ עַמִּים כֻּלָּם.</p>
);
export const Soft = () => <p className="hl-wrap" style={{ margin: 0 }}>הלילה מכוונים לאות <Highlight soft>נ</Highlight></p>;
