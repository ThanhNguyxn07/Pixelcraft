# Mapping, reconciliation, and fidelity checking

## Screenshot/mockup → component mapping

Use a hierarchy of evidence:

1. existing production components and documented APIs;
2. Code Connect/design-system mappings;
3. semantic variables/styles and Auto Layout/constraints;
4. layer names/types/component variants;
5. screenshot geometry/pixels;
6. inferred visual similarity only as a last resort.

Mapping table before implementation:

| Design element | Existing component? | Decision |
|---|---|---|
| exact semantic match | yes | reuse and map variants/props |
| near match | yes but missing state/variant | extend carefully without breaking existing consumers |
| recurring unexplained pattern | no | propose/design primitive after checking taxonomy |
| one-off decoration | no | implement locally only if it carries real meaning |
| raster/text effect | no | decide semantic HTML/SVG/canvas/image treatment deliberately |

Never convert a screenshot into a flat absolute-positioned tree. Auto Layout in Figma usually indicates flow/flex/grid intent, but constraints/resizing behavior still need interpretation.

## Spacing and token reconciliation

Measure spacing as relationships, not isolated numbers:

- repeated inset/gap rhythm;
- alignment/cross-axis relationships;
- optical corrections around icons/text;
- responsive compression/expansion;
- density modes and platform conventions.

Reconcile in this order:

1. exact semantic token exists → use it;
2. exact primitive exists but semantics mismatch → resolve semantic meaning;
3. near match caused by optical adjustment → document/encode only if repeatable;
4. design drift/duplicate → flag rather than enshrining every variant;
5. genuinely new scale step → extend the scale deliberately.

Do not round every value to the nearest token when doing so breaks optical alignment, physical hit targets, or compact density. Record intentional non-scale values as exceptions with reason.

## Missing and ambiguous states

Treat these as unresolved unless design explicitly covers them:

- hover/focus/active/disabled/selected;
- loading/skeleton/optimistic/error/empty/offline/permission;
- long/short/localized/bidi text;
- numeric overflow/currency/date boundary;
- narrow/wide/resized viewport;
- keyboard/screen-reader/touch/pointer input;
- destructive/irreversible confirmation;
- missing image/font/data/permission;
- dark/light/high-contrast/reduced-motion modes.

When blocked, make the smallest explicit assumption in implementation notes or ask the design owner. Do not silently invent destructive behavior or legal/security copy.

## Fidelity loop with `pixelcraft-visual-qa`

Use the visual-qa skill for rendered evidence. A practical loop:

1. capture the design screenshot/export at the target breakpoint/mode;
2. render implementation using real fonts/assets/data;
3. align viewport/device scale exactly;
4. compare full-frame screenshot and meaningful crop regions;
5. use overlay/difference heatmap plus structural inspection—not pixel diff alone;
6. classify divergence: layout geometry, typography/rasterization, color/theme, asset rendering, dynamic content, state mismatch;
7. fix semantic defects first, then geometry/visual regression;
8. rerun only changed comparisons.

Declare tolerance before comparison. Anti-aliasing/font rasterization/platform text shaping can produce nonzero pixel differences even in correct implementations. A strict byte/pixel equality target is usually wrong. Conversely, a loose global percentage can hide misplaced focus rings, clipped text, missing borders, or wrong contrast. Prefer region-aware thresholds and human-readable measurements (offset, size delta, contrast delta, clipping) over a single score.

## Acceptance report

Report:

- source selection/version/mode/breakpoint;
- reused versus newly created components;
- token substitutions/exceptions;
- assumptions/missing states;
- rendered comparison evidence and tolerance;
- intentional deviations;
- remaining `not-checked` surfaces.

Anti-slop failure signals: rasterized text, absolute positioning everywhere, fake placeholder copy retained, duplicated existing component, hidden overflow, inaccessible contrast, focus ring missing, hard-coded hex despite semantic token, and pixel-chasing that breaks responsive behavior.
