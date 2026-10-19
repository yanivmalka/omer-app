import { IconButton, Icon } from '@omer/ds';

export const HeaderTools = () => (
  <div className="tools">
    <IconButton size="sm" label="הקטן טקסט">א−</IconButton>
    <IconButton size="sm" label="הגדל טקסט">א+</IconButton>
    <IconButton size="sm" label="בהיר או כהה"><Icon name="theme" size={18} /></IconButton>
    <IconButton label="הגדרות"><Icon name="settings" /></IconButton>
  </div>
);
export const Disabled = () => <div className="tools"><IconButton size="sm" label="הגדל טקסט" disabled>א+</IconButton><IconButton size="sm" label="הקטן טקסט">א−</IconButton></div>;
