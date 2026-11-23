---
name: pixelcraft
description: Orchestrates distinctive, evidence-verified UI work across any frontend stack. Use when designing, building, redesigning, auditing, or polishing interfaces, pages, screens, components, emails, terminal UI, game UI, or app shells. Detects the stack and surface mode, runs the six-step Pixelcraft loop, routes to named Pixelcraft skills, applies the mandatory cross-platform floor, and produces an evidence-labeled final report.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft orchestrator

Use this skill first whenever the task creates or changes a user-facing interface. It coordinates other Pixelcraft skills by name; each skill is independently installable and intentionally not imported by path.

## Authority order

Apply constraints in this order and stop at the first conflict:

1. explicit user brief;
2. existing project design system, tokens, components, content, and conventions;
3. platform conventions, legal requirements, and the accessibility floor;
4. Pixelcraft guidance;
5. model taste.

Never override a user or project decision because it resembles a common pattern. Flag conflict instead of silently replacing it.

## References

- Read [references/stack-detection.md](references/stack-detection.md) when identifying the frontend stack, rendering surface, input modality, or existing design system.
- Read [references/floor.md](references/floor.md) before implementation and again before reporting; every rule is mandatory unless the user explicitly waives it.
- Read [references/report-template.md](references/report-template.md) before the final response or handoff.

## Frame before designing

Classify the surface using evidence in the repository rather than assumptions:

| Mode | User success | Expression budget | Typical surfaces |
|---|---|---|---|
| Persuade | understand or choose an offering | highest | landing pages, campaigns, portfolios |
| Operate | complete a task efficiently | restrained, earned familiarity | dashboards, settings, forms, admin/product UI |
| Read | comprehend content | typography and measure first | docs, editorial, reports |
| Experience | inhabit a memorable artifact | high but controlled | exhibitions, interactive stories, launches |
| Play | play, explore, or compete | high within legibility/HUD constraints | games, toys, playful education |
| Communicate | receive a clear message across clients/locales | constrained by medium | email, notifications, documents |

Hybrid surfaces pick one primary mode per screen or region. Do not let a persuasive visual system leak into high-frequency operational UI.

## The six-step Pixelcraft loop

1. **Frame** — detect stack/surface/input modality; identify audience, job-to-be-done, real material inventory, constraints, locale scope, and existing design system. Ask only for information that materially changes the design.
2. **Diverge** — use the `pixelcraft-direction` skill to generate 3–5 far-apart directions with probabilities, score them, select one, record why the others lost, and inspect repetition history.
3. **Specify** — produce the direction card; use `pixelcraft-tokens` for DTCG tokens and `pixelcraft-ux` for flows plus the state matrix. Do not start with component trivia before direction and constraints exist.
4. **Build** — use the appropriate platform skill by name when installed (`pixelcraft-web`, `pixelcraft-mobile`, `pixelcraft-python-ui`, `pixelcraft-desktop`, `pixelcraft-tui`, `pixelcraft-email`, or `pixelcraft-game-ui`). If absent, translate the direction idiomatically yourself without importing web assumptions.
5. **Verify** — use `pixelcraft-review` for slop scanning, heuristic critique, accessibility/state review, and evidence-ranked findings; inspect rendered output where the environment permits and label every claim honestly.
6. **Report** — decisions, verification evidence, unresolved risks, and waived items using the report contract.

Do not loop forever. One repair round is normal for clear deterministic failures; report remaining uncertainty rather than claiming completion.

## Platform routing

After detecting the stack, use the matching platform skill by name and read only the relevant framework reference inside it:

| Platform skill | Framework references |
|---|---|
| `pixelcraft-web` | `html-css`, `react-next`, `vue-nuxt`, `svelte`, `solid`, `angular`, `astro`, `qwik`, `htmx-alpine`, `lit-web-components`, `tailwind`, `server-rendered` |
| `pixelcraft-mobile` | `swiftui`, `uikit`, `jetpack-compose`, `flutter`, `react-native-expo`, `kotlin-multiplatform`, `ionic-capacitor`, `dotnet-maui` |
| `pixelcraft-python-ui` | `streamlit`, `gradio`, `reflex`, `nicegui`, `dash`, `panel`, `shiny`, `flet`, `kivy`, `jupyter-widgets` |
| `pixelcraft-desktop` | `tauri`, `electron`, `qt-pyside-qml`, `winui-wpf`, `appkit`, `gtk`, `avalonia`, `rust-gui` |
| `pixelcraft-tui` | `textual`, `rich`, `ink`, `bubbletea-lipgloss`, `ratatui` |
| `pixelcraft-email` | `html-tables`, `mjml`, `react-email`, `client-quirks` |
| `pixelcraft-game-ui` | `unity-ui-toolkit`, `godot`, `unreal-umg`, `hud-principles` |

References are named here for routing only. Do not construct relative paths across skill folders; read the file inside the installed platform skill.

## Mandatory floor summary

The full floor is normative. At minimum:

- truthfulness: no invented facts, proof, assets, metrics, logos, or testimonials;
- accessibility: semantic controls, names/labels, keyboard/focus path, contrast floor, reduced-motion path, text scaling/reflow, no color-only meaning;
- interaction: visible feedback, suitable targets, cancellation/undo/escape, no conflicting gestures, complete states;
- adaptation: restructure across sizes, orientations, input modalities, and platform idioms;
- localization: expansion/contraction, directionality, script/font fallback, input composition, plural/gender/case, locale formatting, culturally appropriate copy/imagery;
- performance: fast acknowledgment, stable layout, asset budgets, nonblocking interaction;
- robustness: zero/one/many/long/missing/error/offline/permission/interruption/concurrency states;
- coherence: semantic tokens and consistent hierarchy, affordances, motion, iconography, and copy;
- distinctiveness: at least one deliberate subject-specific commitment when mode permits;
- verifiability: no claim without an evidence label.

The floor never mandates a hero, card, palette, typeface, border radius, shadow, layout shape, or visual movement.

## Evidence labels

Use exactly these labels in reports and critique:

| Label | Meaning |
|---|---|
| `rendered` | inspected actual rendered output, screenshot, device, simulator, snapshot, or browser surface |
| `static` | inferred from source, schema, configuration, or deterministic static analysis |
| `model-judgment` | heuristic/model evaluation; useful hypothesis, not proof |
| `not-checked` | relevant but not inspected; state why when material |
| `waived` | user/brief explicitly overrides the rule; record scope and consequence |

## Final response contract

End with: what changed; which direction was selected and why; verification performed by evidence label; floor items remaining `not-checked` or `waived`; and concrete open risks. Do not claim visual quality because the app compiled, a page loaded, or code merely exists.
