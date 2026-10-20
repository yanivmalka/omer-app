import * as React from 'react';

/**
 * Panel — from @omer/ds@0.1.0.
 */
export interface PanelProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const Panel: React.ComponentType<PanelProps>;
