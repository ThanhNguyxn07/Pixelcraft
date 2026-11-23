# Motion and interaction

Evidence base: NN/g animation-duration and scrolljacking studies `[S109–S111]`, Apple motion/accessibility guidance `[S112]`, Material motion `[S66]`, web rendering/CWV guidance `[S118]` `[S119]`, WCAG floor `[S57]`.

## Purpose before spectacle

Motion earns its cost only when it acknowledges input, shows causality, preserves orientation, communicates progress/state, or creates the direction's single signature moment. Apple gives the same constraint: purposeful, brief, precise, optional motion—not motion for its own sake `[S112]`. Award-showcase spectacle is not permission to sacrifice usability: Awwwards usability is 30% of the score and CSSDA scores UX separately `[S91]` `[S93]`.

## Budgets

| Layer | Budget posture |
|---|---|
| input acknowledgment | immediate; roughly 50–120ms; never delayed behind a scene animation |
| local state change | roughly 100–250ms; NN/g places most animation in a 100–500ms envelope `[S110]` |
| sheet/panel/route transition | roughly 200–400ms; shortest non-jarring duration |
| scroll-linked progress | visually respond within one normal wheel/touch increment; never require pixel-perfect scrolling `[S109]` |
| concurrent choreographed elements | normally 1 primary + at most 2 supporting motions; cascade only when order encodes meaning |
| ambient/looping motion | default none in Operate/Read; if used, subtle, pausable, and outside the reading focus |
| rendering | target compositor work; animate transform/opacity, avoid layout/paint-triggering properties and `transition: all` `[S118]` |
| assets | motion cannot justify layout shift, delayed LCP media, blocked input, or main-thread long tasks `[S119]` |

Tokenize semantic durations/easings (`feedback.instant`, `state.standard`, `scene.enter`) rather than scattering raw milliseconds.

## Technique library

| Technique | Use when | Web implementation | Native/mobile equivalent | Reduced/fallback path | Cliché risk |
|---|---|---|---|---|---|
| scroll-driven reveal/progress | progress itself is spatial/temporal: drawing a route, filling a meter, comparing before/after | CSS scroll-driven animations or small observer-driven transform/opacity `[S115]`; no input hijacking | scroll-linked offset/phase in SwiftUI/Compose/Flutter | static final state or chapter thumbnails; progress readable without motion | every section fading/sliding upward becomes meaningless decoration |
| pinned/sticky narrative | one artifact needs persistent context while chapters annotate it | sticky media pane + normal document flow; sparse keyed state changes | split pane or top preview + pageable chapters | linear static layout with all annotations visible | scrolljacked full-screen scenes that trap the user `[S109]` |
| View Transitions/shared element | object identity continues across route/state | same-document `startViewTransition` or cross-document opt-in `[S116]`; name only meaningful shared elements | native shared-element/container transform transitions | instant navigation; preserve focus and announce route change | morphing everything because the API exists |
| cursor/hover response | pointer precision adds inspection, magnetic affordance, or localized reveal | transform/opacity near cursor; keyboard focus receives equivalent state | touch/long-press/context menu or focus ring equivalents | static emphasis; no hover-only disclosure | custom cursor replacing the system cursor without value |
| text reveal | short editorial headlines where sequencing creates voice | per-line or per-phrase mask/translate once; keep text selectable and semantically whole | attributed text/line-level fade or no-op | all words visible instantly | letter-by-letter spectacle on long/localized copy |
| page transition | spatial continuity or scene change is real | View Transition or brief opacity/transform; keep browser navigation expectations | platform navigation transition/spring | instant transition | ceremonial transitions that delay every task |
| micro-interaction | state needs confirmation or physical cause | pressed scale/color/token state within 100ms; no layout shift | haptics/platform touch feedback plus visual state | static state/icon/color change | bouncy jelly controls on serious operations |
| WebGL/shader accent | material/light/data inherently spatial or generative | one bounded canvas/scene; pause offscreen; static poster; GPU/memory budget | Metal/Vulkan/OpenGL/native scene only at signature surface | high-quality static image/canvas fallback | default orb/fluid/aurora background |
| kinetic type/marquee | ticker/log/scoreboard semantics or deliberate print/poster voice | transform-only loop, pause on hover/focus, duplicate content accessibly | ticker view with reduced speed/control | static wrapped text | meaningless infinite marquee as faux award-site signal |

## Scrolljacking boundary

Default answer: **do not scrolljack**. NN/g found disorientation across participants; when stakeholders insist, use it only for functional value, keep required scroll input small, make change visible quickly, preserve normal scrollbar/progress, provide direct section links, avoid precision-dependent reveals, and user-test the rate `[S109]`. Never hijack input, invert direction, suppress keyboard/scrollbar behavior, or make content vanish on a slight overscroll.

## Reduced-motion matrix

1. preserve causality with an instant state change;
2. replace spatial movement with opacity/fade or static crossfade;
3. show a static intermediate/endpoint sequence;
4. provide text/icon/haptic/audio equivalent where appropriate;
5. respect `prefers-reduced-motion` on web `[S117]` and platform Reduce Motion settings natively; Apple specifically calls out limiting automatic/repetitive zoom, scale, peripheral motion, z-depth, and blur transitions `[S112]`.

Deleting feedback is not a reduced-motion path. Motion-triggering vestibular risk includes large-scale panning/zooming, spinning, parallax, autoforwarding carousels, and scrolljacking `[S110]` `[S111]`.

## Implementation checklist

- input stays interactive during nonessential animation;
- focus never remains inside removed content;
- no flashing/rapid oscillation or photosensitive pattern;
- animations pause offscreen/backgrounded and do not run in dense operational screens;
- DOM/visual order remain coherent for keyboard, controller, and assistive tech;
- frame budget verified on a mid-tier device, not only a developer workstation;
- reduced-motion, forced-colors, high-contrast, RTL, 200% text, and narrow viewport paths inspected;
- one sentence recorded for why each signature motion exists and what replaces it when motion is unavailable.
