---
version: "alpha"
name: "Registro de Bancada"
description: "Dark operational-ledger system for the shared validation landing pages."
colors:
  background: "oklch(0.16 0.018 225)"
  surface: "oklch(0.205 0.021 225)"
  surface-raised: "oklch(0.25 0.023 225)"
  surface-strong: "oklch(0.31 0.025 225)"
  text-primary: "oklch(0.95 0.008 225)"
  text-secondary: "oklch(0.76 0.018 225)"
  text-muted: "oklch(0.66 0.018 225)"
  border: "oklch(0.38 0.025 225)"
  border-strong: "oklch(0.52 0.03 225)"
  accent: "oklch(0.79 0.16 84)"
  accent-hover: "oklch(0.84 0.15 84)"
  accent-ink: "oklch(0.20 0.035 84)"
  error: "oklch(0.72 0.16 28)"
  success: "oklch(0.74 0.12 162)"
  focus: "oklch(0.86 0.17 84)"
typography:
  display:
    fontFamily: "Geologica, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5.25rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Geologica, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 620
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline-md:
    fontFamily: "Geologica, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  body-lg:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  body-md:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0em"
  body-sm:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 450
    lineHeight: 1.55
    letterSpacing: "0.005em"
  label:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  none: "0px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  xxl: "64px"
  section: "clamp(72px, 10vw, 144px)"
  gutter: "clamp(20px, 4vw, 56px)"
  content-max: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    height: "52px"
    padding: "14px 22px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    height: "52px"
    padding: "14px 22px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "12px 14px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "clamp(20px, 3vw, 32px)"
---

# Design System: Registro de Bancada

## Overview

The selected direction is probe A, “operational ledger,” strengthened by restrained physical
workbench evidence from probe B. Probe C is rejected because its signal-path treatment reads too
close to monitoring/cyber aesthetics. The reference contact sheet is
`specs/003-landing-assistencia-tecnica/assets/impeccable-direction-probes.png`; it is a directional
test only, not a final comp and not approved page copy.

**Scene sentence:** A repair-shop owner stands at a graphite workbench under bright overhead task
lighting, with a customer waiting and several labeled devices nearby; the dark, low-glare surface
calms visual noise while one amber inspection mark shows the next action.

The color strategy is **Restrained**: dark petroleum-tinted neutrals carry almost all surfaces and a
single amber signal color stays below roughly 10% of the view. The emotional objective is relief
through visible order—never excitement through spectacle. Named anchors are the compact
information hierarchy of a Mitutoyo inspection instrument, the control economy of a Braun T3
radio, and the sequential evidence of a carbon-copy service intake ledger. These are behavioral
anchors, not assets or imitation targets.

## Colors

- The base is petroleum-tinted graphite, never pure black. Adjacent surfaces differ by lightness,
  not blur or decorative shadows.
- Amber is an inspection/next-action signal used for the primary CTA, active process step, visible
  focus, and one or two decisive emphasis moments. It is not sprayed across headings or body copy.
- Error and success colors are semantic exceptions and always include text/icon/state wording so
  color is never the only signal.
- Every token pair used in production must be measured. Body/placeholder text requires at least
  4.5:1; large text and non-text UI require at least 3:1. If an OKLCH token misses, move lightness
  before altering the hue strategy and record the final values.
- Gradients are unnecessary. Gradient text, decorative neon, gray text on colored surfaces, and
  low-contrast muted copy are forbidden.

## Typography

- Voice words: **machined, legible, composed**.
- The planned pair is Geologica for display/headings and Atkinson Hyperlegible Next for prose,
  labels, form controls, and dense explanation. Both must be license-verified and subset/loaded
  through the framework's optimized font path before final acceptance. If either is unavailable,
  choose a materially contrasting, Portuguese-capable, redistributable replacement and record the
  decision; do not fall back to a banned reflex family without approval.
- The display ceiling is 5.25rem and letter spacing never tightens beyond -0.04em. Headings use
  balanced wrapping; body copy uses pretty wrapping and stays within 65-72ch.
- Avoid monospace as a technical costume. Identifiers or examples may use tabular numerals within
  the text family; no additional font package is justified for this landing.
- Do not repeat tiny uppercase tracked eyebrows. Use sentence-case section openings, process labels,
  or direct headings with varied cadence.

## Layout

- Mobile-first single-column reading order; desktop may use asymmetric 5/7 or 7/5 splits where one
  side is narrative and the other is the physical/process artifact.
- Max content width is 1200px with fluid gutters. Section spacing varies deliberately: tight
  problem/risk grouping, generous separation before the proposed process, and a decisive closing
  form zone.
- The hero contains one dominant promise, validation message, CTA, microcopy, and an operational
  artifact. It must not use a hero-metric template.
- The real lifecycle earns one numbered/ordered sequence. Section numbers elsewhere are forbidden.
- Prefer ledger rows, evidence strips, timelines, and grouped form fields over identical card grids.
  A card is used only when containment communicates a real record or state; nested cards are not
  allowed.
- At 390px, lifecycle steps become a readable vertical or horizontally labeled sequence without
  forcing precision swipes. At 1440px, the page must not become sparse or over-wide.

## Elevation & Depth

Depth comes from tonal surfaces, separators, occlusion, and a few purposeful physical textures in
conceptual imagery. Do not pair a 1px border with a wide soft shadow. If a shadow is required for a
focused floating control, blur stays at or below 8px and the same element does not also receive a
decorative border. Glassmorphism is forbidden.

## Shapes

Containers and form controls use 6-14px radii; no card or section exceeds 16px. Full pills are
reserved for compact status tags or one validation badge, not navigation or every label. Lines and
separators are precise, full-width where structure requires them, and never thick colored side
stripes.

## Components

- **Primary CTA:** solid amber, dark ink, at least 44px target, direct pilot copy, visible hover,
  active, focus, pending, and disabled states. Pending text must describe the action.
- **Secondary actions:** quiet text/border treatment; they never compete with the pilot CTA.
- **Validation notice:** a compact, high-contrast statement near the hero and again near the form;
  it is content, not a dismissible alert.
- **Lifecycle:** the page's signature component. Each stage has a concrete noun, short consequence,
  and non-color state cue. On desktop it can read horizontally; mobile must preserve order and
  full labels.
- **Concept view:** a device record/timeline/quote artifact labeled “Visão do produto — conceito”.
  Do not populate it with real PII, fabricated customer names, or realistic claims of availability.
- **Form:** visible label above every control; helper/error regions are stable to limit CLS; groups
  use fieldset/legend; multi-select exposes its selection rule; required consent is unchecked;
  loading and retry preserve entered data and focus.
- **FAQ:** use native semantic disclosure behavior when appropriate, with large targets and visible
  focus; no icon dependency is needed.
- **Evidence imagery:** if used, prefer one decisive, rights-cleared/generated workbench crop or a
  code-native semantic artifact. Do not ship generic broken-phone stock imagery. Critical meaning
  must remain in text.
- **Motion:** one coordinated hero/process introduction and local state transitions only; no
  repetitive fade-on-scroll. Default content is visible without animation, easing is out-quart or
  out-quint, and reduced motion becomes instant/crossfade.

## Do's and Don'ts

- Do repeat “projeto em validação” at decision points and label every concept view.
- Do make the lifecycle and evidence more visually memorable than a fake dashboard.
- Do use real domain vocabulary and clear Brazilian Portuguese.
- Do inspect every target viewport, 200% zoom, long labels, slow-network pending states, keyboard,
  focus, contrast, reduced motion, and asset fallback.
- Do run Impeccable `critique`, `adapt`, `audit`, and `polish`, correct findings, and record evidence.
- Don't use purple-blue gradients, neon, cyberpunk, e-commerce promo motifs, fake proof, or AI
  superlatives.
- Don't use identical icon-card grids, nested cards, excessive pills, huge radii, gradient text,
  decorative CSS grids/stripes, sketchy SVGs, or background blur as visual identity.
- Don't present notifications, WhatsApp automation, stock, invoicing, payment, or a working SaaS as
  available.
- Don't let analytics, motion, imagery, or fonts block the form or core reading experience.
