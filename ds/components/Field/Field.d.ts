import * as React from 'react';

/**
 * Field — from @omer/ds@0.1.0.
 */
export interface FieldProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  children?: React.ReactNode;
}

export declare const Field: React.ComponentType<FieldProps>;
