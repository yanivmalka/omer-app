import * as React from 'react';

/**
 * DayHero — from @omer/ds@0.1.0.
 */
export interface DayHeroProps {
  /** Omer day 1–49. Drives the gematria number, short count, full count text and the kavanot. */
  day: number;
  nusach?: "em" | "sefard" | "ashk" | "chabad";
  /** Show vowel points (ניקוד). */
  nikud?: boolean;
  /** Muted status line, e.g. "הלילה סופרים" or "הערב, מ־19:42, נספור". */
  when?: string;
  onPrev?: () => void;
  onNext?: () => void;
  /** Action row (usually <Button>s). */
  actions?: React.ReactNode;
  /** "אתמול ספרו" line; pass true to derive it from `day`, or a node. Shown without the word "היום" and without the final per */
  yesterday?: React.ReactNode;
  /** Banners below the hero content. */
  children?: React.ReactNode;
}

export declare const DayHero: React.ComponentType<DayHeroProps>;
