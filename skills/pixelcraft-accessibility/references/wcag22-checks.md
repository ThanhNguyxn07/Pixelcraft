# WCAG 2.2 AA operational checks

Primary source; new-criteria overview. This is a practical floor, not legal certification.

## Perceivable

- Text contrast: 4.5:1 normal, 3:1 large; non-text UI/icons 3:1 unless exempt. Check states, placeholders, disabled-but-relevant text, focus indicators, diagrams/charts.
- Resize/reflow: 200% zoom/text scaling and 320 CSS px-equivalent width without two-dimensional scrolling or loss of content/function, subject to exceptions.
- Meaning does not depend on color, shape, position, sound, or sensory characteristic alone.
- Media: captions/subtitles, transcripts/audio description as applicable; no flashing above safe thresholds.
- Content adapts orientation unless essential; meaningful images have appropriate alternative text or are marked decorative.

## Operable

| Criterion | Concrete check |
|---|---|
| keyboard/focus | every action reachable/operable; no keyboard trap; visible focus with sufficient contrast |
| 2.4.11 focus not obscured | sticky headers, banners, overlays, keyboards, and floating actions never fully hide focused component; enhanced AAA minimum is stricter |
| bypass/navigation | skip/landmarks/headings or platform equivalent; logical reading/focus order; meaningful page/screen titles |
| link/control purpose | destination/action understandable in context; avoid repeated vague names |
| 2.5.7 dragging | every dragging movement has single-pointer alternative (buttons, menu, keyboard, direct input) |
| 2.5.8 target size | web AA minimum 24×24 CSS px unless spacing/inline/essential/user-agent exception applies; platform baselines may be larger |
| gestures/motion | multipoint/path gestures have simple alternatives; motion actuation can be disabled/substituted |
| timing | user can extend/disable/control nonessential time limits; no unexpected context change on input/focus |

## Understandable

- Language of page/parts declared; consistent navigation/identification; icons/controls behave consistently.
- Errors are identified in text, associated with the input, and suggestions are provided when correction rules are known.
- 3.3.7 redundant entry: do not require re-entering information already supplied in the same process unless essential/security/revalidation exception applies.
- 3.3.8 accessible authentication: no cognitive function test (memory, puzzle, transcription) unless an allowed alternative/mechanism such as password manager/paste/passkey path exists.
- Help appears consistently when repeated across pages/screens.

## Robust

- Use valid native semantics first; ARIA only where needed and correct. Name/role/value/state must update programmatically.
- Status messages are exposed without moving focus where platform supports it.
- Custom components preserve focus, selection, input method, screen-reader ordering, and platform accessibility tree behavior.

## Automatic failures to scan/fix

`outline:none` without replacement, positive tabindex, placeholder-as-label, missing form label, mouse-only handlers, blocked paste, disabled zoom, color-only state, missing reduced-motion path, focus removed/unmanaged in dialogs, keyboard-inaccessible drag/drop/menu/grid, target padding counted as visual target when hit box is smaller.
