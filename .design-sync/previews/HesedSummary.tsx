import { HesedSummary } from '@omer/ds';

export const WithNames = () => (
  <div style={{ width: 400 }}><HesedSummary entries={[
    { name: 'יעקב בן שרה', purpose: 'לרפואת', when: '12.5 21:14' },
    { name: 'אברהם בן יצחק', purpose: 'לעילוי נשמת', when: '11.5 20:58' },
  ]} /></div>
);
export const Empty = () => <div style={{ width: 400 }}><HesedSummary entries={[]} /></div>;
