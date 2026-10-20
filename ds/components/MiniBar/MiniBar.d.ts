import * as React from 'react';

/**
 * MiniBar — from @omer/ds@0.1.0.
 */
export interface MiniBarProps {
  day: number;
  nusach?: "em" | "sefard" | "ashk" | "chabad";
  /** Slides in when the hero scrolls out of view. */
  visible?: boolean;
  /** Render in normal flow instead of fixed to the top. */
  inline?: boolean;
  fontScale?: number;
  onFontScale?: (v: number) => void;
  onToggleTheme?: () => void;
  onSettings?: () => void;
  onCountClick?: () => void;
}

export declare const MiniBar: React.ComponentType<MiniBarProps>;
