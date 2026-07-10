# Security and Quality Requirements Checklist: Landing Assistência Técnica

**Purpose**: Test whether the written requirements are complete, clear, consistent, measurable, and
traceable across security, privacy, conversion, UX, accessibility, performance, and release gates.

**Created**: 2026-07-09

**Feature**: [spec.md](../spec.md)

**Audience/timing**: Formal reviewer gate before Claude Code implementation handoff

**Note**: This is a Spec Kit requirements-quality checklist, not an implementation test script.

## Requirement Completeness

- [ ] CHK001 Are the audience, validation goal, primary conversion, non-audience, and explicit SaaS exclusions all defined without relying on the macro document alone? [Completeness, Spec §Context/§Explicit Exclusions]
- [ ] CHK002 Are requirements present for every required page area, form step, privacy route, thank-you state, and campaign release condition? [Completeness, Spec §FR-001-FR-037]
- [ ] CHK003 Are primary, alternate, validation-error, persistence-error, automation, duplicate, recovery, and direct-navigation scenarios all documented? [Coverage, Spec §US2/§Edge Cases]
- [ ] CHK004 Are all common lead fields and assistance-technical answer fields accounted for, including null/not-collected behavior? [Completeness, Spec §Key Entities; Data Model]
- [ ] CHK005 Are all nine analytics events and every permitted/forbidden property category specified? [Completeness, Spec §FR-030-FR-034; CTR-002]
- [ ] CHK006 Are every mandatory security tool, repository control, severity response, report duty, and agent responsibility explicitly required? [Completeness, Spec §SEC-001-SEC-024]

## Requirement Clarity

- [ ] CHK007 Is “projeto em validação” tied to concrete placements and forbidden availability claims rather than subjective prominence? [Clarity, Spec §FR-002/FR-006/FR-010]
- [ ] CHK008 Is the complete intake-to-warranty order fixed and distinguishable from generic field service? [Clarity, Spec §FR-005/FR-007/FR-008]
- [ ] CHK009 Are every form enum, cardinality, length boundary, optionality rule, consent rule, and authority source unambiguous? [Clarity, Spec §FR-012-FR-027; CTR-001]
- [ ] CHK010 Is the inserted/existing public-result and analytics tradeoff explicit enough to prevent a duplicate-membership oracle and misleading unique-lead reporting? [Clarity, Spec §FR-024/FR-033/SC-004/SC-006]
- [ ] CHK011 Are accessibility and performance adjectives replaced by exact viewports, WCAG target, axe severity, Lighthouse scores, LCP, and CLS thresholds? [Clarity, Spec §NFR-001-NFR-006]

## Requirement Consistency

- [ ] CHK012 Do the form requirements, data model, lead-submission contract, and tasks use the same field names, enums, bounds, and single-primary-category rule? [Consistency, Spec §FR-011-FR-027; Data Model; CTR-001]
- [ ] CHK013 Do consent, interview permission, privacy purpose, retention, and deletion requirements remain distinct and consistent across the spec and CTR-004? [Consistency, Spec §US4/FR-035; CTR-004]
- [ ] CHK014 Do analytics success semantics align across US3, FR-033, SC-006, the plan data flow, and CTR-002? [Consistency, Spec §US3/FR-033/SC-006; Plan §Architecture; CTR-002]
- [ ] CHK015 Does the exact security order remain consistent across the constitution, SEC-017, plan, quickstart, and T010/T083-T085? [Consistency, Spec §SEC-017; Plan §Ordered CI; Tasks]
- [ ] CHK016 Do CodeQL primary/Semgrep fallback requirements prevent a missing or double-counted SAST gate? [Consistency, Spec §SEC-008/SEC-009; Research R-006]
- [ ] CHK017 Are Impeccable duties and visual anti-goals consistent between NFR-013, `PRODUCT.md`, `DESIGN.md`, the design brief, and task phases? [Consistency, Spec §NFR-013; Design Context]

## Acceptance Criteria Quality

- [ ] CHK018 Can every success criterion be objectively evaluated from named tests, reports, screenshots, database evidence, scanner results, or external readbacks? [Measurability, Spec §SC-001-SC-014]
- [ ] CHK019 Is the two-minute form outcome defined as a representative completion measure rather than a universal hard timeout? [Measurability, Spec §NFR-008/SC-003]
- [ ] CHK020 Are exactly-once event expectations scoped to one page view, form session, attempt, or accepted outcome as appropriate? [Measurability, CTR-002]
- [ ] CHK021 Are campaign release criteria separately measurable from implementation completion and owned by Codex/external administrators where required? [Acceptance Criteria, Spec §SC-014/PD-003-PD-005]
- [ ] CHK022 Does 100% traceability have a defined population and canonical matrix rather than an unbounded aspiration? [Measurability, Spec §SC-012; Traceability Matrix]

## Scenario and Edge-Case Coverage

- [ ] CHK023 Are sequential and concurrent duplicates, invalid contact formats, absent optional fields, and hostile attribution values all addressed? [Coverage, Spec §Edge Cases/FR-023-FR-030]
- [ ] CHK024 Are blocked analytics, direct thank-you navigation, back navigation, double click, rerender, and slow-network states covered? [Coverage, Spec §US2/US3; CTR-002]
- [ ] CHK025 Are database timeout, migration failure/recovery, safe retry, and non-desclosing errors specified without destructive rollback assumptions? [Coverage, Spec §Edge Cases/NFR-009; Data Model §Migration]
- [ ] CHK026 Are keyboard, focus, 200% zoom, reduced motion, long Portuguese text, asset failure, and both target viewports covered? [Coverage, Spec §NFR-001-NFR-004]
- [ ] CHK027 Are lead deletion verification, cross-vertical scope, failure escalation, backup limitations, and retention scheduling documented? [Coverage, CTR-004]

## Security and Supply-Chain Requirement Quality

- [ ] CHK028 Does the dependency policy require all eight report fields for baseline as well as unexpected packages, with no convenience exemption? [Completeness, Spec §SEC-002/SEC-003]
- [ ] CHK029 Are frozen install, lockfile review, audit, Trivy, license applicability, Socket, SAST, and human review described as complementary controls? [Consistency, Spec §SEC-004-SEC-011]
- [ ] CHK030 Are High/Critical/secret blocking rules and Medium/Low handling consistent and objectively classifiable? [Clarity, Spec §SEC-007/SEC-009/SEC-018]
- [ ] CHK031 Are secret storage, detection, rotation, history/log review, and non-reproduction requirements complete for source, docs, tests, screenshots, and reports? [Completeness, Spec §SEC-012-SEC-014]
- [ ] CHK032 Are trusted-boundary requirements complete for authority fields, XSS/injection, parameterized access, unsafe redirects/URLs, commands, and client bundles? [Coverage, Spec §SEC-015/SEC-016]
- [ ] CHK033 Does every security exception require all seven normative fields, accountable human acceptance, deadline, and a non-bypass lifecycle? [Completeness, Spec §SEC-020; CTR-005]
- [ ] CHK034 Are future Go/container controls triggered only by an approved scope change while remaining explicitly recorded as not currently applicable? [Clarity, Spec §SEC-024]

## Dependencies, Assumptions, and External Gates

- [ ] CHK035 Are managed PostgreSQL, Vercel, GTM/GA4/Ads, GitHub settings, Socket, controller/contact, and retention dependencies each assigned a safe missing-state? [Dependency, Spec §External Dependencies/PD-001-PD-005]
- [ ] CHK036 Does the provider decision preserve standard PostgreSQL behavior and prohibit proprietary APIs regardless of Neon/Supabase choice? [Assumption, Spec §PD-001; Research R-003]
- [ ] CHK037 Are Node/PyYAML planning impediments and the shared-parent-git risk documented without authorizing unplanned installs or unrelated changes? [Risk, Plan §CIR-001/CIR-002/CIR-006]
- [ ] CHK038 Is the font decision bounded by license, Portuguese glyph, performance, and non-reflex design requirements rather than an unreviewed aesthetic preference? [Dependency, Spec §PD-006; DESIGN §Typography]

## Ambiguities and Conflicts

- [ ] CHK039 Are all `[NEEDS CLARIFICATION]`, TODO, placeholder, and contradictory normative statements absent from the handoff artifacts? [Ambiguity, Requirements Checklist; Clarification Report]
- [ ] CHK040 Is security-spec precedence explicit anywhere convenience, platform capability, analytics, CSP, or schedule could conflict with a control? [Conflict, Constitution §Governance; Spec §Normative Inputs]

## Notes

- Each item must be evaluated against the written artifacts before implementation starts.
- A missing or ambiguous security requirement is not an implementation exception; fix the planning
  package or stop the handoff.
