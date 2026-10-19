import { AskList, AskItem, Button } from '@omer/ds';

export const MissedDays = () => (
  <div style={{ width: 400 }}>
    <h2 style={{ fontFamily: 'var(--serif)', margin: '0 0 6px', fontSize: '1.3rem' }}>האם ספרת בימים האלה?</h2>
    <AskList>
      <AskItem label="יום כ' (20)" />
      <AskItem label='יום כ"א (21)' />
    </AskList>
    <div className="row" style={{ justifyContent: 'space-between' }}><Button variant="ghost" size="small">ספרתי בכולם</Button><Button>שמור</Button></div>
  </div>
);
