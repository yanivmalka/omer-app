import * as React from 'react';

/**
 * OmerRoot — from @omer/ds@0.1.0.
 */
export interface OmerRootProps {
  /** 'auto' follows the device; 'light' / 'dark' force a theme. */
  theme?: "auto" | "light" | "dark";
  /** User text scale, 0.8–1.4 (the app's א−/א+). Prayer text scales fully, UI chrome ~45%. */
  fontScale?: number;
  /** Wraps content in the app's centered 680px column with page padding. */
  page?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const OmerRoot: React.ComponentType<OmerRootProps>;
