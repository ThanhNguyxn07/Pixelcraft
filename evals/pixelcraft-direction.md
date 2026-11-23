# pixelcraft-direction evaluation cases

## Case 1 — direction divergence

**Prompt**

> Generate directions for a museum archive discovery product.

**Expected behaviors**

- Selects or applies `pixelcraft-direction` behavior when the prompt matches its trigger.
- produces genuinely far-apart directions with probabilities/tradeoffs.
- selects a named composition family and explains its structural grid, fallback behavior, and cliché risk.
- records losing rationale.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- three same blue SaaS themes.
- no material inventory.
- instant convergence.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — repetition avoidance

**Prompt**

> Create another direction after the user rejected generic luxury minimalism.

**Expected behaviors**

- Selects or applies `pixelcraft-direction` behavior when the prompt matches its trigger.
- inspects repetition history and changes the design space rather than palette only.
- changes composition/grid structure, not just color or typeface.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- renames same direction.
- uses generic premium language.
- ignores rejection evidence.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
