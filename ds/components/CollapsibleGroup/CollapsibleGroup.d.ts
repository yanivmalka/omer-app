import * as React from 'react';

/**
 * CollapsibleGroup — from @omer/ds@0.1.0.
 */
export interface CollapsibleGroupProps {
  title: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children?: React.ReactNode;
}

export declare const CollapsibleGroup: React.ComponentType<CollapsibleGroupProps>;
