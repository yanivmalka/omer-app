import { Panel, Siddur, PrayerSection } from '@omer/ds';

export const WithPrayer = () => (
  <div style={{ width: 400 }}>
    <Panel>
      <Siddur>
        <PrayerSection title="ברכה" variant="blessing">בָּרוּךְ אַתָּה יְיָ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל סְפִירַת הָעֹמֶר.</PrayerSection>
      </Siddur>
    </Panel>
  </div>
);
