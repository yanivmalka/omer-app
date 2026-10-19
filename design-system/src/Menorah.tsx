import * as React from 'react';
import { ANA, PS, kav, gem, stripNikud } from './omer';

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

/**
 * Psalm 67 (למנצח) drawn as a seven-branched menorah, ported from the app's menorahHTML().
 * Verse 2 on the left branch … verse 8 on the right; center branch "ישמחו…מישור" with its end on the base;
 * "למנצח בנגינות מזמור שיר" split above the branch tops; "שויתי ה׳ לנגדי תמיד" on top;
 * אנא בכח names on both sides (right top→down, left bottom→up). Past words gold, today's word boxed.
 */
export function Menorah({ day, width = 360, fontScale = 1, nikud = true, caption = true }: MenorahProps) {
  const t = (s: string) => stripNikud(s, nikud);
  const n = day, k = kav(n), FS = 19, SFS = 17, TFS = 30, FFS = FS;
  const cw = Math.max(260, width - 36), BL = 1.3 * 17, bl = BL * fontScale;
  const ratio = Math.min(.9, (FS * cw / 352) / (BL * 1.4)), D = ratio * bl;
  const STEP = Math.min(78, Math.max(40, (FS * cw / D / 2 - 56) / 3));
  const R3 = 3 * STEP, SIDEX = R3 + 38, VBW = 2 * (SIDEX + 18), CX = VBW / 2, svgW = Math.min(cw, VBW * D / FS);
  const OFF = [-3, -2, -1, 0, 1, 2, 3];
  const FRAG: Record<string, string> = { 3: 'לַמְנַ', 2: 'צֵּחַ בִּ', 1: 'נְגִי', 0: 'נֹת', '-1': 'מִזְ', '-2': 'מוֹר', '-3': 'שִׁיר' };
  const est = (w: string) => w.replace(/[֑-ׇ]/g, '').length * FS * 0.6;
  const need = (list: string[]) => list.reduce((x, w) => x + est(w), 0) * 1.22;
  const END = 36;
  let L = 180;
  PS.forEach((v, vi) => {
    const r = Math.abs(OFF[vi]) * STEP;
    L = Math.max(L, vi === 3 ? need(v.slice(0, 7)) - R3 - 10 : need(v) - (Math.PI / 2 * r - END));
  });
  const TOP = TFS + 22 + FFS + 34, Y0 = TOP + L, STEM = Y0 + R3 + 10;
  const chan: React.ReactNode[] = [], words: React.ReactNode[] = [], frags: React.ReactNode[] = [];
  let base: React.ReactNode[] = [], idx = 0;
  PS.forEach((v, vi) => {
    const o = OFF[vi] * STEP, r = Math.abs(o), side = Math.sign(o), on = vi === k.ps.vi;
    let list = v, len: number, d: string, pos: (s: number) => { x: number; y: number; tx: number; ty: number };
    if (o === 0) { list = v.slice(0, 7); len = STEM - TOP; d = `M${CX} ${TOP} V${STEM}`; pos = s => ({ x: CX, y: TOP + s, tx: 0, ty: 1 }); }
    else {
      const x0 = CX + o; len = L + Math.PI / 2 * r - END;
      d = `M${x0} ${TOP} V${Y0} A${r} ${r} 0 0 ${side > 0 ? 1 : 0} ${CX} ${Y0 + r}`;
      pos = s => { if (s <= L) return { x: x0, y: TOP + s, tx: 0, ty: 1 }; const th = (s - L) / r; return { x: CX + side * r * Math.cos(th), y: Y0 + r * Math.sin(th), tx: -side * Math.sin(th), ty: Math.cos(th) }; };
    }
    chan.push(<path key={vi} className={'chan' + (on ? ' on' : '')} d={d} />);
    frags.push(<text key={vi} className="mfrag" x={CX + o} y={TOP - 24} textAnchor="middle" direction="rtl">{t(FRAG[OFF[vi]])}</text>);
    const ws = list.map(est), gap = (len - ws.reduce((x, y) => x + y, 0)) / list.length; let s = gap / 2;
    list.forEach((w, i) => {
      idx++; const c = pos(s + ws[i] / 2); s += ws[i] + gap;
      const ang = Math.atan2(-c.ty, -c.tx) * 180 / Math.PI, cls = idx === n ? 'today' : idx < n ? 'past' : '';
      words.push(<g key={idx} transform={`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${ang.toFixed(1)})`}>
        {idx === n && <rect className="tbg" x={(-ws[i] / 2 - 6).toFixed(1)} y={(-FS * .85).toFixed(1)} width={(ws[i] + 12).toFixed(1)} height={(FS * 1.75).toFixed(1)} rx={8} />}
        <text className={'mw ' + cls} textAnchor="middle" dominantBaseline="central" direction="rtl">{t(w)}</text></g>);
    });
    if (o === 0) base = v.slice(7).map(w => { idx++; return <React.Fragment key={idx}><tspan className={'mw ' + (idx === n ? 'today-t' : idx < n ? 'past' : '')}>{t(w)}</tspan>{' '}</React.Fragment>; });
  });
  const side: React.ReactNode[] = []; const rw = SFS * 5.8, rh = SFS * 1.9;
  type Item = { h?: React.ReactNode; t?: string; on: boolean };
  const col = (x: number, items: Item[], down: boolean) => {
    const sh = (STEM - TOP) / items.length;
    items.forEach((it, j) => {
      const y = down ? TOP + sh * j + sh / 2 : STEM - sh * j - sh / 2;
      side.push(<g key={x + '-' + j} transform={`translate(${x} ${y.toFixed(1)}) rotate(${down ? -90 : 90})`}>
        {it.on && <rect className="tbg soft" x={(-rw / 2).toFixed(1)} y={(-rh / 2).toFixed(1)} width={rw.toFixed(1)} height={rh.toFixed(1)} rx={8} />}
        <text className={'mside' + (it.on ? ' on' : '')} textAnchor="middle" dominantBaseline="central" direction="rtl">{it.h || t(it.t!)}</text></g>);
    });
  };
  const A = (i: number): Item => {
    const on = i === k.w, a = ANA[i].a;
    const Lt = (j: number) => <tspan key={j} className={on && (k.d === 6 || j === k.d) ? 'lon' : ''}>{a[j]}</tspan>;
    return { h: <>{Lt(0)}{Lt(1)}"{Lt(2)} {Lt(3)}{Lt(4)}"{Lt(5)}</>, on };
  };
  col(CX + SIDEX, [A(0), A(1), A(2), A(3)], true);
  col(CX - SIDEX, [A(4), A(5), A(6), { t: 'בשכמל"ו', on: false }], false);
  const bw = Math.min(VBW / 2 - 40, Math.max(110, need(PS[3].slice(7)) / 2 + 14)), bh = 38 + FS, VBH = STEM + 6 + bh + 14;
  const style = { width: svgW.toFixed(0) + 'px', margin: '0 auto', '--mfs': FS + 'px', '--msfs': SFS + 'px', '--mtfs': TFS + 'px', '--mffs': FFS + 'px', '--mcw': '32px' } as React.CSSProperties;
  return (
    <div>
      <div className="men-scroll">
        <svg className="menorah" viewBox={`0 0 ${VBW} ${VBH.toFixed(0)}`} role="img" aria-label="מזמור למנצח בצורת המנורה" style={style}>
          <text className="mtop" x={CX} y={(TFS + 8).toFixed(1)} textAnchor="middle" direction="rtl">{t('שִׁוִּיתִי ה׳ לְנֶגְדִּי תָמִיד')}</text>
          {chan}
          <path className="mbase" d={`M${CX - bw} ${STEM + 6} H${CX + bw} L${CX + bw + 35} ${STEM + 6 + bh} H${CX - bw - 35} Z`} />
          {frags}{words}{side}
          <text x={CX} y={(STEM + 6 + bh / 2).toFixed(1)} textAnchor="middle" dominantBaseline="central" direction="rtl">{base}</text>
        </svg>
      </div>
      {caption && <>
        <div className="men-caption">יום {gem(n)}: <b>{t(k.ps.w)}</b> · {t(k.sef)} · {t(k.ana)}</div>
        <div className="note" style={{ textAlign: 'center' }}>כל קנה הוא פסוק, מפסוק ב׳ בקנה השמאלי ועד פסוק ח׳ בימני. בקנה האמצעי "ישמחו וירננו", וסופו כתוב על הבסיס. המילים שכבר נספרו בזהב.</div>
      </>}
    </div>
  );
}
