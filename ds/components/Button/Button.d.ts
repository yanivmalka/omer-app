import * as React from 'react';

/**
 * Button — from @omer/ds@0.1.0.
 * @replaces button
 */
export interface ButtonProps {
  /** primary = gold pill; ghost = outlined; done = completed (green outline); locked = already-done, gold wash; danger = dest */
  variant?: "primary" | "ghost" | "done" | "locked" | "danger";
  size?: "md" | "small";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const Button: React.ComponentType<ButtonProps>;
