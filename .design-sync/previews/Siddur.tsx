import { Siddur, PrayerSection, CollapsibleGroup } from '@omer/ds';

export const FullOrder = () => (
  <div style={{ width: 420 }}><Siddur>
    <CollapsibleGroup title="לפני הספירה" defaultOpen={false}><PrayerSection>…</PrayerSection></CollapsibleGroup>
    <PrayerSection title="ברכה" variant="blessing">בָּרוּךְ אַתָּה יְיָ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל סְפִירַת הָעֹמֶר.</PrayerSection>
    <PrayerSection title="הספירה" variant="count">הַיּוֹם שִׁבְעָה יָמִים, שֶׁהֵם שָׁבוּעַ אֶחָד לָעֹמֶר.</PrayerSection>
  </Siddur></div>
);
