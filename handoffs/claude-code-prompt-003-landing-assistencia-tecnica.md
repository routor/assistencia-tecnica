# Execution Prompt for Claude Code

Act exclusively as the application-code executor for feature
`003-landing-assistencia-tecnica`. Do not redefine scope, stack, architecture, security, design
direction, or acceptance criteria.

Before editing, read and list in your report: `AGENTS.md`, `CLAUDE.md`,
`plano_macro_landing_assistencia_tecnica_codex_claude.md`,
`spec_seguranca_codigo_supply_chain.md`, `.specify/memory/constitution.md`, every file under
`specs/003-landing-assistencia-tecnica/`, `PRODUCT.md`, `DESIGN.md`, and
`handoffs/codex-to-claude-003-landing-assistencia-tecnica.md`.

Implement the 87 tasks in `tasks.md` in dependency order. Write each story's tests first and prove
the intended failure before implementation. Build only the validation landing, shared privacy and
thank-you routes, two-step form, Server Action, PostgreSQL/Drizzle persistence, idempotency,
bounded attribution, fixed `dataLayer` events, GTM documentation, migrations, tests, security
workflows, and required operational docs. Never implement the SaaS or any excluded feature.

Security is non-negotiable and overrides convenience. No task is complete until applicable gates
pass. Use frozen pnpm installs, audit, the exact Trivy HIGH/CRITICAL vuln/secret/misconfig command,
Trivy license applicability, Socket, Dependabot, Secret Scanning/Push Protection when available,
and CodeQL ordered after Trivy and before final E2E. Pin GitHub Actions to immutable SHAs. Never
disable a scanner, lower severity, silently ignore a finding, expose a secret/PII, or use broad force
fixes.

Do not add any dependency silently. Before/with every package addition, record package, version,
purpose, necessity, alternatives, license, prod/dev scope, and security results in
`reports/claude-execution-003-landing-assistencia-tecnica.md`. Unjustified additions block work.

Because Node was unavailable during planning, first security-review and install an exact-version
project-scoped Impeccable integration for both Claude and Codex using pnpm; record its version,
files, license, alternatives, and Socket/audit/Trivy evidence. Do not run an unpinned `npx` command.

Follow `PRODUCT.md`, `DESIGN.md`, and `design-brief.md`. Use Impeccable for `critique`, `adapt`,
`audit`, and `polish`; fix findings and record evidence. The surface is dark, workbench-practical,
instrument-precise, and restrained—not cyberpunk, generic SaaS, electronics retail, or fake
dashboard. Clearly label every product-like view as conceptual. Generate target screenshots with
synthetic data only.

Run the final ordered gate documented in the handoff and quickstart. Produce the complete execution
report with documents read, files, task mapping, dependencies/licenses, migrations, analytics,
screenshots, exact commands/results, security findings/exceptions/secrets, risks, deviations,
external blockers, local instructions, and campaign PASS/BLOCKED matrix.

If any stop condition in the handoff occurs, stop at the safe boundary and report it. Do not invent
production controller/contact/retention/domain/GTM values, touch neighboring repository work, edit
the specs to fit code, claim Codex approval, or release paid traffic. Hand the final report and full
diff back to Codex for independent review.
