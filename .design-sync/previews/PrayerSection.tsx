import { PrayerSection, Siddur, LinkButton, Highlight } from '@omer/ds';

export const BlessingAndCount = () => (
  <div style={{ width: 420 }}><Siddur>
    <PrayerSection title="ברכה" variant="blessing">בָּרוּךְ אַתָּה יְיָ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל סְפִירַת הָעֹמֶר.</PrayerSection>
    <PrayerSection title="הספירה" variant="count" note="כוונה: הוֹד שֶׁבְּהוֹד"
      after={<p className="blessing" style={{ marginTop: 10 }}>הָרַחֲמָן הוּא יַחֲזִיר לָנוּ עֲבוֹדַת בֵּית הַמִּקְדָּשׁ לִמְקוֹמָהּ, בִּמְהֵרָה בְיָמֵינוּ, אָמֵן סֶלָה.</p>}>
      הַיּוֹם שְׁלֹשָׁה וּשְׁלֹשִׁים יוֹם לָעֹמֶר, שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים.
    </PrayerSection>
  </Siddur></div>
);
export const PsalmWithAction = () => (
  <div style={{ width: 420 }}><Siddur>
    <PrayerSection title="למנצח (תהלים סז)" headerAction={<LinkButton icon="menorah">בצורת המנורה</LinkButton>}
      note={<>מכוונים למילה <Highlight soft>אֱלֹהִים</Highlight> — המילה ה־33 במזמור.</>}>
      יוֹדוּךָ עַמִּים <Highlight>אֱלֹהִים</Highlight> יוֹדוּךָ עַמִּים כֻּלָּם.
    </PrayerSection>
  </Siddur></div>
);
