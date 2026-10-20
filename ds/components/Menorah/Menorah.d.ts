import * as React from 'react';

/**
 * Menorah — from @omer/ds@0.1.0.
 */
export interface MenorahProps {
  /** Omer day 1–49: highlights the branch (verse), the word, the week's name and the day's letter. */
  day: number;
  /** Available width in px (the panel's inner width). The menorah always fits the width — never scrolls sideways. */
  width?: number;
  /** User text scale 0.8–1.4; larger text makes the menorah taller, not wider. */
  fontScale?: number;
  nikud?: boolean;
  /** Show the caption + explanatory note under the drawing. */
  caption?: boolean;
}

export declare const Menorah: React.ComponentType<MenorahProps>;
