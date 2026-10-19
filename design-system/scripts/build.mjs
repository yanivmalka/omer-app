// Builds dist/index.js (ESM, react external) and dist/styles.css (tokens + components).
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  target: 'es2020',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
});
const css = ['tokens.css', 'components.css'].map(f => readFileSync('src/styles/' + f, 'utf8')).join('\n');
writeFileSync('dist/styles.css', css);
console.log('built dist/index.js + dist/styles.css');
