import * as React from 'react';

/**
 * Tabs — from @omer/ds@0.1.0.
 */
export interface TabsProps {
  items: { id: string; label: string; }[];
  value: string;
  onChange?: (id: string) => void;
}

export declare const Tabs: React.ComponentType<TabsProps>;
