import { SegmentedChoice } from '@omer/ds';

export const Unset = () => <div className="ask-item"><SegmentedChoice /></div>;
export const Counted = () => <div className="ask-item"><SegmentedChoice value="y" /></div>;
export const Missed = () => <div className="ask-item"><SegmentedChoice value="n" /></div>;
