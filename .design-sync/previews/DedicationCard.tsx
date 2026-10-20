import { DedicationCard } from '@omer/ds';

export const NotYetPrayed = () => <div style={{ width: 400 }}><DedicationCard purpose="לרפואת" name="יעקב בן שרה" prayedCount={128} index={2} total={3} /></div>;
export const Prayed = () => <div style={{ width: 400 }}><DedicationCard purpose="לעילוי נשמת" name="אברהם בן יצחק" prayedCount={57} prayed /></div>;
export const FirstToPray = () => <div style={{ width: 400 }}><DedicationCard purpose="להצלחת" name="משפחת לוי" /></div>;
