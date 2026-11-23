# Distribution

Pixelcraft has one source of truth: [`skills/`](../skills/). Every installer, adapter, plugin, archive, and manual copy derives from those self-contained `SKILL.md` directories. Generated output is never edited by hand.

This document compares comparable public skill packs, records the verified agent locations Pixelcraft uses, and defines what the release archives contain. Agent products change their extension surfaces often; only the documented paths listed here are installer targets.

## Competitor comparison

| Project | Distribution mechanisms | Agent reach | Per-agent/generated output | Runtime and source model |
|---|---|---|---|---|
| [Impeccable](https://github.com/PBakaus/impeccable) ([docs](https://impeccable.style/docs)) | `npx impeccable install`; Claude Code plugin marketplace; direct repository/submodule copies; npm CLI shim; browser extension | README claims Claude Code, Cursor, Codex CLI, GitHub Copilot, Devin, Replit Agent, Gemini CLI, Grok Build, OpenCode, Antigravity, Kiro, Trae, Rovo Dev, Qoder, Mistral Vibe, Pi, Hermes Agent, DeepSeek Harness, and Veto | A build transforms one source skill into many provider harnesses. Root harness folders such as `.agents/skills`, `.claude/skills`, `.cursor/skills`, `.devin/skills`, `.gemini/skills`, `.github/skills`, `.kiro/skills`, and `.opencode/skills` are generated but tracked so direct GitHub installs work; `dist/` itself is ignored | `skill/` is the source of truth, but the product also carries a Rust engine/binary, launcher scripts, hooks, detector, and extension machinery |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/) | `npm install -g ui-ux-pro-max-cli` then `uipro init --ai <agent>`; Claude marketplace; `.agents` plugin marketplace metadata; manual copy | CLI help/README list Claude Code, Cursor, Windsurf, Antigravity, Copilot, Kiro, Codex, Qoder, Roo Code, Gemini CLI, Trae, OpenCode, Continue, CodeBuddy, Droid, KiloCode, Warp, Augment, CodeWhale, ZCode, Kimi, Amazon Q, OpenClaw, AutoClaw, and universal `.agents` | Templates generate platform-specific reference folders at install time. Canonical CSV/scripts live in `src/ui-ux-pro-max/`; mirrors are copied into `cli/assets/` and `.claude/skills/` by a sync script | The search runtime is Python standard library. Distribution breadth depends on the Node CLI and committed/synced copies |
| [Anthropic `frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | The [`anthropics/skills`](https://github.com/anthropics/skills) repository is added as a Claude Code plugin marketplace; examples are also available in Claude.ai/API contexts | Claude-first. No broad per-agent adapter matrix is published for this skill | No generated multi-agent output; the skill is a single self-contained folder | Very small and dependency-free, but intentionally limited to the Claude skills ecosystem |
| **Pixelcraft** | `npx pixelcraft` wizard/direct CLI; `install.sh`; `install.ps1`; Claude plugin marketplace; external `npx skills add`; manual clone/copy; tagged release archives | Installer targets Claude Code, Codex/`.agents`, Devin, Cursor, Gemini CLI, GitHub Copilot, Windsurf, OpenCode, and Kiro. Unsupported agents can still consume the universal `.agents` layout where their own documentation says they do so | [`scripts/build-adapters.mjs`](../scripts/build-adapters.mjs) generates `dist/<agent>/` project-root fragments: native skill folders where supported plus small router/rule/workflow/command files. `dist/` is not committed; the release workflow rebuilds and packages it | Zero npm dependencies. `skills/` alone is authoritative; adapters point to full skills rather than inlining them |

### Why `dist/` is not committed

`dist/` is in [`.gitignore`](../.gitignore). Committing it would copy every Pixelcraft skill into seven native skill fragments plus the Windsurf and Kiro payload fragments—currently 171 skill copies for 19 canonical skills. That churn would make ordinary skill edits noisy and easy to merge incorrectly.

Impeccable tracks generated provider harnesses because direct repository/submodule installation is a primary install path. Pixelcraft does not need that tradeoff: direct repository consumers can copy canonical `skills/`, plugin users read the same directories through `marketplace.json`, the installers generate/copy what they need, and release consumers receive `dist/` inside the archive. The release workflow therefore treats adapters as reproducible build artifacts rather than a second source of truth.

## Agent support matrix

“Native skill path” means the agent itself can discover a folder containing `SKILL.md` there. “Adapter-only” means Pixelcraft uses the agent's documented rule/workflow/steering surface as a router and installs the full skills in an adjacent Pixelcraft-owned payload directory; it does **not** claim that the agent natively supports Agent Skills.

| Agent | Project-level native/verified path | User-level path | Native format | Pixelcraft adapter surface | Sources |
|---|---|---|---|---|---|
| Claude Code | `.claude/skills/<skill>/SKILL.md` | `~/.claude/skills/<skill>/SKILL.md` | Agent Skills `SKILL.md`; slash commands are Markdown files in `.claude/commands/` | `.claude/skills/` plus `/pixelcraft`, `/pixelcraft-plan`, `/pixelcraft-review`, `/pixelcraft-visual-qa` command files | [Claude skills](https://code.claude.com/docs/en/skills/), [Claude directory/plugins](https://code.claude.com/docs/en/claude-directory) |
| Codex | `.agents/skills/<skill>/SKILL.md` | `~/.agents/skills/<skill>/SKILL.md` | Agent Skills `SKILL.md` | Native skill copy only | [ChatGPT/Codex customization](https://learn.chatgpt.com/docs/customization/overview) |
| Generic `.agents` clients | `.agents/skills/<skill>/SKILL.md` | `~/.agents/skills/<skill>/SKILL.md` | Agent Skills `SKILL.md` | Native skill copy only | [Agent Skills standard](https://agentskills.io) |
| Devin | `.agents/skills/<skill>/SKILL.md` | `~/.agents/skills/<skill>/SKILL.md`; Devin CLI deployments may use `~/.config/devin/skills/` | Agent Skills `SKILL.md` | Native skill copy only | [Devin skills](https://docs.devin.ai/product-guides/skills), [Devin CLI skills](https://docs.devin.ai/cli/extensibility/skills/overview) |
| Cursor | `.cursor/skills/<skill>/SKILL.md` | `~/.cursor/skills/<skill>/SKILL.md` | Agent Skills `SKILL.md`; rules are `.mdc` YAML/Markdown | `.cursor/skills/` plus `.cursor/rules/pixelcraft.mdc` router | [Cursor skills](https://cursor.com/docs/skills), [Cursor rules](https://cursor.com/docs/rules) |
| Gemini CLI | `.gemini/skills/<skill>/SKILL.md` | `~/.gemini/skills/<skill>/SKILL.md` | Agent Skills `SKILL.md`; custom commands use TOML and are not required for routing | `.gemini/skills/` native copy | [Gemini CLI skills](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md), [custom commands](https://google-gemini.github.io/gemini-cli/docs/cli/custom-commands.html) |
| GitHub Copilot | `.github/skills/<skill>/SKILL.md` | `~/.copilot/skills/<skill>/SKILL.md`; Copilot also documents `.agents` compatibility locations | Agent Skills `SKILL.md`; repository instructions, path instructions, and prompt files are Markdown with YAML frontmatter | `.github/skills/`, `.github/copilot-instructions.md`, `.github/instructions/pixelcraft.instructions.md`, and `.github/prompts/*.prompt.md` | [Copilot custom instructions](https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions), [prompt files](https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-files), [Copilot agent skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills) |
| OpenCode | `.opencode/skills/<skill>/SKILL.md` | `~/.config/opencode/skills/<skill>/SKILL.md` | Agent Skills `SKILL.md` | Native skill copy only | [OpenCode skills](https://opencode.ai/docs/skills/) |
| Windsurf | No verified native project skills directory is claimed by this repository | No verified native user skills directory is claimed by this repository | Rules in `.windsurf/rules/`; workflows in `.windsurf/workflows/` | Adapter-only: `.windsurf/pixelcraft/skills/` payload, `.windsurf/rules/pixelcraft.md` router, and four workflow files | [Windsurf rules/memories](https://docs.devin.ai/windsurf/plugins/cascade/memories), [Windsurf workflows](https://docs.devin.ai/windsurf/plugins/cascade/workflows) |
| Kiro | No verified native project skills directory is claimed by this repository | No verified native user skills directory is claimed by this repository | Steering Markdown in `.kiro/steering/` | Adapter-only: `.kiro/pixelcraft/skills/` payload plus `.kiro/steering/pixelcraft.md` router | [Kiro steering](https://kiro.dev/docs/steering/) |

### Installer target names

The bundled installers expose these names: `claude`, `codex`, `agents`, `devin`, `cursor`, `gemini`, `copilot`, `windsurf`, `opencode`, `kiro`, and `all`. Accepted aliases are `claude-code`, `gemini-cli`, `github-copilot`, and `open-code`. `--agent all` deduplicates the shared `.agents/skills` destination used by Codex, generic agents, and Devin.

Agents such as Roo Code, Cline, Continue, Qoder, Trae, Antigravity, Amp, Pi, Zed, JetBrains Junie, and Augment are deliberately **not** first-class installer targets until their current skill/rules paths are verified against primary documentation. Where one of those agents implements the portable `.agents/skills` standard, use `--agent agents` or the external Vercel `skills` CLI rather than an unverified hard-coded target.

## Generated adapter outputs

Run:

```bash
node scripts/build-adapters.mjs
# or
npm run build:adapters
```

The script uses only Node built-ins. It clears only the selected output directory (default `dist/`) and writes:

```text
dist/
├── manifest.json
├── README.md
├── claude/
│   └── .claude/
│       ├── skills/<19 canonical skills>/
│       └── commands/
│           ├── pixelcraft.md
│           ├── pixelcraft-plan.md
│           ├── pixelcraft-review.md
│           └── pixelcraft-visual-qa.md
├── codex/.agents/skills/<19 canonical skills>/
├── devin/.agents/skills/<19 canonical skills>/
├── cursor/
│   └── .cursor/
│       ├── skills/<19 canonical skills>/
│       └── rules/pixelcraft.mdc
├── gemini/.gemini/skills/<19 canonical skills>/
├── copilot/
│   └── .github/
│       ├── skills/<19 canonical skills>/
│       ├── copilot-instructions.md
│       ├── instructions/pixelcraft.instructions.md
│       └── prompts/
│           ├── pixelcraft-plan.prompt.md
│           ├── pixelcraft-review.prompt.md
│           ├── pixelcraft-visual-qa.prompt.md
│           └── pixelcraft-direction.prompt.md
├── opencode/.opencode/skills/<19 canonical skills>/
├── windsurf/
│   └── .windsurf/
│       ├── pixelcraft/skills/<19 canonical skills>/
│       ├── rules/pixelcraft.md
│       └── workflows/{pixelcraft-plan,pixelcraft-review,pixelcraft-visual-qa,pixelcraft-direction}.md
└── kiro/
    └── .kiro/
        ├── pixelcraft/skills/<19 canonical skills>/
        └── steering/pixelcraft.md
```

Each `dist/<agent>/` directory is a project-root fragment: copy its hidden dot-directories into the target project. Router files are intentionally small and link/point to the full skills. They do not inline the large skill bodies, because duplication would go stale and consume context even when the active task does not need the skill.

## Release archive contents

Pushing a `v*` tag runs [`.github/workflows/release.yml`](../.github/workflows/release.yml). The workflow validates the canonical skills, builds adapters, packages both formats, creates the GitHub Release, and attaches:

- `pixelcraft-skills.zip`
- `pixelcraft-skills.tar.gz`

Both archives have the same top-level layout:

```text
skills/
├── pixelcraft/
├── pixelcraft-plan/
├── pixelcraft-direction/
├── pixelcraft-craft/
├── pixelcraft-tokens/
├── pixelcraft-ux/
├── pixelcraft-patterns/
├── pixelcraft-accessibility/
├── pixelcraft-review/
├── pixelcraft-visual-qa/
├── pixelcraft-extensions/
├── pixelcraft-web/
├── pixelcraft-mobile/
├── pixelcraft-data-apps/
├── pixelcraft-desktop/
├── pixelcraft-tui/
├── pixelcraft-email/
├── pixelcraft-game-ui/
└── pixelcraft-brandkit/
adapters/
├── manifest.json
├── README.md
├── claude/
├── codex/
├── copilot/
├── cursor/
├── devin/
├── gemini/
├── kiro/
├── opencode/
└── windsurf/
```

The exact compressed sizes are release artifacts, not part of the contract. A local rehearsal of the current tree produced a zip of about 2.4 MB and a tar.gz of about 1.5 MB.

## Safety and update behavior

All three bundled installers share the same policy:

1. no sudo or elevation;
2. project scope by default, user scope only when requested;
3. refuse symlinked/reparse-point target directories and path components;
4. skip an existing skill directory unless `--force`/`-Force` is passed;
5. `--force` applies only to explicitly requested skills;
6. auto-included `pixelcraft` and `pixelcraft-plan` install only when missing;
7. adapter files follow the same overwrite policy as skills;
8. dry runs print intended copies/adapters without writing.

The Node installer is the fullest interface because it can run the interactive wizard when stdin is a TTY. The shell and PowerShell installers are dependency-light equivalents for documented targets; they deliberately do not implement every edge of the Node CLI.

## Verification commands

```bash
node scripts/build-adapters.mjs
node scripts/validate-skills.mjs
node bin/pixelcraft.mjs add pixelcraft-web --agent claude --dry-run
node bin/pixelcraft.mjs add pixelcraft-web --agent windsurf --dry-run
bash -n install.sh
```

`install.ps1` is statically inspected in CI only when a PowerShell runtime is available; do not claim parser validation on machines without `pwsh`.
