---
name: pixelcraft-handoff
description: Converts design-system artifacts and Figma selections into faithful implementation without losing existing architecture. Use for Figma Dev Mode MCP server workflows, get_design_context/get_variable_defs/get_screenshot inspection, Dev Mode variables and modes, DTCG token reconciliation, Code Connect mappings, screenshot/mockup-to-component translation, existing-component reuse, spacing/token normalization, ambiguity resolution, and visual-fidelity checking with pixelcraft-visual-qa.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft handoff

Design handoff is translation under uncertainty, not screenshot copying. Figma output is evidence about intent; it is not automatically correct production architecture. Preserve existing components, tokens, state behavior, accessibility, localization, data contracts, and framework idioms before visual novelty.

## References

- Read [references/figma-mcp.md](references/figma-mcp.md) for Dev Mode MCP setup/workflow, tool selection, variable/style extraction, screenshots/assets, and Code Connect context.
- Read [references/mapping-fidelity.md](references/mapping-fidelity.md) for mockup-to-component mapping, token/spacing reconciliation, missing states, ambiguity handling, and the visual-qa fidelity loop.

## Required workflow

1. **Inspect implementation first.** Inventory existing components/tokens/routes/state before asking for generated code. Reuse is the default; divergence must be justified.
2. **Define selection and contract.** Capture exact Figma frame/component, breakpoints/modes/variants, interaction state, data states, target surface, and acceptance tolerance.
3. **Fetch structured context.** Prefer semantic design context/variables/component metadata over screenshot inference. Use screenshots as visual evidence, not as the only source.
4. **Map before generating.** Identify existing component matches, Code Connect mappings, token aliases/modes, asset exports, unsupported effects, and unknown/missing states.
5. **Reconcile tokens.** Translate Figma variables/styles into the project's semantic DTCG token layer through the `pixelcraft-tokens` skill. Do not hard-code leaf hex/px values when a semantic token exists.
6. **Verify fidelity.** Implement, render real states, compare screenshot/overlay/pixel measurements within a declared tolerance, fix meaningful divergence, and report residual uncertainty.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| evidence hierarchy | existing production behavior + semantic design metadata outrank generated code guesses; screenshots outrank nothing by themselves. |
| reuse | do not duplicate an existing component because Figma output emitted literal markup. |
| architecture | preserve framework conventions, state ownership, accessibility semantics, routing, data loading, and localization. |
| ambiguity | unknown interaction/state/token meaning is a question or explicit assumption—not silent invention. |
| fidelity | visual similarity never excuses broken keyboard behavior, contrast, overflow, empty/error/loading states, or content scaling. |
| privacy/security | do not expose proprietary design files, assets, tokens, or MCP endpoints beyond the intended client/session. |
| anti-slop | do not flatten design into static absolute positioning, rasterize text, copy placeholder copy, or mimic visual noise without semantic structure. |

## Pre-submit checklist

- [ ] exact frame/component/version and target breakpoint/mode are recorded;
- [ ] existing component/token reuse decisions are documented;
- [ ] semantic variables/modes map to project tokens or deliberate overrides;
- [ ] missing hover/focus/disabled/loading/error/empty/overflow states are resolved or labeled assumptions;
- [ ] implementation uses real data/state behavior rather than static screenshot structure;
- [ ] rendered output was compared at target sizes using the `pixelcraft-visual-qa` skill where available;
- [ ] intentional deviations and residual uncertainty are reported.
