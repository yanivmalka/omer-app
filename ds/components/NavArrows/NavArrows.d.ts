import * as React from 'react';

/**
 * NavArrows — from @omer/ds@0.1.0.
 */
export interface NavArrowsProps {
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
}

export declare const NavArrows: React.ComponentType<NavArrowsProps>;
