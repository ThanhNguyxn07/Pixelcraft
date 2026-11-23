# Contributing to Pixelcraft

Pixelcraft is a portable Agent Skills pack for distinctive UI and rigorous UX across frontend stacks. Read `docs/ARCHITECTURE.md` before editing; it is the controlling design document.

## Ground rules

- English content; concise, imperative, concrete, and evidence-backed.
- Each skill must be independently installable and self-contained.
- Depth belongs in `references/`; `SKILL.md` is routing plus operational rules.
- No runtime dependencies. Utility scripts use Node.js >= 18 built-ins only.
- Do not make web/React assumptions in core skills. Platform translation belongs in platform skills.
- Respect the authority order: explicit user brief, existing project system/tokens, platform/legal/accessibility constraints, Pixelcraft guidance, then model taste.

## Editing checklist

1. Keep frontmatter valid and descriptions within the Agent Skills limits.
2. Link every reference from `SKILL.md` with a one-line “read when” trigger.
3. Keep citations sparse and use `[Sxx]` IDs from `docs/RESEARCH.md`.
4. Add or update fixtures/examples when behavior changes.
5. Run:
   ```sh
   npm run validate
   node bin/pixelcraft.mjs add all --agent all --dry-run
   ```
6. Commit in focused logical commits. Do not commit generated install copies or `.pixelcraft/` project state.

## Design content standard

A rule is useful only if it changes an agent decision. Prefer “Use a 65–75ch measure for long-form Latin text” over “use readable typography.” Include transferability notes when a rule depends on platform, script, input modality, locale, or rendering surface.
