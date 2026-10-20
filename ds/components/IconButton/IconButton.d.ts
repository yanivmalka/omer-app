import * as React from 'react';

/**
 * IconButton — from @omer/ds@0.1.0.
 */
export interface IconButtonProps {
  /** Accessible Hebrew label (required — the button has no visible text other than the icon/glyph). */
  label: string;
  /** md = 42px header button; sm = 36px tool button (also used for the א−/א+ glyphs). */
  size?: "md" | "sm";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const IconButton: React.ComponentType<IconButtonProps>;
