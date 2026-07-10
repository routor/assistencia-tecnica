# Impeccable Shape Brief: Landing Assistência Técnica

**Status**: Approved default direction for planning

**Date**: 2026-07-09

## 1. Feature Summary

A production-ready, responsive brand landing page for Brazilian owners/managers of small bench and
workshop repair businesses. It must make an often-chaotic repair lifecycle feel traceable, present
the future product honestly as a concept in validation, and convert qualified visitors into a
two-minute pilot/interview registration.

## 2. Primary User Action

Understand that the proposed intake-to-warranty workflow is relevant and voluntarily complete the
qualified interest form. The page must earn that action through recognition and specificity, not
through urgency, fake social proof, or the appearance of a functioning SaaS.

## 3. Design Direction

- **Strategy:** Restrained dark technical palette; amber is the one decisive signal.
- **Scene:** A small-shop owner at a graphite bench under bright task lighting, managing labeled
  devices while a customer waits; visual order lowers stress and exposes the next action.
- **Anchors:** Mitutoyo inspection-instrument hierarchy, Braun T3 control economy, carbon-copy
  service intake ledger sequence.
- **Probe decision:** Direction A wins. Carry over a small amount of physical evidence texture from
  B. Reject C's monitoring/cyber signal path. The probe is stored in `assets/` and is not a final
  comp.

## 4. Scope

- **Fidelity:** Production-ready requirements and design specification.
- **Breadth:** `/assistencia-tecnica`, shared `/privacidade`, and
  `/obrigado?vertical=assistencia-tecnica`, plus responsive/error/success states.
- **Interactivity:** Shipped-quality conversion flow, not a static prototype; conceptual product
  visuals remain non-functional and labeled.
- **Time intent:** Polish until all acceptance, Impeccable, accessibility, performance, analytics,
  and security gates pass.

## 5. Layout Strategy

Begin with a split hero pairing direct validation copy and one operational artifact. Move into a
recognizable messy-process scene, tighten rhythm through risks, then release into the ordered
lifecycle as the signature moment. Benefits and the conceptual record/timeline follow as proof of
thinking, not product availability. Fit/non-fit and pilot/FAQ reduce uncertainty. The form becomes a
focused closing zone with validation language repeated at the decision point.

## 6. Key States

- **Default:** Content, validation status, CTA, and lifecycle are fully understandable.
- **Form untouched/start:** Duration, progress, required/optional distinction, and consent purpose
  are explicit.
- **Step transition:** Focus enters the step heading; entered data persists.
- **Field validation error:** Specific error, stable layout, summary/focus behavior, no persistence.
- **Pending/slow network:** Button is protected, action is announced, content remains readable.
- **Database error:** Safe retry, retained values, no success/conversion.
- **Duplicate/idempotent:** Calm success equal to first valid submission, one stored lead.
- **Success:** Redirected thank-you state reiterates validation/interview/pilot expectations.
- **Analytics unavailable:** Invisible degradation; form and success are unaffected.
- **Reduced motion/asset failure/200% zoom:** Meaning and order remain intact.

## 7. Interaction Model

The primary CTA moves focus to the form. Lifecycle and concept artifacts may use subtle hover/focus
explanation but cannot hide essential information. FAQ uses semantic disclosure. Form step 1
collects contact/profile; step 2 collects validation context and explicit consent. Validation is
available at the trusted boundary and reflected accessibly. Submission provides pending feedback,
persists exactly once, emits success exactly once, and only then navigates to thanks.

## 8. Content Requirements

Use the approved hero promise and pilot CTA, explicit validation microcopy, concrete bench/workshop
pain, the full ordered lifecycle, fit/non-fit, pilot explanation, six-domain FAQ, form labels/options,
privacy purpose and deletion path, safe errors, and thank-you expectations. Any conceptual record
uses fictitious neutral identifiers rather than person-like PII. Required media role: one
operational concept artifact/lifecycle; optional role: one physical evidence crop. Source may be a
rights-cleared/generated raster or code-native semantic structure; omission is acceptable only if
the lifecycle artifact carries the visual identity without generic placeholders.

## 9. Recommended Impeccable References During Implementation

- `reference/critique.md` for conversion hierarchy and trust heuristics.
- `reference/adapt.md` for lifecycle/form transformations across 390x844 and 1440x900.
- `reference/audit.md` for accessibility, performance, responsive, and anti-pattern inspection.
- `reference/polish.md` for final rhythm, typography, interaction, and copy details.
- `reference/typeset.md`, `reference/layout.md`, and `reference/harden.md` when the primary passes
  identify type, spatial, or state shortcomings.

## 10. Open Questions

No design question blocks implementation. PD-002 and PD-006 in `spec.md` require owner confirmation
of final brand naming/contact identity and font licensing before production. Until then the executor
uses neutral descriptive identity and the documented font pair, records licenses, and never invents
a logo.
