import * as React from 'react';
import { Icon, IconButton, NavArrows, FontSizeControl, Button, Badge, Note } from './primitives';
import { ANA, SEF, gem, kav, countText, shortCount, stripNikud, type Nusach } from './omer';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/* ============ HEADER / STATUS ============ */
export interface AppHeaderProps {
  title?: string;
  /** Hebrew date line under the title, e.g. "ליל ט"ז אייר תשפ"ז". */
  hebDate?: string;
  fontScale?: number;
  onFontScale?: (v: number) => void;
  onToggleTheme?: () => void;
  onSettings?: () => void;
}
/** Top app header: serif title + Hebrew date on the right; א−/א+, theme and settings buttons on the left. */
export function AppHeader({ title = 'ספירת העומר', hebDate, fontScale = 1, onFontScale, onToggleTheme, onSettings }: AppHeaderProps) {
  return (
    <header className="top">
      <div><h1>{title}</h1>{hebDate && <div className="heb">{hebDate}</div>}</div>
      <div className="tools">
        <FontSizeControl value={fontScale} onChange={onFontScale} />
        <IconButton size="sm" label="בהיר או כהה" onClick={onToggleTheme}><Icon name="theme" size={18} /></IconButton>
        <IconButton label="הגדרות" onClick={onSettings}><Icon name="settings" /></IconButton>
      </div>
    </header>
  );
}

export interface StatusBarProps { items: { label?: string; value?: React.ReactNode }[]; }
/** Muted info line under the header (location · צאת הכוכבים time · preview mode). `value` renders bold ink. */
export function StatusBar({ items }: StatusBarProps) {
  return <div className="status">{items.map((it, i) => <span key={i}>{it.label}{it.label && it.value ? ' ' : ''}{it.value != null && <b>{it.value}</b>}</span>)}</div>;
}

/* ============ HERO ============ */
export interface KavanotGridProps { sefira: string; ana: string; psalmWord: string; }
/** Three gold-wash tiles with tonight's intentions: ספירה (sefira), אנא בכח (letter/name), למנצח (word). */
export function KavanotGrid({ sefira, ana, psalmWord }: KavanotGridProps) {
  return (
    <div className="kav">
      <div><small>ספירה</small><span>{sefira}</span></div>
      <div><small>אנא בכח</small><span>{ana}</span></div>
      <div><small>למנצח</small><span>{psalmWord}</span></div>
    </div>
  );
}

export interface DayHeroProps {
  /** Omer day 1–49. Drives the gematria number, short count, full count text and the kavanot. */
  day: number;
  nusach?: Nusach;
  /** Show vowel points (ניקוד). */
  nikud?: boolean;
  /** Muted status line, e.g. "הלילה סופרים" or "הערב, מ־19:42, נספור". */
  when?: string;
  onPrev?: () => void;
  onNext?: () => void;
  /** Action row (usually <Button>s). */
  actions?: React.ReactNode;
  /** "אתמול ספרו" line; pass true to derive it from `day`, or a node. Shown without the word "היום" and without the final period. */
  yesterday?: boolean | React.ReactNode;
  /** Banners below the hero content. */
  children?: React.ReactNode;
}
/** The main "tonight" card: gold gematria day number, short count, full count text in the chosen nusach, the three kavanot, actions and banners. */
export function DayHero({ day, nusach = 'em', nikud = true, when, onPrev, onNext, actions, yesterday, children }: DayHeroProps) {
  const k = kav(day), t = (s: string) => stripNikud(s, nikud);
  let y: React.ReactNode = null;
  if (yesterday === true) y = day > 1
    ? <>אתמול ספרו: <b>{t(countText(day - 1, nusach).replace(/^הַיּוֹם /, '').replace(/\.$/, ''))}</b></>
    : 'זה הלילה הראשון של הספירה.';
  else if (yesterday) y = yesterday;
  return (
    <section className="hero" aria-live="polite">
      <div className="hero-head">
        <div className="when">{when}</div>
        <NavArrows onPrev={onPrev} onNext={onNext} prevDisabled={day <= 1} nextDisabled={day >= 49} />
      </div>
      <div className="daynum"><span className="n">{gem(day)}</span><span className="of">{shortCount(day, nusach)}</span></div>
      <div className="count">{t(countText(day, nusach))}</div>
      <KavanotGrid sefira={t(k.sef)} ana={t(k.ana)} psalmWord={t(k.ps.w)} />
      {actions && <div className="row">{actions}</div>}
      {y && <div className="yesterday">{y}</div>}
      {children}
    </section>
  );
}

/* ============ SIDDUR ============ */
export interface PrayerSectionProps {
  /** Small muted heading, e.g. "ברכה", "הספירה", "לשם יחוד". */
  title?: React.ReactNode;
  /** text = serif prayer paragraph; blessing = bold; count = the gold count line. */
  variant?: 'text' | 'blessing' | 'count';
  note?: React.ReactNode;
  /** Extra content after the paragraph (e.g. the הרחמן line as a second blessing-weight <p>). */
  after?: React.ReactNode;
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
}
/** One block of the siddur: muted heading + large serif prayer text (scales fully with --fs). Wrap a list of them in <Siddur>. */
export function PrayerSection({ title, variant = 'text', note, after, headerAction, children }: PrayerSectionProps) {
  return (
    <section>
      {title && <h3 className={headerAction ? 'h3row' : undefined}>{title}{headerAction}</h3>}
      <p className={variant === 'blessing' ? 'blessing' : variant === 'count' ? 'countline' : undefined}>{children}</p>
      {note && <div className="note">{note}</div>}
      {after}
    </section>
  );
}
/** Container that applies siddur typography to its <PrayerSection>s and <CollapsibleGroup>s. */
export function Siddur({ children }: { children?: React.ReactNode }) { return <div className="sid">{children}</div>; }

export interface AnaBekoachProps { day: number; nikud?: boolean; }
/** The full אנא בכח prayer for a day: 7 lines + בשכמל"ו, acronym column on the right; this week's line washed gold, tonight's word and letter highlighted (on day 7 of the week the whole name). */
export function AnaBekoach({ day, nikud = true }: AnaBekoachProps) {
  const k = kav(day), t = (s: string) => stripNikud(s, nikud);
  return (
    <div className="sid">
      {ANA.map((l, li) => {
        const on = li === k.w;
        const L = (ci: number) => <span key={ci} className={cx('l', on && (k.d === 6 || ci === k.d) && 'on')}>{l.a[ci]}</span>;
        const words = l.w.map((w, wi) => {
          const s = t(w);
          if (on && k.d < 6 && wi === k.d) { const m = s.match(/^[א-ת][֑-ׇ]*/)![0]; return <React.Fragment key={wi}><span className="hl"><span className="firstl">{m}</span>{s.slice(m.length)}</span>{' '}</React.Fragment>; }
          return <React.Fragment key={wi}>{s}{' '}</React.Fragment>;
        });
        return (
          <div key={li} className={cx('ana-line', on && 'on')}>
            <span className="acr">{L(0)}{L(1)}"{L(2)} {L(3)}{L(4)}"{L(5)}</span>
            <span className="txt">{on && k.d === 6 ? <span className="hl">{words}</span> : words}</span>
          </div>
        );
      })}
      <div className="ana-line"><span className="acr">בשכמל"ו</span><span className="txt">{t('בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד.')} <small className="note">(בלחש)</small></span></div>
    </div>
  );
}

/* ============ TRACKER ============ */
export type DayStatus = 'y' | 'n' | undefined;
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
/** 7×7 grid of round day cells (rows labeled by sefira): gold = counted, dashed red = missed, faded = future. */
export function TrackerGrid({ statuses, current, tonight, onDayClick, showLegend = true }: TrackerGridProps) {
  const rows: React.ReactNode[] = [];
  for (let w = 0; w < 7; w++) {
    rows.push(<div key={'w' + w} className="wk">{stripNikud(SEF[w], false)}</div>);
    for (let d = 1; d <= 7; d++) {
      const n = w * 7 + d, s = statuses[n], fut = !current || n > current;
      rows.push(<button type="button" key={n} aria-label={'יום ' + n} aria-disabled={fut || undefined}
        className={cx('cell', s, fut && 'fut', n === tonight && 'tonight')} onClick={() => !fut && onDayClick?.(n)}>{gem(n).replace(/["']/g, '')}</button>);
    }
  }
  return (
    <div>
      <div className="grid">{rows}</div>
      {showLegend && <div className="legend"><span><i className="y" />ספרתי</span><span><i className="n" />לא ספרתי</span><span><i />לא סומן</span></div>}
    </div>
  );
}

/* ============ DEDICATIONS ============ */
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
/** Dedication card ("הספירה הלילה מוקדשת"): purpose + name, prayer counter, "הזכרתי בתפילתי" / "עוד שם" actions, optional paging. */
export function DedicationCard({ purpose, name, prayedCount = 0, prayed, index = 1, total = 1, onPray, onMore, onUndo, onPrev, onNext }: DedicationCardProps) {
  return (
    <section className="dedic">
      <div className="ded-top"><span>הספירה הלילה מוקדשת</span>
        {total > 1 && <span className="dn">
          <button type="button" aria-label="השם הקודם" disabled={index <= 1} onClick={onPrev}><Icon name="chevron-right" size={14} /></button>
          {index}/{total}
          <button type="button" aria-label="השם הבא" disabled={index >= total} onClick={onNext}><Icon name="chevron-left" size={14} /></button>
        </span>}
      </div>
      <div className="ded-purpose">{purpose}</div>
      <div className="ded-name">{name}</div>
      <div className="ded-count">{prayedCount ? <><b>{prayedCount}</b> {prayedCount === 1 ? 'מתפלל הזכיר' : 'מתפללים הזכירו'} את {name} בתפילתם</> : 'היה הראשון להזכיר בתפילתך'}</div>
      <div className="ded-actions">
        {prayed ? <Button variant="locked" disabled>✓ הזכרת בתפילתך</Button> : <Button onClick={onPray}>הזכרתי בתפילתי</Button>}
        <Button variant="ghost" onClick={onMore}>עוד שם</Button>
      </div>
      <div className="ded-thanks">{prayed ? 'תודה. שתתקבל תפילתך ברצון' : ''}</div>
      {prayed && <button type="button" className="back-today" onClick={onUndo}>ביטול הסימון</button>}
    </section>
  );
}

export interface QuoteProps { text: string; source?: string; }
/** Centered serif quote of the day with a small muted source. */
export function Quote({ text, source }: QuoteProps) {
  return <div className="quote">{text} {source && <small>({source})</small>}</div>;
}

export interface HesedEntry { name: string; purpose: string; when: string; }
export interface HesedSummaryProps { entries: HesedEntry[]; }
const BADGES: [number, string, string][] = [[1, '🕯️', 'נר ראשון'], [7, '🌿', 'שבוע של חסד'], [18, '⭐', 'ח"י שמות'], [36, '🔥', 'ל"ו'], [49, '👑', 'שבעה שבועות']];
/** "גומלי חסד בתפילה": points (10 per name), badge row, next-badge hint and a table of names mentioned. */
export function HesedSummary({ entries }: HesedSummaryProps) {
  const n = entries.length, next = BADGES.find(b => b[0] > n);
  return (
    <div className="hesed">
      <h3>גומלי חסד בתפילה</h3>
      <div className="pts"><span className="big">{n * 10}</span><span>נקודות חסד · הזכרת {n} {n === 1 ? 'שם' : 'שמות'} בתפילתך</span></div>
      <div className="badges">{BADGES.map(b => <Badge key={b[0]} icon={b[1]} earned={n >= b[0]} title={b[0] + ' שמות'}>{b[2]}</Badge>)}</div>
      {next && <Note>עוד {next[0] - n} {next[0] - n === 1 ? 'שם' : 'שמות'} לתג {next[1]} {next[2]}</Note>}
      {n ? <table className="hs"><tbody><tr><th>שם</th><th>עבור</th><th>מתי</th></tr>{entries.map((x, i) => <tr key={i}><td>{x.name}</td><td>{x.purpose}</td><td>{x.when}</td></tr>)}</tbody></table>
        : <Note>כשתזכיר בתפילתך שם מההקדשות, הוא יופיע כאן.</Note>}
    </div>
  );
}

/* ============ BARS ============ */
export interface MiniBarProps {
  day: number;
  nusach?: Nusach;
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
/** Compact sticky top bar shown while scrolling: gematria day + short count, א−/א+, theme, settings. */
export function MiniBar({ day, nusach = 'em', visible = true, inline, fontScale = 1, onFontScale, onToggleTheme, onSettings, onCountClick }: MiniBarProps) {
  return (
    <div className={cx('mini', visible && 'show', inline && 'inline')}>
      <button type="button" className="mini-count" aria-label="חזרה לראש העמוד" onClick={onCountClick}><b>{gem(day)}</b><span>{shortCount(day, nusach)}</span></button>
      <div className="tools">
        <FontSizeControl value={fontScale} onChange={onFontScale} />
        <IconButton size="sm" label="בהיר או כהה" onClick={onToggleTheme}><Icon name="theme" size={18} /></IconButton>
        <IconButton size="sm" label="הגדרות" onClick={onSettings}><Icon name="settings" size={18} /></IconButton>
      </div>
    </div>
  );
}

export const SCROLL_SPEEDS = ['איטי מאוד', 'איטי', 'בינוני', 'מהיר', 'מהיר מאוד'];
export interface AutoScrollBarProps {
  playing?: boolean;
  /** 1–5 (SCROLL_SPEEDS). The −/name/+ speed control shows only while playing. */
  speed?: number;
  inline?: boolean;
  onToggle?: () => void;
  onSpeed?: (v: number) => void;
}
/** Floating bottom pill for auto-scrolling the siddur: gold play/pause + −/speed/+ control. */
export function AutoScrollBar({ playing, speed = 2, inline, onToggle, onSpeed }: AutoScrollBarProps) {
  return (
    <div className={cx('autobar', inline && 'inline')}>
      <button type="button" className="play" aria-label={playing ? 'עצור גלילה' : 'התחל גלילה אוטומטית'} onClick={onToggle}><Icon name={playing ? 'pause' : 'play'} size={16} /></button>
      {playing && <div className="spd" role="slider" aria-label="מהירות גלילה" aria-valuemin={1} aria-valuemax={5} aria-valuenow={speed}>
        <button type="button" aria-label="האט" disabled={speed <= 1} onClick={() => onSpeed?.(speed - 1)}>−</button>
        <span>{SCROLL_SPEEDS[speed - 1]}</span>
        <button type="button" aria-label="האץ" disabled={speed >= 5} onClick={() => onSpeed?.(speed + 1)}>+</button>
      </div>}
    </div>
  );
}
