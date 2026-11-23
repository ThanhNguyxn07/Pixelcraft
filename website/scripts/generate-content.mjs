#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(siteRoot, '..');
const skillsDir = path.join(repoRoot, 'skills');
const outDir = path.join(siteRoot, 'src/generated');

const CORE = new Set(['pixelcraft', 'pixelcraft-plan', 'pixelcraft-direction']);
const CRAFT = new Set([
  'pixelcraft-craft',
  'pixelcraft-tokens',
  'pixelcraft-ux',
  'pixelcraft-patterns',
  'pixelcraft-accessibility',
  'pixelcraft-brandkit',
  'pixelcraft-dataviz',
]);
const QUALITY = new Set(['pixelcraft-review', 'pixelcraft-visual-qa', 'pixelcraft-handoff']);

function categorize(name) {
  if (CORE.has(name)) return 'Core Loop';
  if (CRAFT.has(name)) return 'Craft & UX';
  if (QUALITY.has(name)) return 'Quality & Handoff';
  return 'Platform';
}

function parseSkill(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { name: '', description: '', body: raw };
  const block = match[1];
  const body = match[2].trim();
  const nameMatch = /^name:\s*(.+)$/m.exec(block);
  const descMatch = /^description:\s*(.+)$/m.exec(block);
  const clean = (v) => v.trim().replace(/^["']|["']$/g, '');
  return {
    name: nameMatch ? clean(nameMatch[1]) : '',
    description: descMatch ? clean(descMatch[1]) : '',
    body,
  };
}

const entries = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
const skills = [];

for (const entry of entries) {
  const dir = path.join(skillsDir, entry.name);
  const skillMd = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(skillMd)) continue;
  const parsed = parseSkill(fs.readFileSync(skillMd, 'utf8'));
  const refsDir = path.join(dir, 'references');
  const scriptsDir = path.join(dir, 'scripts');
  const references = fs.existsSync(refsDir)
    ? fs.readdirSync(refsDir).filter((f) => f.endsWith('.md')).sort()
    : [];
  const scripts = fs.existsSync(scriptsDir)
    ? fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.mjs')).sort()
    : [];

  skills.push({
    slug: entry.name,
    name: parsed.name || entry.name,
    description: parsed.description,
    category: categorize(parsed.name || entry.name),
    references,
    scripts,
    body: parsed.body,
  });
}

const order = { 'Core Loop': 0, 'Craft & UX': 1, 'Quality & Handoff': 2, Platform: 3 };
skills.sort((a, b) => order[a.category] - order[b.category] || a.name.localeCompare(b.name));

const docs = {
  architecture: fs.readFileSync(path.join(repoRoot, 'docs/ARCHITECTURE.md'), 'utf8'),
  rationale: fs.readFileSync(path.join(repoRoot, 'docs/DESIGN-RATIONALE.md'), 'utf8'),
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'skills.json'), `${JSON.stringify(skills, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'docs.json'), `${JSON.stringify(docs, null, 2)}\n`);
console.log(`generated ${skills.length} skills + 2 docs into website/src/generated/`);
