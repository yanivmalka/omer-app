import * as React from 'react';

/**
 * LinkButton — from @omer/ds@0.1.0.
 */
export interface LinkButtonProps {
  icon?: "settings" | "theme" | "chevron-right" | "chevron-left" | "chevron-down" | "menorah" | "play" | "pause";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const LinkButton: React.ComponentType<LinkButtonProps>;
