import * as React from 'react';

/**
 * Icon — from @omer/ds@0.1.0.
 */
export interface IconProps {
  name: "settings" | "theme" | "chevron-right" | "chevron-left" | "chevron-down" | "menorah" | "play" | "pause";
  size?: number;
}

export declare const Icon: React.ComponentType<IconProps>;
