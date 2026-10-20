import * as React from 'react';

/**
 * AppHeader — from @omer/ds@0.1.0.
 */
export interface AppHeaderProps {
  title?: string;
  /** Hebrew date line under the title, e.g. "ליל ט"ז אייר תשפ"ז". */
  hebDate?: string;
  fontScale?: number;
  onFontScale?: (v: number) => void;
  onToggleTheme?: () => void;
  onSettings?: () => void;
}

export declare const AppHeader: React.ComponentType<AppHeaderProps>;
