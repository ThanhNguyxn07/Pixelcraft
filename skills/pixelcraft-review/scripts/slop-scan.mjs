#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const exts = new Set(['.css','.scss','.html','.jsx','.tsx','.vue','.svelte','.dart','.swift','.kt','.py','.qss','.tcss','.js','.ts']);
const skip = new Set(['node_modules','.git','dist','build','coverage']);
const skillHosts = new Set(['.claude','.agents','.cursor','.gemini','.github','.copilot']);
function partsOf(file) { return file.split(/[\\/]/); }
function isInstalledPixelcraftSkill(file) {
  const parts = partsOf(file);
  return parts.some((part, i) => skillHosts.has(part) && parts[i + 1] === 'skills' && parts[i + 2]?.startsWith('pixelcraft'));
}
function isInsidePixelcraftSkill(file) {
  const parts = partsOf(file);
  return parts.some((part, i) => part === 'skills' && parts[i + 1]?.startsWith('pixelcraft'));
}
const disclaimer = 'A zero score means only that these known fingerprints were not detected; zero findings is not evidence of good design.';

function help() {
  return `Usage: node slop-scan.mjs <directory> [--json]\n\nScan source files for recurring AI-slop fingerprints. Output includes file:line,\nseverity, score contribution, and a suggested fix. ${disclaimer}`;
}
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (isInstalledPixelcraftSkill(file)) continue;
    if ((entry.name === 'fixtures' || entry.name === 'examples') && isInsidePixelcraftSkill(file)) continue;
    if (entry.isDirectory()) walk(file, out);
    else if (exts.has(path.extname(entry.name))) out.push(file);
  }
  return out;
}
function lineOf(text, index) { return text.slice(0, index).split(/\r?\n/).length; }

function scanFile(file, root) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const findings = [];
  const seenRules = new Set();
  const focusVisibleLines = new Set();
  const focusRulePattern = /([^{}]+)\{([^{}]*)\}/gs;
  for (const match of text.matchAll(focusRulePattern)) {
    const [whole, selector, body] = match;
    if (!selector.includes(':focus-visible')) continue;
    const start = lineOf(text, match.index);
    const end = lineOf(text, match.index + whole.length);
    for (let line = start; line <= end; line += 1) focusVisibleLines.add(line);
    const outline = /outline\s*:\s*(none|0)\b/i.exec(body);
    if (!outline) continue;
    const shadow = /box-shadow\s*:\s*(?!none\b)[^;}]+/i.test(body);
    const border = /border(?:-[\w-]+)?\s*:\s*(?!none\b|0\b)[^;}]+/i.test(body);
    const visibleOutline = /outline-offset/i.test(body) && /outline(?:-style)?\s*:[^;}]*(?:solid|double|auto|thick|thin|medium)/i.test(body);
    if (!shadow && !border && !visibleOutline) {
      const bodyStart = match.index + whole.indexOf(body);
      const line = lineOf(text, bodyStart + outline.index);
      const key = `outline-removed:${line}`;
      if (!seenRules.has(key)) {
        seenRules.add(key);
        findings.push({ rule: 'outline-removed', severity: 'P0', weight: 5, file: path.relative(root, file), line, match: outline[0], fix: 'Restore a visible keyboard focus indicator.' });
      }
    }
  }
  const add = (rule, severity, weight, line, match, fix) => {
    const key = `${rule}:${line}`;
    if (seenRules.has(key)) return;
    seenRules.add(key);
    findings.push({ rule, severity, weight, file: path.relative(root, file), line, match: match.trim().slice(0, 160), fix });
  };
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/font-family\s*:\s*['"]?(Inter|Roboto|Geist|Arial)['"]?\s*;?/i.test(line)) add('default-font-only','P2',2,n,line,'Choose type by voice/platform and provide deliberate fallbacks.');
    if (/transition\s*:\s*all\b/.test(line)) add('transition-all','P2',2,n,line,'Animate only intentional properties with semantic durations/easing.');
    if (!focusVisibleLines.has(n) && /outline\s*:\s*(none|0)\b/.test(line) && !/box-shadow|outline-offset/i.test(line)) add('outline-removed','P0',5,n,line,'Restore a visible keyboard focus indicator.');
    if (/<(input|textarea)\b[^>]*placeholder=/i.test(line) && !/aria-label|aria-labelledby/i.test(line)) add('placeholder-as-label','P1',4,n,line,'Use a persistent programmatic label; placeholder is only a hint.');
    if (/(user-scalable\s*=\s*["']?no|maximum-scale\s*=\s*["']?1(?:\.0)?\b)/i.test(line)) add('zoom-disabled','P0',5,n,line,'Do not disable pinch zoom or text scaling.');
    if (/\p{Extended_Pictographic}/u.test(line) && /icon|button|nav|<span/i.test(line)) add('emoji-as-icon','P2',2,n,line,'Use a coherent icon system or text instead of structural emoji.');
    if (/\b(get started|seamless|unlock|revolutionize|elevate)\b/i.test(line) || /lorem ipsum/i.test(line)) add('generic-copy','P2',2,n,line,'Replace template copy with concrete user/domain language.');
    if (/rounded-2xl/.test(line)) add('rounded-2xl-repetition','P3',1,n,line,'Use semantic radius variation rather than uniform rounded-2xl.', true);
    if (/shadow-(lg|xl|2xl)/.test(line)) add('uniform-shadow','P3',1,n,line,'Use elevation/shadow only where material semantics require it.', true);
  });

  const rounded = (text.match(/rounded-2xl/g) || []).length;
  if (rounded < 3) for (const f of findings.filter((f) => f.rule === 'rounded-2xl-repetition')) f.drop = true;
  const shadows = (text.match(/shadow-(lg|xl|2xl)/g) || []).length;
  if (shadows < 3) for (const f of findings.filter((f) => f.rule === 'uniform-shadow')) f.drop = true;

  if (/gradient/i.test(text) && /(purple|violet|indigo|blue|#[0-9a-f]{3,8})/i.test(text) && /(purple|violet|indigo)/i.test(text) && /(blue|cyan)/i.test(text)) add('purple-blue-gradient','P2',2,lineOf(text,/gradient/i.exec(text)?.index || 0),'gradient definition','Use a color posture derived from subject/material rather than the default AI gradient.');
  const paste = /paste[\s\S]{0,160}preventDefault|preventDefault[\s\S]{0,160}paste/i.exec(text);
  if (paste) add('paste-blocked','P0',5,lineOf(text,paste.index),paste[0],'Never block paste; it harms password managers, accessibility, and recovery.');
  const motion = /@keyframes|\banimation\b|\btransition\b/.exec(text);
  if (motion && !/prefers-reduced-motion|reduceMotion|accessibilityReduceMotion/i.test(text)) add('missing-reduced-motion','P1',4,lineOf(text,motion.index),motion[0],'Provide a reduced-motion path when animation or transitions exist.');
  const hexes = [...text.matchAll(/#[0-9a-fA-F]{3,8}\b/g)];
  const tokenRefs = (text.match(/var\(|token|theme\.|Color\.|semantic/gi) || []).length;
  if (hexes.length >= 6 && hexes.length > tokenRefs * 2) add('hardcoded-color-literals','P2',2,lineOf(text,hexes[0].index),`${hexes.length} hardcoded color literals`,'Move recurring colors into semantic tokens and verify contrast roles.');
  const heroIndex = text.search(/hero|text-center|items-center|justify-center|mx-auto/i);
  const ctaCount = (text.match(/<button|<a\b|get started|learn more/gi) || []).length;
  if (heroIndex >= 0 && ctaCount >= 2 && /(hero|text-center)/i.test(text)) add('centered-hero-two-ctas','P3',1,lineOf(text,heroIndex),'centered hero with repeated calls to action','Question the centered hero/two-CTA template; choose composition from the user decision.');
  return findings.filter((f) => !f.drop);
}

try {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) { console.log(help()); process.exit(0); }
  const json = args.includes('--json');
  const dir = args.find((a) => !a.startsWith('-'));
  if (!dir || !fs.existsSync(dir)) throw new Error('provide an existing file or directory to scan');
  const input = path.resolve(dir);
  const stat = fs.statSync(input);
  const root = stat.isDirectory() ? input : path.dirname(input);
  const files = stat.isDirectory() ? walk(input) : [input];
  const findings = files.flatMap((file) => scanFile(file, root));
  const score = findings.reduce((sum, f) => sum + f.weight, 0);
  const output = { score, disclaimer, findings };
  if (json) console.log(JSON.stringify(output, null, 2));
  else {
    console.log(`slop-scan score: ${score}`);
    for (const f of findings) console.log(`${f.severity} ${f.file}:${f.line} ${f.rule} (+${f.weight}) — ${f.match}\n  fix: ${f.fix}`);
    console.log(`disclaimer: ${disclaimer}`);
  }
} catch (error) {
  console.error(`slop-scan: ${error.message}`);
  process.exit(1);
}
