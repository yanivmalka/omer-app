import * as React from 'react';

/**
 * Toast — from @omer/ds@0.1.0.
 */
export interface ToastProps {
  message: string;
  visible?: boolean;
  inline?: boolean;
}

export declare const Toast: React.ComponentType<ToastProps>;
