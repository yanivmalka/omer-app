import * as React from 'react';

/**
 * AnaBekoach — from @omer/ds@0.1.0.
 */
export interface AnaBekoachProps {
  day: number;
  nikud?: boolean;
}

export declare const AnaBekoach: React.ComponentType<AnaBekoachProps>;

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

/**
 * AskItem — from @omer/ds@0.1.0.
 */
export interface AskItemProps {
  label: React.ReactNode;
  detail?: React.ReactNode;
  value?: "y" | "n";
  onChange?: (v: "y" | "n") => void;
  yesLabel?: string;
  noLabel?: string;
}

export declare const AskItem: React.ComponentType<AskItemProps>;

/**
 * AskList — from @omer/ds@0.1.0.
 */
export interface AskListProps {
  children?: React.ReactNode;
}

export declare const AskList: React.ComponentType<AskListProps>;

/**
 * AutoScrollBar — from @omer/ds@0.1.0.
 */
export interface AutoScrollBarProps {
  playing?: boolean;
  /** 1–5 (SCROLL_SPEEDS). The −/name/+ speed control shows only while playing. */
  speed?: number;
  inline?: boolean;
  onToggle?: () => void;
  onSpeed?: (v: number) => void;
}

export declare const AutoScrollBar: React.ComponentType<AutoScrollBarProps>;

/**
 * Badge — from @omer/ds@0.1.0.
 */
export interface BadgeProps {
  icon?: string;
  earned?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export declare const Badge: React.ComponentType<BadgeProps>;

/**
 * Banner — from @omer/ds@0.1.0.
 */
export interface BannerProps {
  tone?: "info" | "warn";
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export declare const Banner: React.ComponentType<BannerProps>;

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

/**
 * DayHero — from @omer/ds@0.1.0.
 */
export interface DayHeroProps {
  /** Omer day 1–49. Drives the gematria number, short count, full count text and the kavanot. */
  day: number;
  nusach?: "em" | "sefard" | "ashk" | "chabad";
  /** Show vowel points (ניקוד). */
  nikud?: boolean;
  /** Muted status line, e.g. "הלילה סופרים" or "הערב, מ־19:42, נספור". */
  when?: string;
  onPrev?: () => void;
  onNext?: () => void;
  /** Action row (usually <Button>s). */
  actions?: React.ReactNode;
  /** "אתמול ספרו" line; pass true to derive it from `day`, or a node. Shown without the word "היום" and without the final per */
  yesterday?: React.ReactNode;
  /** Banners below the hero content. */
  children?: React.ReactNode;
}

export declare const DayHero: React.ComponentType<DayHeroProps>;

/**
 * DedicationCard — from @omer/ds@0.1.0.
 */
export interface DedicationCardProps {
  /** e.g. "לרפואת", "לעילוי נשמת", "להצלחת". */
  purpose: string;
  name: string;
  /** How many people already mentioned this name. */
  prayedCount?: number;
  /** The current user already mentioned it → locked button + thanks + undo. */
  prayed?: boolean;
  /** 1-based position when paging through today's names. */
  index?: number;
  total?: number;
  onPray?: () => void;
  onMore?: () => void;
  onUndo?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export declare const DedicationCard: React.ComponentType<DedicationCardProps>;

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

/**
 * FontSizeControl — from @omer/ds@0.1.0.
 */
export interface FontSizeControlProps {
  value: number;
  onChange?: (v: number) => void;
  size?: "md" | "sm";
}

export declare const FontSizeControl: React.ComponentType<FontSizeControlProps>;

/**
 * HesedSummary — from @omer/ds@0.1.0.
 */
export interface HesedSummaryProps {
  entries: HesedEntry[];
}

export declare const HesedSummary: React.ComponentType<HesedSummaryProps>;

/**
 * Highlight — from @omer/ds@0.1.0.
 */
export interface HighlightProps {
  soft?: boolean;
  children?: React.ReactNode;
}

export declare const Highlight: React.ComponentType<HighlightProps>;

/**
 * Icon — from @omer/ds@0.1.0.
 */
export interface IconProps {
  name: "settings" | "theme" | "chevron-right" | "chevron-left" | "chevron-down" | "menorah" | "play" | "pause";
  size?: number;
}

export declare const Icon: React.ComponentType<IconProps>;

/**
 * IconButton — from @omer/ds@0.1.0.
 */
export interface IconButtonProps {
  /** Accessible Hebrew label (required — the button has no visible text other than the icon/glyph). */
  label: string;
  /** md = 42px header button; sm = 36px tool button (also used for the א−/א+ glyphs). */
  size?: "md" | "sm";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const IconButton: React.ComponentType<IconButtonProps>;

/**
 * KavanotGrid — from @omer/ds@0.1.0.
 */
export interface KavanotGridProps {
  sefira: string;
  ana: string;
  psalmWord: string;
}

export declare const KavanotGrid: React.ComponentType<KavanotGridProps>;

/**
 * LinkButton — from @omer/ds@0.1.0.
 */
export interface LinkButtonProps {
  icon?: "settings" | "theme" | "chevron-right" | "chevron-left" | "chevron-down" | "menorah" | "play" | "pause";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const LinkButton: React.ComponentType<LinkButtonProps>;

/**
 * Menorah — from @omer/ds@0.1.0.
 */
export interface MenorahProps {
  /** Omer day 1–49: highlights the branch (verse), the word, the week's name and the day's letter. */
  day: number;
  /** Available width in px (the panel's inner width). The menorah always fits the width — never scrolls sideways. */
  width?: number;
  /** User text scale 0.8–1.4; larger text makes the menorah taller, not wider. */
  fontScale?: number;
  nikud?: boolean;
  /** Show the caption + explanatory note under the drawing. */
  caption?: boolean;
}

export declare const Menorah: React.ComponentType<MenorahProps>;

/**
 * MiniBar — from @omer/ds@0.1.0.
 */
export interface MiniBarProps {
  day: number;
  nusach?: "em" | "sefard" | "ashk" | "chabad";
  /** Slides in when the hero scrolls out of view. */
  visible?: boolean;
  /** Render in normal flow instead of fixed to the top. */
  inline?: boolean;
  fontScale?: number;
  onFontScale?: (v: number) => void;
  onToggleTheme?: () => void;
  onSettings?: () => void;
  onCountClick?: () => void;
}

export declare const MiniBar: React.ComponentType<MiniBarProps>;

/**
 * NavArrows — from @omer/ds@0.1.0.
 */
export interface NavArrowsProps {
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
}

export declare const NavArrows: React.ComponentType<NavArrowsProps>;

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

/**
 * Panel — from @omer/ds@0.1.0.
 */
export interface PanelProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const Panel: React.ComponentType<PanelProps>;

/**
 * PrayerSection — from @omer/ds@0.1.0.
 */
export interface PrayerSectionProps {
  /** Small muted heading, e.g. "ברכה", "הספירה", "לשם יחוד". */
  title?: React.ReactNode;
  /** text = serif prayer paragraph; blessing = bold; count = the gold count line. */
  variant?: "text" | "blessing" | "count";
  note?: React.ReactNode;
  /** Extra content after the paragraph (e.g. the הרחמן line as a second blessing-weight <p>). */
  after?: React.ReactNode;
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
}

export declare const PrayerSection: React.ComponentType<PrayerSectionProps>;

/**
 * Quote — from @omer/ds@0.1.0.
 */
export interface QuoteProps {
  text: string;
  source?: string;
}

export declare const Quote: React.ComponentType<QuoteProps>;

/**
 * SegmentedChoice — from @omer/ds@0.1.0.
 */
export interface SegmentedChoiceProps {
  value?: "y" | "n";
  onChange?: (v: "y" | "n") => void;
  yesLabel?: string;
  noLabel?: string;
}

export declare const SegmentedChoice: React.ComponentType<SegmentedChoiceProps>;

/**
 * Siddur — from @omer/ds@0.1.0.
 */
export interface SiddurProps {
  children?: React.ReactNode;
}

export declare const Siddur: React.ComponentType<SiddurProps>;

/**
 * StatusBar — from @omer/ds@0.1.0.
 */
export interface StatusBarProps {
  items: { label?: string; value?: React.ReactNode; }[];
}

export declare const StatusBar: React.ComponentType<StatusBarProps>;

/**
 * Switch — from @omer/ds@0.1.0.
 */
export interface SwitchProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const Switch: React.ComponentType<SwitchProps>;

/**
 * Tabs — from @omer/ds@0.1.0.
 */
export interface TabsProps {
  items: { id: string; label: string; }[];
  value: string;
  onChange?: (id: string) => void;
}

export declare const Tabs: React.ComponentType<TabsProps>;

/**
 * TextButton — from @omer/ds@0.1.0.
 */
export interface TextButtonProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const TextButton: React.ComponentType<TextButtonProps>;

/**
 * Toast — from @omer/ds@0.1.0.
 */
export interface ToastProps {
  message: string;
  visible?: boolean;
  inline?: boolean;
}

export declare const Toast: React.ComponentType<ToastProps>;

/**
 * TrackerGrid — from @omer/ds@0.1.0.
 */
export interface TrackerGridProps {
  /** day (1–49) → 'y' counted / 'n' missed. */
  statuses: Record<number, DayStatus>;
  /** Days after this are disabled (future). */
  current?: number;
  /** Tonight's day gets a gold ring. */
  tonight?: number;
  onDayClick?: (day: number) => void;
  showLegend?: boolean;
}

export declare const TrackerGrid: React.ComponentType<TrackerGridProps>;
