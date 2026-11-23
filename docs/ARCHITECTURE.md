# Pixelcraft architecture

Pixelcraft is a pack of portable Agent Skills (`skills/<name>/SKILL.md`) that makes coding agents
produce distinctive UI and rigorous UX on **any** frontend stack. Evidence base: `docs/RESEARCH.md`
(cite as `[Sxx]`).

## Product thesis

1. **Divergence before commitment** — LLM UIs converge because single-shot "best design" prompting
   collapses to the mode `[S26–S30]`. Pixelcraft forces a distribution of 3–5 far-apart directions,
   scores them against the brief, commits to one, and records history so the next build differs.
2. **A hard floor that never dictates appearance** — truthfulness, accessibility, state coverage,
   localization, responsiveness, performance and verifiability are mandatory; heroes, cards,
   palettes, fonts and layout shapes are not.
3. **Design once, translate per stack** — core skills speak design language (roles, scales, units,
   rules). Platform skills translate them into idioms of web, mobile, Python UI, desktop, TUI, email
   and game UI. Never assume React/Tailwind.
4. **Honest verification** — every claim names its evidence: rendered, static inspection,
   model judgment, not checked, or waived.

## Authority order

explicit user brief → existing project design system/tokens → platform conventions + legal +
accessibility floor → Pixelcraft guidance → model taste.

## Skills

| Skill | Role |
|---|---|
| `pixelcraft` | Orchestrator: detect stack + surface mode, run the loop, route to other skills, final report contract |
| `pixelcraft-direction` | Divergence engine: brief/material extraction, verbalized-sampling directions, movement catalog, signature element, slop fingerprints, history |
| `pixelcraft-craft` | Visual craft: typography, color (OKLCH, contrast), layout/composition, motion, imagery, iconography |
| `pixelcraft-tokens` | DTCG 2025.10 tokens, theming/modes, export to CSS/Tailwind/Swift/Compose/Flutter/Python/Qt/Textual |
| `pixelcraft-ux` | UX before and during build: JTBD, flows, IA, full state coverage, forms, feedback, navigation, cognitive load, i18n, UX writing |
| `pixelcraft-accessibility` | WCAG 2.2 floor + platform translations (HIG, Material, desktop, TUI, email, game) and verification split |
| `pixelcraft-review` | Audit / critique / polish: heuristic scoring with evidence + confidence, persona walkthroughs, slop scan script |
| `pixelcraft-web` | HTML/CSS, React/Next, Vue/Nuxt, Svelte, Solid, Angular, Astro, Qwik, htmx/Alpine, Lit, server-rendered (Rails, Laravel, Django, Phoenix, Blazor, templ) |
| `pixelcraft-mobile` | SwiftUI, UIKit, Jetpack Compose, Flutter, React Native/Expo, KMP, Ionic, .NET MAUI |
| `pixelcraft-python-ui` | Streamlit, Gradio, Reflex, NiceGUI, Dash, Panel, Shiny, Flet, Kivy, Jupyter widgets |
| `pixelcraft-desktop` | Tauri, Electron, Qt/PySide/QML, WinUI/WPF, AppKit, GTK, Avalonia, Rust GUIs (egui, Slint, Dioxus) |
| `pixelcraft-tui` | Textual, Rich, Ink, Bubble Tea, Ratatui |
| `pixelcraft-email` | HTML email / MJML / React Email: tables, inline CSS, dark mode, image blocking, plaintext parity |
| `pixelcraft-game-ui` | Unity UI Toolkit, Godot, Unreal UMG: HUD legibility, controller nav, safe areas, localization |
| `pixelcraft-brandkit` | Premium brand-kit / identity-board image generation (art direction for image models) |

Each skill is self-contained (installable alone). Skills refer to each other **by name**
("use the `pixelcraft-ux` skill"), never by relative path across skill folders.
Platform skills keep one reference file per framework (`references/<framework>.md`) so they scale to
many stacks via progressive disclosure.

## The Pixelcraft loop (owned by `pixelcraft`)

1. **Frame** – stack + surface detection, mode (Persuade / Operate / Read / Experience / Play /
   Communicate), audience, job-to-be-done, real material inventory, existing design system.
2. **Diverge** – `pixelcraft-direction`: 3–5 directions with probabilities, scored; pick; log why
   others lost; check history.
3. **Specify** – direction card + tokens (`pixelcraft-tokens`) + UX plan (flows + state matrix,
   `pixelcraft-ux`).
4. **Build** – via the platform skill; floor rules applied by default, not repaired later.
5. **Verify** – `pixelcraft-review`: slop scan, a11y checks, rendered screenshots where possible,
   heuristic critique, persona walkthrough.
6. **Report** – what was verified and how, open risks, decisions.

## Conventions for SKILL.md

- Frontmatter: `name` (= folder name, lowercase-hyphen, ≤64 chars) and `description`
  (third person, what + when + trigger words, ≤1024 chars). Optional `license`, `metadata`.
  No host-specific fields.
- Body ≤ 500 lines (target ≤ 300). Depth in `references/*.md`, one level deep, each linked from
  SKILL.md with a one-line "read when…".
- Imperative, concrete, checkable rules. Do not restate what models already know.
  Prefer tables, checklists, do/don't pairs with code in the target idiom.
- Scripts: Node ≥ 18, zero dependencies, `.mjs`, runnable as `node scripts/x.mjs --help`.

## Repository layout

```
skills/<skill>/SKILL.md, references/, scripts/, assets/
bin/pixelcraft.mjs          # installer CLI: npx pixelcraft add [skills…] --agent <host>
scripts/validate-skills.mjs # CI lint for skills
.claude-plugin/marketplace.json
docs/ARCHITECTURE.md, docs/RESEARCH.md
examples/                   # golden fixtures (later)
```
