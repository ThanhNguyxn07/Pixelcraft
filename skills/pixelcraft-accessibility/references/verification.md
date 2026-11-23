# Accessibility verification split

Evidence: WCAG, axe-core, generated-code accessibility repair research.

## Automated evidence (`static` or tool-generated `rendered` when run in renderer)

| Tool/surface | Detects | Does not prove |
|---|---|---|
| axe-core/browser scan | many missing labels/names, contrast, invalid ARIA, landmarks, duplicate IDs | actual usability, correct focus order, meaningful labels, cognitive load |
| Lighthouse accessibility | selected DOM/browser rules | full WCAG conformance |
| Accessibility Inspector/Xcode | iOS/macOS accessibility tree, labels/traits/audit | real VoiceOver task completion |
| Android Accessibility Scanner/Layout Inspector | touch target/content description/contrast heuristics | correct TalkBack flow or meaningful behavior |
| linters/static scanners | banned patterns, hardcoded assumptions | rendered visibility and interaction quality |

Automated zero means “no detected violations in scanned scope,” never “accessible.”

## Manual protocol

1. Keyboard/controller only: complete primary task, reverse direction, close/escape, recover after error.
2. Screen reader: inspect name/role/value/order/status/error/form behavior. Use the platform pairing realistically (NVDA/JAWS+Chrome/Edge, VoiceOver+Safari/iOS, TalkBack+Android/Chrome, orca+Linux).
3. Zoom/reflow/text scaling: 200% or platform largest text where practical; verify clipping/overlap/truncation.
4. Visual modes: dark/light/high contrast/increased contrast/forced colors; inspect state boundaries and focus.
5. Input modalities: touch target one-hand, keyboard, mouse, controller/switch/voice where applicable.
6. Motion/audio: reduced motion, captions/subtitles, flashing, autoplay control.
7. Forms/auth: paste/password manager/autofill, preserve input, error association/recovery, redundant entry.
8. Record scope: build/commit, OS/browser/assistive tech versions, viewport/device, locale/direction, test data, exact task path.

## Reporting language

Use: “axe-core scan of `<scope>` reported zero violations `static`; keyboard checkout flow completed through payment step `rendered`; VoiceOver not tested `not-checked`.”

Never use: “WCAG compliant” unless the full scoped conformance process actually happened and legal/conformance language is intended.
