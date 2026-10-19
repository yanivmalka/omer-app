import { Icon } from '@omer/ds';

const names = ['settings', 'theme', 'chevron-right', 'chevron-left', 'chevron-down', 'menorah', 'play', 'pause'] as const;
export const AllIcons = () => (
  <div className="row" style={{ gap: 18, color: 'var(--ink)' }}>
    {names.map(n => <span key={n} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><Icon name={n} size={24} /><small className="note">{n}</small></span>)}
  </div>
);
export const Gold = () => <div className="row" style={{ color: 'var(--gold)' }}><Icon name="menorah" size={32} /><Icon name="play" size={32} /></div>;
