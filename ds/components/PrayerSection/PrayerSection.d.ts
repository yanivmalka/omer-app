import * as React from 'react';

/**
 * PrayerSection — from @omer/ds@0.1.0.
 */
export interface PrayerSectionProps {
  /** Small muted heading, e.g. "ברכה", "הספירה", "לשם יחוד". */
  title?: React.ReactNode;
  /** text = serif prayer paragraph; blessing = bold; count = the gold count line. */
  variant?: "text" | "blessing" | "count";
  note?: React.ReactNode;
  /** Extra content after the paragraph (e.g. the הרחמן line as a second blessing-weight <p>). */
  after?: React.ReactNode;
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
}

export declare const PrayerSection: React.ComponentType<PrayerSectionProps>;
