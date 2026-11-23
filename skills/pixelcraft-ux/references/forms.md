# Forms

Evidence: Baymard validation/inline/checkout research `[S53]` `[S54]` `[S55]`; WCAG redundant entry and accessible authentication `[S57]` `[S86]`; NN/g input guidance `[S84]` `[S85]`.

## Structure

- One persistent visible label per field. Placeholder is never a label because it disappears, harms recall, and is often low contrast.
- Ask only for information needed now. Mark optional fields rather than plastering required markers everywhere when most fields are required.
- Group related choices; order by user mental model, not database schema. Use one column in most task flows.
- Use correct control type: text input vs select vs radio/checkbox/stepper/date picker. Do not force tiny dropdowns for few choices or free text for constrained values.
- Accept forgiving formats; parse and normalize rather than forcing users to match backend storage.
- Preserve entered input after errors, navigation, refresh, authentication expiry, and submission failure.

## Input semantics and mobile adaptation

- Use correct autocomplete/input purpose tokens (`name`, `email`, `tel`, `url`, `postal-code`, payment fields), input types/modes, virtual keyboard layout, capitalization/autocorrect settings, and paste behavior.
- Never block paste in email/password/verification/payment fields. Do not require retyping email or other redundant entry unless a security/legal reason exists `[S57]`.
- Accessible authentication: no cognitive memory test, puzzle, or transcription-only flow; support password managers, paste, passkeys/biometrics/magic links where appropriate `[S57]`.
- Use input masking only when it visibly reduces uncertainty without trapping IMEs/paste/screen readers.
- Verification codes: allow paste/autofill, do not split focus unpredictably, announce errors accessibly, and preserve countdown/resend state.

## Validation timing

| Moment | Use for |
|---|---|
| while typing | format hinting only when non-disruptive; do not show premature errors |
| after field completion/blur | invalid format, availability, mismatch, missing required value |
| on submit | cross-field/server/business-rule validation |
| after correction | clear error promptly; do not require full resubmission to know it fixed |

Do not validate required empty fields aggressively before the user has had a chance to answer. Never disable submit as the only indication of incomplete input; explain missing/invalid fields on attempt.

## Error copy and recovery

Pattern: `<what is wrong>` + `<what was preserved>` + `<how to fix>`.

- Bad: “Invalid input.” Better: “Enter the expiry month as two digits, for example 09. Your other payment details are unchanged.”
- Put messages adjacent to fields and provide an error summary for long/complex forms; moving focus must be deliberate and accessible.
- Use forgiving constraints before validation. A date picker, mask, or autocomplete is often prevention; validation is the fallback.
- Destructive form reset/cancel must distinguish discard from close/back and protect entered work.
