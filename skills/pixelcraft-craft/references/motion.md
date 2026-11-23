# Motion

Evidence base: platform motion guidance `[S63]` `[S64]`; response-time constraints `[S48]`; accessibility floor `[S57]`.

## Purpose first

Every animation must do at least one job:

- acknowledge input immediately;
- show causality/source/destination;
- preserve orientation during spatial or hierarchy change;
- communicate progress/state;
- reinforce a deliberate signature moment.

Decoration-only looping motion is usually noise. Motion cannot compensate for unclear hierarchy.

## Durations and posture

| Interaction | Typical posture |
|---|---|
| hover/press/direct feedback | immediate or roughly 50–120ms |
| small state transition | roughly 120–250ms |
| panel/sheet/scene transition | roughly 200–400ms |
| orientation-critical choreography | only as long as comprehension requires |
| loading progress | show real progress when known; otherwise stable indeterminate feedback without fake precision |

Use platform-native easing unless the direction defines a material behavior: snap/stepped for instruments, physics/spring for playful objects, smooth symmetric easing for neutral UI. Avoid `transition: all`; animate only intentional properties, preferably transform/opacity on compositing surfaces.

## Rules

- Never block interaction during nonessential animation.
- Do not animate layout properties that trigger expensive reflow when transform/opacity can communicate the same change.
- Keep focus stable or move it deliberately; never leave focus in removed content.
- Avoid flashing or rapid oscillation; respect photosensitivity constraints.
- Pause or avoid background motion in dense operational screens.
- Coordinate entrance motion in one direction and order. Do not make every card cascade independently.

## Reduced-motion path

Provide a real alternative when users request reduced motion:

1. instant state change;
2. opacity-only fade where safe;
3. static intermediate/endpoint representation;
4. text or icon state equivalent.

Reduced motion must preserve information and causality. Simply deleting feedback is not sufficient.

## Platform transfer

- Web: honor `prefers-reduced-motion`; avoid scroll-jacking.
- iOS/Android: use native spring/transition idioms and interruptibility.
- Flutter/RN/Compose/SwiftUI: tokenize duration/easing semantically rather than hard-coding per component.
- Desktop: respect instant window manipulation and reduced animation settings.
- TUI: use sparse cursor/progress/state changes; do not assume high frame rate.
- Email: assume animation support is absent or inconsistent; never make meaning depend on it.
- Game UI: distinguish gameplay-critical timing, HUD feedback, cinematic decoration, and photosensitivity risk.
