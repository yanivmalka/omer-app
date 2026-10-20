import * as React from 'react';

/**
 * AutoScrollBar — from @omer/ds@0.1.0.
 */
export interface AutoScrollBarProps {
  playing?: boolean;
  /** 1–5 (SCROLL_SPEEDS). The −/name/+ speed control shows only while playing. */
  speed?: number;
  inline?: boolean;
  onToggle?: () => void;
  onSpeed?: (v: number) => void;
}

export declare const AutoScrollBar: React.ComponentType<AutoScrollBarProps>;
