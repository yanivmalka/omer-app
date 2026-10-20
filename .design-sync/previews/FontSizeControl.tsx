import { FontSizeControl } from '@omer/ds';

export const Default = () => <FontSizeControl value={1} />;
export const AtMinimum = () => <FontSizeControl value={0.8} />;
export const AtMaximum = () => <FontSizeControl value={1.4} size="md" />;
