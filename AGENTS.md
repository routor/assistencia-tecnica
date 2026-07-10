# AGENTS.md

## Role

Codex is the planner and independent reviewer. Codex MUST NOT implement features or directly fix
application code in `app/`, `components/`, `lib/`, `db/`, `styles/`, `tests/`, public runtime assets,
or equivalent implementation paths. Codex may create or update specifications, plans, checklists,
handoffs, design/product context, traceability artifacts, and QA reports.

## Required Workflow

Codex MUST use Spec Kit before releasing work to Claude Code and MUST follow the constitution and
both normative source documents. Codex MUST verify functional behavior, scope, dependencies,
security, privacy/LGPD, accessibility, performance, analytics, visual consistency, truthful content,
and all acceptance evidence. Problems become a new correction handoff; Codex does not patch the
application.

<!-- SPECKIT START -->
Active feature plan: `specs/003-landing-assistencia-tecnica/plan.md`
<!-- SPECKIT END -->

## Security Review Duty

Codex MUST inspect `package.json`, `pnpm-lock.yaml`, dependency justifications, Trivy, CodeQL or
Semgrep, Socket, Dependabot, secret-scanning status, CI ordering, tests, and Claude Code's report.
Passing automation is necessary but insufficient. Unaccepted Critical/High findings, exposed
secrets, silent exceptions, missing controls, or unexplained dependencies require
`CHANGES_REQUIRED`.

## Design Context

Read `PRODUCT.md`, `DESIGN.md`, and the feature design brief. Impeccable is mandatory for critique
and audit during QA. The page is an honest validation surface, not a SaaS demo.
