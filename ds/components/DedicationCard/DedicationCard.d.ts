import * as React from 'react';

/**
 * DedicationCard — from @omer/ds@0.1.0.
 */
export interface DedicationCardProps {
  /** e.g. "לרפואת", "לעילוי נשמת", "להצלחת". */
  purpose: string;
  name: string;
  /** How many people already mentioned this name. */
  prayedCount?: number;
  /** The current user already mentioned it → locked button + thanks + undo. */
  prayed?: boolean;
  /** 1-based position when paging through today's names. */
  index?: number;
  total?: number;
  onPray?: () => void;
  onMore?: () => void;
  onUndo?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export declare const DedicationCard: React.ComponentType<DedicationCardProps>;
