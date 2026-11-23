# pixelcraft-ux evaluation cases

## Case 1 — flow matrix

**Prompt**

> Design the UX flow for inviting a teammate to a workspace.

**Expected behaviors**

- Selects or applies `pixelcraft-ux` behavior when the prompt matches its trigger.
- covers happy path plus empty/error/permission/offline/loading states.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- single happy-path mock.
- missing rollback.
- no copy hierarchy.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — recovery design

**Prompt**

> Improve recovery after failed payment submission.

**Expected behaviors**

- Selects or applies `pixelcraft-ux` behavior when the prompt matches its trigger.
- preserves input/context and gives truthful retry/idempotency behavior.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- loses form data.
- blames user.
- duplicate submission risk.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
