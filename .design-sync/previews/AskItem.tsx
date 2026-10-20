import { AskItem, AskList } from '@omer/ds';

export const Rows = () => (
  <div style={{ width: 380 }}>
    <AskList>
      <AskItem label='יום י"ב (12)' value="y" />
      <AskItem label='יום י"ג (13)' detail="נרשמה פתיחה ב־21:04, 3 דקות, 80% גלילה" />
      <AskItem label='יום י"ד (14)' value="n" />
    </AskList>
  </div>
);
