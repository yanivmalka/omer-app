import { DayHero, Button, Banner } from '@omer/ds';

export const Tonight = () => (
  <DayHero day={33} when="הלילה סופרים" yesterday
    actions={<><Button>סמן כהושלם</Button><Button variant="ghost" size="small">שתף</Button></>} />
);

export const Completed = () => (
  <DayHero day={7} nusach="ashk" when="הלילה סופרים" yesterday
    actions={<><Button variant="done">✓ הושלם</Button><Button variant="ghost" size="small">שתף</Button></>} />
);

export const MissedWarning = () => (
  <DayHero day={18} when="היום — נספר אמש">
    <Banner tone="warn" title="ממשיכים לספור בלי ברכה.">לפי הרשום, חסר יום שלם בספירה. נוהגים לשמוע את הברכה מהש"ץ ולענות אמן. במקרה של ספק — שאל רב.</Banner>
  </DayHero>
);

export const FirstNight = () => (
  <DayHero day={1} nusach="sefard" nikud={false} when="הלילה סופרים" yesterday
    actions={<Button>סמן כהושלם</Button>} />
);
