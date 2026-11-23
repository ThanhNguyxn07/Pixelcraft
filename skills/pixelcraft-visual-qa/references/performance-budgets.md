# Performance budgets

Budgets are user-experience constraints, not score chasing. Set them during planning and measure in the real runtime whenever possible.

## Core Web Vitals

| Metric | Good threshold | What it represents |
|---|---:|---|
| LCP | ≤ 2.5 s at p75 | largest contentful paint / perceived loading |
| INP | ≤ 200 ms at p75 | interaction responsiveness |
| CLS | ≤ 0.1 at p75 | visual stability |

Use field data when available. Lighthouse/WebPageTest/local tracing are lab evidence and must be labeled as such. Do not optimize hidden test widgets at the expense of the real page.

## Interaction and frame budgets

| Surface | Budget |
|---|---|
| pointer/keyboard acknowledgment | visible feedback within 100 ms; preferably immediate |
| ordinary 60 Hz frame | 16.7 ms total frame budget; leave main-thread headroom |
| high-refresh/game frame | 11.1 ms at 90 Hz, 8.3 ms at 120 Hz; engine/platform dependent |
| scrolling/dragging | no long task blocking input; virtualization for large lists |
| startup | meaningful skeleton/first useful surface before decorative assets |

## Indicative web asset budgets

Adjust by mode and document the choice.

| Mode | Initial compressed JS+CSS | Notes |
|---|---:|---|
| content/read | ≤ 150–250 KB | prioritize fonts/images and stable measure |
| operate/dashboard | ≤ 250–450 KB | route-level splitting; avoid chart/map cost on unrelated routes |
| persuade/experience | ≤ 350–700 KB | media-heavy work needs explicit loading/adaptive quality |
| embedded/widget | ≤ 100–200 KB | host page pays additional cost |

Fonts: subset and limit families/weights; use `font-display` appropriate to content. Images: responsive sizes, modern formats when supported, explicit dimensions to prevent CLS. Video/3D: adaptive quality, poster/loading state, reduced-motion/data path.

## Measurement commands and signals

- Browser: Performance panel, Lighthouse/WebPageTest, `performance.measure`, long-task/INP observers, coverage and bundle analyzer.
- Native/mobile: platform profiler, frame-time instrumentation, startup tracing, memory/energy impact.
- Game: engine profiler, CPU/GPU frame breakdown, texture/font atlas cost, worst-scene capture—not menu-only measurement.
- Terminal: startup latency, resize redraw cost, input echo latency; snapshot tests do not measure runtime performance.

## Budget failure response

1. identify the user-visible symptom and measurement context;
2. attribute cost before deleting features;
3. fix the largest causal cost (blocking work, payload, layout instability, memory pressure);
4. remeasure the same surface;
5. report before/after numbers or `not-checked` honestly.
