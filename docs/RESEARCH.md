# Pixelcraft research report

Research snapshot: 2026-11-23. Scope: Agent Skills packaging, competing UI/UX skills, evidence on homogeneous AI-generated UI, UX/accessibility evidence, distinctive visual craft, and a recommended architecture for Pixelcraft.

Citation notation: bracketed IDs such as `[S01]` refer to the numbered source registry at the end. URLs are primary wherever practical. Fast-moving product documentation was captured on the snapshot date and should be rechecked before release.

## 0. Executive synthesis

1. Agent Skills are a thin executable filesystem contract, not a prompt blob: one required `SKILL.md`, plus optional `scripts/`, `references/`, and `assets/`; keep the entry concise and delegate depth progressively. `[S01]`
2. The only universally required frontmatter fields are `name` and `description`; every other field is optional, experimental, or product-specific, so Pixelcraft should treat extras as non-portable unless namespaced under `metadata`. `[S01]`
3. Skill discovery is a ranking problem: write the description in third person, state what the skill does and when to invoke it, and include concrete trigger words across UI types and stacks. `[S03]`
4. Keep the main body under 500 lines and preferably under 5k tokens; use one-level references rather than deeply chained documents. `[S01]` `[S03]`
5. Cross-agent support is converging on `.agents/skills/` for project skills, but Claude Code, Gemini, Copilot, Devin, and Cursor differ in canonical/global paths; publish once in a repository layout that both Vercel's CLI and `gh skill install` discover. `[S08]` `[S10]` `[S12]`
6. Claude plugin packaging is additive distribution metadata: `.claude-plugin/marketplace.json` lists plugin entries and their skill paths; it does not replace `SKILL.md`. `[S04]` `[S05]`
7. The competitive field proves that agents can produce less generic UI when forced to choose among far-apart directions, commit to real material, and verify rendered output; it does not yet solve cross-stack UX. `[S15]` `[S16]` `[S19]` `[S20]`
8. Existing leaders are web-centric even when they claim cross-platform scope. Native mobile coverage exists in Impeccable and UI UX Pro Max, but Python UI, Qt/Tauri, TUI, email, game UI, server-rendered frameworks, and localization are mostly absent. `[S16]` `[S18]`
9. The strongest competitor pattern is not “more rules”; it is a closed loop: interpret the brief, generate divergent candidates, commit, build, inspect rendered truth, repair, and report unresolved checks. `[S15]` `[S19]` `[S20]`
10. Randomness alone is not enough. Taste-skill and Hallmark use dealt catalogs plus history/rotation to avoid repeating the same layout/material across builds; Pixelcraft should generalize this beyond websites. `[S19]` `[S20]`
11. Mode collapse has two distinct meanings in the literature: inference-time output homogenization after alignment/decoding, and recursive training-data collapse. Pixelcraft mainly fights the former; do not conflate them. `[S26]` `[S27]` `[S32]`
12. Evidence across LLM ideation studies is consistent: models often raise average fluency or perceived quality while reducing group-level diversity. Single-shot “best design” prompting is therefore structurally slop-prone. `[S28]` `[S29]` `[S30]`
13. Verbalized sampling is directly actionable: ask for a small probability distribution over meaningfully different design directions, sample or deliberately choose among them, and only then elaborate. `[S28]`
14. UI benchmarks show that screenshot similarity, implementation correctness, visual quality, interactivity, and human preference are separate axes; copying pixels is not UX quality. `[S35]` `[S37]` `[S39]`
15. LLM-as-UX-evaluator is useful for triage but unreliable as an oracle: reported overlap with expert heuristic evaluation is low and false positives/duplicates are common. Pair it with deterministic checks and human spot review. `[S43]` `[S44]`
16. Generated-code accessibility failures are common, but follow-up prompting can repair many simple issues; prevention through semantic defaults and automated checks is better than post-hoc apologies. `[S45]` `[S46]`
17. WCAG 2.2 is the conformance floor, not the design aspiration: target size, focus visibility, dragging alternatives, redundant entry, accessible authentication, contrast, reflow, and error identification must be encoded as mechanical checks. `[S57]` `[S58]` `[S59]`
18. Platform minima differ by unit and context: 24×24 CSS px is the WCAG 2.2 AA web floor, 44×44 pt is Apple's touch baseline, and 48×48 dp is Material's Android baseline. Never substitute one number across platforms. `[S59]` `[S62]` `[S63]`
19. UX quality is mostly state coverage: loading, empty, error, offline, permission, success, disabled, keyboard/focus, localization expansion, long content, zero/many items, and interruption recovery. `[S47]` `[S51]` `[S53]`
20. Distinctiveness and usability are not enemies. Operate surfaces should favor earned familiarity and restraint; persuasion/experience surfaces can carry stronger authorship. Mode-aware ambition is a key Pixelcraft primitive. `[S16]`
21. A hard floor must never dictate appearance: contrast, focus, motion safety, responsiveness, truthfulness, state coverage, and localization resilience are mandatory; heroes, cards, palettes, typefaces, and layout shapes are not. `[S20]` `[S22]`
22. Anti-slop linting can detect absence of known tells but cannot prove good design; sloplint explicitly warns that a zero score can still be bad design. `[S21]`
23. Design movements should be encoded as operational constraints (grid, material, color, type, texture, motion, imagery, taboos), not mood-board labels or copied costumes. `[S79]` `[S80]`
24. Type pairing should start from content voice and script coverage: one family is often enough, superfamilies reduce risk, decorative faces belong to display only, and international fallback/metrics are part of the choice. `[S68]` `[S69]` `[S70]` `[S71]`
25. OKLCH/OKLab are useful authoring spaces for perceptual ramps, but gamut clipping and contrast still require validation; APCA is a candidate future method, not a current WCAG conformance standard. `[S76]` `[S77]` `[S78]`
26. DTCG 2025.10 is the right interchange target for Pixelcraft tokens, but it is a stable Community Group report rather than a W3C Standard; implement versioned adapters and verify the spec directly before adding new syntax such as `$ref`. `[S72]` `[S74]`
27. Style Dictionary is a practical multi-platform token compiler because it deep-merges token files, resolves references, and emits platform-specific outputs; treat version/config migration as a compatibility concern. `[S75]`
28. Pixelcraft should be a pack of focused skills plus shared references, not one monolithic mega-skill: visual direction, UX evidence, accessibility, platform adapters, token export, and validation have different triggers and context costs. `[S01]` `[S03]`
29. The portable core must be stack-agnostic and language-aware; framework modules should translate invariants into React/SwiftUI/Flutter/Streamlit/Qt/Textual/email/game idioms rather than forcing web DOM concepts everywhere.
30. The central product thesis is measurable: ship a generation loop that increases divergence between first-pass drafts while preserving a strict usability/accessibility floor.

## 1. Agent Skills specification and ecosystem packaging

### 1.1 Canonical filesystem contract

- A skill is a directory containing at minimum `SKILL.md`; optional conventional siblings are `scripts/`, `references/`, and `assets/`, but additional files/directories are allowed. `[S01]`
- `SKILL.md` is YAML frontmatter followed by unrestricted Markdown instructions. `[S01]`
- Required `name`: 1–64 chars, lowercase alphanumeric plus hyphen, no leading/trailing/consecutive hyphen, and it must match the parent directory name. `[S01]`
- Anthropic's authoring docs additionally forbid XML tags and reserved words `anthropic`/`claude` in names; treat this as a Claude-specific validation constraint. `[S03]`
- Required `description`: non-empty, max 1,024 chars, states what the skill does and when to use it, and contains keywords the agent can match. `[S01]` `[S03]`
- Optional `license`: short license name or bundled-license reference. `[S01]`
- Optional `compatibility`: 1–500 chars, only for real environment requirements such as product, OS packages, network access, Python/Node versions, or hardware. `[S01]`
- Optional `metadata`: string-keyed map for additional properties; use unique keys because implementers may reserve their own. `[S01]`
- Optional `allowed-tools`: space-separated pre-approved tools; explicitly experimental and unevenly supported. `[S01]` `[S12]`
- Body content has no format restriction, but the whole file is loaded when the skill activates, so every line competes with task context. `[S01]` `[S03]`
- Recommended body sections include step-by-step instructions, input/output examples, edge cases, escalation conditions, and verification. `[S01]`
- `scripts/` should be self-contained or document dependencies, emit useful errors, and handle edge cases; supported languages depend on the host. `[S01]`
- `references/` should hold focused on-demand documentation; smaller files reduce context cost. `[S01]`
- `assets/` should hold templates, examples, schemas, lookup data, images, or other static resources. `[S01]`

### 1.2 Progressive disclosure as an architecture constraint

- Level 1 metadata is always loaded: about 100 tokens per installed skill, consisting of name and description. `[S02]`
- Level 2 instructions load only after triggering: the full `SKILL.md` body; Anthropic recommends keeping it under 5k tokens and under 500 lines. `[S02]` `[S03]`
- Level 3 resources load only when referenced: files are read into context when needed; scripts execute and only output enters context. `[S02]`
- Keep file references one level deep from `SKILL.md`; avoid reference chains that force the agent to traverse a documentation maze. `[S01]`
- Use domain-specific reference partitioning so one task never loads irrelevant platform or style material. `[S03]`
- Match degrees of freedom to fragility: high-level heuristics for judgment calls, parameterized pseudocode for preferred patterns, exact scripts for fragile deterministic operations. `[S03]`
- Assume the model is already smart; include only information it does not reliably know or behavior it does not reliably perform. `[S03]`
- Test the same skill with every target model class because concise guidance that works for a strong model may underspecify a fast/small model. `[S03]`
- Write descriptions in third person because they are injected into system context; inconsistent point of view can impair discovery. `[S03]`
- Prefer gerund or action-oriented names (`designing-interfaces`, `auditing-accessibility`) and avoid vague names (`helper`, `utils`) or reserved-product names. `[S03]`
- For Pixelcraft, each skill should expose a routing table of references with explicit “read when” triggers, as seen in the strongest competitors. `[S20]` `[S22]`
- Do not make the orchestrator read all platform modules: detect stack/project surface first, then load only the relevant adapter. `[S01]`
- Prefer scripts for measurement and validation; prefer prose for judgment, tradeoffs, and user-facing decisions. `[S02]` `[S03]`
- A skill bundle has no practical context penalty for unused resources, so comprehensive datasets are acceptable if discovery and routing are precise. `[S02]`

### 1.3 Claude plugin and marketplace packaging

- Claude Code plugin marketplaces are defined by `.claude-plugin/marketplace.json`; the containing directory is the marketplace root and relative plugin sources resolve from that root. `[S04]`
- Marketplace top-level required keys are `name`, `owner`, and `plugins`; optional keys include `$schema`, `description`, `version`, `metadata.description`, `metadata.version`, `metadata.pluginRoot`, dependency/rename/policy fields. `[S04]`
- Marketplace names allow letters, digits, `.`, `_`, `-`, must start alphanumeric, cannot contain `..`, and are subject to extensive reserved/impersonation checks. `[S04]`
- Unknown marketplace keys are ignored at load time but reported by validation; typo tolerance means validation must run in CI. `[S04]`
- Each plugin entry requires `name` and `source`; useful listing metadata includes `description`, `version`, `category`, `tags`, `strict`, `relevance`, and `dependencies`. `[S04]`
- A plugin entry can point at a relative directory, GitHub/git source, or other supported source object; Anthropic's own repository uses multiple plugin entries whose `source` is `./` and whose `skills` arrays enumerate `./skills/<name>`. `[S04]` `[S15]`
- `.claude-plugin/plugin.json` is optional inside a plugin; without it Claude Code loads standard-layout components and infers the name from marketplace entry or directory. `[S05]`
- `plugin.json` requires only `name`; optional fields include `displayName`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, `metadata`, component paths, MCP/LSP configuration, and `userConfig`. `[S05]`
- Plugin files live at the plugin root, not inside `.claude-plugin/`; only the manifest belongs there. `[S05]`
- `strict: true` means `plugin.json` is definitive for components; `strict: false` permits marketplace entries to enumerate skills directly, as in Anthropic's example marketplace. `[S04]` `[S05]`
- Validate with `claude plugin validate <path>`; use strict mode in CI because warnings include missing metadata and unknown keys. `[S05]`
- Do not rely on marketplace packaging for cross-agent reach: it is Claude-specific even when the underlying skills remain portable. `[S04]`

### 1.4 Host-specific loading and invocation

- Cursor auto-discovers project `.agents/skills/` and `.cursor/skills/`, user `~/.agents/skills/` and `~/.cursor/skills/`, plus compatibility `.claude/skills/` and `.codex/skills/` locations. `[S06]`
- Cursor recursively finds nested skill folders anywhere in a repo and scopes nested project skills to their subtree; category folders are organizational only. `[S06]`
- Cursor supports manual slash invocation, automatic invocation, custom modes, and nonstandard fields `paths`, `disable-model-invocation`, `icon`, and `color`; these are not portable spec fields. `[S06]`
- Cursor `paths` accepts glob list or comma-separated string and replaces legacy `globs`; omit it for general skills. `[S06]`
- Gemini CLI discovers built-in, extension, user, and workspace skills in ascending precedence; user/workspace aliases include both `.gemini/skills/` and `.agents/skills/`. `[S07]`
- Gemini activation can require user approval; `/skills` inspects loaded skills, and extensions or git installs can distribute them. `[S07]`
- OpenAI's current plugin guidance frames skills as workflow complements to MCP servers: MCP supplies live data/authentication/actions; the skill supplies tool sequence, decisions, outputs, templates, and constraints. `[S13]`
- OpenAI plugin skills can declare MCP dependencies in `agents/openai.yaml`; a skill may also be standalone when packaged instructions/resources suffice. `[S13]`
- OpenAI recommends focused skills mapped to recognizable user goals and explicit tests for direct, indirect, incomplete, negative, and edge-case activation. `[S13]`
- Codex historically used experimental enablement (`[features] skills = true` or `codex --enable skills`), but current cross-agent installers target the standard `.agents/skills/` layout; treat exact host behavior as version-sensitive. `[S12]` `[S13]`
- Current ChatGPT/Codex guidance treats skills as the authoring format and plugins as the distribution unit; standalone skills are available in the ChatGPT desktop app, Codex CLI, and IDE extension, while bundled plugin skills reach broader ChatGPT surfaces. `[S90]`
- Codex's initial discovery list includes each skill's file path, defaults to at most 2% of the context window (or 8,000 characters when unknown), shortens descriptions under pressure, may omit overflow skills with a warning, and exposes `skills.max_context_tokens` with a documented 10,000-token cap. `[S90]`
- GitHub Copilot supports project skills in `.github/skills`, `.claude/skills`, or `.agents/skills`, and personal skills in `~/.copilot/skills` or `~/.agents/skills`; surface support varies, and cloud sandbox personalization can use `.copilot/skills` in a dotfiles repository except in GitHub Actions-based sessions. `[S14]`
- Vercel's CLI maps Codex, Cline, Cursor project, Gemini project, Copilot project, and many others to `.agents/skills/` because those hosts read the shared location natively or as an alias. `[S12]`
- Global paths diverge: Claude `~/.claude/skills`, Gemini `~/.gemini/skills`, Copilot `~/.copilot/skills`, Cursor `~/.cursor/skills`, Devin `~/.config/devin/skills`, while many agents share `~/.agents/skills`. `[S12]`
- GitHub CLI's installer supports dozens of agents, defaults non-interactively to GitHub Copilot/project scope, and shares `.agents/skills` at project scope for supported agents. `[S08]`
- `gh skill install` discovers `skills/*/SKILL.md`, including nested prefixes; exact paths in arguments avoid expensive full-tree traversal in large repositories. `[S08]`
- `gh skill install` resolves versions by latest tagged release then default-branch HEAD; users can pin `<skill>@<version>` or `--pin <git-ref>`. `[S08]`
- Feature support is not uniform: Vercel's compatibility table shows basic skills broadly supported, `allowed-tools` widely but not universally supported, and hooks/`context: fork` mostly Claude-specific. `[S12]`
- Therefore portable Pixelcraft skills should not require hooks, fork context, or pre-approved tool syntax for correctness; expose them as optional host integrations. `[S12]`

### 1.5 `npx skills` conventions and repository layout

- `npx skills add` accepts GitHub shorthand, full GitHub/GitLab/Azure/git URLs, direct tree URLs, local paths, direct `SKILL.md`/archive downloads, and refs via `owner/repo@ref`. `[S10]`
- Project installation is default; `-g/--global` installs user-wide; `--copy` copies instead of symlinks; `--agent` and `--skill` select targets. `[S10]`
- Symlink installation is recommended because one canonical copy updates cleanly, but copy mode is needed where symlinks are unsupported or Windows behavior is unreliable. `[S10]`
- Direct downloads are size/file-count limited by default and omit credential-bearing query strings from lock files; do not publish skills through signed ephemeral URLs. `[S10]`
- `--rename` rewrites folder, lock key, and the installed frontmatter name; renamed copies have different hashes, so upstream comparison must use the recorded original name. `[S10]`
- The CLI discovers root `SKILL.md`, `skills/`, curated/experimental/system subfolders, and dozens of agent-specific skill containers, walking catalog containers up to three levels deep. `[S11]`
- `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json` declarations are also discovered, enabling Claude-plugin repositories to work with the generic CLI. `[S11]`
- Custom discovery containers can be declared in root `skills.sh.json` using `./`-prefixed paths; duplicate skill names resolve to the first found. `[S11]`
- `npx skills experimental_sync` reads npm dependency `skills` arrays and links packaged skills into `.agents/skills/` plus selected agents; this is explicitly experimental. `[S10]`
- `skills-lock.json` content hashes cover installed files after text normalization and path sorting; commit locks for reproducible project installs. `[S09]`
- Recommended Pixelcraft repository shape: canonical folders under `skills/<skill-name>/SKILL.md`, optional category nesting no deeper than two levels, plus root `.claude-plugin/marketplace.json` for Claude users. `[S08]` `[S11]`
- Do not put canonical content only in `.claude/skills/` or `.agents/skills/`; those are install destinations and hidden-directory discovery may require explicit flags. `[S08]` `[S11]`
- Avoid symlinks in the published repository because Windows/git checkouts can turn them into plain text pointers; copy generated artifacts or keep one source of truth. `[S18]`
- Include a tagged release/versioning policy because both Vercel and GitHub installers benefit from immutable refs. `[S08]` `[S10]`

### 1.6 Packaging implications for Pixelcraft

- Use valid kebab-case names under 64 chars and matching directories: `pixelcraft`, `pixelcraft-visual-direction`, `pixelcraft-ux-review`, `pixelcraft-accessibility`, `pixelcraft-tokens`, `pixelcraft-web`, `pixelcraft-mobile`, `pixelcraft-python-ui`, `pixelcraft-desktop`, `pixelcraft-tui`, `pixelcraft-email`, `pixelcraft-game-ui`. `[S01]`
- Keep `pixelcraft` as the small router/orchestrator and let the specialized skills carry their own triggers; a pack is more discoverable and cheaper than one giant trigger-everything skill. `[S02]` `[S03]`
- Use `metadata` for pack version, homepage, locale coverage, and upstream schema version; avoid nonstandard top-level fields except deliberate host-specific companion copies. `[S01]`
- Avoid hard runtime dependencies in the core. Detect and use Node/Python/browser when present, but degrade honestly when validators cannot run. `[S01]` `[S20]`
- Bundle schemas/checklists/datasets as versioned JSON/CSV in `assets/`; documentation and interpretation belong in `references/`; deterministic validators belong in `scripts/`. `[S01]`
- Include license texts for all vendored material and track upstream commit/license in a notice file; masterclass demonstrates the need for provenance when reusing Anthropic/Hallmark material. `[S22]`
- Validate portable structure with `skills-ref validate`, Claude plugin validation where applicable, and install smoke tests through both `npx skills` and `gh skill install`. `[S01]` `[S04]` `[S08]`

## 2. Competitor analysis

### 2.1 Comparative matrix

| Skill | Primary architecture | Strongest idea | Principal gap |
|---|---|---|---|
| Anthropic `frontend-design` | one 71-line prose skill | brief-grounded direction + explicit generated-default clusters | no executable gate/assets; web/hero bias; shallow UX/platform/i18n coverage |
| Impeccable | compact router + ~40 references + Rust binary/detector/hooks | modes (Persuade/Operate/Read/Experience) + project context + visual verification | complex runtime; web/mobile focus; no Python UI/TUI/email/game modules |
| UI UX Pro Max | local CSV catalog + dependency-free Python BM25 search | broadest stack/data coverage + RTL metadata + DTCG token export | catalog can genericize taste; weak rendered verification; uneven freshness |
| taste-skill | opinionated page system + asset kit + deterministic browser/copy gate | copy-first, dealt variation/history, real material, hard finish loop | extremely prescriptive; company/landing sites only; Node/Chrome weight |
| Hallmark | 50 material themes + draw/deal/log + tiered sloplint gates | rotation away from convergence; floor/reflex/finish separation | websites/HTML/CSS only; catalog itself can become monoculture |
| frontend-design-masterclass | Anthropic spine + eight menus + vendored Hallmark | good integration of deal method, floor, menus | inherits web/Node/browser constraints |
| sloplint | measured tell registry + DOM checker + static scanner + CI diff | calibrated evidence and before/after scoring | early; web-only; absence of tells is not presence of quality |
| shadcn skill | component registry/project context workflow | use existing semantic components before inventing UI | intentionally React/shadcn/TS-specific, not a general design skill |
| Vercel web-design-guidelines | pinned audit rulebook emitting `file:line` findings | precise enforceable review format | audit-only, web-centric, little generative direction |

### 2.2 Anthropic `frontend-design`

- Structure: single `SKILL.md` with frontmatter and five conceptual sections; no scripts, references, assets, or automated validation. `[S15]`
- Core move: act as a design lead whose client rejected clichéd/templated proposals and who must make deliberate subject-specific choices. `[S15]`
- Requires grounding in subject, audience, and primary job before design; real content and domain vernacular drive visual identity. `[S15]`
- Names five current convergence clusters: cream+serif+terracotta, near-black+acid accent, broadsheet hairlines, SaaS-card kit, and template chrome. `[S15]`
- Names typography tells: one accented word, unnecessary eyebrow labels, all-caps labels, and decorative numbering without sequence semantics. `[S15]`
- Prescribes two passes: plan compact tokens/type/layout/principles, compare against a similar generic prompt, revise before implementation. `[S15]`
- Encourages restraint: spend boldness in one place, remove decoration that does not serve the brief, use screenshots when available. `[S15]`
- Strong copy guidance: user-centered names, active voice, consistent action vocabulary, errors that explain recovery, empty screens as invitations. `[S15]`
- Strength: concise enough to load fully; high-leverage mental model and explicit anti-default calibration. `[S15]`
- Gap: web/landing-page vocabulary (“hero”, CSS selectors) dominates despite nominally general “UI”. `[S15]`
- Gap: no operational validators, no platform adaptation, no deep forms/navigation/state guidance, no token export, no i18n/RTL/script coverage. `[S15]`
- Pixelcraft lesson: keep the conceptual spine short, but attach deterministic validation and modular platform depth.

### 2.3 Impeccable

- Structure: 91-line entry file, command routing table, many focused references, shell launchers, self-contained Rust binary, detector hook, plugin/generated variants for many agents. `[S16]`
- Strong description explicitly covers design/redesign/critique/audit/polish/simplify/harden/animate across web/product/native iOS/Android and excludes backend-only tasks. `[S16]`
- Best idea: modes describe visitor success. Persuade can be bold; Operate prioritizes scanability/consistency; Read prioritizes comprehension; Experience foregrounds the artifact. `[S16]`
- Context system uses `PRODUCT.md`, `DESIGN.md`, surface briefs, and platform metadata rather than re-inferring project truth every run. `[S16]`
- Craft floor checks rendered truth: contrast, depth, spacing, type measure, motion, states, browser surfaces, copy, and requirement coverage. `[S16]`
- Operate guidance correctly rejects decorative weirdness in product UI: familiarity is often a feature; consistency and state completeness are quality. `[S16]`
- Native adaptation guidance says restructure rather than stretch, translate platform idioms instead of transplanting them, and drive layout from size/window classes. `[S16]`
- Hardening guidance covers long/short text, emoji, RTL, CJK, digits/calendars, pluralization, network/API failures, interruption, permissions, and edge states. `[S16]`
- Critique rubric operationalizes cognitive load, Nielsen heuristics, and five personas including accessibility-dependent, stress-tester, and distracted mobile users. `[S16]`
- Strength: rare attention to browser chrome details (selection, caret, scrollbar, focus ring, tabular numerals) that signal craft. `[S16]`
- Strength: explicit refusal rules separate “default but permissible by brief” from true bans, reducing rigid taste imposition. `[S16]`
- Gap: substantial machinery and terminology create onboarding/context cost; launcher failure fallback must be carefully scripted. `[S16]`
- Gap: despite native coverage, it lacks first-class Streamlit/Gradio/Reflex/NiceGUI, Qt/Tauri, Textual/Ratatui, email, and game UI modules. `[S16]`
- Gap: many checks assume DOM/CSS/browser rendering and do not translate directly to non-web rendering surfaces. `[S16]`
- Pixelcraft lesson: adopt mode-aware ambition, persistent context artifacts, and hardening depth—but implement a lighter portable core.

### 2.4 UI UX Pro Max

- Structure: hand-authored `SKILL.md`, CSV datasets, Python search engine with no external dependencies, generated/master design-system documents, token export, and platform templates. `[S18]`
- Current catalog metadata reports 89 total styles (80 searchable/51 active), 194 products/palettes/reasoning profiles, 74 pairings, 141 UX guidelines, 105 curated icons, 17 motion presets, 25 chart types, 22 stacks, and 1,278 stack guidelines. `[S18]`
- Counts drift across release notes/SKILL text; consumers need catalog hashes/freshness metadata rather than stale marketing numbers. `[S18]`
- Workflow detects product type/audience/style/stack, generates a design system, supplements domain searches, then queries stack-specific implementation guidance. `[S18]`
- Query contract is unusually disciplined: smallest mode, one dominant intent, 2–5 meaningful terms, retry once, never fabricate empty results. `[S18]`
- Master/page override persistence helps consistency across sessions and avoids regenerating prior decisions unless forced. `[S18]`
- Design dials (`variance`, `motion`, `density` 1–10) are a useful abstraction for tuning output without rewriting the brief. `[S18]`
- RTL metadata (`full`, `partial`, `caveats`) is rare among competitors and directly relevant to international Pixelcraft. `[S18]`
- DTCG and CSS token export demonstrates machine-readable handoff rather than copying hex values through prose. `[S18]` `[S72]`
- Mobile pre-delivery checklist covers safe areas, dynamic type, dark-mode contrast parity, target sizes, screen readers, focus obscuring, dragging alternatives, authentication, and error summaries. `[S18]`
- Stack list includes web frameworks plus SwiftUI, React Native, Flutter, Compose, JavaFX, WPF/WinUI/Avalonia/UWP—but not the requested Python UI/TUI/email/game ecosystems. `[S18]`
- Gap: keyword-search catalogs can steer different products into the same rows, recreating sameness unless divergence/history is layered on top. `[S18]`
- Gap: no built-in rendered screenshot gate comparable to taste/Hallmark/Impeccable; many rules remain textual advice. `[S18]`
- Gap: heavy GSAP/Tailwind/React/shadcn material reinforces TS/web gravity even though catalog breadth is greater. `[S18]`
- Pixelcraft lesson: use versioned structured data with provenance and semantic outcome queries, but add diversity rotation and verification.

### 2.5 taste-skill

- Structure: large opinionated entry file, system/asset kit, copy references, layout/photo/motion libraries, dealer scripts, consistency/layout/performance checkers, copy linter, and persistent finish gate. `[S19]`
- Explicit goal is a professional company website at the level of carefully built product/company sites, not maximal artistic novelty. `[S19]`
- Copy comes before layout: category/buyer/action, one hard fact, factual inventory, marked assumptions, buttons as verb+object, no invented proof. `[S19]`
- “Deal, never choose by taste” combines palette/type/hero/moment randomness with history files so consecutive pages differ. `[S19]`
- Page-kind routing distinguishes software, gaming, hardware/product, service, and place; visual grammar changes by trade rather than applying one universal template. `[S19]`
- Strong gate design: checks real rendered pages at multiple widths, detects checker evasion, counts fix rounds, supports explicit waivers, and prevents infinite agent trapping. `[S19]`
- Copy lint detects residue, stock phrases, repeated rhetorical devices, invented proof, and unnamed generic voice—an underdeveloped area in most competitors. `[S19]`
- Strength: insists real photographs/product UI carry the page and records every stand-in/asset limitation in the final report. `[S19]`
- Gap: very rigid house rules (one section per screen, no captions, forbidden violet, exact word budgets) can conflict with legitimate briefs and product UX. `[S19]`
- Gap: primarily static marketing/company sites in HTML/CSS or frontend frameworks; not a general app UX or cross-platform system. `[S19]`
- Gap: Node 22 + Chrome + large asset kit raises installation and portability cost. `[S19]`
- Pixelcraft lesson: copy linting, truth accounting, history-aware variation, waiver discipline, and bounded finish loops are essential; rigid surface shape should not be.

### 2.6 Hallmark

- Structure: 154-line entry, theme catalog, anatomy/layout/imagery/craft/gate references, scripts for dealing/scaffolding/linting/capture/logging. `[S20]`
- Fifty themes are “materials” (tokens/type/surfaces/components/texture), explicitly not page plans, reducing but not eliminating convergence. `[S20]`
- The draw deals shape/hero/nav/footer/action placement/composition exclusions from the visitor job and avoids prior log fingerprints. `[S20]`
- The mirror test is actionable: if a neighboring prompt in the same category would receive the same combination, change one decision and say which. `[S20]`
- Material inventory separates real facts/pictures from absent proof; missing facts remain marked blanks rather than invented testimonials/metrics/logos. `[S20]`
- Floor/Reflex/Finish tiers are the best governance model: non-waivable correctness floor, waivable model defaults with recorded reason, nonblocking craft questions. `[S20]`
- Hero-first construction plus fresh-context visual review catches false confidence before investing in the full page. `[S20]`
- Redesign preserves content/wiring by recording links/fields/handlers/headings before transformation and failing if they disappear. `[S20]`
- Strength: verification budget explicitly limits inspection/fix/review rounds, acknowledging agent cost. `[S20]`
- Gap: self-contained HTML/CSS website orientation means little transfer to native/mobile/Python/TUI/email/game surfaces. `[S20]`
- Gap: a fixed catalog of fifty themes can itself become recognizable over time unless catalog generation/rotation is open-ended. `[S20]`
- Pixelcraft lesson: separate non-negotiable floor from taste defaults; preserve functional truth during redesign; log fingerprints to avoid repeated output.

### 2.7 sloplint and adjacent tools

- sloplint frames AI slop as distributional convergence: safe high-probability choices repeated across outputs. `[S21]`
- It uses a registry of 54 tells with scope, weight, threshold, detection mode, and concrete replacement guidance. `[S21]`
- DOM checks measure computed styles in Chromium at desktop/phone widths, avoiding the common failure of judging source intent rather than rendered truth. `[S21]`
- Weights are calibrated on real/AI-built pages; reported held-out medians separate many AI-built pages from professional pages but are not a quality oracle. `[S21]`
- A zero-to-two score is “clean”, three-to-six “some slop”, seven-plus “slop”; the documentation itself warns clean does not equal good. `[S21]`
- Static scanner catches source-level patterns in CSS/Tailwind/JSX/Vue/Svelte; authenticated setup hooks support signed-in screens. `[S21]`
- Before/after diffing boxes visible changes and distinguishes fixed, introduced, and incidental regressions—an excellent CI pattern. `[S21]`
- Manual checks remain necessary: hero/welcome banners inside apps, decorative charts, explanatory copy, invented proof, missing states, and toast misuse. `[S21]`
- Krebs' independent measured report found 22% of 1,590 sites matching four or more patterns and stresses single-pattern innocence; use it as evidence, not proof of causation. `[S25]`
- Gap: browser DOM model excludes non-web platforms, and early-stage calibration admits false positives. `[S21]`
- shadcn's skill is intentionally narrow but instructive: inspect project context, compose registry components, prefer built-in variants/semantic tokens, and do not reinvent existing primitives. `[S23]`
- Vercel's guidelines skill shows the opposite pattern: pin a stable rulebook with source commit/hash and emit terse `file:line` audit findings rather than generate design. `[S24]`
- Other named community efforts exist (Kami, Open Design, huashu-design, Uncodixfy, antislop, DeSlop), but they were not deeply inspected here; do not treat this matrix as exhaustive. `[S20]` `[S21]`

### 2.8 Cross-competitor whitespace

- No inspected competitor delivers equal-depth support for the full target set: web frameworks, server-rendered apps, SwiftUI/Compose/Flutter/RN, Streamlit/Gradio/Reflex/NiceGUI, Qt/Tauri, Textual/Ratatui, email, and game UI.
- UX evidence is often present as rules, but visual distinctiveness and interaction quality are usually separate systems rather than one coherent generation loop.
- Internationalization is the largest differentiator: UI UX Pro Max has RTL metadata and Impeccable has deep hardening, but none systematically covers locale formatting, plural rules, script shaping, input methods, translation expansion, culturally appropriate imagery/color, or localized copy quality.
- Most tools validate web rendering only. Cross-platform verification needs capability-specific adapters: browser screenshots, native simulator screenshots, static semantic inspection, token validation, terminal snapshots, email client constraints, and human review prompts.
- Existing catalogs risk becoming the next monoculture; Pixelcraft should generate/bend constraints from subject matter and maintain a history-aware diversity mechanism rather than only selecting fixed styles.

## 3. Research evidence: convergence, evaluation, UX agents, accessibility

### 3.1 Why generated UIs converge

- Padmakumar and He show model-generated text can be less diverse than human text even when training data is diverse; generation/alignment choices amplify dominant patterns. `[S26]`
- RLHF/post-training literature reports reduced output diversity as models are optimized toward preferred, safe, typical responses; this is a structural distributional shift rather than a mere prompting bug. `[S27]`
- “Mode collapse” in UX discourse usually means inference-time convergence toward high-probability outputs; it is related to but not identical to recursive training-data collapse. `[S26]` `[S32]`
- Shumailov et al. define model collapse as generative models trained on their own output losing distribution tails and variance across generations; this warns against feeding homogeneous UI back into training data but does not by itself prove inference-time UI sameness. `[S32]`
- Anthropic uses “distributional convergence” for frontend generation: unguided sampling picks common safe patterns at every local decision, producing globally generic interfaces. `[S15]` `[S21]`
- Local decisions compound: default font + default indigo + centered hero + three cards + identical radius + fade-up motion individually seem harmless but jointly form a recognizable template. `[S21]` `[S25]`
- Prompt bans alone merely move the median. Hallmark/masterclass argue that choosing among far-apart candidates is more effective than prohibiting the current cliché. `[S20]` `[S22]`
- Verbalized Sampling asks models to verbalize a distribution over candidate responses and sample from it, reporting improved diversity without retraining; adapt the method to visual directions rather than final code. `[S28]`
- Practical sampling pattern: generate 3–5 materially distinct directions, force each to differ in grid/material/type/motion/imagery, score against subject/audience/job/accessibility, choose explicitly, record why alternatives lost. `[S20]` `[S28]`
- Maintain a project/session history fingerprint of prior choices and penalize repetition across palette, type pairing, composition, navigation, texture, hero posture, and motion signature. `[S19]` `[S20]`
- Do not confuse diversity with randomness: every candidate still must satisfy the brief, platform idioms, accessibility floor, performance constraints, and truthfulness. `[S15]` `[S20]`

### 3.2 Human creativity and homogenization evidence

- A 36-participant creativity-support study found ChatGPT users produced more numerous/detail-rich ideas but group-level ideas were less semantically distinct; users also felt less ownership. `[S29]`
- Nature Human Behaviour commentary on brainstorming reports the central tradeoff: ChatGPT can raise mean creativity while reducing pool diversity, which is precisely the wrong trade for brand differentiation. `[S30]`
- A large dynamic experiment with 800+ participants across 40+ countries found high exposure to AI examples shaped subsequent human ideas; exposure effects depend on amount/disclosure and can propagate culturally. `[S89]`
- Cross-cultural writing research reports AI suggestions can homogenize writing toward Western styles and diminish cultural nuance; localization must include rhetoric, symbols, color meanings, imagery, formality, and interaction norms—not translation alone. `[S31]`
- Treat AI-generated references as a homogenizing input: if all agents copy the same award sites or component libraries, “distinctive” becomes a second-order template. `[S21]` `[S29]`
- Generate direction before looking at inspirational examples where possible; use references for constraints and vocabulary, not as visual templates to imitate. `[S15]` `[S20]`

### 3.3 Measuring “AI slop”

- The “Measuring AI Slop” paper argues slop is multidimensional rather than synonymous with low quality; evaluation should separate coherence, factuality, relevance, originality/creativity, emotional resonance, and other dimensions rather than using one insult label. `[S33]`
- Adrian Krebs' report is valuable because it uses deterministic computed-style checks at scale, but its author and downstream tools acknowledge false positives and the prior existence of template culture. `[S25]`
- Krebs measured pattern prevalence over 1,590 sites: 22% matched four or more patterns and 32% matched two or three; use this as evidence of clustering, not a universal base rate. `[S25]`
- Per-pattern examples reported downstream include decorative gradients around 28%, default shadcn/Tailwind palettes around 23.5%, always-dark around 20.3%, trend display faces around 15.8%, purple CTAs around 10.7%, tracked caps around 10.5%. `[S25]` `[S21]`
- Because percentages are landing-page/Show-HN-centric, do not generalize them to dashboards, native apps, email, or games without new calibration. `[S21]` `[S25]`
- DIS 2025 analysis of AI-generated interfaces reports homogenization and accessibility concerns; use it as evidence that interface-level convergence is observable beyond anecdotes. `[S34]`
- Slop detection should use convergent evidence: computed properties, source patterns, screenshot review, copy analysis, state coverage, and human reaction—not one metric. `[S21]` `[S33]`
- Build a calibration set deliberately spanning professional human work, template-driven pre-AI work, agent output, multiple stacks/locales, and adversarial clean-but-bland controls. `[S21]` `[S33]`

### 3.4 UI generation benchmarks and what they measure

- Design2Code evaluates webpage generation from screenshots/designs using fine-grained automatic visual metrics plus human judgments; it exposes implementation fidelity gaps but rewards replication of a fixed target, not original UX. `[S35]`
- Use Design2Code-style checks for “build this comp” tasks: layout correspondence, text match, color match, element position/size, visual similarity, and interactive completeness. `[S35]`
- UICrit provides 3,059 human-authored critiques over 983 mobile UI screens from seven designers and reports substantial improvement when critique data is used; it is directly relevant for training/evaluating design critique rather than pixel copying. `[S36]`
- UICrit's lesson for Pixelcraft: rubric-based critique should identify hierarchy, grouping, alignment, density, affordance, and usability tradeoffs in explicit language instead of generic “looks good”. `[S36]`
- WebDev Arena uses live pairwise human preference for web generation; it measures what users prefer in context but can reward immediate visual polish over accessibility, maintainability, or truthfulness. `[S37]`
- WebGen-Bench focuses on realistic website generation tasks and functional/browser-test-style evaluation; use it to remember that visual output can hide broken behavior. `[S38]`
- ArtifactsBench evaluates interactive generated artifacts with automated and model-judged criteria; interactivity and runtime correctness are first-class dimensions. `[S39]`
- DesignBench and FrontendBench broaden evaluation across realistic frontend design/implementation settings; treat exact counts/version details as fast-moving and verify before citing in release documentation. `[S40]` `[S41]`
- Benchmark implication: no single benchmark covers distinctiveness + usability + accessibility + implementation + cross-platform parity. Pixelcraft needs its own matrix. `[S35]` `[S39]`
- Recommended evaluation axes: instruction adherence, functional behavior, visual fidelity where a target exists, divergence across repeated generations, UX heuristic severity, accessibility violations, localization resilience, performance, code quality, and human preference. `[S35]` `[S36]`

### 3.5 LLM-as-UX-evaluator and usability-testing agents

- UXAgent research uses LLM-driven simulated users/personas to browse and critique web experiences, showing promise for scalable exploratory usability feedback. `[S42]`
- Different UXAgent publications/prototypes report different study sizes and system versions; cite the specific paper/version when using numerical claims. `[S42]`
- Simulated users are best for generating hypotheses about confusion, expectations, and edge cases; they are not evidence of real-user behavior without validation. `[S42]` `[S44]`
- A GPT-4o heuristic-evaluation comparison found limited overlap with expert-identified problems, duplicate reporting, and false positives; use LLM evaluators as triage rather than conformance proof. `[S43]`
- A systematic review of usability automation concludes automation remains fragmented and human validation is still needed; integrate agents into the loop but do not outsource judgment entirely. `[S44]`
- Use multiple evaluator personas (novice, expert, screen-reader user, stressed mobile user, non-native speaker, skeptic) with task scripts and force concrete evidence/screenshot/state citations. `[S16]` `[S42]`
- Separate evaluator roles: deterministic checker reports facts; heuristic critic interprets; persona simulator hypothesizes; human adjudicates severity and brand fit. `[S43]` `[S44]`
- Prompt UX critics to inspect one mode at a time: first-time completion, repeat-use efficiency, error recovery, accessibility, localization, trust. Aggregation hides failure modes. `[S16]` `[S43]`
- Require severity ratings tied to user impact and evidence: blocker/critical/major/minor plus confidence and reproduction path; do not accept taste-only complaints as UX defects. `[S16]`
- LLM critics should never mark a failure “verified” unless the path was actually executed or rendered; this distinction is crucial for trustworthy automation. `[S44]`

### 3.6 Accessibility of generated code

- A ChatGPT accessibility study found a large majority of generated snippets contained at least one accessibility problem, while iterative prompting fixed many simple violations; exact rates depend on task/prompt taxonomy. `[S45]`
- Prevention beats repair: semantic HTML/native controls, labels, focus management, contrast-safe tokens, keyboard interaction, and reduced-motion defaults should be generated initially. `[S45]` `[S57]`
- CodeA11y shows coding assistants can reinforce inaccessible patterns when users accept suggestions uncritically; accessibility-aware nudges/plugins improve outcomes but do not catch everything. `[S46]`
- Studies of prompt-only accessibility remediation indicate prompts are insufficient for robust compliance; deterministic analysis, assistive-technology testing, and human judgment remain necessary. `[S45]` `[S46]`
- DIS analysis suggests generated interfaces can achieve superficial baseline cues while remaining homogenized and weak in user control/equity; passing a linter is not inclusive design. `[S34]`
- Automated tools such as axe-core catch only a subset of WCAG issues; use them as one layer plus keyboard walkthroughs, screen-reader smoke paths, zoom/reflow checks, and manual judgment. `[S57]` `[S88]`
- Pixelcraft should treat accessibility as platform-independent semantic requirements translated into each stack, not as a final web-only audit. `[S57]`

## 4. UX evidence base

### 4.1 Laws and cognitive constraints

- Fitts' Law: acquisition time grows as targets become smaller/farther; put primary actions in easy reach, enlarge effective hit areas, and separate destructive actions. `[S67]`
- Fitts implications by platform: thumb-zone mobile actions, large touch targets, edge/corner value in pointer interfaces, adequate terminal/menu spacing, forgiving game UI hit areas. `[S62]` `[S67]`
- Hick's Law: decision time increases with number/complexity of choices; reduce visible options, group related choices, expose progressive depth. `[S67]`
- Do not misapply Hick's Law by hiding critical functionality; prioritize and chunk rather than removing necessary control. `[S47]` `[S67]`
- Miller/cognitive-load guidance: working memory is limited; present decision points in small chunks and keep required context visible instead of forcing recall. `[S16]` `[S67]`
- Doherty Threshold: productivity and engagement improve when system feedback stays roughly under 400 ms; preserve responsiveness through optimistic state, immediate feedback, or meaningful progress. `[S67]` `[S48]`
- Jakob's Law: users bring expectations from other products; follow platform/category conventions unless differentiation itself is the value proposition. `[S62]` `[S67]`
- Aesthetic-usability effect: polished coherent interfaces are perceived as easier, but beauty cannot compensate for broken states, slow feedback, or inaccessible interaction. `[S67]`
- Peak-end rule: design completion, error recovery, and final confirmation carefully because users remember peaks and endings. `[S67]`
- Von Restorff effect: one distinctive element can aid memory/attention; use singular emphasis rather than uniform decoration everywhere. `[S15]` `[S67]`
- Goal-gradient effect: visible progress motivates completion in multi-step flows, but never fake progress or collapse distinct steps dishonestly. `[S53]` `[S67]`
- Postel's robustness principle for UI inputs: accept forgiving user formats while producing precise normalized output and clear feedback. `[S49]` `[S50]`

### 4.2 Nielsen heuristics translated into checks

- Visibility of system status: every asynchronous action needs immediate acknowledgment, meaningful progress state, completion/failure feedback, and current navigation location. `[S47]`
- Match system to real world: use domain vocabulary, conventional ordering, familiar metaphors/icons, and locale-appropriate formats instead of implementation jargon. `[S47]`
- User control/freedom: provide undo/cancel/back/escape/clear-filter paths, confirm destructive action without trapping the user, and preserve work. `[S47]`
- Consistency/standards: same action names, visual semantics, component behavior, platform idioms, keyboard shortcuts, and terminology across the product. `[S47]`
- Error prevention: constrain invalid input, choose safe defaults, validate before destructive execution, autosave drafts, and design away predictable mistakes. `[S47]`
- Recognition over recall: visible labels/options, contextual hints, recent items, autocomplete, current state, and explanatory examples reduce memory burden. `[S47]`
- Flexibility/efficiency: keyboard shortcuts, bulk actions, favorites/defaults, command palettes, customization, and expert accelerators must not complicate novice paths. `[S47]`
- Aesthetic/minimalist design: every visible element must support comprehension/action; remove redundant decoration and separate signal from noise through hierarchy. `[S47]`
- Error diagnosis/recovery: use plain language, exact cause, location, correction, preservation of input, and a non-destructive retry path. `[S47]` `[S49]`
- Help/documentation: provide task-focused contextual assistance that is searchable/scannable and does not force users out of the workflow. `[S47]`
- Convert each heuristic into observable questions: “What feedback appears within 100 ms?”, “Where does focus land?”, “What survives refresh?”, “What happens offline?”, rather than copying labels into a checklist. `[S16]` `[S47]`

### 4.3 Response time, loading, and feedback

- Nielsen's classic thresholds: ~0.1 s feels instantaneous, ~1 s preserves flow, ~10 s is the upper bound before attention drifts; use appropriate feedback as duration increases. `[S48]`
- Under ~100 ms: no spinner; simply update. A flashing loader can be worse than no indicator. `[S48]` `[S52]`
- Roughly 100 ms–1 s: immediate visual acknowledgment/pressed state; avoid premature heavyweight progress UI. `[S48]`
- Around 1–10 s: show skeleton/progress context for content-shaped loading; keep layout stable and interaction responsive where safe. `[S48]` `[S52]` `[S53]`
- Over 10 s: explain work, show determinate progress if measurable, estimate/communicate stages, allow backgrounding/cancelation where possible. `[S48]` `[S53]`
- Skeleton screens work best when they match final structure and reduce perceived wait; do not shimmer decorative mystery boxes indefinitely. `[S52]`
- Use spinners for short indeterminate waits in bounded regions, progress bars for measurable processes, and skeletons for content structure; never stack all three. `[S52]` `[S53]`
- Keep input latency and tap feedback under ~100 ms; visual feedback should begin even if the operation completes later. `[S63]` `[S67]`
- Avoid layout shift by reserving dimensions for async media/content; declare image dimensions or aspect ratios where platform permits. `[S18]` `[S63]`
- Never block interaction during animation; transitions must be interruptible and correctness must not depend on animation-end events. `[S62]` `[S66]`
- Optimistic UI is appropriate for reversible/high-confidence operations; provide rollback failure copy and reconciliation rather than pretending certainty. `[S47]`

### 4.4 Forms and validation

- Every input needs a persistent visible label; placeholder text is not a label because it disappears and often fails contrast/memory requirements. `[S50]` `[S85]`
- Put labels close to their fields, generally above inputs on mobile/web forms for scanning and localization expansion. `[S50]` `[S84]`
- Use semantic input types/autocomplete/input modes to trigger correct keyboards, password managers, autofill, and validation behavior. `[S50]` `[S84]` `[S57]`
- Never block paste, including password and one-time-code fields; blocking paste undermines password managers and accessible authentication. `[S57]` `[S18]`
- Mark required fields clearly and explain input constraints before submission when format is non-obvious. `[S49]` `[S50]`
- Validate on submit for initial empty required fields; use blur/inline validation after meaningful entry where appropriate; never yell before the user has had a chance. `[S49]` `[S55]`
- Once a field displays an error, revalidate eagerly enough that the error clears as soon as it is fixed; stale errors are trust-destroying. `[S55]`
- Place a specific inline error adjacent to the field and programmatically associate it; do not rely on color or a toast alone. `[S49]` `[S57]`
- For multi-error submission, show/focus a linked error summary where platform convention supports it while retaining inline errors. `[S49]` `[S18]`
- Preserve every valid and invalid entered value after failure; resetting a form is data loss and a severe violation. `[S49]` `[S50]`
- Error copy pattern: what happened in plain language + what the user can do next + preserve work; avoid apologies, blame, codes, and vague “invalid input”. `[S49]` `[S54]`
- Adaptive messages matter: explain the actual failed constraint (“use fewer than 100 characters”, “include an @”) rather than one generic string for every cause. `[S54]`
- Accept forgiving formats: trim whitespace, ignore harmless punctuation in phone/card/code inputs, accept names with accents/apostrophes/spaces, normalize server-side. `[S50]` `[S18]`
- Group related fields, use logical tab order, keep single-column layouts where practical, and avoid unnecessary optional fields. `[S50]` `[S56]`
- Keep submit enabled until submission semantics are clear; disable only while a request is actually in flight and use idempotency protection against double-submit. `[S18]` `[S49]`
- Use correct focus behavior after route/modal/form transitions; never leave focus on a removed control or trapped behind an overlay. `[S57]` `[S87]`

### 4.5 Empty states, errors, and edge states

- Empty states should communicate what happened, why the space is empty, what the user can do next, and how to learn/use the feature. `[S51]`
- Distinguish first-run empty, user-cleared empty, no-results/filter empty, permission empty, offline empty, error empty, and zero-data states; they are not interchangeable. `[S51]`
- Filter/no-result states must show current criteria, clear/reset action, and alternative next step; “No results” alone is a dead end. `[S51]`
- Empty states in task surfaces should teach through a meaningful primary action, template, example, import, or sample only when clearly labeled and removable. `[S51]`
- Error pages/states need retry/support/navigation paths and must preserve user context; never expose stack traces or secrets as user-facing copy. `[S47]` `[S49]`
- Success states need concise confirmation and the next logical action; avoid celebratory noise for routine operations. `[S47]`
- Design zero, one, few, many, maximum, loading, partial permission, read-only, archived/deleted, long-text, missing-media, and offline variants before implementation. `[S16]` `[S18]`
- Long content requires wrapping/truncation rules, stable layout, localization expansion budget, and accessible disclosure of full text when truncated. `[S18]` `[S82]`
- Large collections need pagination/virtualization/search/filter/sort behavior, count/result context, and recovery when filters empty. `[S18]` `[S47]`
- Interrupted flows need state persistence: refresh, app switch, crash, timeout, multi-tab use, and network loss must not silently discard work. `[S16]` `[S47]`
- Permission states should explain what is visible/editable and why, not simply hide navigation or show a blank screen. `[S18]` `[S47]`

### 4.6 Checkout and high-friction flows (Baymard)

- Baymard checkout research repeatedly finds average implementations expose far more form fields than necessary; reducing unnecessary fields matters more than merely splitting steps. `[S56]`
- A checkout can feel short in step count yet remain exhausting when each step contains dense optional/duplicative fields. `[S56]`
- A meaningful minority of users abandon because checkout is too long/complicated; treat every field as a cost requiring justification. `[S56]`
- Inline validation improves recovery when timing/messages are adaptive, but premature or stale validation harms trust. `[S55]`
- Many sites still use generic validation messages that do not state the precise reason; write constraint-specific copy. `[S54]`
- Use inline validation selectively where input has meaningful constraints; do not validate fields that cannot yet be judged. `[S55]`
- Avoid forced account creation where possible; if account creation is needed, explain/delay/integrate it without surprising the user. `[S56]`
- Preserve cart, shipping, payment, and validation state across errors/interruptions; high-friction flows magnify data-loss cost. `[S47]` `[S56]`
- Generalize Baymard beyond ecommerce: every wizard, onboarding, booking, settings migration, import, and checkout-like flow should minimize fields and expose progress honestly. `[S53]` `[S56]`

### 4.7 WCAG 2.2 core requirements for generated UI

- WCAG 2.2 is organized around perceivable, operable, understandable, and robust outcomes; use the Quick Reference to map criteria to implementation. `[S57]` `[S58]`
- Contrast minimum (1.4.3): normal text 4.5:1; large text 3:1; incidental/logotype/inactive exceptions are narrow and must not be abused. `[S60]`
- Non-text contrast (1.4.11): essential UI component boundaries/states and meaningful graphics need 3:1 against adjacent colors. `[S57]` `[S58]`
- Resize/reflow: content must remain usable under text scaling and at constrained widths without two-dimensional scrolling where reflow applies; fixed layouts are a failure mode. `[S57]` `[S58]`
- Keyboard operability: all functionality must be operable through keyboard without requiring specific timings; no keyboard traps. `[S57]` `[S87]`
- Focus visible/not obscured: focus indicators must be perceptible and sticky headers/overlays/cookie banners must not hide the focused component. `[S61]` `[S57]`
- Target size minimum (2.5.8): pointer targets at least 24×24 CSS px unless spacing, equivalent control, inline, user-agent, or essential exceptions apply. `[S59]`
- Target size enhanced (2.5.5 AAA) uses 44×44 CSS px; use it as the better target for primary/touch-heavy controls even though AA minimum is smaller. `[S59]`
- Dragging movements (2.5.7): every drag-only operation needs a single-pointer alternative; provide keyboard/control alternatives as a robust implementation. `[S57]` `[S18]`
- Pointer cancellation: actions should trigger on up/activation rather than irreversible down events, with abort/undo paths. `[S57]`
- Label in name: visible labels must match accessible names so voice control users can activate controls reliably. `[S57]`
- Error identification/suggestion: identify the field and describe the error in text; when a correction is known, suggest it unless security/content restrictions prevent it. `[S57]` `[S49]`
- Consistent help (3.2.6): repeated help/contact mechanisms stay in the same relative order across a set of pages/screens. `[S57]`
- Redundant entry (3.3.7): do not require users to re-enter information already supplied in the same process unless essential, security-related, or confirmation-specific. `[S57]`
- Accessible authentication minimum (3.3.8): do not require cognitive function tests unless an alternative/mechanism such as paste/password manager/autofill is available. `[S57]`
- Focus appearance (2.4.11/AAA): consider indicator area/contrast as a design target even when strict conformance level differs. `[S57]` `[S18]`
- Moving/auto-updating content needs pause/stop/hide or user control; honor reduced motion and never let animation hide content permanently. `[S57]` `[S62]`
- Use native semantics before ARIA; incorrect ARIA is often worse than none. Icon-only controls require accessible names and state exposure. `[S57]` `[S87]`
- Modals require focus movement into dialog, containment while open, Escape dismissal where appropriate, restoration to opener, and non-modal content inertness semantics. `[S87]`

### 4.8 Apple HIG essentials

- Apple touch target baseline: 44×44 pt; visionOS inputs have larger spatial/target requirements because precision differs by modality. `[S62]`
- Respect safe areas, status/navigation bars, dynamic island/notch, keyboard, split view, orientation, and platform gestures; do not place critical UI under OS chrome. `[S62]`
- Use Dynamic Type/system text scaling so user-selected sizes change layout without clipping; test at the largest accessibility sizes rather than only default. `[S62]`
- Prefer system typefaces/weights/control vocabularies when usability matters; custom branding belongs in measured accents rather than illegible labels. `[S62]`
- Buttons should use clear action-oriented titles, prioritize one prominent action per view, and avoid competing visual emphasis. `[S62]`
- Important content belongs where people expect it under platform scanning conventions; alignment, grouping, whitespace, and progressive disclosure communicate hierarchy. `[S62]`
- Motion should clarify state/continuity, be interruptible, avoid blocking input, and respect Reduce Motion. `[S62]` `[S66]`
- Use haptics sparingly for meaningful confirmation/notification; do not use them as decoration. `[S62]`
- SF Symbols/platform symbols provide semantic consistency; custom icons must preserve metaphor, weight, scale, and accessibility labeling. `[S62]`
- Adapt across device classes with size classes and structural rethinking; a stretched phone interface is not a tablet design. `[S16]` `[S62]`

### 4.9 Material 3 essentials

- Material touch target baseline: 48×48 dp, with adequate spacing and no reliance on visual icon bounds alone. `[S63]` `[S64]`
- Density is an explicit system decision: compact layouts are valid for expert/data surfaces, but density must not violate target or readability floors. `[S64]`
- Material color uses semantic roles (primary/secondary/tertiary/error/surface/on-surface and containers), not raw one-off hex values. `[S65]`
- Dynamic/color schemes must preserve contrast and role separation in both light/dark themes; never implement dark mode by naive inversion. `[S65]`
- Use type roles/scales (display/headline/title/body/label) consistently rather than arbitrary per-screen sizes. `[S63]` `[S65]`
- Motion durations/easing depend on enter/exit, distance, area, and complexity; do not copy one universal duration across all transitions. `[S66]`
- Standard patterns favor ease-out/deceleration on entry, acceleration on exit, and shorter exits than entries for perceived responsiveness. `[S66]`
- Navigation should adapt by window size class: bottom navigation/navigation bar on small screens, rail/drawer/sidebar patterns as width expands. `[S63]` `[S16]`
- State layers communicate hover/focus/pressed/dragged/disabled consistently across components rather than ad-hoc color hacks. `[S63]` `[S65]`
- Predictive Back and system gestures must be preserved; do not create conflicting horizontal gestures in critical regions. `[S63]` `[S16]`

### 4.10 Internationalization and cultural robustness

- Internationalization is a design requirement, not a translation pipeline: layout, type, input, imagery, color, numerals, calendars, names, addresses, formality, and reading direction all change. `[S82]`
- Reserve roughly 30–40% expansion budget for common translation growth and use adaptive constraints rather than fixed-width text containers. `[S16]` `[S82]`
- Use locale-aware APIs/CLDR data for numbers, currencies, dates, times, calendars, units, collation, and plural/select rules instead of concatenating strings. `[S81]`
- Never concatenate sentence fragments in a fixed English order; translate complete messages with placeholders because grammar and gender/case/plural agreement differ. `[S81]` `[S82]`
- RTL requires logical directionality across layout, icons, motion direction, progress, charts, breadcrumbs, trimming, keyboard arrows, and gesture semantics—not just flipped margins. `[S82]` `[S83]`
- Use logical CSS properties (`margin-inline-start`, `padding-inline`, `border-inline-end`) in web/hybrid stacks rather than physical left/right assumptions. `[S83]`
- Arabic-script handling must preserve joining behavior/ZWNJ, locale-specific letter variants, Eastern Arabic-Indic digits, and Hijri/Solar Hijri calendar expectations. `[S16]` `[S82]`
- CJK interfaces need appropriate fonts/metrics/line breaking, vertical-writing awareness where relevant, no naive letter spacing/italicization, and locale-sensitive punctuation. `[S82]`
- Input methods/composition mean Enter/keyup semantics differ; custom shortcuts must distinguish composition confirmation from submission. `[S18]` `[S82]`
- Name forms must not assume first/last ordering, ASCII letters, mononyms, length limits, or honorific structures. `[S82]`
- Address/phone/tax/postcode formats are local; do not copy US-centric checkout validation into global products. `[S56]` `[S82]`
- Iconography, hand gestures, animals, color symbolism, humor, imagery, and examples carry culture-specific meanings; use local review rather than inventing universal claims. `[S31]` `[S82]`
- Font fallback is part of visual identity: script coverage, optical size, weight matching, fallback metric alignment, and licensing must be specified for every target language. `[S68]` `[S82]`
- Localize microcopy with the same truth constraints: no machine-translated invented testimonials, metrics, legal copy, or cultural claims. `[S31]` `[S82]`

## 5. Creative and distinctive UI craft

### 5.1 Generation workflow that avoids convergence

1. Extract subject, audience, user job, surface mode, platform, constraints, brand truth, real assets, locale, and existing design-system authority before ideation. `[S15]`
2. Separate fixed truth from free axes: pinned brand/palette/type/layout/copy/accessibility/legal constraints win; everything else is available for divergence. `[S15]` `[S20]`
3. Generate 3–5 far-apart directions before implementation; vary material, composition, typography, color posture, motion, imagery, density, and interaction metaphor simultaneously. `[S20]` `[S28]`
4. Force each direction to name its inspiration/source in the subject matter rather than a generic trend label. `[S15]`
5. Score candidates against audience/job/platform/mode/accessibility/feasibility/localization/truthfulness, select one, and record why the others lost. `[S20]` `[S22]`
6. Add one self-generated wildcard not in any catalog; catalogs are priors, not the boundaries of design. `[S22]` `[S28]`
7. Produce compact tokens before code: semantic color roles, type scale/families/fallbacks, spacing/density, radius, elevation/depth, motion, iconography, imagery treatment, and usage rules. `[S15]` `[S65]` `[S72]`
8. Apply the mirror test: if a neighboring prompt would receive the same output, alter at least one meaningful axis and document the reason. `[S20]`
9. Build the critical first screen/component in isolation, inspect rendered truth, then continue; early correction prevents compounding template decisions. `[S20]`
10. Spend emphasis in one memorable place; keep surrounding systems quiet and coherent. `[S15]` `[S67]`
11. Maintain a diversity log/fingerprint across repeated builds and penalize reused palettes, pairings, layouts, motions, textures, and hero postures. `[S19]` `[S20]`
12. End with a report distinguishing deterministic verification, visual inspection, model judgment, unverified assumptions, waivers, and missing real assets. `[S19]` `[S20]`

### 5.2 Design movement catalog: operational rules

- Swiss/International Typographic Style: use a rigorous grid, asymmetric alignment, objective photography, strong sans typography, whitespace, and restrained color; avoid decorative texture. `[S79]` `[S80]`
- Swiss caution: strict neutrality can read corporate/template-like if every page uses the same grid/face; customize scale, rhythm, imagery, and density to the subject. `[S15]`
- Bauhaus: geometric primitives, primary/limited palette, functional composition, diagonal tension, integration of type/form; use shapes structurally rather than random decoration. `[S79]` `[S80]`
- Bauhaus caution: do not use colored circles/triangles as costume; each form should organize attention or encode content. `[S15]`
- De Stijl: orthogonal black rules, blocks of red/yellow/blue/white, strict rectilinear spacing; useful for bold editorial/system layouts. `[S79]`
- De Stijl caution: maintain readable text contrast and do not force data-dense product UI into sparse art composition. `[S60]`
- Brutalist architecture/web: exposed structure, heavy borders, raw materials, visible seams, monospaced/system type, unapologetic blocks; use intentionally for directness/utility. `[S80]`
- Neo-brutalism: high-contrast outlines, hard offset shadows, saturated flat color, chunky controls, sticker-like type; use only when brief/audience supports playful confrontation. `[S20]` `[S80]`
- Neo-brutalism caution: hard shadows and saturated fills can destroy hierarchy/accessibility when overused; retain focus/contrast/state semantics. `[S60]` `[S16]`
- Memphis/postmodern: playful geometric confetti, clashing color, squiggles, irregular composition; best for youth/culture/entertainment, not trust-critical dense workflows. `[S80]`
- Art Deco: symmetrical geometry, stepped forms, metallic/ink palette, elegant display type, fine linework; use sparingly for luxury/heritage. `[S79]`
- Mid-century modern: organic geometry, warm wood/earth color, optimistic shapes, humanist spacing, illustrative texture; useful for hospitality/consumer warmth. `[S79]`
- Scandinavian/Nordic: light neutrals, functional forms, quiet typography, natural texture, generous whitespace, humane copy; avoid defaulting into generic beige minimalism. `[S80]`
- Japanese minimalism/wabi-sabi: asymmetry, imperfection, natural material, negative space, restrained color, careful ritual-like pacing; avoid stereotyping or appropriative imagery. `[S79]` `[S82]`
- Editorial/broadsheet: hairline rules, dense columns, serif display, captions/section logic, high information density; use for news/analysis/longform authority. `[S15]` `[S80]`
- Editorial caution: numbered markers/eyebrows must encode actual sequence/section semantics, not decorate every heading. `[S15]`
- Grunge/anti-design: torn edges, photocopy texture, irregular type, visible noise, deliberate misalignment; use where rebellion/underground authenticity is truthful. `[S80]`
- Grunge caution: never sacrifice body readability, focus order, or state clarity for texture. `[S60]`
- Y2K/retro-futurism: chrome, translucency, pixel/bitmap type, glossy highlights, optimistic techno-color; use as a period language, not random nostalgia. `[S80]`
- Cyberpunk/terminal: dark environment, scanlines/CRT texture, mono type, saturated signal color, dense instrumentation; use for technical/game contexts only when justified. `[S15]` `[S80]`
- Vaporwave/synthwave: gradients, sunset grids, retro neon, surreal nostalgia; high recognizability means high cliché risk unless subverted by subject-specific content. `[S80]`
- Maximalism/collage: layered ephemera, mixed scale/type, sticker overlays, dense sensory composition; use when abundance is the message. `[S80]`
- Maximalism caution: preserve one reading path and state hierarchy; maximalism is orchestration, not random clutter. `[S47]`
- Minimalism: remove nonessential elements, use few materials/colors/type sizes, let negative space and exact alignment carry quality. `[S47]` `[S80]`
- Minimalism caution: blankness is not minimalism; empty or under-explained interfaces fail usability. `[S51]`
- Material/flat: semantic color roles, elevation/state layers, consistent component geometry, motion continuity; strong default for product systems. `[S63]` `[S65]`
- Skeuomorphism: realistic texture/controls that leverage object familiarity; appropriate only when metaphor materially aids comprehension. `[S80]`
- Neumorphism: low-contrast extruded soft surfaces; accessibility risk is intrinsic, so avoid for critical controls or use only as decorative nonessential texture. `[S60]` `[S80]`
- Glassmorphism: translucency/blur over rich backgrounds; use to communicate layering/depth, never as generic decoration or over text-critical content without measured contrast. `[S16]` `[S60]`
- Claymorphism/soft 3D: inflated rounded forms, inner/outer softness, friendly depth; use selectively for playful consumer surfaces. `[S80]`
- Bento/grid cards: modular rectangular compartments with varied spans and clear content hierarchy; effective for feature/system summaries but currently overused. `[S15]` `[S80]`
- Industrial/blueprint/technical drawing: grid paper, annotation lines, precise dimensions, restrained mono text, schematic icons; ideal when engineering/process truth is central. `[S80]`
- Risograph/print: limited ink palette, registration offset, grain, overprint; use for warmth/craft/editorial individuality while keeping digital contrast compliant. `[S60]` `[S80]`
- Biophilic/organic: natural contours, layered depth, subdued earth/plant palette, texture; derive forms from actual subject imagery rather than blob clip-path clichés. `[S16]` `[S80]`
- Game/UI diegetic: interface elements embedded in world materials/instruments; prioritize readability, input speed, HUD legibility, localization expansion, and reduced motion. `[S67]`
- Email/print/terminal/TUI are not “movements” but media constraints; design language must translate through limited color/type/layout primitives rather than pasted web effects.

### 5.3 Type pairing and typography practice

- Start with the primary text face and content job; choose a second face only for a clear role such as display, data, code, or editorial contrast. `[S68]` `[S71]`
- One family is often enough, especially product UI; a variable family with width/weight/optical axes can supply contrast without visual conflict. `[S15]` `[S69]`
- Superfamilies are the safest pairing because serif/sans/mono companions share skeletons and metrics while preserving clear role separation. `[S69]`
- If using two families, make them clearly distinct in skeleton/proportion/role; near-identical sans pairings look accidental. `[S68]` `[S71]`
- Avoid pairing by trend list alone. Evaluate x-height, aperture, contrast, spacing, numerals, punctuation, diacritics, script coverage, hinting/rendering, license, and variable axes. `[S68]` `[S82]`
- Decorative/display faces belong at large sizes and short strings; do not use them for buttons, labels, body, form fields, or dense data. `[S16]` `[S68]`
- Set a deliberate scale with clear hierarchy steps; product UI generally needs tighter ratios around 1.125–1.2 while editorial/brand surfaces can carry stronger contrast. `[S16]` `[S70]`
- Body line length should generally stay around 60–75/80 Latin characters depending on platform/context; mobile measure is naturally shorter but must not become cramped. `[S15]` `[S70]`
- Serif body generally tolerates slightly longer measure and benefits from more line-height than comparable sans text. `[S15]` `[S70]`
- Use font weight/size/spacing/color as a coordinated hierarchy; do not rely on color alone or random bolding. `[S65]` `[S71]`
- Use tabular/monospaced numerals for aligned data, prices, timers, and metrics so changing digits do not cause layout jitter. `[S16]` `[S70]`
- Avoid tight tracking in body; reserve negative tracking cautiously for large display type and never sacrifice legibility. `[S16]` `[S70]`
- Do not use all-caps/tracked-out labels as a default eyebrow; when caps are semantically appropriate, control size/letterspacing/contrast deliberately. `[S15]` `[S20]`
- Balance headings without creating stranded words through fragile manual nonbreaking hacks; use platform-supported balancing as progressive enhancement. `[S18]` `[S70]`
- Specify fallback stacks per script and platform (`system-ui`, platform serif/sans/mono, Noto or equivalent coverage) with metric-compatible choices where possible. `[S68]` `[S82]`
- Preload only critical font files, use appropriate font-display behavior, reserve layout space, and avoid loading every weight/axis by default. `[S18]` `[S70]`

### 5.4 Color systems: OKLCH, APCA, semantic roles

- Define semantic roles first: background/surface/foreground/muted/primary/on-primary/accent/success/warning/error/info/focus/border/scrim/chart series. `[S65]` `[S72]`
- Use color to encode state and hierarchy, not decoration; every accent must have a job and a corresponding accessible foreground. `[S65]` `[S60]`
- Build palettes as ramps with stable semantic positions rather than isolated hex picks; include hover/focus/active/selected/disabled and dark/light variants together. `[S65]` `[S72]`
- OKLab/OKLCH are perceptually oriented spaces useful for smooth ramps because lightness/chroma/hue are more meaningful than HSL's device-centric channels. `[S78]`
- Do not assume equal OKLCH lightness means equal contrast across hue/chroma; validate actual foreground/background pairs. `[S60]` `[S78]`
- Watch gamut clipping: high-chroma OKLCH colors may not exist in sRGB and must be mapped/clamped intentionally for each target medium. `[S73]` `[S78]`
- Keep hue/chroma consistent enough for system coherence, but vary lightness/desaturation for dark mode rather than inverting or simply dimming everything. `[S65]` `[S18]`
- APCA models perceived contrast more closely than the WCAG 2.x ratio for many conditions, but its own documentation says WCAG 3 compliance does not exist until the standard is official. `[S76]` `[S77]`
- Use APCA as a supplemental design aid for readable polarity/size/weight decisions while enforcing WCAG 2.2 AA/AAA legal/conformance requirements. `[S60]` `[S76]`
- Do not use red/green or hue-only encodings; pair color with icon/text/pattern/shape/position. `[S57]` `[S18]`
- Build chart palettes using colorblind-aware categorical sequences plus direct labels/patterns; data color must meet visibility requirements against background/grid. `[S57]` `[S18]`
- Check focus ring, selection, caret, scrollbar, placeholder, disabled text, border, overlay scrim, and pressed/selected states explicitly; these are routinely missed. `[S16]` `[S57]`
- Test both themes independently. A passing light-mode pair proves nothing about dark mode or elevated surfaces. `[S18]` `[S65]`

### 5.5 DTCG tokens and multi-platform export

- DTCG 2025.10 is a Final Community Group Report/Candidate-Recommendation-style stable specification intended for implementation, but explicitly not a W3C Standard or Standards Track document. `[S72]` `[S74]`
- Token files are JSON; recommended media type is `application/design-tokens+json`, with `application/json` acceptable because every token file is valid JSON. `[S72]`
- Recommended file extensions are `.tokens` and `.tokens.json`; use `.tokens.json` for editor compatibility unless there is a reason otherwise. `[S72]`
- A token minimally associates a human-readable name with a value; object form uses `$value`, with `$type`, `$description`, `$deprecated`, `$extensions` used for typing/documentation/lifecycle/tool metadata. `[S72]`
- Reserved properties begin with `$`; unknown non-`$` keys can represent groups/tokens according to structure, while extensions belong under `$extensions` so tools preserve them. `[S72]`
- Groups are organizational and should not be used by tools to infer type/purpose; put shared `$type` inheritance deliberately when supported. `[S72]`
- Aliases/references let one semantic token resolve to another underlying value; reject circular references and document resolution behavior. `[S72]` `[S75]`
- Secondary guides report that 2025.10 adds `$ref`/JSON Pointer alongside curly-brace references; verify this in the primary spec before implementing because extraction was incomplete here. `[S72]`
- Color token object requires `colorSpace` and `components`; optional `alpha` defaults to opaque and optional `hex` is a six-digit fallback. `[S73]`
- Supported color spaces include sRGB/sRGB-linear/HSL/HWB/LAB/LCH/OKLab/OKLCH-style values; component ranges differ by space and `none` can represent missing hue components. `[S73]`
- Composite tokens represent closely coupled values such as shadows/typography; use them sparingly because platform compilers differ in support. `[S72]` `[S75]`
- Use a layered architecture: primitive palette scales → semantic theme roles → component aliases → platform output. Never let components reference raw primitive hex when a semantic role exists. `[S65]` `[S72]`
- Include units/dimension semantics explicitly rather than embedding strings without meaning; translation tools need typed values to emit pt/dp/sp/rem/px correctly. `[S72]` `[S75]`
- Version token schema and theme metadata; record light/dark/high-contrast/RTL/density/motion-reduction variants as explicit modes rather than ad-hoc duplication. `[S72]` `[S75]`
- Style Dictionary deep-merges source token files, resolves references such as `{dimensions.4}`, transforms values per platform, and outputs platform-specific artifacts. `[S75]`
- Use Style Dictionary or equivalent translation layer to generate CSS custom properties, SCSS/Sass, JS/TS objects, Swift/SwiftUI constants, Kotlin/Compose values, XML resources, Flutter/Dart constants, Qt/QML constants, Python dictionaries/theme config, terminal palettes, email-safe CSS variables/fallbacks, and engine-native game UI themes. `[S75]`
- Treat compiler support gaps as explicit warnings rather than silently dropping token types. Validate emitted artifacts in CI. `[S72]` `[S75]`
- Node/browser-heavy token tooling should not block non-JS users; provide prebuilt reference outputs and document regeneration as optional. `[S75]`

### 5.6 Imagery, layout, motion, copy

- Use real product UI, real photographs, real documents/data, and user-provided assets before stock or generated imagery; every stand-in must be disclosed and easy to replace. `[S19]` `[S20]`
- Never invent testimonials, customer counts, metrics, logos, credentials, reviews, prices, or “trusted by” proof. Absence is a marked blank, not a hallucination opportunity. `[S15]` `[S20]`
- Composition should derive from the visitor/user job and material: proof near claims, action at decision point, content hierarchy matching actual importance. `[S20]` `[S67]`
- Vary compositions structurally: full-bleed object, split utility, editorial index, instrument panel, archive/table, timeline, spatial scene, comparison, live artifact, letter/manifesto—not just hero + cards. `[S20]` `[S22]`
- Preserve strong alignment and shared edges even in expressive layouts; chaos must be intentional and readable. `[S19]` `[S47]`
- Motion should answer user action, preserve spatial continuity, expose causality, or direct attention once; decoration without information is noise. `[S62]` `[S66]`
- Prefer transform/opacity/compositor-safe properties on web; avoid animating layout properties that cause reflow, and never use `transition: all`. `[S20]` `[S66]`
- Respect reduced motion by stopping/softening nonessential movement while keeping all content visible and functional. `[S57]` `[S62]`
- Copy is interface material: concise nouns/verbs, sentence case, active voice, consistent action names, no filler or marketing fog. `[S15]` `[S19]`
- Buttons say exactly what happens (“Save changes”, “Book a table”), not generic “Submit”; success/undo copy uses the same verb. `[S15]` `[S47]`
- Errors name cause and recovery; empty states invite action; loading states name what is happening; helper text prevents errors. `[S15]` `[S49]` `[S51]`
- Lint copy for stock phrases, repeated rhetorical devices, buzzwords, unexplained jargon, template residue, culturally insensitive assumptions, and machine-translated tone. `[S19]` `[S31]`
- Design the browser/system chrome you do not draw: selection, caret, focus ring, scrollbars, disabled states, underlines, spelling markers, tabular numerals where applicable. `[S16]`

## 6. Recommended Pixelcraft architecture

### 6.1 Pack topology

- `pixelcraft`: thin orchestrator, mode/platform detection, shared generation loop, routing table, floor invariants, final reporting contract.
- `pixelcraft-visual-direction`: divergence engine, subject/material analysis, design movements, typography/color/imagery/motion/menu catalogs, history fingerprinting.
- `pixelcraft-ux-review`: Nielsen/laws/cognitive-load/forms/navigation/state/persona critique workflow and severity taxonomy.
- `pixelcraft-accessibility`: WCAG 2.2 semantic floor, platform translations, automated/manual verification split, assistive-technology smoke scripts.
- `pixelcraft-tokens`: DTCG authoring, schema validation, theme/mode layering, Style Dictionary/export adapters and token provenance.
- `pixelcraft-web`: DOM/browser implementation idioms, responsive rendering validation, semantic HTML, CSS constraints, server-rendered/framework notes.
- `pixelcraft-mobile`: SwiftUI/Compose/Flutter/React Native platform translation, safe areas, dynamic type/sp scaling, navigation gestures, target sizes.
- `pixelcraft-python-ui`: Streamlit/Gradio/Reflex/NiceGUI constraints, state reruns, component limitations, accessible labeling, layout/theme customization escape hatches.
- `pixelcraft-desktop`: Qt/QML/Tauri/native desktop/windows/menu/keyboard/high-DPI/multiwindow/resizable layout guidance.
- `pixelcraft-tui`: Textual/Ratatui terminal constraints: grid, keyboard-first navigation, focus/selection semantics, color/unicode fallbacks, width/height adaptation.
- `pixelcraft-email`: table/inline-CSS/client quirks, dark-mode behavior, accessibility, image blocking/alt text, narrow mobile rendering, plaintext parity.
- `pixelcraft-game-ui`: HUD legibility, diegetic/non-diegetic tradeoffs, input latency, controller/keyboard/touch navigation, localization expansion, safe-area/platform certification constraints.
- Shared `references/` and `assets/` can be duplicated only at release into each installable folder if cross-skill relative reads are unreliable; document the mechanism and do not hand-maintain copies. `[S11]` `[S18]`

### 6.2 Orchestrator contract

- Begin with authority order: explicit user/brief → existing project design system/tokens → platform conventions/legal/accessibility floor → Pixelcraft guidance → model taste. `[S20]` `[S21]`
- Never overwrite an existing visual identity because it resembles a tell; evaluate whether it is deliberate, documented, or part of a live brand. `[S20]` `[S21]`
- Detect project stack and surface from files/dependencies but ask when uncertain; never silently assume Tailwind/React/web. `[S18]`
- Classify mode: Persuade, Operate, Read, Experience, Play/Immersive, Communicate (email/docs), or hybrid; scale expressiveness accordingly. `[S16]`
- Inventory real material and missing facts before ideation; prohibit invented proof unless explicitly labeled placeholder/assumption approved by the user. `[S19]` `[S20]`
- Generate divergent directions only after constraints are extracted; otherwise divergence becomes arbitrary decoration. `[S28]`
- Output a compact direction card before implementation: subject rationale, tokens, type, color posture, composition, motion, imagery, UX risks, i18n implications, validation plan. `[S15]` `[S72]`
- Preserve a decision/history record inside project memory/design docs so subsequent screens remain coherent but not identical. `[S19]` `[S20]`
- Use platform adapter references after direction selection; core direction must not contain CSS-only assumptions. `[S01]`
- Report uncertainty honestly: distinguish “verified in rendered output”, “static inspection only”, “model judgment”, “not checked”, and “waived because brief requires it”. `[S19]` `[S20]`

### 6.3 Mandatory cross-platform floor

- Truthfulness: no invented facts/proof/assets; missing facts visibly marked or omitted. `[S15]` `[S20]`
- Accessibility: semantic controls, labels/names, keyboard/focus operability, contrast floor, reduced-motion path, text scaling/reflow, no color-only meaning. `[S57]`
- Interaction: visible feedback, target/input modality appropriateness, cancellation/undo/escape, no conflicting gestures, state completeness. `[S47]` `[S62]` `[S63]`
- Responsiveness/adaptation: layout restructures across sizes/orientations/input modes; never clips/overlaps/horizontal-scrolls unintentionally. `[S18]` `[S62]` `[S64]`
- Localization: expansion/contraction, directionality, scripts/fonts, input composition, plural/gender/case, locale formatting, culturally appropriate copy/imagery. `[S81]` `[S82]`
- Performance: fast acknowledgment, stable layout, asset budgets, appropriate loading/progress, nonblocking interaction. `[S48]` `[S52]` `[S63]`
- Robustness: zero/one/many/long/missing/error/offline/permission/interruption/concurrency states. `[S16]` `[S18]`
- Coherence: semantic tokens, consistent hierarchy/affordances/components/motion/iconography/copy within each surface. `[S47]` `[S65]`
- Distinctiveness: at least one deliberate subject-specific design commitment when mode permits, with repetition history checked. `[S15]` `[S20]`
- Verifiability: every claim of compliance names evidence and method; no visual check is claimed when only code was read. `[S20]`

### 6.4 Validation and evaluation harness

- Layer 1 deterministic schema/config validation: skill frontmatter, DTCG schema, token references/cycles, forbidden raw values, missing metadata. `[S01]` `[S72]`
- Layer 2 static semantic analysis: labels, focus removal, placeholders-as-labels, blocked paste, color literals, missing autocomplete/input types, `transition: all`, reduced-motion absence. `[S21]` `[S24]`
- Layer 3 rendered/device validation: browser/mobile/desktop screenshots or snapshots at narrow/wide/text-scaled/RTL/dark/high-contrast/reduced-motion states where available. `[S19]` `[S20]`
- Layer 4 accessibility automation: axe-like rule engines for web plus platform-specific accessibility inspectors; record manually untested criteria. `[S57]` `[S88]`
- Layer 5 behavior tests: forms preserve input, focus moves correctly, keyboard path completes task, drag alternative works, double-submit prevented, offline/error recovery. `[S47]` `[S57]`
- Layer 6 heuristic critic: structured LLM/rubric review using screenshots/snapshots and code facts; cite evidence per finding and confidence. `[S36]` `[S43]`
- Layer 7 persona simulation: novice/expert/accessibility/mobile/non-native/stress-user paths, explicitly labeled hypothesis generation. `[S16]` `[S42]`
- Layer 8 diversity measurement: pairwise similarity of repeated outputs across layout tokens, color/type choices, embedding similarity, copy similarity, and human spot labels. `[S28]` `[S29]` `[S33]`
- Layer 9 human review: small sample adjudication for calibration; use human preference only as one axis, never to override floor violations. `[S37]` `[S44]`
- Evaluation fixtures should cover every target stack, at least two writing directions/scripts, multiple density/mode classes, empty/error states, existing design systems, and greenfield/brownfield cases.
- Publish reproducibility metadata: model, temperature/settings, skill version, fixture hash, tool versions, platform/runtime, locale, random seed/deal choices, and screenshots.

### 6.5 Implementation sequence

1. Build citation-backed content inventory and normalize it into focused reference files; remove generic advice the model already knows. `[S03]`
2. Author `pixelcraft` orchestrator under 500 lines with routing only; validate frontmatter/discovery. `[S01]`
3. Implement token schema + minimal validator first because it is deterministic, cross-platform, and reusable. `[S72]` `[S75]`
4. Implement visual-direction catalog as data (movement/constraints/taboos/platform transferability) rather than hardcoded prompts. `[S79]` `[S80]`
5. Implement UX/accessibility floor as separate concise checklists keyed by surface/platform/input modality. `[S47]` `[S57]`
6. Implement web adapter and rendered verification because it is easiest to validate end-to-end. `[S19]` `[S20]`
7. Add Python UI/TUI/email adapters next because they are underserved and their constraints differ sharply from DOM assumptions.
8. Add mobile/desktop/game adapters with explicit capability detection; do not pretend simulator/device verification exists when unavailable. `[S16]` `[S62]` `[S63]`
9. Build a golden evaluation corpus and report per-axis metrics; tune content against failures rather than adding more prose reflexively. `[S35]` `[S36]`
10. Only after evidence of stability, package Claude marketplace/plugin metadata and installer smoke tests for `npx skills`/`gh skill install`. `[S04]` `[S08]` `[S10]`

### 6.6 Risks and open questions

- Agent Skills implementations are changing rapidly; global paths, slash invocation, hooks, allowed tools, and plugin behavior must be retested before each release. `[S07]` `[S08]` `[S12]`
- Cross-skill resource reuse is not standardized; duplicating shared references increases install size/version drift, while relative cross-links may fail outside repository layout. `[S01]` `[S11]`
- A fixed movement/theme catalog can become the next monoculture; solve with subject-derived generation, wildcard candidates, rotation history, and community-contributed versioned packs. `[S20]` `[S28]`
- LLM judges can amplify the same biases they evaluate; use deterministic evidence and human calibration. `[S43]` `[S44]`
- APCA/WCAG 3 status is unsettled; do not claim compliance beyond WCAG 2.2. `[S76]` `[S77]`
- DTCG compiler support is uneven during ecosystem migration; validate exact syntax before relying on advanced token types or `$ref`. `[S72]` `[S75]`
- Game UI/email/TUI evidence is thinner than web/mobile evidence; recruit domain reviewers before publishing authoritative constraints.
- International UX cannot be fully encoded in generic rules; local review and locale-specific fixture users are essential. `[S31]` `[S82]`

## 7. Source registry

- `[S01]` Agent Skills specification — https://agentskills.io/specification
- `[S02]` Anthropic Agent Skills overview — https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- `[S03]` Anthropic skill authoring best practices — https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- `[S04]` Claude marketplace reference — https://code.claude.com/docs/en/plugins/marketplace-reference
- `[S05]` Claude plugin manifest reference — https://code.claude.com/docs/en/plugins/manifest-reference
- `[S06]` Cursor Agent Skills — https://cursor.com/docs/skills
- `[S07]` Gemini CLI creating skills — https://geminicli.com/docs/cli/creating-skills/
- `[S08]` GitHub CLI `gh skill install` — https://cli.github.com/manual/gh_skill_install
- `[S09]` Vercel skills CLI repository — https://github.com/vercel-labs/skills/
- `[S10]` Vercel skills CLI command reference — https://github.com/vercel-labs/skills/blob/main/docs/commands.md
- `[S11]` Vercel skills creating/discovery guide — https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md
- `[S12]` Vercel supported agents/compatibility — https://github.com/vercel-labs/skills/blob/main/docs/agents.md
- `[S13]` OpenAI/ChatGPT build skills — https://developers.openai.com/plugins/build/skills
- `[S14]` GitHub Copilot Agent Skills concepts — https://docs.github.com/en/copilot/concepts/customizations/agent-skills
- `[S15]` Anthropic frontend-design skill — https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- `[S16]` Impeccable repository — https://github.com/PBakaus/impeccable
- `[S17]` Impeccable documentation site — https://impeccable.style/docs/
- `[S18]` UI UX Pro Max skill — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/
- `[S19]` taste-skill — https://github.com/Leonxlnx/taste-skill/
- `[S20]` Hallmark — https://github.com/Nutlope/hallmark
- `[S21]` sloplint — https://github.com/callmehai/sloplint
- `[S22]` Frontend Design Masterclass — https://github.com/aaaronmiller/frontend-design-masterclass
- `[S23]` shadcn skill — https://github.com/shadcn/ui/blob/main/skills/shadcn/SKILL.md
- `[S24]` Vercel web-design guidelines — https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md
- `[S25]` Adrian Krebs, Design Slop — https://www.adriankrebs.ch/blog/design-slop/
- `[S26]` Padmakumar & He, output diversity — https://arxiv.org/abs/2309.05196
- `[S27]` RLHF diversity reduction paper — https://proceedings.iclr.cc/paper_files/paper/2024/file/5a68d05006d5b05dd9463dd9c0219db0-Paper-Conference.pdf
- `[S28]` Verbalized Sampling — https://arxiv.org/abs/2510.01171
- `[S29]` Homogenization Effects on Creative Ideation — https://dl.acm.org/doi/fullHtml/10.1145/3635636.3656204
- `[S30]` ChatGPT decreases idea diversity — https://www.nature.com/articles/s41562-025-02173-x
- `[S31]` Cross-cultural homogenization — https://arxiv.org/html/2409.11360v3
- `[S32]` Model collapse, Nature 2024 — https://www.nature.com/articles/s41586-024-07566-y
- `[S33]` Measuring AI slop — https://arxiv.org/html/2509.19163v1
- `[S34]` AI-generated UIs/accessibility/homogenization — https://dl.acm.org/doi/10.1145/3715336.3735691
- `[S35]` Design2Code — https://arxiv.org/abs/2403.03163
- `[S36]` UICrit dataset/paper — https://arxiv.org/abs/2407.08850
- `[S37]` WebDev Arena — https://arena.ai/blog/webdev-arena
- `[S38]` WebGen-Bench — https://arxiv.org/abs/2505.03733
- `[S39]` ArtifactsBench — https://arxiv.org/abs/2507.04952
- `[S40]` DesignBench — https://arxiv.org/abs/2506.06251v1
- `[S41]` FrontendBench — https://arxiv.org/abs/2506.13832
- `[S42]` UXAgent — https://arxiv.org/abs/2504.09407
- `[S43]` GPT-4o heuristic evaluation comparison — https://arxiv.org/abs/2506.16345
- `[S44]` Usability automation systematic review — https://arxiv.org/abs/2504.01415
- `[S45]` ChatGPT accessible-code study — https://dl.acm.org/doi/full/10.1145/3677846.3677854
- `[S46]` CodeA11y — https://dl.acm.org/doi/full/10.1145/3706598.3713335
- `[S47]` Nielsen ten usability heuristics — https://www.nngroup.com/articles/ten-usability-heuristics/
- `[S48]` Nielsen response-time limits — https://www.nngroup.com/articles/response-times-3-important-limits/
- `[S49]` NN/g form error guidelines — https://www.nngroup.com/articles/errors-forms-design-guidelines/
- `[S50]` NN/g web form design — https://www.nngroup.com/articles/web-form-design/
- `[S51]` NN/g empty states — https://www.nngroup.com/articles/empty-state-interface-design/
- `[S52]` NN/g skeleton screens — https://www.nngroup.com/articles/skeleton-screens/
- `[S53]` NN/g progress indicators — https://www.nngroup.com/articles/progress-indicators/
- `[S54]` Baymard adaptive validation messages — https://baymard.com/research-articles/adaptive-validation-error-messages
- `[S55]` Baymard inline validation — https://baymard.com/research-articles/inline-form-validation
- `[S56]` Baymard checkout fields — https://baymard.com/research-articles/checkout-flow-average-form-fields
- `[S57]` WCAG 2.2 specification — https://www.w3.org/TR/WCAG22/
- `[S58]` WCAG 2.2 quick reference — https://www.w3.org/WAI/WCAG22/quickref/
- `[S59]` Understanding target size minimum — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- `[S60]` Understanding contrast minimum — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- `[S61]` Understanding focus visible — https://www.w3.org/WAI/WCAG22/Understanding/focus-visible
- `[S62]` Apple Human Interface Guidelines — https://developer.apple.com/design/human-interface-guidelines/
- `[S63]` Material 3 usability — https://m3.material.io/foundations/usability/overview
- `[S64]` Material 3 density — https://m3.material.io/foundations/layout/grids-spacing/density
- `[S65]` Material 3 color system — https://m3.material.io/styles/color/system
- `[S66]` Material 3 motion — https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration
- `[S67]` Laws of UX — https://lawsofux.com/laws/
- `[S68]` Google Fonts pairing typefaces — https://fonts.google.com/knowledge/choosing_type/pairing_typefaces
- `[S69]` Google Fonts superfamilies — https://fonts.google.com/knowledge/choosing_type/pairing_typefaces_within_a_family_superfamily
- `[S70]` Google Fonts measure/line length — https://fonts.google.com/knowledge/using_type/understanding_measure_line_length
- `[S71]` NN/g typeface pairing — https://www.nngroup.com/articles/pairing-typefaces/
- `[S72]` DTCG Format Module 2025.10 — https://www.designtokens.org/tr/2025.10/format/
- `[S73]` DTCG Color Module 2025.10 — https://www.designtokens.org/tr/2025.10/color/
- `[S74]` DTCG stable specification announcement — https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
- `[S75]` Style Dictionary — https://styledictionary.com/
- `[S76]` APCA in a Nutshell — https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html
- `[S77]` APCA minimum compliance — https://git.apcacontrast.com/documentation/minimum_compliance.html
- `[S78]` OKLab/OKLCH original article — https://bottosson.github.io/posts/oklab/
- `[S79]` Metropolitan Museum, Design 1925–50 — https://www.metmuseum.org/essays/design-1925-50
- `[S80]` Interaction Design Foundation design styles guide — https://www.interaction-design.org/literature/article/a-guide-to-design-styles-and-movements
- `[S81]` Unicode CLDR — https://cldr.unicode.org/
- `[S82]` W3C Internationalization — https://www.w3.org/International/
- `[S83]` MDN CSS logical properties — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- `[S84]` NN/g mobile input checklist — https://www.nngroup.com/articles/mobile-input-checklist/
- `[S85]` NN/g placeholder text in forms — https://www.nngroup.com/articles/form-design-placeholders/
- `[S86]` W3C WCAG 2.2 new criteria overview — https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- `[S87]` WAI-ARIA Authoring Practices modal dialog — https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- `[S88]` axe-core accessibility engine — https://github.com/dequelabs/axe-core
- `[S89]` How AI ideas affect creativity/diversity/evolution — https://arxiv.org/abs/2401.13481
- `[S90]` ChatGPT/Codex build skills — https://learn.chatgpt.com/docs/build-skills

## 8. Immediate implications for the next implementation step

- Start with `pixelcraft` + `pixelcraft-tokens` + one validator; do not boil the ocean by writing all platform modules first.
- Treat this document as source material, not as content to paste wholesale into skills; compress ruthlessly because context is a public good. `[S03]`
- Before implementation, inspect primary documentation again for Copilot/OpenAI packaging because those ecosystems change quickly and this report could not fully verify every current subpage.
- Require every future claim in user-facing docs to carry either a primary citation, a measured fixture result, or an explicit “heuristic/opinion” label.
- Maintain a living decision log of what Pixelcraft intentionally does not copy from competitors: rigid page shapes, web-only assumptions, catalog-only taste, unbounded agent loops, and unverifiable compliance claims.
