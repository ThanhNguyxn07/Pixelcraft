#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');
const evalsRoot = path.join(root, 'evals');
const errors = [];
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const yamlPlainStartPattern = /^[-?:,\[\]{}#&*!|>'"%@`]/;

function fail(file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

function parseFrontmatter(file, text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { error: 'missing opening frontmatter delimiter' };
  const end = lines.findIndex((line, index) => index > 0 && line === '---');
  if (end === -1) return { error: 'missing closing frontmatter delimiter' };

  const data = {};
  const seen = new Set();
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (line.includes('\t')) return { error: 'frontmatter contains a tab character' };
    if (/^\s/.test(line)) continue; // nested metadata/list content; not needed for linted scalar fields
    const match = /^([A-Za-z0-9_-]+):(?:[ \t]*(.*))?$/.exec(line);
    if (!match) return { error: `unparseable frontmatter line: ${line}` };
    const [, key, raw = ''] = match;
    if (seen.has(key)) return { error: `duplicate frontmatter key: ${key}` };
    seen.add(key);
    let value = raw.trim();
    const startsQuoted = value.startsWith('"') || value.startsWith("'");
    if (value && !startsQuoted) {
      if (value.includes(': ')) return { error: `unquoted scalar for ${key} contains ': '; quote it for strict YAML loaders` };
      if (yamlPlainStartPattern.test(value)) return { error: `unquoted scalar for ${key} starts with YAML-special character '${value[0]}'; quote it for strict YAML loaders` };
    }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      if (value.length < 2) return { error: `unterminated quoted scalar for ${key}` };
      value = value.slice(1, -1);
    } else if (value.startsWith('"') || value.startsWith("'")) {
      return { error: `unterminated quoted scalar for ${key}` };
    }
    data[key] = value;
  }
  return { data, bodyLines: lines.slice(end + 1) };
}

function stripCode(text) {
  return text.replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '');
}

function checkLinks(file, skillDir, skillName, text) {
  const visible = stripCode(text);
  const linkPattern = /\[[^\]\n]+\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of visible.matchAll(linkPattern)) {
    let target = match[1].trim();
    if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    target = decodeURIComponent(target.split('#')[0].split('?')[0]);
    if (!target) continue;
    const resolved = path.resolve(skillDir, target);
    const relToSkills = path.relative(skillsRoot, resolved);
    if (!relToSkills.startsWith('..') && !path.isAbsolute(relToSkills)) {
      const owner = relToSkills.split(path.sep)[0];
      if (owner !== skillName) fail(file, `cross-skill relative link to ${target}`);
    }
    if (!fs.existsSync(resolved)) fail(file, `broken relative link: ${match[1]}`);
  }
}

function checkScriptHelp(file) {
  const result = spawnSync(process.execPath, [file, '--help'], { encoding: 'utf8' });
  const output = `${result.stdout}\n${result.stderr}`;
  if (result.error || result.status !== 0 || !/usage|help/i.test(output)) {
    fail(file, `script does not exit successfully with a usage/help response for --help`);
  }
}

if (!fs.existsSync(skillsRoot)) {
  console.error('skills/ directory not found');
  process.exit(1);
}

const skillDirs = fs.readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name));

if (skillDirs.length === 0) errors.push('skills/: no skills found');

for (const entry of skillDirs) {
  const skillName = entry.name;
  const skillDir = path.join(skillsRoot, skillName);
  const file = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(file)) {
    fail(file, 'missing SKILL.md');
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontmatter(file, text);
  if (parsed.error) {
    fail(file, parsed.error);
    continue;
  }
  const { data, bodyLines } = parsed;
  if (!namePattern.test(skillName) || skillName.length > 64) fail(file, `folder name is not valid lowercase-hyphen <=64 chars: ${skillName}`);
  if (data.name !== skillName) fail(file, `frontmatter name (${data.name || 'missing'}) does not equal folder name (${skillName})`);
  if (!data.description || !data.description.trim()) fail(file, 'description is missing or empty');
  else if (data.description.length > 1024) fail(file, `description is ${data.description.length} characters; limit is 1024`);
  if (bodyLines.length > 500) fail(file, `body has ${bodyLines.length} lines; limit is 500`);
  checkLinks(file, skillDir, skillName, text);

  const evalFile = path.join(evalsRoot, `${skillName}.md`);
  if (!fs.existsSync(evalFile)) {
    fail(evalFile, `missing evaluation file for ${skillName}`);
  } else {
    const evalText = fs.readFileSync(evalFile, 'utf8');
    if (!/^##\s+Case\b/m.test(evalText)) fail(evalFile, 'missing at least one `## Case` evaluation prompt');
  }

  const scriptsDir = path.join(skillDir, 'scripts');
  if (fs.existsSync(scriptsDir)) {
    for (const script of fs.readdirSync(scriptsDir).filter((name) => name.endsWith('.mjs')).sort()) {
      checkScriptHelp(path.join(scriptsDir, script));
    }
  }
}

if (errors.length) {
  console.error(`Skill validation failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Skill validation passed: ${skillDirs.length} skill${skillDirs.length === 1 ? '' : 's'} checked.`);
