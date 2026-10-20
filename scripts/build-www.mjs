// Copies the static PWA into www/ (the Capacitor webDir). No bundler: the app is plain files.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });
for (const p of ['index.html', 'manifest.webmanifest', 'icons', 'src']) cpSync(p, `www/${p}`, { recursive: true });
// design system: only what the app loads at runtime
mkdirSync('www/ds/components/lib', { recursive: true });
for (const p of ['components/bundle.js', 'components/bundle.css', 'components/lib', 'tokens.json', 'tokens.css'])
  cpSync(`ds/${p}`, `www/ds/${p}`, { recursive: true });
// CI passes BUILD_NUMBER (= Android versionCode); the app uses it if the native version call fails
const bn = parseInt(process.env.BUILD_NUMBER || '0', 10) || 0;
// Capacitor's JS core (registerPlugin etc.). The native bridge alone does not provide registerPlugin,
// so without this file the app's native plugins (updater, back button) are unreachable.
cpSync('node_modules/@capacitor/core/dist/capacitor.js', 'www/capacitor.js');
const html = readFileSync('www/index.html', 'utf8')
  .replace('<head>', `<head>\n<script>window.OMER_BUILD=${bn};</script>`)
  .replace('<script src="src/logic.js">', '<script src="capacitor.js"></script>\n<script src="src/logic.js">');
writeFileSync('www/index.html', html);
console.log('www/ ready, build', bn);
