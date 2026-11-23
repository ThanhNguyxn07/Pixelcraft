# Figma Dev Mode MCP workflow

Official sources: Figma MCP setup <https://help.figma.com/hc/en-us/articles/39216419318551-Get-started-with-the-Figma-MCP-server>, tools/prompts <https://help.figma.com/hc/en-us/articles/42495147242903-Tools-and-example-prompts>, Code Connect and MCP <https://help.figma.com/hc/en-us/articles/42495296821911-Code-Connect-and-MCP>.

## Server setup boundary

Figma currently documents two servers:

- **Remote server:** recommended hosted endpoint and broadest feature set.
- **Desktop server:** enabled inside Figma Dev Mode for specific organization/enterprise/desktop needs. Figma documents the local endpoint as `http://127.0.0.1:3845/mcp`.

Only MCP clients listed in Figma's catalog are supported. Feature availability varies by server type/plan/seat; inspect the tools actually exposed in the session rather than assuming a static list. Do not send proprietary selections/assets to an endpoint outside the approved environment.

## Current documented tool family

The official tool catalog includes design-to-code tools such as:

| Tool | Use |
|---|---|
| `get_design_context` | main structured context/code for a layer or selection |
| `get_metadata` | lightweight XML outline/selection structure |
| `get_screenshot` | visual evidence for the selection |
| `get_variable_defs` | variables/styles used by the selection |
| `download_assets` | exported/source images where available |
| `get_motion_context` | keyframe/animation data where available |
| `get_code_connect_map` | mappings from Figma components to code components |
| `get_code_connect_suggestions` | candidate mappings where available |
| `get_comments` | feedback/intent that may explain ambiguity |

Do not hard-code a call sequence blindly. Ask for the minimum evidence needed. Large selections can lose semantic detail or exceed practical context budgets.

## Recommended selection workflow

1. **Start narrow.** Select a component/frame representing one state and breakpoint, not an entire page.
2. **Fetch metadata/outline.** Understand layer/component hierarchy, instances, variants, hidden layers, and clipping before interpreting pixels.
3. **Fetch design context.** Inspect generated implementation hints critically. Treat them as evidence, not production-ready architecture.
4. **Fetch variable definitions.** Extract variable names, collections, modes, scopes, aliases, and styles. Missing/invalid variable use is important diagnostic evidence.
5. **Fetch screenshot.** Use it to verify visual intent, layering, raster effects, and actual appearance.
6. **Fetch assets only when needed.** Prefer existing asset pipeline/vector export settings; do not rasterize text or inline decorative images blindly.
7. **Inspect comments/specs.** Resolve why a state exists before inventing behavior.
8. **Inspect Code Connect mappings.** Prefer the mapped production component API over generated markup.

## Dev Mode variables and modes → DTCG tokens

Use the `pixelcraft-tokens` skill for canonical token structure. Translation rules:

| Figma concept | Token-system interpretation |
|---|---|
| primitive variable (raw color/number) | candidate primitive token; do not expose directly in components unless already intentional |
| semantic variable (`surface/default`, `text/primary`) | semantic token candidate—prefer this layer in implementation |
| collection | namespace/category boundary, not automatically a theme |
| mode (`light`, `dark`, brand/density/locale modes) | theme/context axis requiring explicit matrix coverage |
| alias | preserve reference semantics instead of flattening to hex/px |
| scoped variable (text/fill/stroke/effect/corner/gap) | validates intended use but does not replace semantic naming |
| style | reusable style candidate; determine whether it duplicates variables/tokens |

Do not invent token equality because two hex values match. Naming/mode/scope intent matters. Conversely, do not create hundreds of one-off semantic tokens for inconsistent design drift; reconcile duplicates deliberately.

## Code Connect

Code Connect connects design components to real code implementations. When present, use it to recover:

- production component import/name;
- prop mapping and variant mapping;
- nested component slots/children;
- implementation examples;
- design-to-code ownership boundaries.

Rules:

- preserve component API semantics instead of prop-drilling generated markup around it;
- if mapping is absent/wrong/stale, report that as design-system debt rather than hard-coding around it silently;
- do not create fake mappings merely to satisfy tooling;
- verify responsive behavior outside the mapped component because Code Connect does not implement application state/routing/data.

## Prompt hygiene

Good MCP prompts name the exact selection/intent: “Inspect this frame for implementation in the existing React settings page. Prioritize semantic variables, component reuse, breakpoints, and missing states.”

Bad prompts ask for “pixel-perfect React” without target architecture. They produce absolute-positioned literal translations with inaccessible structure.
