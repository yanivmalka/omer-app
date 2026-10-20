import * as React from 'react';

/**
 * FontSizeControl — from @omer/ds@0.1.0.
 */
export interface FontSizeControlProps {
  value: number;
  onChange?: (v: number) => void;
  size?: "md" | "sm";
}

export declare const FontSizeControl: React.ComponentType<FontSizeControlProps>;
