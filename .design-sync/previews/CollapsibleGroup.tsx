import { CollapsibleGroup, Siddur, PrayerSection } from '@omer/ds';

export const Open = () => (
  <div style={{ width: 420 }}><Siddur>
    <CollapsibleGroup title="לפני הספירה">
      <PrayerSection title="לשם יחוד">לְשֵׁם יִחוּד קוּדְשָׁא בְּרִיךְ הוּא וּשְׁכִינְתֵּיהּ, בִּדְחִילוּ וּרְחִימוּ, לְיַחֲד שֵׁם י"ה בו"ה בְּיִחוּדָא שְׁלִים בְּשֵׁם כָּל יִשְׂרָאֵל.</PrayerSection>
    </CollapsibleGroup>
  </Siddur></div>
);
export const Collapsed = () => (
  <div style={{ width: 420 }}><Siddur>
    <CollapsibleGroup title="אחרי הספירה" defaultOpen={false}><PrayerSection>…</PrayerSection></CollapsibleGroup>
  </Siddur></div>
);
