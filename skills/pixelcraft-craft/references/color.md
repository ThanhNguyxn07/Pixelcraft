# Color

Evidence base: OKLab/OKLCH `[S78]`, WCAG 2.2 `[S57]`, APCA caveats `[S76]` `[S77]`, Material color roles `[S63]`.

## Use OKLCH as a design space

Specify color posture by lightness (`L`), chroma (`C`), and hue (`H`) rather than manipulating random hex values:

- keep hue/chroma coherent across a scale while changing lightness;
- reduce chroma at very light/dark ends to avoid clipping and visual harshness;
- inspect actual rendered output because gamut mapping differs by platform/display;
- store/export exact values through tokens rather than copying screenshots.

Example ramp posture:

```text
accent-050 L .96 C .02 H 245
accent-100 L .90 C .05 H 245
accent-300 L .72 C .12 H 245
accent-500 L .55 C .18 H 245
accent-700 L .42 C .13 H 245
accent-900 L .28 C .07 H 245
```

Do not treat these values as a universal palette. Derive hue/chroma from the direction and test gamut contrast.

## Semantic roles

Define roles before hex values:

- `surface`, `surface-raised`, `surface-sunken`, `overlay`;
- `ink`, `ink-muted`, `ink-inverse`, `link`, `focus`;
- `accent`, `accent-ink`, `accent-soft`;
- `success`, `warning`, `danger`, `info` plus foreground/background variants;
- `border`, `divider`, `selection`, `scrim`, `shadow`;
- data/categorical/sequential/diverging palettes only when needed.

Never use red/green alone for status. Pair color with text/icon/shape/position.

## Contrast and states

- WCAG 2.2 AA web floor: normal text 4.5:1, large text 3:1, non-text UI 3:1 unless exempt `[S57]`.
- APCA can inform perceptual judgment but is not the final WCAG 3 standard; do not claim APCA conformance unless scoped carefully `[S76]` `[S77]`.
- Check hover/active/focus/disabled/selected/pressed/visited and placeholder text; states often fail before base colors.
- Do not lower contrast for “muted” metadata below usability requirements; use size/spacing/weight to de-emphasize.
- In dark mode do not invert naïvely. Reduce large filled saturation, use lighter foreground accents, preserve semantic meaning, and test elevation/scrim/shadow visibility.
- Honor increased-contrast and forced-colors/platform high-contrast modes where supported.

## Data color

- categorical: limit simultaneous categories; use label/direct annotation instead of forcing users to decode many hues;
- sequential: monotonic lightness, not rainbow hue cycling;
- diverging: meaningful neutral midpoint and symmetric endpoints;
- use texture/pattern/line style/ordering in addition to hue for print, color-vision deficiency, and low-quality displays.

## Cultural meaning

Color symbolism is locale- and domain-dependent (finance gains/losses, mourning, luck, politics, religion, safety). Validate palette meaning for target markets instead of universalizing Western SaaS associations `[S31]` `[S82]`.
