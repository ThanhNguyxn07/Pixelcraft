# Slop fingerprints

Evidence base: recurring generated-UI patterns and output-homogenization evidence. These are recurrence signals, not universal moral bans. The response is redesign or explicit justification—not shame.

## High-confidence visual fingerprints

| Fingerprint | Why it converges | Redesign move |
|---|---|---|
| cream paper + high-contrast serif + orange/terracotta accent | current “crafted AI” neo-slop cluster | derive palette/material from subject; use accent as a semantic system rather than one fashionable color |
| near-black page + single acid green/purple accent | generic futurism | define lighting/material logic and more than one semantic state color |
| Inter/Geist/Helvetica-like sans for every role | model default typography | choose voice by subject; use optical sizes, serif/mono/serifless contrast, native platform defaults when appropriate |
| purple-to-blue gradient | model/default AI branding | use color posture with physical or symbolic basis; gradients only when they encode light/material/data |
| centered hero + eyebrow + H1 + subcopy + two CTAs | template composition | choose hierarchy from user decision; asymmetric, editorial, instrument, object-led, or content-first composition |
| exactly three rounded feature cards with icon/title/text | homogeneous SaaS kit | match information structure to actual number/meaning of ideas; use table, index, timeline, object anatomy, comparison, or spatial layout |
| emoji as structural icons | cheap visual noise | use a coherent icon system or text; emoji only when culturally/semantically appropriate and never as sole critical meaning |
| `rounded-2xl` + large soft shadow everywhere | depth without material logic | choose radius/elevation from component semantics and material; flat can be intentional |
| default glassmorphism panels | decorative translucency | use translucency only where layered context/background matters; test contrast and performance |
| one italic/accented word inside roman heading | model typography tic | create hierarchy through size/weight/measure/language instead |
| unnecessary uppercase eyebrow labels | false sophistication | remove or replace with meaningful metadata/navigation |
| decorative section numbers with no sequence semantics | pseudo-editorial signaling | use actual indexing or remove |
| generic aurora/blob/grid background | meaningless generated atmosphere | derive visual field from content or omit background effect |
| card inside card inside card | noisy containment | use spacing/hairline/typographic grouping; reserve containers for semantic boundaries |
| everything centered regardless of content length | lowest-effort layout | align to reading/task logic; use measure and asymmetric negative space deliberately |
| identical radius/spacing/shadow on every component | token misunderstanding | define semantic variation and density hierarchy |

## Copy fingerprints

- “supercharge/elevate/revolutionize/unlock/seamless/cutting-edge” without concrete evidence;
- fake statistics, logos, testimonials, customer counts, awards, or case studies;
- headings that say “Features/Benefits/Why choose us” instead of subject-specific claims;
- error copy that apologizes but gives no recovery path;
- empty-state copy that explains the obvious (“No items yet”) without the next useful action;
- buttons that all say “Learn more” regardless of consequence.

## Behavior fingerprints

- animation on every section entrance regardless of purpose;
- `transition: all` and long easing everywhere;
- hover-only disclosure with no keyboard/touch path;
- skeletons that mimic fake content rather than stable structure;
- modal chains and cookie/banner chrome occupying the first screen;
- responsive behavior that only scales a desktop layout down instead of restructuring.

## Lazy-agent & design-theater fingerprints

| Fingerprint | Why it happens | Redesign move |
|---|---|---|
| empty colored/gray `<div>` boxes standing in for product photos or illustrations | agent rushes past asset sourcing/generation | use real licensed/generated photography, authentic product UI, or bespoke SVG/canvas; never ship placeholder rectangles |
| `font-serif` or custom font names declared in CSS without loading the actual font face | silent fallback to system Times New Roman or Arial | load every declared typeface explicitly and verify `document.fonts` in the rendered browser |
| raw unstyled `<input type="range">` or default browser widgets inside a bespoke interface | agent skips control craft | style controls intentionally with semantic tokens and accessible focus/hover states |
| gradient-clipped display text (`bg-clip-text text-transparent`) | recurring model hero cliché | build display hierarchy via scale, optical tracking, weight, and spacing |
| floating pills/badges colliding with footer or hero content on scroll or at `390px` | fixed overlay added without testing viewports | integrate navigation into header/layout flow and verify `1440px`, `768px`, and `390px` renders |
| eloquent direction plan paired with generic boxed card layout in code ("design theater") | reasoning diverges from implementation | audit rendered screenshots directly against the direction card before reporting completion |
| shipping 3+ shallow pages/demos at once instead of finishing 1 surface properly | trading craft depth for count | finish, screenshot, and refine one complete surface before starting the next |

## Evaluation rule

A page can have zero fingerprints and still be bad; absence of slop is not presence of design. Judge subject fit, hierarchy, craft, usability, and evidence separately.
