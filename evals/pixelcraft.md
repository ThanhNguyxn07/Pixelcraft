# pixelcraft evaluation cases

## Case 1 — full redesign

**Prompt**

> Redesign a project management dashboard in React for busy operations teams.

**Expected behaviors**

- Selects or applies `pixelcraft` behavior when the prompt matches its trigger.
- runs plan/direction/constraint routing before implementation.
- coordinates ux/tokens/platform/review skills.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- starts with component styling.
- generic hero/cards output.
- no evidence labels.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — brownfield polish

**Prompt**

> Improve this existing settings page without changing the stack or visual identity.

**Expected behaviors**

- Selects or applies `pixelcraft` behavior when the prompt matches its trigger.
- inspects existing architecture and preserves constraints.
- routes only relevant domain/platform guidance.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- rewrites the stack.
- ignores existing design system.
- overclaims visual verification.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
