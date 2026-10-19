import { AutoScrollBar } from '@omer/ds';

export const Stopped = () => <AutoScrollBar inline />;
export const Playing = () => <AutoScrollBar inline playing speed={3} />;
export const Fastest = () => <AutoScrollBar inline playing speed={5} />;
