# Anti-laziness & finish gate

Use this reference before declaring any UI task complete. Research on generative UI consistently exposes **design theater**: agents write eloquent direction plans and then ship rushed, homogenized, placeholder-ridden code that contradicts their own stated intent.

## Hard finish gates

Every gate below is mandatory unless explicitly waived by the user:

1. **Direction-to-render fidelity (no design theater):** compare the rendered screenshots side-by-side against the committed direction card. If the plan promised bespoke photography, editorial hierarchy, or custom controls while the build shipped empty gray boxes, uniform cards, or default browser controls, fail the gate and repair before reporting.
2. **One surface finished before multiplying:** when building multiple pages, demos, or screens, complete, visually inspect, and refine the first surface to production quality before starting the next. Never trade craft depth for headcount.
3. **Zero placeholder media:** never ship colored `<div>` blocks, `via.placeholder` / `placehold.co` URLs, or "image goes here" boxes where real photography, bespoke SVG/canvas, or real product UI belongs. If real assets cannot be generated or sourced, stop and ask or mark the surface explicitly incomplete.
4. **Verified font loading:** inspect `document.fonts` in the rendered browser (not only CSS declarations) to confirm every declared display, serif, body, and monospace family actually loaded for the target script—preventing silent fallback to system Times New Roman or Arial.
5. **No default-control laziness:** style custom range sliders, selects, switches, and focus indicators to match the surface material rather than leaving raw unstyled OS widgets inside a bespoke interface.
6. **Three-viewport visual pass:** capture and visually inspect rendered screenshots at **`1440px` (desktop)**, **`768px` (tablet)**, and **`390px` (mobile)**—checking clipping, overlap, horizontal overflow, floating-chrome collisions, contrast, and text wrapping.
7. **Bounded repair loop (up to 3 rounds):** fix all deterministic visual, contrast, font, layout, and `slop-scan` findings in batches, re-rendering and re-inspecting after each batch. Stop after at most **3 bounded repair rounds** and report any remaining uncertainty honestly as `not-checked`.

## Quick pre-completion audit table

| Gate | Pass evidence | Label |
|---|---|---|
| Static slop scan (`slop-scan.mjs`) | 0 blocking findings (`P0`/`P1`) and all `P2` addressed or justified | `static` |
| Rendered fonts (`document.fonts`) | All declared families report `status: "loaded"` | `rendered` |
| Media & imagery | Zero empty placeholder boxes or broken image URLs | `rendered` |
| 3-viewport layout (`1440 / 768 / 390`) | Zero horizontal overflow, zero text/chrome overlap, hierarchy holds | `rendered` |
| Interactive states | Primary task, error recovery, empty/loading, keyboard focus, reduced motion exercised | `rendered` |
| Direction fidelity | Rendered screenshots match committed palette, type voice, and signature element | `model-judgment` |
