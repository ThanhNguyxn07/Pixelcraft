#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(repoRoot, 'skills');
const canonicalAgents = ['claude', 'codex', 'agents', 'devin', 'cursor', 'gemini', 'copilot', 'windsurf', 'opencode'];
const validAgents = [...canonicalAgents, 'all'];
const agentAliases = {
  'claude-code': 'claude',
  'gemini-cli': 'gemini',
  'github-copilot': 'copilot',
  'open-code': 'opencode',
};

function skillNames() {
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
    .sort();
}

function canonicalAgent(name) {
  const normalized = name.trim().toLowerCase();
  return agentAliases[normalized] || normalized;
}

function expandAgents(input) {
  const values = (Array.isArray(input) ? input : [input])
    .flatMap((value) => String(value).split(/[\s,]+/))
    .filter(Boolean)
    .map(canonicalAgent);
  if (values.length === 0) throw new Error('add requires --agent');
  const unknown = values.filter((name) => !validAgents.includes(name));
  if (unknown.length) throw new Error(`invalid agent '${unknown.join(', ')}'; expected one of ${validAgents.join(', ')}`);
  if (values.includes('all')) return canonicalAgents;
  return [...new Set(values)];
}

function targetsFor(agentInput, globalInstall) {
  const home = os.homedir();
  const project = {
    claude: ['.claude/skills'],
    codex: ['.agents/skills'],
    agents: ['.agents/skills'],
    devin: ['.agents/skills'],
    cursor: ['.agents/skills'],
    gemini: ['.agents/skills'],
    copilot: ['.agents/skills'],
    windsurf: ['.windsurf/skills'],
    opencode: ['.opencode/skills'],
  };
  const globalMap = {
    claude: [path.join(home, '.claude/skills')],
    codex: [path.join(home, '.agents/skills')],
    agents: [path.join(home, '.agents/skills')],
    devin: [path.join(home, '.agents/skills')],
    cursor: [path.join(home, '.cursor/skills')],
    gemini: [path.join(home, '.gemini/skills')],
    copilot: [path.join(home, '.copilot/skills')],
    windsurf: [path.join(home, '.codeium/windsurf/skills')],
    opencode: [path.join(home, '.config/opencode/skills')],
  };
  const map = globalInstall ? globalMap : project;
  const agents = expandAgents(agentInput);
  const selected = agents.flatMap((agent) => map[agent]);
  return [...new Set(selected)].map((target) => path.resolve(process.cwd(), target));
}

function help() {
  return `Usage: pixelcraft [command] [options]

Run with no arguments to start the interactive install wizard.

Commands:
  add <skill...|all> --agent <name|all> [--global] [--dry-run] [--force]
      Copy self-contained skill folders into one or more agent skills directories.
      Repeat --agent or use comma-separated names for multiple targets.
  list
      List skills bundled in this package.
  help, --help
      Show this help.

Agents: claude, codex, agents, devin, cursor, gemini, copilot, windsurf, opencode, all.
Aliases: claude-code, gemini-cli, github-copilot, open-code.

Options:
  --agent NAME   Target host. Required for non-interactive add.
  --global       Install in the user-level skills directory instead of the current project.
  --dry-run      Print destination copies without writing files.
  --force        Replace existing explicitly requested skill directories. Auto-added core skills install only when missing.

Symlink safety: installation refuses a symlinked target skills directory or skill
directory instead of replacing files outside the project.

Project locations: claude=.claude/skills; codex/agents/devin/cursor/gemini/copilot=.agents/skills;
windsurf=.windsurf/skills; opencode=.opencode/skills. Cursor, Gemini, and Copilot also
read some compatibility locations; universal .agents/skills is the canonical target here.
Global locations: claude=~/.claude/skills; codex/agents/devin=~/.agents/skills;
cursor=~/.cursor/skills; gemini=~/.gemini/skills; copilot=~/.copilot/skills;
windsurf=~/.codeium/windsurf/skills; opencode=~/.config/opencode/skills.

Host behavior and global paths follow current public documentation where available.
They change quickly; verify current host documentation before depending on them in automation.`;
}

function parse(args) {
  const positional = [];
  const options = { global: false, dryRun: false, force: false, agents: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--global') options.global = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--agent') {
      index += 1;
      if (!args[index]) throw new Error('--agent requires a value');
      options.agents.push(args[index]);
    } else if (arg.startsWith('--agent=')) options.agents.push(arg.slice('--agent='.length));
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

function selectSkills(positional, available) {
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
  return selected;
}

function runAdd({ positional, options }) {
  if (positional.length === 0) throw new Error('add requires at least one skill name or all');
  const available = skillNames();
  const selected = selectSkills(positional, available);
  const targets = targetsFor(options.agents, options.global);
  for (const target of targets) {
    for (const entry of selected) {
      copySkill(entry.name, target, options.dryRun, { force: options.force && !entry.auto, auto: entry.auto });
    }
  }
}

function numberedSelection(answer, names) {
  const tokens = answer.split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) throw new Error('empty selection');
  return [...new Set(tokens.map((token) => {
    if (/^\d+$/.test(token)) {
      const index = Number(token) - 1;
      if (!names[index]) throw new Error(`selection ${token} is outside the numbered list`);
      return names[index];
    }
    return token.toLowerCase();
  }))];
}

function createPrompter() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const eof = Symbol('eof');
  const lines = [];
  const waiters = [];
  rl.on('line', (line) => {
    if (waiters.length) waiters.shift()(line);
    else lines.push(line);
  });
  rl.on('close', () => {
    while (waiters.length) waiters.shift()(eof);
  });
  return {
    async question(text) {
      process.stdout.write(text);
      if (lines.length) return lines.shift();
      const answer = await new Promise((resolve) => waiters.push(resolve));
      if (answer === eof) throw new Error('input ended before the wizard completed');
      return answer;
    },
    close() {
      rl.close();
    },
  };
}

async function wizard() {
  const available = skillNames();
  const prompter = createPrompter();
  try {
    console.log('Pixelcraft interactive installer\n');
    console.log('Agents:');
    canonicalAgents.forEach((name, index) => console.log(`  ${index + 1}) ${name}`));
    console.log(`  ${canonicalAgents.length + 1}) all`);
    const ask = async (question, fallback) => {
      const answer = (await prompter.question(question)).trim();
      return answer || fallback;
    };

    const agentAnswer = await ask(`Choose agent(s) by number/name, comma-separated [1]: `, '1');
    const agents = numberedSelection(agentAnswer, [...canonicalAgents, 'all']);

    const allAnswer = (await ask('Install all skills? [Y/n]: ', 'y')).toLowerCase();
    let positional = ['all'];
    if (allAnswer.startsWith('n')) {
      console.log('Skills:');
      available.forEach((name, index) => console.log(`  ${index + 1}) ${name}`));
      const skillAnswer = await ask('Choose skills by number/name, comma-separated [1]: ', '1');
      positional = numberedSelection(skillAnswer, available);
    }

    const scope = (await ask('Scope: project or global? [project]: ', 'project')).toLowerCase();
    if (scope !== 'project' && scope !== 'global') throw new Error(`scope must be project or global, got '${scope}'`);
    console.log(`\nReady to install ${positional.join(', ')} for ${agents.join(', ')} in ${scope} scope.`);
    const confirm = (await ask('Continue? [Y/n]: ', 'y')).toLowerCase();
    if (confirm.startsWith('n')) throw new Error('installation cancelled');

    return {
      positional,
      options: { global: scope === 'global', dryRun: false, force: false, agents },
    };
  } finally {
    prompter.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h') || args[0] === 'help') {
    console.log(help());
    return;
  }
  if (args.length === 0) {
    runAdd(await wizard());
    return;
  }

  const [command, ...rest] = args;
  if (command === 'list') {
    for (const name of skillNames()) console.log(name);
    return;
  }
  if (command !== 'add') throw new Error(`unknown command: ${command}; run pixelcraft --help`);

  const { positional, options } = parse(rest);
  if (options.agents.length === 0) throw new Error('add requires --agent');
  runAdd({ positional, options });
}

main().catch((error) => {
  console.error(`pixelcraft: ${error.message}`);
  process.exit(1);
});
