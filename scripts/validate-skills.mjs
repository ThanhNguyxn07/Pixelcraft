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

function quoteCanOpen(text, index) {
  if (index === 0) return true;
  let previous = index - 1;
  while (previous >= 0 && /\s/.test(text[previous])) previous--;
  return previous < 0 || '{[,:'.includes(text[previous]);
}

function stripYamlComment(raw) {
  let quote = null;
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (quote === '"') {
      if (char === '\\') i++;
      else if (char === '"') quote = null;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && raw[i + 1] === "'") i++;
      else if (char === "'") quote = null;
      continue;
    }
    if ((char === '"' || char === "'") && quoteCanOpen(raw, i)) {
      quote = char;
      continue;
    }
    if (char === '#' && (i === 0 || /\s/.test(raw[i - 1]))) return raw.slice(0, i).trimEnd();
  }
  return raw.trimEnd();
}

function indentationWidth(line) {
  return /^ */.exec(line)[0].length;
}

function parseBlockHeader(value) {
  const match = /^([|>])((?:[+-]?[1-9]?|[1-9]?[+-]?))$/.exec(value);
  if (!match) return /^[|>]/.test(value) ? { invalid: true } : null;
  const suffix = match[2];
  const explicitIndent = /[1-9]/.exec(suffix);
  return {
    style: match[1],
    chomp: suffix.includes('-') ? '-' : suffix.includes('+') ? '+' : '',
    indent: explicitIndent ? Number(explicitIndent[0]) : 0
  };
}

function foldBlockLines(lines) {
  let output = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    output += line;
    if (i === lines.length - 1) break;
    const next = lines[i + 1];
    const foldable = line && next && !/^\s/.test(line) && !/^\s/.test(next);
    if (foldable) output += ' ';
    else if (!(line === '' && next !== '' && i > 0)) output += '\n';
  }
  return output;
}

function applyChomp(body, lineCount, chomp) {
  if (!lineCount) return '';
  if (chomp === '-') return body.replace(/\n+$/g, '');
  if (chomp === '+') return `${body}\n`;
  return `${body.replace(/\n+$/g, '')}\n`;
}

function readBlockScalar(lines, start, end, header) {
  let indent = header.indent;
  if (!indent) {
    for (let probe = start + 1; probe < end; probe++) {
      if (!lines[probe].trim()) continue;
      indent = indentationWidth(lines[probe]) || 1;
      break;
    }
    if (!indent) indent = 1;
  }

  const content = [];
  let index = start + 1;
  for (; index < end; index++) {
    const line = lines[index];
    if (!line.trim()) {
      content.push('');
      continue;
    }
    if (indentationWidth(line) < indent) break;
    content.push(line.slice(indent));
  }
  const body = header.style === '|' ? content.join('\n') : foldBlockLines(content);
  return { value: applyChomp(body, content.length, header.chomp), nextIndex: index };
}

function isInlineFlow(value) {
  if (!value.startsWith('{') && !value.startsWith('[')) return false;
  const closers = { '{': '}', '[': ']' };
  const stack = [];
  let quote = null;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (quote === '"') {
      if (char === '\\') i++;
      else if (char === '"') quote = null;
      continue;
    }
    if (quote === "'") {
      if (char === "'" && value[i + 1] === "'") i++;
      else if (char === "'") quote = null;
      continue;
    }
    if ((char === '"' || char === "'") && quoteCanOpen(value, i)) {
      quote = char;
      continue;
    }
    if (closers[char]) {
      stack.push(closers[char]);
      continue;
    }
    if (char === '}' || char === ']') {
      if (stack.pop() !== char) return false;
      if (!stack.length && i !== value.length - 1) return false;
    }
  }
  return !quote && stack.length === 0;
}

function parseFrontmatter(file, text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { error: 'missing opening frontmatter delimiter' };
  const end = lines.findIndex((line, index) => index > 0 && line === '---');
  if (end === -1) return { error: 'missing closing frontmatter delimiter' };

  const data = {};
  const seen = new Set();
  for (let index = 1; index < end; index++) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (line.includes('\t')) return { error: 'frontmatter contains a tab character' };
    if (/^\s/.test(line)) continue; // nested metadata/list content; not needed for linted scalar fields
    const match = /^([A-Za-z0-9_-]+):(?:[ \t]*(.*))?$/.exec(line);
    if (!match) return { error: `unparseable frontmatter line: ${line}` };
    const [, key, raw = ''] = match;
    if (seen.has(key)) return { error: `duplicate frontmatter key: ${key}` };
    seen.add(key);
    let value = stripYamlComment(raw).trim();
    const block = parseBlockHeader(value);
    if (block?.invalid) return { error: `invalid block scalar header for ${key}` };
    if (block) {
      const scalar = readBlockScalar(lines, index, end, block);
      data[key] = scalar.value;
      index = scalar.nextIndex - 1;
      continue;
    }
    const startsQuoted = value.startsWith('"') || value.startsWith("'");
    const flow = isInlineFlow(value);
    if (value && !startsQuoted && !flow) {
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
