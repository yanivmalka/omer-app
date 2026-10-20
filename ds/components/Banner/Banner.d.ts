import * as React from 'react';

/**
 * Banner — from @omer/ds@0.1.0.
 */
export interface BannerProps {
  tone?: "info" | "warn";
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export declare const Banner: React.ComponentType<BannerProps>;
