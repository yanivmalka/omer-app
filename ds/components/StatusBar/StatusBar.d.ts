import * as React from 'react';

/**
 * StatusBar — from @omer/ds@0.1.0.
 */
export interface StatusBarProps {
  items: { label?: string; value?: React.ReactNode; }[];
}

export declare const StatusBar: React.ComponentType<StatusBarProps>;
