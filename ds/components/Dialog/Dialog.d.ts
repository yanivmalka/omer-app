import * as React from 'react';

/**
 * Dialog — from @omer/ds@0.1.0.
 * @replaces dialog
 */
export interface DialogProps {
  open: boolean;
  title?: React.ReactNode;
  onClose?: () => void;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export declare const Dialog: React.ComponentType<DialogProps>;
