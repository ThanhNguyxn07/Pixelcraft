# Visual critique rubric

Use this rubric after capture, never as a substitute for capture. Rank findings by user impact rather than visual preference.

## Evidence hierarchy

1. physical device/platform chrome (`rendered`);
2. simulator/emulator/browser runtime (`rendered`, labeled as emulation);
3. deterministic snapshot backend (`rendered` for layout/text raster only, not interaction truth);
4. static geometry/style/code inference (`static`);
5. model interpretation of a screenshot (`model-judgment`).

Never upgrade a label because the screenshot looks convincing.

## Inspection order

| Layer | Questions |
|---|---|
| task | Can the primary action be found and completed? Is state feedback unambiguous? |
| platform | Does chrome, navigation, target size, focus, safe area, scaling, and input behavior fit the host? |
| hierarchy | Do eye path, grouping, spacing, and emphasis match importance? Is anything competing with the primary task? |
| legibility | Are type size, line length, contrast, truncation, wrapping, script shaping, and icon recognition adequate in context? |
| geometry | Check edges first: clipping, overlap, unintended scroll, off-screen controls, cramped resize, unstable aspect ratios. |
| state | Loading/empty/error/offline/permission/long-content/disabled/selected/focus states visible and truthful? |
| theme/motion | Do dark/high-contrast modes preserve semantic contrast? Does reduced motion preserve meaning? |
| distinctiveness | Does the result express the chosen direction and subject, or could any product reuse it unchanged? |
| performance | Is interaction responsive, layout stable, and media cost proportionate? |

## Severity guide

- **P0:** primary task impossible, unreadable, inaccessible, deceptive, or destructive.
- **P1:** major state/navigation/platform failure or essential content clipped/invisible.
- **P2:** comprehension, efficiency, trust, contrast, localization, or layout defect with a workaround.
- **P3:** optical refinement that does not change task success.

## Critique format

```text
[P1][rendered][high] 390px light capture: checkout button is clipped at the right edge.
Evidence: captures/390x844-light-motion.png, right-bottom quadrant.
Fix: move the action into the normal flow before the safe-area inset; do not hide overflow.
Residual: physical touch target not checked.
```

## Anti-patterns

- “Looks clean/premium/modern” without evidence or criteria.
- Fixing alignment by magic numbers instead of correcting layout constraints.
- Cropping captures to avoid edge defects.
- Treating a full-page screenshot as proof of keyboard, screen-reader, motion, or runtime behavior.
- Redesigning the product during a QA pass; report direction-level concerns separately.
