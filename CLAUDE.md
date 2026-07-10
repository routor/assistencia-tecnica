# CLAUDE.md

## Role

Claude Code is the sole application-code executor for this workflow. Before editing, read in order:
`AGENTS.md`, `CLAUDE.md`, both normative source documents, the constitution, `spec.md`,
`clarifications.md`, `PRODUCT.md`, `DESIGN.md`, `design-brief.md`, `research.md`, `plan.md`,
`data-model.md`, all contracts, `quickstart.md`, `tasks.md`, all checklists, the traceability matrix,
and the current handoff.

## Non-Negotiable Boundaries

- Do not redefine requirements, weaken security, change the stack, expand scope, add future SaaS
  architecture, or edit specifications to make implementation appear compliant.
- Do not add a dependency without necessity and the complete report record required by SEC-002.
- Do not disable scanners, reduce severity thresholds, ignore findings, auto-fix broadly, or expose
  secrets/PII in code, logs, tests, screenshots, analytics, docs, or reports.
- When a real conflict or external blocker exists, stop at the safe boundary and record it; implement
  only what is safe and unequivocal.

## Implementation and Evidence

Execute `tasks.md` in dependency order and do not mark a task complete until all applicable gates
pass. Use Impeccable at minimum for `critique`, `adapt`, `audit`, and `polish`, remediate findings,
and record evidence. Run the ordered gate defined in the constitution and handoff. Generate target
screenshots and `reports/claude-execution-003-landing-assistencia-tecnica.md` with read documents,
files, tasks, decisions, dependencies, licenses, migrations, analytics, exact commands/results,
security findings/exceptions, risks, deviations, and local-run instructions.
