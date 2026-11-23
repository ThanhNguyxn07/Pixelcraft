# Pixelcraft design rationale

This document explains why Pixelcraft's rules exist. It is written for contributors before they change behavior. It is deliberately prose rather than a citation registry: the goal is to preserve the reasoning and trade-offs in Pixelcraft's own words, not to outsource judgment to a bibliography.

Public standards and platform guidelines such as WCAG 2.2, WAI-ARIA, Apple Human Interface Guidelines, Material Design, DTCG, Unicode CLDR, W3C internationalization guidance, and host documentation remain authoritative in their own domains. This document explains how Pixelcraft uses them; it does not replace them.

## Planning-first

**Rule:** inspect the existing repository or explicitly choose a greenfield stack before visual direction or implementation.

**Why:** UI decisions are constrained by architecture, ownership, data flow, distribution, verification tools, localization, and existing design authority. Without planning, agents confuse greenfield freedom with brownfield obligation and rediscover the same facts repeatedly.

**Trade-off:** planning adds a step before visible output. Pixelcraft accepts that cost because premature visual novelty is usually more expensive to undo than a concise plan is to write.

## Authority order

**Rule:** the explicit user brief outranks project conventions; project conventions outrank platform defaults; platform and legal constraints outrank Pixelcraft guidance; model taste is last.

**Why:** taste is the easiest thing for a model to supply and the least reliable source of authority. Existing products encode decisions, constraints, and user expectations that are invisible in a prompt.

**Trade-off:** Pixelcraft may preserve a choice it would not have invented. That is intentional. The system flags material conflicts instead of silently replacing user or project decisions. An approved design fixes visual intent, but never silently overrides accessibility, legal/platform duties, architecture, security, or existing semantic constraints.

## Divergence and anti-slop

**Rule:** when visual direction is undecided, generate several genuinely different directions, score them, choose one, and record why alternatives lost. Do not rediverge an approved design.

**Why:** single-shot generation tends toward statistically safe layouts, palettes, copy, and components. Repetition across outputs is the root of recognizable AI slop. Deliberate divergence forces contact with subject matter, audience, material, and constraints before convergence on implementation detail.

**Trade-off:** divergence costs tokens and can produce unusable candidates. Pixelcraft treats that as exploration cost, but bounds it: divergence is skipped where the user has already decided the direction and applies only to undecided scope.

## Typography, color, layout, and motion craft

**Rule:** craft decisions must be semantic, systematic, platform-aware, and testable. Type needs role/measure/hierarchy; color needs roles, ramps, contrast behavior, and mode logic; layout needs structure rather than decorative rearrangement; motion needs purpose, duration budget, rendering cost awareness, and reduced-motion fallback.

**Why:** superficial variation is easy to imitate and quickly becomes another template. Durable distinctiveness comes from coherent relationships among content, spacing, rhythm, material, interaction, and platform behavior.

**Trade-off:** systematic craft is less spontaneous than styling by instinct. It can also feel restrictive for expressive work. Pixelcraft still allows deliberate exceptions, but expects them to be named and verified rather than accidental.

## UX states, forms, and flows

**Rule:** design the job, flow, navigation, feedback, validation, recovery, and complete state matrix before polishing pixels.

**Why:** interfaces fail most often at the boundaries: empty data, loading, errors, permissions, long text, offline behavior, interruptions, destructive actions, concurrency, and malformed input. A visually faithful static screen can still be operationally broken.

**Trade-off:** state coverage increases implementation scope. Pixelcraft prefers explicit assumptions and prioritized matrices over pretending one happy-path frame represents the whole product.

## Accessibility floor

**Rule:** accessibility is mandatory unless the user explicitly waives a scoped item. WCAG 2.2 is treated as a floor, not a finish line.

**Why:** semantic structure, keyboard interaction, names/labels, focus visibility, contrast, target size, text scaling, reduced motion, error identity, and non-color meaning determine whether people can use the interface at all. They are not optional polish.

**Trade-off:** some visual concepts require adaptation or rejection. Pixelcraft accepts that constraint because inaccessible fidelity is not fidelity to a usable product.

## Internationalization

**Rule:** plan for text expansion and contraction, script shaping, font fallback, directionality, locale formatting, plural and grammatical variation, input composition, culturally appropriate copy, and emoji behavior from the start.

**Why:** English-shaped layouts hide fragility. Dense CJK text, long compounded words, RTL mirroring, stacked diacritics, line-breaking rules, and localized formats expose assumptions that cannot be fixed by translating strings at the end.

**Trade-off:** early i18n constraints reduce layout freedom and increase test matrices. The benefit is that the design survives real language rather than treating localization as a destructive afterthought.

## Platform idioms

**Rule:** translate principles into the actual stack rather than copying web assumptions into mobile, desktop, data apps, TUI, email, documents, games, spatial UI, or constrained hardware.

**Why:** each platform has its own layout model, input modality, navigation contract, accessibility machinery, performance envelope, packaging limits, and user expectations. Literal visual copying often destroys usability even when it preserves pixels.

**Trade-off:** idiomatic translation means a design will not be byte-identical across platforms. Pixelcraft values behavioral fidelity and user success over false uniformity.

## Design tokens

**Rule:** use semantic tokens with explicit modes, aliases, and export targets rather than scattering leaf hex or measurement values through components.

**Why:** tokens preserve intent across themes, density, platforms, and rebrands. DTCG-style structure gives implementations a shared contract, while semantic naming prevents two visually identical values with different meanings from collapsing into one accidental constant.

**Trade-off:** token architecture requires maintenance and can feel heavy for a tiny prototype. Pixelcraft scales depth to the project but does not treat hard-coded drift as a neutral choice in durable systems.

## Visual QA and verification

**Rule:** claims must carry evidence labels. Rendered inspection, screenshots, overlays, measurements, accessibility checks, and performance evidence outrank compile success or confident prose.

**Why:** agents overestimate visual quality when they inspect only source code. Rendering exposes clipping, contrast failure, font fallback, motion cost, overflow, state mismatch, rasterization differences, and broken interaction.

**Trade-off:** verification is environment-dependent and sometimes impossible. Pixelcraft requires honest `not-checked` or `waived` labels instead of fabricated certainty.

## Evaluations

**Rule:** behavior-changing guidance should be represented by evaluation prompts, expected behaviors, and failure signals.

**Why:** prose that sounds good can still fail to alter agent behavior. Evals expose missing triggers, generic output, ignored constraints, false verification claims, and regressions caused by later edits.

**Trade-off:** evals require maintenance and cannot prove taste. They are regression instruments, not a substitute for human review or rendered evidence.

## Distribution and installer safety

**Rule:** canonical skills remain self-contained; generated adapters are reproducible artifacts; installers default to project scope, avoid privilege escalation, refuse symlink traversal, preserve existing files unless forced, and support dry runs.

**Why:** a skill pack edits the user's workspace. Trust depends on predictable scope, reversible inspection, no hidden overwrite behavior, and clear separation between canonical content and generated integration fragments.

**Trade-off:** supporting fewer verified targets is less flashy than claiming universal compatibility. Pixelcraft chooses explicit support boundaries over unsafe guesses about agent-specific paths.

## Brand and logo craft

**Rule:** identity work starts with strategy, metaphor inventory, many small concepts, silhouette reduction, appropriate reproduction, and small-size evidence. Pixel-art identities additionally require integer-grid discipline, curated palettes, deliberate dithering, and explicit small-size reductions.

**Why:** a logo identifies rather than explaining everything. Detail that looks impressive at hero size often disappears at 16 or 32 px, while mascot and pixel-art systems fail when geometry, palette, or personality is inconsistent.

**Trade-off:** reduction can remove clever detail. Pixelcraft prefers recognition, reproducibility, and contextual appropriateness over decorative complexity.

## Changing these rules

Do not weaken a rule merely because a task is inconvenient. Change the rule when the underlying trade-off changed, when evidence shows the rule produces worse outcomes, or when a platform/standard changed. Record the reason in the commit and update affected skills, evals, and verification tooling together.
