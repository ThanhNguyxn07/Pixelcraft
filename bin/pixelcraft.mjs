#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(repoRoot, 'skills');
const validAgents = ['claude', 'codex', 'cursor', 'gemini', 'copilot', 'agents', 'all'];

function skillNames() {
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
    .sort();
}

function targetsFor(agent, globalInstall) {
  const home = os.homedir();
  const project = {
    claude: ['.claude/skills'],
    codex: ['.agents/skills'],
    agents: ['.agents/skills'],
    cursor: ['.cursor/skills'],
    gemini: ['.gemini/skills'],
    copilot: ['.github/skills'],
  };
  const globalMap = {
    claude: [path.join(home, '.claude/skills')],
    codex: [path.join(home, '.agents/skills')],
    agents: [path.join(home, '.agents/skills')],
    cursor: [path.join(home, '.cursor/skills')],
    gemini: [path.join(home, '.gemini/skills')],
    copilot: [path.join(home, '.copilot/skills')],
  };
  const map = globalInstall ? globalMap : project;
  const selected = agent === 'all' ? Object.values(map).flat() : map[agent];
  return [...new Set(selected)].map((target) => path.resolve(process.cwd(), target));
}

function help() {
  return `Usage: pixelcraft <command> [options]

Commands:
  add <skill...|all> --agent <claude|codex|cursor|gemini|copilot|agents|all> [--global] [--dry-run] [--force]
      Copy self-contained skill folders into an agent skills directory.
  list
      List skills bundled in this package.
  help, --help
      Show this help.

Options:
  --agent NAME   Target host. Required for add.
  --global       Install in the user-level skills directory instead of the current project.
  --dry-run      Print destination copies without writing files.
  --force        Replace existing explicitly requested skill directories. Auto-added core skills install only when missing.

Symlink safety: installation refuses a symlinked target skills directory or skill
directory instead of replacing files outside the project.

Project locations: claude=.claude/skills; codex/agents=.agents/skills;
cursor=.cursor/skills; gemini=.gemini/skills; copilot=.github/skills.
Global locations: claude=~/.claude/skills; codex/agents=~/.agents/skills;
cursor=~/.cursor/skills; gemini=~/.gemini/skills; copilot=~/.copilot/skills.

Host behavior and global paths follow docs/RESEARCH.md section 1.4 as of the
research snapshot. They change quickly; verify current host documentation before
depending on them in automation.`;
}

function parse(args) {
  const positional = [];
  const options = { global: false, dryRun: false, force: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--global') options.global = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--agent') {
      index += 1;
      options.agent = args[index];
      if (!options.agent) throw new Error('--agent requires a value');
    } else if (arg.startsWith('--agent=')) options.agent = arg.slice('--agent='.length);
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else positional.push(arg);
  }
  return { positional, options };
}

function lstatIfExists(file) {
  try {
    return fs.lstatSync(file);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function assertNotSymlink(file, label) {
  if (lstatIfExists(file)?.isSymbolicLink()) throw new Error(`${label} is a symlink: ${file}; refusing to install through it`);
}

function copySkill(name, destinationRoot, dryRun, { force = false, auto = false } = {}) {
  const source = path.join(skillsRoot, name);
  const destination = path.join(destinationRoot, name);
  assertNotSymlink(source, 'source skill directory');
  assertNotSymlink(destinationRoot, 'target skills directory');
  const destinationStat = lstatIfExists(destination);
  const exists = destinationStat !== null;
  if (auto && exists) {
    const kind = destinationStat.isSymbolicLink() ? 'existing symlink' : 'existing install';
    console.log(`${dryRun ? 'dry-run: ' : ''}skipped auto-added ${kind}: ${name} -> ${destination}`);
    return;
  }
  if (destinationStat?.isSymbolicLink()) throw new Error(`installed skill directory is a symlink: ${destination}; refusing to install through it`);
  if (dryRun) {
    if (exists && !force) console.log(`dry-run: skipped existing ${name} -> ${destination} (use --force to replace)`);
    else console.log(`dry-run: ${name} -> ${destination}`);
    return;
  }
  fs.mkdirSync(destinationRoot, { recursive: true });
  assertNotSymlink(destinationRoot, 'target skills directory');
  if (exists && !force) {
    console.log(`skipped existing: ${name} -> ${destination} (use --force to replace)`);
    return;
  }
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(source, destination, { recursive: true });
  console.log(`installed: ${name} -> ${destination}`);
}

try {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h') || args[0] === 'help') {
    console.log(help());
    process.exit(0);
  }

  const [command, ...rest] = args;
  if (command === 'list') {
    for (const name of skillNames()) console.log(name);
    process.exit(0);
  }
  if (command !== 'add') throw new Error(`unknown command: ${command}; run pixelcraft --help`);

  const { positional, options } = parse(rest);
  if (!options.agent) throw new Error('add requires --agent');
  if (!validAgents.includes(options.agent)) throw new Error(`invalid agent '${options.agent}'; expected one of ${validAgents.join(', ')}`);
  if (positional.length === 0) throw new Error('add requires at least one skill name or all');

  const available = skillNames();
  const requested = positional.includes('all') ? available : positional;
  const unknown = requested.filter((name) => !available.includes(name));
  if (unknown.length) throw new Error(`unknown skill(s): ${unknown.join(', ')}; available: ${available.join(', ')}`);

  let selected = requested.map((name) => ({ name, auto: false }));
  if (!positional.includes('all')) {
    const required = ['pixelcraft', 'pixelcraft-plan'].filter((name) => available.includes(name));
    const injected = required.filter((name) => !requested.includes(name));
    if (injected.length) {
      selected = [...injected.map((name) => ({ name, auto: true })), ...selected];
      console.log(`note: including required core skill(s): ${injected.join(', ')}`);
    }
  }

  const targets = targetsFor(options.agent, options.global);
  for (const target of targets) {
    for (const entry of selected) {
      copySkill(entry.name, target, options.dryRun, { force: options.force && !entry.auto, auto: entry.auto });
    }
  }
} catch (error) {
  console.error(`pixelcraft: ${error.message}`);
  process.exit(1);
}
