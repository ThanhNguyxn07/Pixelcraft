# Typography

Evidence base: practical type guidance synthesized in `[S67]` `[S68]`; localization requirements `[S81]` `[S82]`; platform scaling expectations `[S62]` `[S63]`.

## Voice before font

Choose a typographic voice from the direction: editorial, instrumental, humanist, technical, archival, playful, ceremonial, or native/platform. “Clean” is not a voice.

| Voice | Pairing behavior | Use carefully for |
|---|---|---|
| editorial | high-contrast serif display + quiet serif/sans text + small metadata sans | publishing, culture, luxury |
| instrumental | legible grotesque + tabular monospace/data figures | dashboards, measurement, operations |
| humanist | warm sans/serif with open apertures | health, education, consumer trust |
| technical | monospace or engineered sans + precise numerals | developer, scientific, industrial |
| archival | text serif + caption/index system | history, museums, documents |
| playful | rounded/display face tightly constrained to headings | games, children, casual commerce |
| native | system type stack and platform scale | high-frequency app UI where platform fit matters most |

Do not default to Inter/Geist-like neutrality everywhere. If a neutral sans is right, state the reason (platform norm, dense data, broad script coverage, brand continuity).

## Scale and measure

- Build a scale with a perceptible ratio: approximately 1.125–1.2 for dense UI, 1.25–1.4 for editorial/marketing. Do not create twelve indistinguishable steps.
- Define roles: display, title, heading, body, body-small, caption, UI control, data/numeric, code/log.
- For long-form Latin text target roughly 65–75 characters per line; shorten for captions/tables and adjust for CJK/Arabic/Indic shaping rather than copying the number blindly.
- Keep paragraph line height approximately 1.45–1.65 for Latin body; tighten large display but avoid clipping ascenders/diacritics. Dense UI can use shorter line height only when measure and scanning remain clear.
- Use tabular figures and consistent decimal alignment for changing numeric data; use proportional figures for prose unless tabular alignment matters.
- Avoid tracking out lowercase body text. Use letterspacing cautiously for uppercase/labels and never as a substitute for hierarchy.
- Limit display tracking compression; extreme negative tracking breaks scripts and platform rendering.

## Fallbacks and international scripts

- Declare fallback behavior per script, not just `sans-serif`. Check Latin extended, Cyrillic, Greek, Arabic, Hebrew, Devanagari/Indic shaping, Thai/Lao/Khmer, CJK, Hangul, emoji, and numeric systems required by the audience.
- Do not fake italics/bold where the font lacks them; use real faces or change emphasis strategy.
- CJK: respect line breaking, punctuation compression, ruby/furigana where applicable, vertical writing only when deliberately supported, and font substitution differences across platforms.
- Arabic/Hebrew: verify joining/shaping, diacritics, ligatures, numeral choice, bidi isolation, and truncation direction.
- Indic/SE Asian scripts: verify conjuncts, vowel signs, line breaking, and adequate vertical metrics.
- Never set translated copy in a Latin-only display face that silently falls back to an uncoordinated system font.

## Platform transfer

- Web: use optical sizing/variable axes only when they improve hierarchy or performance; preload critical fonts responsibly.
- iOS: prefer Dynamic Type-compatible scaling; SF Pro/system defaults are valid when native clarity matters `[S62]`.
- Android: respect sp scaling and Material type roles unless the project owns a deliberate custom system `[S63]`.
- Flutter/RN/Compose/SwiftUI: map semantic roles once; do not hard-code pixel mental models from web CSS.
- TUI: use weight/color/underline/inverse sparingly; no assumed ligatures or variable widths.
- Email: assume limited font support; provide robust websafe fallback stacks and never make meaning dependent on custom fonts.
- Game UI: test bitmap/SDF rendering, localization glyph atlases, memory cost, and controller-distance legibility.
