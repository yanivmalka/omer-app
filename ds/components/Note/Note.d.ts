import * as React from 'react';

/**
 * Note — from @omer/ds@0.1.0.
 */
export interface NoteProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const Note: React.ComponentType<NoteProps>;
