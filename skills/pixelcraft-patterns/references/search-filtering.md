# Search and filtering

Search quality is measured by recovery as much as result relevance.

## Query input

- Use a persistent label or accessible name; placeholder is hint only.
- Support paste, clear, keyboard submission, autocomplete/IME composition, and cancellation of stale requests.
- Debounce without hiding that work is pending; preserve typed query through errors/navigation.
- Advanced syntax/filter UI must not expose implementation jargon unless users know it.

## Results

- Show count/scope/time freshness where meaningful; never claim zero means absence when permissions hide data.
- Sorting/filter state must be visible, reversible, shareable where possible, and preserved on back/refresh.
- Empty results diagnose likely cause and offer concrete recovery: remove filter, broaden query, correct spelling, change scope.
- Large results need pagination/virtualization/stable ordering and selection semantics that users understand.

## Faceting/filtering

Show applied filters as removable objects. Avoid cascading dependent dropdowns when direct filters or grouped controls communicate better. Do not hide counts in ways that dead-end users. Explain incompatible combinations.

## Verification

Test no query, no results, one result, thousands, slow network, aborted stale response, malformed query, Unicode/IME/case/diacritic behavior, locale sort expectations, keyboard focus into results, screen-reader status announcements, narrow layout, and saved/deep-linked state.
