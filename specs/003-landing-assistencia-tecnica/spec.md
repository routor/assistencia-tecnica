# Feature Specification: Landing Assistência Técnica

**Feature Directory**: `003-landing-assistencia-tecnica`

**Created**: 2026-07-09

**Status**: Ready for planning

**Normative inputs**: `plano_macro_landing_assistencia_tecnica_codex_claude.md`,
`spec_seguranca_codigo_supply_chain.md`, and `.specify/memory/constitution.md`

## Context and Validation Objective

This feature is a Brazilian Portuguese landing page at `/assistencia-tecnica` that tests whether
owners and managers of small bench/workshop repair businesses demonstrate qualified interest and
willingness to pay for a future, simple management product. It is not the product. It must make
the validation status unmistakable while showing the proposed journey from equipment intake to
delivery and warranty.

The primary audience operates a 1-10 person repair business for phones/tablets, computers,
electronics, appliances, commercial equipment, or technical tools and currently relies on paper,
spreadsheets, WhatsApp, or an unsatisfactory system. Field-service companies, automotive shops,
large authorized networks, and consumers seeking a repair are outside the primary audience.

The central validation question is whether this audience shows intent to pay for a solution that
organizes intake condition and accessories, identification, evidence, diagnosis, quote, approval,
repair/status, parts, collection, delivery, and warranty. The primary conversion is a qualified,
free, no-commitment registration for early access, an interview, and/or a future pilot.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognize the problem and proposed value (Priority: P1)

As an owner or manager of a small repair business, I want to recognize my daily workflow and
understand the proposed intake-to-warranty solution so that I can decide whether a future pilot is
relevant without being misled into thinking the product already exists.

**Why this priority**: A visitor who cannot immediately identify the audience, problem, value, and
validation status will neither trust the page nor produce meaningful validation evidence.

**Independent Test**: A first-time visitor at either target viewport can identify the intended
audience, validation status, proposed lifecycle, primary CTA, and conceptual nature of product
views without submitting the form.

**Acceptance Scenarios**:

1. **Given** a repair-business owner arrives at `/assistencia-tecnica`, **When** the first viewport
   is presented, **Then** the page identifies assistance-technical businesses, states that the
   project is in validation, explains the core value, and offers “Quero participar do piloto”.
2. **Given** the visitor continues through the page, **When** the process narrative is read,
   **Then** it covers intake, evidence/registration, diagnosis, quote, approval, repair/status,
   delivery, and warranty in that order.
3. **Given** a conceptual device record, status timeline, or quote is shown, **When** the visitor
   encounters it, **Then** it is visibly labeled “Visão do produto” or equivalent concept wording.
4. **Given** the visitor compares fit, **When** the audience section is read, **Then** it clearly
   distinguishes bench/workshop assistance from field service, automotive shops, large networks,
   and repair-seeking consumers.
5. **Given** the visitor wants more information, **When** the FAQ and pilot explanation are read,
   **Then** they explain supported categories, mobile access as a future intent rather than a
   released claim, future pricing uncertainty, data purpose, and current validation status.

---

### User Story 2 - Register qualified interest safely (Priority: P1)

As a qualified repair-business owner or manager, I want to submit contact and business context in
two short, accessible steps so that I can volunteer for early access, an interview, or a future
pilot and understand how my data will be used.

**Why this priority**: Qualified, persisted interest is the experiment's primary conversion and
must be trustworthy, accessible, idempotent, and useful for validation.

**Independent Test**: A visitor can complete both steps in about two minutes, correct errors,
submit once, receive an accessible success outcome, and reach the assistance-technical thank-you
state only after successful persistence.

**Acceptance Scenarios**:

1. **Given** a visitor begins the form, **When** step 1 is presented, **Then** it requests name,
   business name, WhatsApp, optional email, and primary repair category with real labels.
2. **Given** valid step-1 data, **When** the visitor advances, **Then** step 2 requests team size,
   monthly intake volume, current process, main bottleneck, priority features, frequency of customer
   status questions, considered price range, interview permission, and explicit privacy consent.
3. **Given** invalid or incomplete required data, **When** the visitor advances or submits,
   **Then** clear Portuguese errors are associated with affected fields, focus is managed, entered
   data is preserved, and no lead is persisted.
4. **Given** valid data and consent, **When** the visitor submits, **Then** controls prevent a
   double submission, the lead is persisted once, and the visitor reaches
   `/obrigado?vertical=assistencia-tecnica`.
5. **Given** the same normalized WhatsApp is resubmitted for the same vertical, **When** persistence
   occurs, **Then** the outcome is successful and idempotent without a second lead record.
6. **Given** persistence fails, **When** the submit attempt completes, **Then** the visitor sees a
   safe retryable message without internal details, remains on the form with entered data, and no
   success state or success conversion is emitted.
7. **Given** the honeypot indicates automated submission, **When** the form is submitted, **Then**
   no business lead is persisted and the response does not reveal the anti-abuse mechanism.

---

### User Story 3 - Preserve attribution without exposing personal data (Priority: P2)

As the validation owner, I want consistent, privacy-safe funnel events and campaign attribution so
that interest can be measured without sending contact data or open answers to analytics platforms.

**Why this priority**: The validation requires reliable funnel measurement, but analytics must not
expand the personal-data exposure created by the form.

**Independent Test**: The full journey exposes the defined non-PII event sequence and attribution,
with exactly one conversion success only after persistence, while inspection shows no PII or open
answers in analytics payloads.

**Acceptance Scenarios**:

1. **Given** a campaign visit includes supported UTMs or `gclid`, **When** the visitor navigates the
   page and submits, **Then** attribution is preserved through persistence without being accepted as
   an authoritative vertical or landing path.
2. **Given** the visitor advances, encounters validation errors, submits, succeeds, or receives an
   error, **When** each funnel milestone occurs, **Then** the corresponding approved event is emitted
   with only approved common properties.
3. **Given** persistence succeeds once, **When** analytics is inspected, **Then**
   `lead_submit_success` occurs exactly once for that accepted attempt and is the only event eligible
   for Google Ads conversion; inserted and idempotent-existing outcomes remain outwardly identical,
   while unique database rows are the canonical qualified-lead metric.
4. **Given** any event is inspected, **When** its payload is reviewed, **Then** it contains no name,
   phone, email, business name, city, state, open answer, full form payload, or raw IP.
5. **Given** the thank-you route is opened for the supported vertical, **When** it is presented,
   **Then** it emits `thank_you_view` and reiterates the validation/interview/pilot status.

---

### User Story 4 - Understand privacy and contact boundaries (Priority: P2)

As a prospective participant, I want a clear privacy notice and contact/deletion path so that I can
make an informed choice and later request removal of my lead.

**Why this priority**: Clear purpose, consent, and deletion instructions are required for trust and
LGPD-aligned data handling.

**Independent Test**: A visitor can reach a Portuguese privacy page from the landing and form,
understand purposes and data categories, and find a documented channel/process for deletion.

**Acceptance Scenarios**:

1. **Given** the visitor reviews the form or footer, **When** privacy information is selected,
   **Then** `/privacidade` explains research, pilot contact, validation purpose, data categories,
   analytics boundaries, deletion process, and controller contact placeholders that must be
   configured before production.
2. **Given** the consent control is presented, **When** the visitor has not actively selected it,
   **Then** submission is not accepted and no lead is persisted.
3. **Given** a deletion request is received through the published channel, **When** the documented
   procedure is followed, **Then** the lead can be located by normalized contact data and removed
   without exposing unrelated leads.

### Edge Cases and Failure Handling

- Direct navigation to the thank-you route MUST NOT create or imply a conversion success; only the
  persisted submission path can emit `lead_submit_success`.
- Unknown or manipulated `vertical` and `landing_path` client values MUST be ignored/rejected in
  favor of server-authoritative allowlisted values.
- Unsupported or overlong attribution values MUST be safely rejected or bounded; they MUST NOT
  become executable content or unbounded database input.
- WhatsApp input with punctuation, spaces, Brazilian country code variations, too few/many digits,
  or non-digit content MUST receive deterministic normalization/validation behavior.
- Duplicate submissions racing concurrently MUST resolve through a database uniqueness guarantee,
  not only a client-side disabled button.
- A missing optional email, city, state, or campaign parameter MUST NOT prevent submission.
- A database timeout/unavailability MUST preserve form state, disclose no internals, and allow a
  deliberate retry without duplicate success emission.
- Analytics, GTM, or ad scripts blocked by privacy tools or network failure MUST NOT block content,
  form completion, persistence, or redirection.
- Long Portuguese labels, 200% zoom, keyboard-only use, reduced-motion preference, slow network,
  and 390x844 viewport MUST remain usable without clipped content or lost focus.
- A failed conceptual image or decorative asset MUST not remove critical meaning; semantic text and
  process labels remain sufficient.
- The form MUST never collect passwords, unlock patterns, device credentials, or customer repair
  data; unexpected content in open fields is treated as untrusted text.
- The system MUST NOT log PII or raw form payloads even on validation, database, analytics, or
  unexpected exceptions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The experience MUST be available at `/assistencia-tecnica` with unique title,
  description, absolute canonical URL, and complete social metadata.
- **FR-002**: The first viewport MUST identify small assistance-technical businesses, communicate
  the core intake-to-warranty promise, state “Projeto em validação” or equivalent, show the primary
  CTA, and state that registration is free and without commitment.
- **FR-003**: The primary CTA MUST use pilot/early-access/interview intent, appear above the fold,
  and move focus/scroll to the interest form without deceptive urgency.
- **FR-004**: The page MUST contain the eleven content areas defined in the macro plan: hero,
  recognizable scene, current-process risks, proposed flow, benefits, conceptual product view,
  fit/non-fit, pilot explanation, FAQ, interest form, and footer.
- **FR-005**: The proposed flow MUST explicitly present intake -> registration/evidence -> diagnosis
  -> quote -> approval -> repair/status -> delivery/warranty.
- **FR-006**: Conceptual device record, timeline, quote, and any product-like visual MUST be labeled
  as a concept/“Visão do produto” and MUST NOT imply existing functionality.
- **FR-007**: Copy MUST serve phone/tablet, computer/notebook, electronics, appliances, commercial
  equipment, and technical tools without collapsing into generic field service.
- **FR-008**: The page MUST state who it serves and explicitly exclude generic field service,
  automotive shops, large authorized networks, and consumers seeking repair.
- **FR-009**: The page MUST NOT contain invented testimonials, customer/logo walls, ratings,
  customer/revenue metrics, or unsupported claims.
- **FR-010**: The page MUST NOT claim that WhatsApp automation, invoicing, inventory, payments,
  notifications, or dispute elimination is currently available.
- **FR-011**: The form MUST be divided into two short steps and display the estimated duration
  “cerca de 2 minutos”.
- **FR-012**: Step 1 MUST collect required name, business name, WhatsApp, primary segment, and
  optional email using visible labels.
- **FR-013**: Step 2 MUST collect team size, monthly volume, current process, main bottleneck,
  priority features, customer-status frequency, price range, optional interview permission, and
  required privacy consent.
- **FR-014**: `repair_categories` MUST support: celulares/tablets, computadores/notebooks,
  eletrônicos, eletrodomésticos, equipamentos comerciais, ferramentas, outro.
- **FR-015**: `team_size` MUST support: trabalha sozinho, 2-3, 4-6, 7-10, mais de 10.
- **FR-016**: `monthly_intakes` MUST support: até 30, 31-100, 101-250, 251-500, mais de 500.
- **FR-017**: `current_process` MUST support: papel, planilha, WhatsApp, sistema genérico, sistema
  de assistência, ERP, outro.
- **FR-018**: `main_bottleneck` MUST support: entrada/evidência, identificação, diagnóstico,
  orçamento/aprovação, status ao cliente, peças, entrega/retirada, garantia, relatórios.
- **FR-019**: `priority_features` MUST support the twelve proposed choices from device record and
  photos through messages, delivery, warranty, and reports, with an explicit bounded selection rule
  documented in the form contract.
- **FR-020**: `customer_status_frequency` MUST support: raramente, algumas vezes por semana,
  diariamente, muitas vezes ao dia.
- **FR-021**: `price_range` MUST support: até R$79, R$80-129, R$130-199, R$200-299, R$300+, não sei.
- **FR-022**: All submitted values MUST be validated on the trusted server boundary; validation
  errors MUST be field-specific, clear, accessible, and preserve safe user input.
- **FR-023**: The server MUST normalize WhatsApp consistently and enforce one lead per normalized
  WhatsApp and vertical.
- **FR-024**: A repeat or concurrent duplicate submission for the same normalized WhatsApp and
  vertical MUST produce a successful idempotent result without a second lead.
- **FR-025**: The form MUST include a non-disclosed honeypot and double-submit protection without
  relying on either as the database uniqueness control.
- **FR-026**: The system MUST persist the common lead fields and the complete approved
  assistance-technical answer set, including consent and attribution, only after valid submission.
- **FR-027**: `vertical` MUST be persisted as `assistencia-tecnica` and `landing_path` as
  `/assistencia-tecnica` from server-authoritative values, not client assertions.
- **FR-028**: Successful persistence MUST redirect to
  `/obrigado?vertical=assistencia-tecnica`; failure MUST remain retryable and MUST NOT redirect.
- **FR-029**: The thank-you page MUST explain that the product is in validation and that contact may
  occur for an interview or future pilot.
- **FR-030**: The page MUST preserve supported UTM fields and `gclid` from landing through valid
  submission using bounded, inert values.
- **FR-031**: The approved analytics event set MUST be exactly: `landing_view`,
  `primary_cta_click`, `lead_form_start`, `lead_form_step_1_complete`,
  `lead_form_validation_error`, `lead_submit_attempt`, `lead_submit_success`,
  `lead_submit_error`, and `thank_you_view`.
- **FR-032**: Approved common event properties MUST be limited to `vertical`, `landing_path`,
  `cta_location`, `form_step`, supported UTM fields, and `gclid_present`; PII and open answers are
  forbidden.
- **FR-033**: `lead_submit_success` MUST be emitted exactly once only after the server returns the
  same safe accepted result for an inserted or idempotent-existing persistence outcome. Google Ads
  conversion MUST depend only on this event; unique database rows, not browser success count, are
  the canonical qualified-lead metric to avoid a duplicate-membership oracle.
- **FR-034**: Analytics-script failure or blocking MUST not block form validation, persistence, or
  success navigation.
- **FR-035**: `/privacidade` MUST explain in clear Portuguese the controller/contact fields,
  purpose, categories, consent, analytics boundaries, retention basis, deletion request procedure,
  and participant rights; production release is blocked until real controller/contact details are
  supplied.
- **FR-036**: The footer MUST link to privacy and contact information and repeat the validation
  status without creating cross-links between campaign verticals.
- **FR-037**: Documentation MUST define the manual GTM/GA4/Google Ads configuration and a safe lead
  deletion procedure.

### Non-Functional Requirements

- **NFR-001**: All primary journeys MUST be fully usable by keyboard with visible focus, logical
  order, semantic landmarks/headings, real labels, and correctly associated errors/status messages.
- **NFR-002**: Text and controls MUST meet WCAG 2.2 AA contrast; the main routes MUST have zero
  critical or serious automated accessibility violations.
- **NFR-003**: Motion MUST be purposeful, must not gate content visibility, and MUST provide a
  reduced-motion alternative.
- **NFR-004**: The complete landing and conversion flow MUST be accepted at 390x844 and 1440x900,
  including 200% zoom and slow-network loading behavior.
- **NFR-005**: Mobile Lighthouse in production or equivalent preview MUST reach Performance >=90,
  Accessibility >=95, Best Practices >=95, and SEO >=90 under a recorded repeatable profile.
- **NFR-006**: LCP MUST be <=2.5 seconds and CLS <=0.1 under that same recorded profile.
- **NFR-007**: Analytics MUST load without render blocking; avoid autoplay video, excessive client
  JavaScript, and heavy or unoptimized imagery.
- **NFR-008**: The two-step form SHOULD be completable by a representative qualified visitor in
  about two minutes, excluding time spent reading the landing.
- **NFR-009**: Database errors and unexpected exceptions MUST return safe Portuguese messages and
  MUST NOT disclose stack traces, queries, schema, credentials, or provider details.
- **NFR-010**: PII, complete payloads, secrets, and raw IP addresses MUST NOT be emitted to logs,
  analytics, reports, test snapshots, or client bundles.
- **NFR-011**: Security headers MUST be defined and validated with a narrow policy compatible with
  required assets and GTM; broad unsafe directives require a registered exception and block release
  until accepted.
- **NFR-012**: The page MUST render correctly in current Chromium desktop and the defined mobile and
  desktop viewports with JavaScript enabled; form loading MUST be tested under slow network.
- **NFR-013**: The visual system MUST follow `DESIGN.md`, use Impeccable throughout implementation,
  and maintain structural comparability with the other two planned landing variants.
- **NFR-014**: No application or campaign release may occur until all automated and human security,
  accessibility, analytics, persistence, performance, visual, and documentation gates pass.

### Security and Supply-Chain Requirements

- **SEC-001**: Security MUST be continuous and every change MUST pass applicable automated controls
  before it is considered complete.
- **SEC-002**: External dependencies MUST be minimized; every new package MUST have its package,
  version, purpose, necessity, considered alternatives, license, production/development scope, and
  security results recorded in the Claude Code execution report.
- **SEC-003**: `package.json` and `pnpm-lock.yaml` MUST be reviewed by Codex; an unexplained package
  or lockfile change blocks approval.
- **SEC-004**: The lockfile MUST be versioned and CI MUST install with
  `pnpm install --frozen-lockfile`.
- **SEC-005**: `pnpm audit --audit-level high` MUST run as a complementary gate and MUST NOT replace
  other scanners or review.
- **SEC-006**: Trivy MUST run the normative filesystem command with `vuln,secret,misconfig`,
  `HIGH,CRITICAL`, and exit code 1; applicable infrastructure, container, image, and license scans
  MUST be added when those artifacts exist.
- **SEC-007**: High or Critical Trivy/dependency findings MUST block delivery and MUST NOT be ignored
  merely to release.
- **SEC-008**: CodeQL or Semgrep MUST run on pull requests and before final Codex approval, covering
  untrusted input, injection, XSS, unsafe APIs/URLs, data exposure, Server Actions/route handlers,
  command execution, and AI-generated unsafe patterns.
- **SEC-009**: Critical or High SAST findings MUST be corrected or formally assessed; unresolved
  Critical/High findings block delivery under the severity policy.
- **SEC-010**: Dependabot Alerts, Security Updates, and weekly dependency updates MUST be enabled;
  no dependency update may auto-merge without tests, build, scanners, and Codex review.
- **SEC-011**: Socket MUST be integrated into dependency-change review and evaluate install scripts,
  obfuscation, unexpected network/shell/filesystem/environment access, typosquatting, maintainer
  changes, and compromise signals.
- **SEC-012**: GitHub Secret Scanning and Push Protection MUST be enabled when repository capability
  permits; Trivy secret scanning remains mandatory regardless.
- **SEC-013**: Credentials MUST NOT be stored in source, versioned files, docs, examples, tests,
  logs, screenshots, or reports; only environment/secret-store mechanisms may hold them.
- **SEC-014**: A detected secret MUST immediately block delivery, trigger revocation and rotation,
  require log/history review, and produce an incident record without reproducing the secret.
- **SEC-015**: All database access MUST use parameterized operations and least-privilege production
  credentials that are server-only.
- **SEC-016**: Client-controlled `vertical`, path, attribution, price, consent, and answer values MUST
  be validated, bounded, and server-authorized; untrusted strings MUST never become executable HTML,
  script, SQL, shell input, or unsafe redirects.
- **SEC-017**: The ordered pull-request gate MUST be: lint -> typecheck -> unit tests -> integration
  tests -> build -> pnpm audit -> Trivy -> CodeQL/Semgrep -> E2E -> Claude report -> Codex review.
- **SEC-018**: Severity action MUST be Critical=immediate block, High=block, Medium=mandatory analysis
  and record, Low=risk-based planned correction, exposed secret=immediate block and rotation.
- **SEC-019**: Automatic destructive or broad vulnerability fixes, including
  `npm audit fix --force`, MUST NOT be used; upgrades require targeted review and full regression
  gates.
- **SEC-020**: Every security exception MUST record vulnerability ID, affected component, technical
  justification, estimated impact, existing mitigation, accepting owner, and review deadline; no
  exception may be silent.
- **SEC-021**: Claude Code MUST NOT disable scanners, lower severity thresholds, ignore findings,
  silently add dependencies, or alter security requirements.
- **SEC-022**: The execution report MUST contain the security section required by the normative
  security spec, including tool execution, dependencies, findings, fixes, exceptions, secrets, and
  known risks.
- **SEC-023**: Codex MUST independently inspect code, dependencies, scanner outputs, and the report;
  a passing pipeline alone MUST NOT cause approval.
- **SEC-024**: Future-only controls (`govulncheck`, container-image scanning, SBOM/signing, DAST) MUST
  not be falsely implemented in this landing phase, but tasks MUST add the applicable scanner if
  future Go, Docker, or release artifacts enter scope through an approved constitution change.

### Key Entities

- **Lead**: A qualified expression of interest. It includes a generated identifier, authoritative
  vertical and landing path, contact/profile fields, normalized WhatsApp, structured business
  answers, explicit consent, interview permission, attribution fields, and creation time.
- **Vertical Answers**: The bounded assistance-technical response set for repair categories, team
  size, monthly intake, current process, bottleneck, priority features, customer-status frequency,
  and considered price range. It belongs to one Lead.
- **Attribution Context**: Optional, bounded UTM fields and `gclid` captured from the landing visit
  and persisted with the Lead. It contains no PII by design.
- **Analytics Event**: A member of the fixed funnel event vocabulary with approved non-PII
  properties. Persistence success governs conversion eligibility.
- **Security Exception Record**: A formal, time-bounded acceptance record containing the fields in
  SEC-020. No record authorizes bypass of secret exposure or unaccepted Critical/High risk.
- **Execution Evidence**: Claude Code's report, scanner/test results, screenshots, dependency table,
  migration record, deviations, and environment notes used for independent Codex review.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a first-viewport review at 390x844 and 1440x900, all evaluators can identify the
  audience, proposed value, validation status, and primary pilot CTA without scrolling.
- **SC-002**: Every step in the intake-to-warranty lifecycle is present in correct order and every
  product-like view is explicitly labeled conceptual in content review.
- **SC-003**: A representative valid lead can complete the two-step form in about two minutes, is
  persisted once, and reaches the correct thank-you state.
- **SC-004**: Repeating the same normalized WhatsApp for `assistencia-tecnica`, including a
  concurrent double attempt, produces one lead record and a successful idempotent user outcome.
- **SC-005**: Every required invalid-field, database-failure, honeypot, loading, and retry scenario
  has an accessible, non-disclosing outcome and never emits a false success conversion.
- **SC-006**: The nine approved funnel events appear with the specified semantics;
  `lead_submit_success` appears exactly once per accepted inserted/idempotent-existing attempt, and
  reporting distinguishes browser completions from canonical unique stored leads.
- **SC-007**: Automated and manual inspection finds zero PII/open-answer values in analytics, logs,
  public error messages, client bundles, reports, and committed examples.
- **SC-008**: The primary routes have zero critical or serious accessibility violations and pass
  keyboard, visible-focus, reduced-motion, contrast, label/error association, and 200% zoom review.
- **SC-009**: The recorded mobile Lighthouse run meets Performance >=90, Accessibility >=95, Best
  Practices >=95, SEO >=90, LCP <=2.5s, and CLS <=0.1.
- **SC-010**: Lint, typecheck, unit, integration, build, audit, Trivy, SAST, E2E, and the required
  report all pass in the mandated order with no unaccepted Critical/High finding or exposed secret.
- **SC-011**: Every added dependency has all eight required justification/security fields and no
  unexpected lockfile change remains unexplained at Codex review.
- **SC-012**: The requirements-to-tasks-to-tests-to-security matrix has 100% coverage for all FR,
  NFR, SEC, and buildable SC identifiers before implementation handoff.
- **SC-013**: Content review finds zero fabricated proof, zero device-credential collection, zero
  out-of-scope SaaS implementation, and zero claim that the proposed product is already available.
- **SC-014**: Paid traffic remains disabled until the production release gate has evidence for real
  persistence, validated conversion, published privacy details, no console errors, reviewed target
  screenshots, and an `APPROVED` or `APPROVED_WITH_NOTES` Codex decision.

## Assumptions

- The landing is the first implementation in a repository intended eventually to hold three
  comparable vertical pages; this feature establishes shared infrastructure without implementing
  the other two pages.
- Users have JavaScript enabled, as required by the macro plan; resilience focuses on blocked
  analytics rather than a no-JavaScript form submission.
- A managed, standard PostgreSQL service will be provisioned externally; application behavior may
  not depend on provider-specific APIs.
- The production operator will supply the canonical origin, database URL, GTM container ID,
  privacy-controller identity/contact, and deletion request channel through approved configuration
  before the corresponding release gate.
- Interview permission is optional and distinct from required consent for storing/submitting the
  lead; consent wording must make purposes explicit.
- Lead retention duration is an owner/legal decision and must be published before production; until
  set, campaign release is blocked and the implementation must not invent a period.
- Rate limiting beyond honeypot, validation, uniqueness, and platform protections is deferred unless
  abuse evidence or a security review establishes a threshold; any added service/package requires
  scope and dependency approval.

## Dependencies, Risks, and Pending Decisions

### External Dependencies

- Managed PostgreSQL provisioning and least-privilege credentials.
- Vercel project, preview/production environment variables, and protected production deployment.
- GTM/GA4/Google Ads configuration and identifiers.
- GitHub repository capabilities for Actions, Dependabot, CodeQL, Secret Scanning, Push Protection,
  and branch protection.
- Socket organization/repository integration for pull-request dependency analysis.
- Approved privacy-controller identity, public contact channel, lead retention period, and deletion
  request owner.

### Recorded Risks

- A shared parent Git repository currently contains unrelated changes outside this project
  directory; implementation MUST scope git operations to this project and MUST NOT modify or commit
  neighboring work.
- The planning environment does not provide a `node` executable, so Impeccable context/palette
  scripts and application commands cannot run here; Claude Code must establish Node.js LTS before
  implementation and record the exact runtime.
- Missing production controller/contact, retention, canonical origin, or GTM values block release
  but do not block provider-neutral implementation with validated configuration contracts.
- Third-party analytics and security services can be unavailable or repository-plan constrained;
  absence must be recorded as a blocking external configuration gap, never represented as passed.
- Identical inserted/existing public outcomes protect participant membership but a genuine repeat
  may increment browser/Ads success; validation reporting MUST use unique stored leads as the primary
  count and disclose the browser-completion distinction.
- Dark, technical visuals can drift into generic AI/cyberpunk/dashboard aesthetics; `DESIGN.md`,
  Impeccable evidence, and concept labels mitigate this risk.

### Pending Owner Decisions Before Production (non-blocking for implementation)

- **PD-001**: Choose Neon or Supabase PostgreSQL based on operational ownership; standard PostgreSQL
  compatibility and a single server-only connection URL remain mandatory.
- **PD-002**: Supply the final public brand/product name and authorized contact identity; until then,
  neutral descriptive naming is used and no invented logo is allowed.
- **PD-003**: Approve the public privacy-controller identity, contact/deletion channel, and retention
  period before production.
- **PD-004**: Supply the production canonical origin and GTM/GA4/Google Ads identifiers before
  metadata/conversion validation.
- **PD-005**: Confirm repository/organization entitlement and administrators for Socket, GitHub
  Secret Scanning, Push Protection, branch protection, and Dependabot settings.
- **PD-006**: Approve the final licensed type family after catalog/license and performance review;
  the design brief defines selection criteria and forbids reflex-default families.

## Explicit Exclusions

This feature excludes the SaaS application, authentication, user/admin dashboards, invoicing,
payments, real WhatsApp integration, operational scheduling, functional service orders, PMOC,
real inventory, notifications, a Go backend, microservices, queues, AI support, paid plans, invite
systems, CMS, and a full blog. It also excludes implementation of the other two campaign verticals;
only shared infrastructure necessary for fair future comparison is allowed.
