#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(root, '..');
const exporter = path.join(repoRoot, 'skills/pixelcraft-tokens/scripts/export-tokens.mjs');
const tokensFile = path.join(root, 'tokens/pixelcraft.tokens.json');
const outDir = path.join(root, 'src/styles');

fs.mkdirSync(outDir, { recursive: true });
execFileSync(process.execPath, [exporter, tokensFile, '--format', 'css', '--out-dir', outDir], { stdio: 'pipe' });
execFileSync(process.execPath, [exporter, tokensFile, '--format', 'css', '--mode', 'dark', '--out-dir', outDir], { stdio: 'pipe' });

const lightBody = fs.readFileSync(path.join(outDir, 'tokens.css'), 'utf8')
  .replace(/^:root\s*\{/, '')
  .replace(/\}\s*$/, '')
  .trim();
const darkBody = fs.readFileSync(path.join(outDir, 'tokens.dark.css'), 'utf8')
  .replace(/^:root\s*\{/, '')
  .replace(/\}\s*$/, '')
  .trim();

const combined = `/* Generated from website/tokens/pixelcraft.tokens.json via export-tokens.mjs */
:root,
[data-theme="dark"] {
  color-scheme: dark;
${darkBody}
}

[data-theme="light"] {
  color-scheme: light;
${lightBody}
}
`;

fs.writeFileSync(path.join(outDir, 'theme-tokens.css'), combined);
console.log('synced website/src/styles/theme-tokens.css');
