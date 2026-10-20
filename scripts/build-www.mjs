// Copies the static PWA into www/ (the Capacitor webDir). No bundler: the app is plain files.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });
for (const p of ['index.html', 'manifest.webmanifest', 'icons', 'src']) cpSync(p, `www/${p}`, { recursive: true });
// design system: only what the app loads at runtime
mkdirSync('www/ds/components/lib', { recursive: true });
for (const p of ['components/bundle.js', 'components/bundle.css', 'components/lib', 'tokens.json', 'tokens.css'])
  cpSync(`ds/${p}`, `www/ds/${p}`, { recursive: true });
console.log('www/ ready');
