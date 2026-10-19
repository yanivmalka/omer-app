import * as React from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/* ============ ROOT ============ */
export interface OmerRootProps {
  /** 'auto' follows the device; 'light' / 'dark' force a theme. */
  theme?: 'auto' | 'light' | 'dark';
  /** User text scale, 0.8–1.4 (the app's א−/א+). Prayer text scales fully, UI chrome ~45%. */
  fontScale?: number;
  /** Wraps content in the app's centered 680px column with page padding. */
  page?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
/** Root wrapper for every Omer screen: sets dir="rtl", lang="he", the theme tokens, background and the text scale. Without it components lose colors, fonts and RTL. */
export function OmerRoot({ theme = 'auto', fontScale = 1, page, className, style, children }: OmerRootProps) {
  const fs = Math.min(1.4, Math.max(0.8, fontScale));
  React.useLayoutEffect(() => {
    // rem sizes follow <html>, so the scale is mirrored there like the app does.
    document.documentElement.style.setProperty('--fs', String(fs));
  }, [fs]);
  return (
    <div dir="rtl" lang="he" className={cx('omer-root', className)} data-theme={theme === 'auto' ? undefined : theme}
      style={{ ['--fs' as any]: fs, ...style }}>
      {page ? <div className="wrap">{children}</div> : children}
    </div>
  );
}

/* ============ ICONS ============ */
export type IconName = 'settings' | 'theme' | 'chevron-right' | 'chevron-left' | 'chevron-down' | 'menorah' | 'play' | 'pause';
export interface IconProps { name: IconName; size?: number; }
/** Stroke icons from the app (SVG, so they never flip in RTL). In RTL, chevron-right = previous, chevron-left = next. */
export function Icon({ name, size = 20 }: IconProps) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true } as const;
  const st = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  switch (name) {
    case 'settings': return <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case 'theme': return <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" /></svg>;
    case 'chevron-right': return <svg {...p} {...st}><path d="M9 6l6 6-6 6" /></svg>;
    case 'chevron-left': return <svg {...p} {...st}><path d="M15 6l-6 6 6 6" /></svg>;
    case 'chevron-down': return <svg {...p} {...st}><path d="M6 9l6 6 6-6" /></svg>;
    case 'menorah': return <svg {...p} {...st} strokeWidth={2}><path d="M12 4v16M6 20h12M5 5v3a7 7 0 0 0 14 0V5M8.5 5v3a3.5 3.5 0 0 0 7 0V5" /></svg>;
    case 'play': return <svg {...p} fill="currentColor"><path d="M7 5v14l11-7z" /></svg>;
    case 'pause': return <svg {...p} fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
  }
}

/* ============ BUTTONS ============ */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = gold pill; ghost = outlined; done = completed (green outline); locked = already-done, gold wash; danger = destructive confirm. */
  variant?: 'primary' | 'ghost' | 'done' | 'locked' | 'danger';
  size?: 'md' | 'small';
}
/** Pill button — the app's main action control ("סמן כהושלם", "שתף", "הזכרתי בתפילתי"). */
export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return <button type="button" className={cx('btn', variant !== 'primary' && variant, size === 'small' && 'small', className)} {...rest} />;
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible Hebrew label (required — the button has no visible text other than the icon/glyph). */
  label: string;
  /** md = 42px header button; sm = 36px tool button (also used for the א−/א+ glyphs). */
  size?: 'md' | 'sm';
}
/** Round outlined button holding an <Icon> or a short glyph such as א+. */
export function IconButton({ label, size = 'md', className, children, ...rest }: IconButtonProps) {
  return <button type="button" aria-label={label} className={cx('icon-btn', size === 'sm' && 'sm', className)} {...rest}>{children}</button>;
}

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { icon?: IconName; }
/** Small outlined pill link with optional icon — e.g. "בצורת המנורה", "חזרה לנוסח". */
export function LinkButton({ icon, className, children, ...rest }: LinkButtonProps) {
  return <button type="button" className={cx('linkbtn', className)} {...rest}>{icon && <Icon name={icon} size={15} />}{children}</button>;
}

/** Underlined gold text button for secondary actions — "חזרה לספירה הנוכחית", "ביטול הסימון". */
export function TextButton({ className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cx('back-today', className)} {...rest} />;
}

export interface NavArrowsProps { onPrev?: () => void; onNext?: () => void; prevDisabled?: boolean; nextDisabled?: boolean; prevLabel?: string; nextLabel?: string; }
/** Previous/next day arrows. RTL: right arrow = previous, left arrow = next. */
export function NavArrows({ onPrev, onNext, prevDisabled, nextDisabled, prevLabel = 'יום קודם', nextLabel = 'יום הבא' }: NavArrowsProps) {
  return (
    <div className="nav">
      <button type="button" aria-label={prevLabel} disabled={prevDisabled} onClick={onPrev}><Icon name="chevron-right" size={18} /></button>
      <button type="button" aria-label={nextLabel} disabled={nextDisabled} onClick={onNext}><Icon name="chevron-left" size={18} /></button>
    </div>
  );
}

export interface FontSizeControlProps { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md'; }
/** א− / א+ text-size buttons; range 0.8–1.4 in steps of 0.1, each button disabled at its edge. */
export function FontSizeControl({ value, onChange, size = 'sm' }: FontSizeControlProps) {
  const set = (v: number) => onChange?.(Math.min(1.4, Math.max(0.8, +v.toFixed(1))));
  return (
    <div className="tools">
      <IconButton size={size} label="הקטן טקסט" disabled={value <= 0.8} onClick={() => set(value - 0.1)}>א−</IconButton>
      <IconButton size={size} label="הגדל טקסט" disabled={value >= 1.4} onClick={() => set(value + 0.1)}>א+</IconButton>
    </div>
  );
}

/* ============ FORM ============ */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}
/** On/off toggle (gold when on), RTL knob. Use inside <Field>. */
export function Switch({ className, ...rest }: SwitchProps) {
  return <input type="checkbox" className={cx('switch', className)} {...rest} />;
}

export interface FieldProps { label: React.ReactNode; hint?: React.ReactNode; htmlFor?: string; children?: React.ReactNode; }
/** Settings row: label (+ small muted hint) on the right, control on the left, hairline divider below. Native <select>/<input> inside are styled automatically. */
export function Field({ label, hint, htmlFor, children }: FieldProps) {
  return <div className="field"><label htmlFor={htmlFor}>{label}{hint && <small>{hint}</small>}</label>{children}</div>;
}

export interface SegmentedChoiceProps { value?: 'y' | 'n'; onChange?: (v: 'y' | 'n') => void; yesLabel?: string; noLabel?: string; }
/** Two-option yes/no pill pair ("ספרתי" / "לא ספרתי") used in the missed-days dialog. */
export function SegmentedChoice({ value, onChange, yesLabel = 'ספרתי', noLabel = 'לא ספרתי' }: SegmentedChoiceProps) {
  return (
    <span className="seg">
      <button type="button" className={value === 'y' ? 'sel-y' : ''} onClick={() => onChange?.('y')}>{yesLabel}</button>
      <button type="button" className={value === 'n' ? 'sel-n' : ''} onClick={() => onChange?.('n')}>{noLabel}</button>
    </span>
  );
}

export interface AskItemProps extends SegmentedChoiceProps { label: React.ReactNode; detail?: React.ReactNode; }
/** One row of the "האם ספרת בימים האלה?" list: day label + yes/no choice. Stack several inside <AskList>. */
export function AskItem({ label, detail, ...seg }: AskItemProps) {
  return <div className="ask-item"><span>{label}{detail && <><br /><small className="note">{detail}</small></>}</span><SegmentedChoice {...seg} /></div>;
}
/** Vertical stack for <AskItem> rows. */
export function AskList({ children }: { children?: React.ReactNode }) { return <div className="ask-list">{children}</div>; }

/* ============ SURFACES ============ */
export interface TabsProps { items: { id: string; label: string }[]; value: string; onChange?: (id: string) => void; }
/** Segmented pill tab bar (the app's סדר הספירה / מנורה / המעקב שלי). Equal-width columns, one per item. */
export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <nav className="tabs" role="tablist" style={{ gridTemplateColumns: `repeat(${items.length},1fr)` }}>
      {items.map(t => <button type="button" role="tab" key={t.id} aria-selected={t.id === value} onClick={() => onChange?.(t.id)}>{t.label}</button>)}
    </nav>
  );
}

/** Large rounded surface card that holds a tab's content. */
export function Panel({ className, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cx('panel', className)} {...rest} />;
}

export interface BannerProps { tone?: 'info' | 'warn'; title?: React.ReactNode; children?: React.ReactNode; }
/** Inline notice box. warn = halachic warning (e.g. continuing without a bracha) with a red bold lead-in title. */
export function Banner({ tone = 'info', title, children }: BannerProps) {
  return <div className={cx('banner', tone === 'warn' && 'warn')}>{title && <strong>{title} </strong>}{children}</div>;
}

/** Small muted explanatory text under a section. */
export function Note({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('note', className)} {...rest} />;
}

export interface HighlightProps { soft?: boolean; children?: React.ReactNode; }
/** Gold highlight for the word/letter of the day inside prayer text. soft = bold gold text only, no box. */
export function Highlight({ soft, children }: HighlightProps) {
  return <span className={soft ? 'hl-soft' : 'hl'}>{children}</span>;
}

export interface BadgeProps { icon?: string; earned?: boolean; title?: string; children?: React.ReactNode; }
/** Achievement chip (חסד badges). Unearned badges are faded; earned ones get gold border + wash. */
export function Badge({ icon, earned, title, children }: BadgeProps) {
  return <span className={cx('badge', earned && 'got')} title={title}>{icon && <>{icon} </>}{children}</span>;
}

export interface ToastProps { message: string; visible?: boolean; inline?: boolean; }
/** Bottom-center ink pill confirming an action ("נרשם כהושלם"). Fixed by default; inline renders it in flow. */
export function Toast({ message, visible = true, inline }: ToastProps) {
  return <div role="status" className={cx('toast', visible && 'show', inline && 'inline')}>{message}</div>;
}

export interface DialogProps { open: boolean; title?: React.ReactNode; onClose?: () => void; actions?: React.ReactNode; children?: React.ReactNode; }
/** Modal sheet (native <dialog>, showModal). Clicking the backdrop closes it. Put action <Button>s in `actions` (left-aligned row in RTL). */
export function Dialog({ open, title, onClose, actions, children }: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) { try { d.showModal(); } catch { d.setAttribute('open', ''); } }
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="omer-dialog" dir="rtl" onCancel={e => { e.preventDefault(); onClose?.(); }}
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="dlg" tabIndex={-1} autoFocus>
        {title && <h2>{title}</h2>}
        {children}
        {actions && <div className="row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>{actions}</div>}
      </div>
    </dialog>
  );
}

export interface CollapsibleGroupProps { title: React.ReactNode; defaultOpen?: boolean; open?: boolean; onToggle?: (open: boolean) => void; children?: React.ReactNode; }
/** Collapsible outlined group (<details>) — "לפני הספירה" / "אחרי הספירה". Chevron rotates when open. */
export function CollapsibleGroup({ title, defaultOpen = true, open, onToggle, children }: CollapsibleGroupProps) {
  return (
    <details className="grp" open={open ?? defaultOpen} onToggle={e => onToggle?.((e.currentTarget as HTMLDetailsElement).open)}>
      <summary><span>{title}</span><span className="chev"><Icon name="chevron-down" size={18} /></span></summary>
      {children}
    </details>
  );
}
