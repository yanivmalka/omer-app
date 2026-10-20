import * as React from 'react';

/**
 * SegmentedChoice — from @omer/ds@0.1.0.
 */
export interface SegmentedChoiceProps {
  value?: "y" | "n";
  onChange?: (v: "y" | "n") => void;
  yesLabel?: string;
  noLabel?: string;
}

export declare const SegmentedChoice: React.ComponentType<SegmentedChoiceProps>;
