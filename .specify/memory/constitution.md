<!--
Sync Impact Report
- Version change: template (unratified) -> 1.0.0
- Added principles:
  - I. Validation Scope and Honest Communication
  - II. Fixed Stack, Simplicity, and Dependency Containment
  - III. Security and Supply-Chain Gates (NON-NEGOTIABLE)
  - IV. Data Minimization, Input Trust, and LGPD
  - V. Evidence-Based Quality
  - VI. Accessible, Performant, Impeccable Design
  - VII. Agent Separation and End-to-End Traceability
- Added sections: Mandatory Technical Constraints; Delivery Workflow and Gates
- Removed sections: none (initial ratification)
- Templates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .specify/templates/checklist-template.md (compatible; no change required)
- Runtime guidance: AGENTS.md and CLAUDE.md will be created in this planning cycle.
- Deferred items: none.
-->

# Assistência Técnica Validation Project Constitution

## Core Principles

### I. Validation Scope and Honest Communication

Every deliverable MUST serve validation of demand for the assistance-technical landing page.
The page MUST describe a proposed product in validation, never an available SaaS. It MUST NOT
add authentication, dashboards, payments, operational order-of-service functionality, real
WhatsApp integration, inventory, notifications, a Go backend, microservices, queues, CMS, or
other future-product scope. Mockups MUST be labeled as conceptual. Testimonials, customer counts,
logos, ratings, revenue, or product capabilities MUST NOT be fabricated. The primary conversion
MUST remain a qualified, no-charge, no-commitment expression of interest for early access,
interview, or a future pilot. Rationale: misleading scope invalidates the experiment and creates
ethical and legal risk.

### II. Fixed Stack, Simplicity, and Dependency Containment

Implementation MUST use the approved stack: stable Next.js App Router, strict TypeScript, React,
Tailwind CSS, Server Actions with `useActionState`, Zod, provider-neutral managed PostgreSQL,
Drizzle ORM, GTM-managed analytics, Vitest and Testing Library, Playwright with axe-core, pnpm,
Node.js LTS, Vercel, and Impeccable. A separate Go backend is forbidden in this phase. The
implementation MUST prefer the web platform and existing stack over new packages, abstractions,
or services. Every added dependency MUST be necessary, minimal, maintained, lockfile-pinned, and
fully recorded in the Claude Code execution report with package, version, purpose, necessity,
alternatives, license, scope, and security results. Unjustified dependencies block approval.
Rationale: a small validation surface must not acquire SaaS architecture or hidden supply-chain
risk.

### III. Security and Supply-Chain Gates (NON-NEGOTIABLE)

Security controls in `spec_seguranca_codigo_supply_chain.md` MUST be applied literally and take
precedence over convenience, timing, architecture, or tooling preferences. Every pull request
MUST pass, in order: lint, typecheck, unit tests, integration tests, build, `pnpm audit
--audit-level high`, Trivy filesystem scanning for `vuln,secret,misconfig` at HIGH/CRITICAL with
exit code 1, CodeQL or Semgrep, E2E tests, Claude Code's execution report, and independent Codex
review. Dependabot alerts, security updates and weekly updates; Socket dependency analysis;
GitHub Secret Scanning and Push Protection when available; frozen-lockfile CI installation; and
versioned lockfiles are mandatory. Critical or High vulnerabilities, exposed secrets, or
critical/high unresolved SAST findings MUST block delivery. Scanner disabling, severity reduction,
silent ignoring, auto-merge, and destructive broad fixes such as `npm audit fix --force` are
forbidden. Every exception MUST name the vulnerability, component, justification, estimated
impact, mitigation, accepting owner, and review deadline. Rationale: automated and human review
jointly protect AI-generated code and the dependency chain.

### IV. Data Minimization, Input Trust, and LGPD

The system MUST collect only the data required for research, pilot contact, and validation. It
MUST obtain explicit, unselected privacy consent, disclose purpose in clear Brazilian Portuguese,
provide a documented lead-deletion procedure, and never store a raw IP as business data. It MUST
NOT request device passwords, unlock patterns, or credentials. All client-controlled values MUST
be treated as untrusted and validated server-side; authoritative values such as vertical and
landing path MUST be set or allowlisted by the server. Database access MUST be parameterized.
PII and complete form payloads MUST NOT appear in logs, analytics, error responses, documentation,
tests, screenshots, or execution reports. Secrets MUST remain in environment/secret stores and
MUST NOT reach client bundles. Analytics MUST never receive names, phone numbers, emails, or open
answers. Rationale: the experiment handles identifiable contact data and must minimize both legal
and technical exposure.

### V. Evidence-Based Quality

No task is complete until its applicable automated controls and acceptance evidence pass. The
feature MUST include unit, component, integration, contract where applicable, E2E, accessibility,
analytics, persistence, idempotency, responsive, performance, build, and security validation.
Tests MUST cover success, validation failure, database failure, duplicate submission, loading,
double-submit prevention, analytics exactly-once behavior, and PII exclusion. The execution report
MUST record exact commands, outcomes, created migrations, screenshots, changed files, incomplete
tasks, risks, deviations, dependency evidence, and security findings. Pipeline success alone is
insufficient; Codex MUST inspect code and evidence. Rationale: completion is an evidence claim,
not an implementation claim.

### VI. Accessible, Performant, Impeccable Design

Impeccable is mandatory for product context, shape, critique, responsive adaptation, audit, and
polish. The interface MUST be mobile-first, usable by keyboard, semantically structured, visibly
focused, compatible with reduced motion, and free of critical or serious axe violations. Text and
controls MUST meet WCAG AA contrast; real labels and associated errors are mandatory. At 390x844
and 1440x900 the primary CTA, narrative, conceptual product view, and form MUST remain coherent.
Production or equivalent preview evidence MUST meet Lighthouse mobile Performance >=90,
Accessibility >=95, Best Practices >=95, SEO >=90, LCP <=2.5 s, and CLS <=0.1. The design MUST
follow `DESIGN.md`, avoid generic AI/SaaS styling and deceptive UI, and preserve comparability
across the three planned landing pages. Rationale: visual quality, accessibility, and experiment
comparability are functional requirements.

### VII. Agent Separation and End-to-End Traceability

Codex MUST plan, specify, analyze, produce checklists/handoffs, and perform independent QA; it MUST
NOT implement or directly fix application code. Claude Code MUST implement only approved tasks,
run every gate, use Impeccable during implementation, and produce the required execution report;
it MUST NOT weaken specs, security, stack, or scope. Every functional requirement, non-functional
requirement, security control, acceptance criterion, test obligation, and task MUST have stable IDs
and traceable relationships. Findings become objective correction handoffs rather than direct Codex
edits. Rationale: separation prevents self-approval and makes omissions auditable.

## Mandatory Technical Constraints

- The route is `/assistencia-tecnica`; shared routes include `/privacidade` and
  `/obrigado?vertical=assistencia-tecnica`.
- The shared `leads` model MUST support server-normalized WhatsApp uniqueness per vertical,
  idempotent resubmission, specific answers, attribution parameters, explicit consent, and
  versioned reproducible migrations.
- The approved analytics events are `landing_view`, `primary_cta_click`, `lead_form_start`,
  `lead_form_step_1_complete`, `lead_form_validation_error`, `lead_submit_attempt`,
  `lead_submit_success`, `lead_submit_error`, and `thank_you_view`; paid conversion MUST occur only
  on exactly one `lead_submit_success` after successful persistence.
- Security headers MUST be compatible with Next.js, Vercel, GTM, and the chosen database without
  weakening browser protections by default. Any necessary CSP exception MUST be narrow and
  documented.
- Versions MUST be current stable releases compatible with the Node.js LTS line at initialization,
  recorded in `package.json`, `packageManager`, `.nvmrc` or `engines`, and `pnpm-lock.yaml`.
- The security specification and macro plan are normative source documents. Conflicts MUST be
  logged; the security specification wins.

## Delivery Workflow and Gates

1. Codex MUST complete Constitution -> Specify -> Clarify -> Impeccable shape -> Plan -> Tasks ->
   Analyze -> Checklist before handoff. `speckit-implement` is forbidden for Codex.
2. Claude Code MUST read all planning artifacts and state the read list at the start of its report.
3. Claude Code MUST execute tasks in dependency order and use Impeccable `critique`, `adapt`,
   `audit`, and `polish` before completion.
4. CI MUST install with `pnpm install --frozen-lockfile` and enforce the security gate from
   Principle III. Dependabot updates MUST never auto-merge.
5. Claude Code MUST create `reports/claude-execution-003-landing-assistencia-tecnica.md` with the
   functional, visual, dependency, security, migration, test, and deviation evidence required by
   this constitution and the security specification.
6. Codex MUST independently rerun applicable gates, inspect the diff, `package.json`, lockfile,
   data handling, analytics, screenshots, scanners, and report, then issue `APPROVED`,
   `APPROVED_WITH_NOTES`, or `CHANGES_REQUIRED`.
7. Paid traffic is prohibited until the campaign release gate is fully satisfied, including real
   persistence, conversion validation, published privacy policy, no console errors, reviewed
   screenshots, and explicit validation-state messaging.

## Governance

This constitution supersedes all project guidance except the normative security specification,
which has explicit precedence on security conflicts. Amendments require a documented reason,
impact analysis, updated dependent templates/artifacts, and semantic versioning: MAJOR for removing
or weakening governance, MINOR for new principles or material expansions, PATCH for clarifications.
Compliance MUST be checked during planning, after design, in every pull request, and during final
Codex QA. Exceptions MUST be explicit, time-bounded, owned, and never used to bypass Critical/High
or secret-exposure blocks. If implementation cannot satisfy a MUST, work stops at the safe boundary
and the conflict is escalated; specs MUST NOT be edited merely to make code appear compliant.

**Version**: 1.0.0 | **Ratified**: 2026-07-09 | **Last Amended**: 2026-07-09
