import * as React from 'react';

/**
 * TrackerGrid — from @omer/ds@0.1.0.
 */
export interface TrackerGridProps {
  /** day (1–49) → 'y' counted / 'n' missed. */
  statuses: Record<number, DayStatus>;
  /** Days after this are disabled (future). */
  current?: number;
  /** Tonight's day gets a gold ring. */
  tonight?: number;
  onDayClick?: (day: number) => void;
  showLegend?: boolean;
}

export declare const TrackerGrid: React.ComponentType<TrackerGridProps>;
