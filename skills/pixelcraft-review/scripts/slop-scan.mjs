#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const exts = new Set(['.css','.scss','.html','.jsx','.tsx','.vue','.svelte','.dart','.swift','.kt','.py','.qss','.tcss','.js','.ts']);
const cssExts = new Set(['.css','.scss','.qss','.tcss']);
const markupExts = new Set(['.html','.vue','.svelte']);
const skip = new Set(['node_modules','.git','dist','build','coverage']);
const skillHosts = new Set(['.claude','.agents','.cursor','.gemini','.github','.copilot']);
const disclaimer = 'A zero score means only that these known fingerprints were not detected; zero findings is not evidence of good design.';

function help() {
  return `Usage: node slop-scan.mjs <directory> [--json]\n\nScan source files for recurring AI-slop fingerprints. Output includes file:line,\nseverity, score contribution, and a suggested fix. ${disclaimer}`;
}
function partsOf(file) { return file.split(/[\\/]/); }
function isInstalledPixelcraftSkill(file) {
  const parts = partsOf(file);
  return parts.some((part, i) => skillHosts.has(part) && parts[i + 1] === 'skills' && parts[i + 2]?.startsWith('pixelcraft'));
}
function isInsidePixelcraftSkill(file) {
  const parts = partsOf(file);
  return parts.some((part, i) => part === 'skills' && parts[i + 1]?.startsWith('pixelcraft'));
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

function skipComment(text, i) {
  const end = text.indexOf('*/', i + 2);
  return end < 0 ? text.length : end + 2;
}

function styleSegments(text) {
  const lower = text.toLowerCase();
  const out = [];
  let pos = 0;
  while (pos < text.length) {
    const open = lower.indexOf('<style', pos);
    if (open < 0) break;
    const tagEnd = lower.indexOf('>', open);
    if (tagEnd < 0) break;
    const close = lower.indexOf('</style', tagEnd + 1);
    if (close < 0) break;
    out.push({ text: text.slice(tagEnd + 1, close), offset: tagEnd + 1 });
    pos = close + 8;
  }
  return out;
}

function cssSegments(file, text) {
  const ext = path.extname(file);
  if (cssExts.has(ext)) return [{ text, offset: 0 }];
  if (markupExts.has(ext)) return styleSegments(text);
  return [];
}

function splitSelectorList(selector) {
  const out = [];
  let start = 0, depth = 0, quote = '';
  for (let i = 0; i < selector.length; i += 1) {
    const c = selector[i];
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(' || c === '[') depth += 1;
    else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
    else if (c === ',' && depth === 0) {
      out.push(selector.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(selector.slice(start).trim());
  return out.filter(Boolean);
}

function stripNotContents(selector) {
  let out = '';
  for (let i = 0; i < selector.length; i += 1) {
    if (selector.slice(i, i + 5).toLowerCase() === ':not(') {
      let depth = 1, quote = '';
      i += 5;
      for (; i < selector.length && depth; i += 1) {
        const c = selector[i];
        if (quote) {
          if (c === '\\') i += 1;
          else if (c === quote) quote = '';
        } else if (c === '"' || c === "'") quote = c;
        else if (c === '(') depth += 1;
        else if (c === ')') depth -= 1;
      }
      i -= 1;
    } else out += selector[i];
  }
  return out;
}

function focusPseudo(selector) {
  const stripped = stripNotContents(selector);
  if (/:focus-visible\b/i.test(stripped)) return true;
  if (/:focus\b/i.test(stripped)) {
    // `:focus:not(:focus-visible)` intentionally suppresses the mouse-focus ring;
    // keyboard visibility must be handled by a separate `:focus-visible` rule.
    if (/:not\(\s*:focus-visible\s*\)/i.test(selector)) return false;
    return true;
  }
  return false;
}

function declarations(body) {
  const out = [];
  let start = 0, depth = 0, quote = '';
  for (let i = 0; i <= body.length; i += 1) {
    const c = body[i] || ';';
    if (c === '/' && body[i + 1] === '*') { i = skipComment(body, i) - 1; continue; }
    if (quote) {
      if (c === '\\') i += 1;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth += 1;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (c === ';' && depth === 0) {
      const raw = body.slice(start, i);
      const colon = raw.indexOf(':');
      if (colon > 0) out.push({ prop: raw.slice(0, colon).trim().toLowerCase(), value: raw.slice(colon + 1).trim().toLowerCase(), offset: start + colon + 1 });
      start = i + 1;
    }
  }
  return out;
}

function visibleReplacement(decls) {
  return decls.some(({ prop, value }) => {
    const clean = value.replace(/\s*!important\s*$/, '').trim();
    if (prop === 'box-shadow') return clean !== 'none';
    if (prop === 'outline') return !/^(none|0)\b/.test(clean);
    if (prop === 'outline-style') return clean !== 'none' && clean !== 'hidden';
    if (prop === 'outline-width') return !/^0(?:\.0+)?(?:px|em|rem)?\b/.test(clean);
    if (prop === 'border' || prop === 'border-color' || prop === 'border-width' || prop === 'border-style') return clean !== 'none' && !/^0(?:\.0+)?(?:px)?\s*$/.test(clean);
    if (/^border-(top|right|bottom|left|inline|block)(?:-(?:start|end))?(?:-color|-width|-style)?$/.test(prop)) return clean !== 'none' && !/^0(?:\.0+)?(?:px)?\s*$/.test(clean);
    if (prop.startsWith('text-decoration')) return clean !== 'none';
    return false;
  });
}

function scanRules(segment, baseOffset, sourceText, visit) {
  let i = 0;
  const text = segment.text;
  while (i < text.length) {
    while (i < text.length && (/\s/.test(text[i]) || (text[i] === '/' && text[i + 1] === '*'))) {
      i = text[i] === '/' ? skipComment(text, i) : i + 1;
    }
    if (i >= text.length) break;
    const selectorStart = i;
    let quote = '', depth = 0;
    for (; i < text.length; i += 1) {
      const c = text[i];
      if (c === '/' && text[i + 1] === '*') { i = skipComment(text, i) - 1; continue; }
      if (quote) {
        if (c === '\\') i += 1;
        else if (c === quote) quote = '';
      } else if (c === '"' || c === "'") quote = c;
      else if (c === '(' || c === '[') depth += 1;
      else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
      else if (c === '{' && depth === 0) break;
    }
    if (i >= text.length) break;
    const selector = text.slice(selectorStart, i).trim();
    const bodyStart = i + 1;
    let braceDepth = 1;
    quote = '';
    for (i += 1; i < text.length; i += 1) {
      const c = text[i];
      if (c === '/' && text[i + 1] === '*') { i = skipComment(text, i) - 1; continue; }
      if (quote) {
        if (c === '\\') i += 1;
        else if (c === quote) quote = '';
      } else if (c === '"' || c === "'") quote = c;
      else if (c === '{') braceDepth += 1;
      else if (c === '}') {
        braceDepth -= 1;
        if (braceDepth === 0) break;
      }
    }
    if (!selector || i >= text.length) break;
    visit(selector, text.slice(bodyStart, i), {
      selectorIndex: baseOffset + selectorStart,
      bodyIndex: baseOffset + bodyStart,
      sourceText
    });
    i += 1;
  }
}

function scanFile(file, root) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const findings = [];
  const seenRules = new Set();
  const add = (rule, severity, weight, line, match, fix) => {
    const key = `${rule}:${line}`;
    if (seenRules.has(key)) return;
    seenRules.add(key);
    findings.push({ rule, severity, weight, file: path.relative(root, file), line, match: match.trim().slice(0, 160), fix });
  };

  for (const segment of cssSegments(file, text)) {
    scanRules(segment, segment.offset, text, (selectorText, body, location) => {
      const decls = declarations(body);
      const removal = decls.find((d) => d.prop === 'outline' && /^(none|0)(?:\s*!important)?$/.test(d.value));
      if (!removal || visibleReplacement(decls)) return;
      for (const selector of splitSelectorList(selectorText)) {
        if (!focusPseudo(selector)) continue;
        add('outline-removed','P0',5,lineOf(text,location.bodyIndex + removal.offset),body.slice(removal.offset).trim().split(';')[0] || 'outline: none','Restore a visible keyboard focus indicator.');
      }
    });
  }

  lines.forEach((line, i) => {
    const n = i + 1;
    if (/font-family\s*:\s*['"]?(Inter|Roboto|Geist|Arial)['"]?\s*;?/i.test(line)) add('default-font-only','P2',2,n,line,'Choose type by voice/platform and provide deliberate fallbacks.');
    if (/transition\s*:\s*all\b/.test(line)) add('transition-all','P2',2,n,line,'Animate only intentional properties with semantic durations/easing.');
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
