import * as React from 'react';

/**
 * AskItem — from @omer/ds@0.1.0.
 */
export interface AskItemProps {
  label: React.ReactNode;
  detail?: React.ReactNode;
  value?: "y" | "n";
  onChange?: (v: "y" | "n") => void;
  yesLabel?: string;
  noLabel?: string;
}

export declare const AskItem: React.ComponentType<AskItemProps>;
