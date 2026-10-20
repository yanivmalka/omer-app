import * as React from 'react';

/**
 * Badge — from @omer/ds@0.1.0.
 */
export interface BadgeProps {
  icon?: string;
  earned?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export declare const Badge: React.ComponentType<BadgeProps>;
