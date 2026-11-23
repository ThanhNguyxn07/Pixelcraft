# Tables, lists, and CRUD

Dense operational UI succeeds through scanability, predictable editing, and safe recovery.

## Tables/lists

- Choose row identity and primary column deliberately; keep actions/context visible without mystery icons.
- Support keyboard/focus/selection semantics, stable sorting, column width behavior, empty/loading/error states, and responsive transformation.
- Virtualize large datasets only when needed and preserve focus/scroll/selection correctly.
- Never truncate essential unique identifiers without expansion/copy/access.

## Create/read/update/delete

| Action | Rules |
|---|---|
| create | sensible defaults, validation near fields, duplicate prevention, clear success/location |
| read/detail | preserve context/back state; distinguish missing vs no permission |
| update | concurrency/version conflict handling; explicit dirty/save state where platform expects it |
| delete | consequence-specific confirmation; undo/archive preferred when truthful |
| bulk | visible selection count/scope, filter-aware selection behavior, progress/partial failure report |

Import/export needs schema errors with row/column references, encoding/locale behavior, progress, cancellation, and no silent data loss.

## Verification

Test zero/one/many rows, long unbroken text, locale sorting/numeric formatting, mixed RTL, row selection by keyboard, focus after delete/dialog, refresh/back/deep link, concurrent edit conflict, failed partial bulk action, narrow screens, dark/high contrast, and virtualization accessibility.
