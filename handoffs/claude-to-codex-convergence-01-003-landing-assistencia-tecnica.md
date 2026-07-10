# Handoff Claude Code → Codex (convergence 01): 003 Landing Assistência Técnica

**Status:** Phase 8 convergence **T088–T097 concluídas**. Devolvido para re-review independente do
Codex. **Sem auto-aprovação.** Itens externos/owner permanecem **BLOCKED** (não marcados como pass).

**Responde a:** `handoffs/codex-to-claude-fix-003-landing-assistencia-tecnica-01.md`
(`CHANGES_REQUIRED`) e `reports/codex-qa-003-landing-assistencia-tecnica.md`.
**Delta detalhado:** `reports/claude-execution-003-landing-assistencia-tecnica.md` §17 (+ §6 Dec-4, §10).

---

## Findings resolvidos (F1–F10)

| # | Task | Correção |
|---|---|---|
| F1 | T088 | Honeypot preserva valores: `values: safeValues(formData)` (campo honeypot excluído), igual ao caminho de erro de DB. Assertion de integração exige valores não-vazios + honeypot ausente + 0 linhas. |
| F2 | T089 | Rodapé agora tem link de **contato/remoção** (`/privacidade#direitos`) além de privacidade. Teste unitário cobre ambos. |
| F3 | T090 | Ciclo de vida redesenhado como **ledger** (uma faixa de linhas raiadas, marcadores `n/8` neutros), mantendo a ordem numerada única. Não são mais 8 cards idênticos. |
| F4 | T091 | **Orçamento de âmbar restaurado**: âmbar só no CTA, um marcador de próxima ação, etapa ativa do form e foco. Ciclo de vida sem âmbar; pontos “concluídos” do conceito neutros; multi-select neutralizado. |
| F5 | T092 | 13 slugs de `priority_features` agrupados em 5 categorias de bancada (regra 1–5 e os 13 slugs preservados). |
| F6 | T093 | `CheckboxGroupField` re-sincroniza o estado marcado a partir dos valores ecoados pelo servidor em invalid/error (sem sobrescrever toggles locais). |
| F7 | T094 | “Conceito” em sentence-case (badges), sem eyebrows uppercase/tracked. |
| F8 | T095 | `output:"standalone"` agora só no build Docker (`BUILD_STANDALONE=1`); `pnpm start`/Playwright/Lighthouse usam `next start` normal (sem warning). Docker rebuildado e verificado (200). |
| F9 | T096 | Decisão de fonte registrada (Dec-4/§6): Atkinson Hyperlegible clássica (OFL) — “Next” indisponível no next/font/google; confirmação do owner segue como PD-006. |
| F10 | T097 | Impeccable `detect` re-executado após correções → 0 defeitos reais (só os falsos-positivos de skip-link OKLCH/`#fff` e timestamps do conceito). Findings de design fechados. Evidência antes/depois em §10/§17. |

## Gates (re-executados nesta rodada)

lint **0 (0 warnings)** · typecheck **0** · unit **64** · integration **25** (inclui nova asserção
do honeypot) · build **0** · audit high **0** · Trivy **0/0/0** · E2E **50** (390×844 + 1440×900) ·
Lighthouse **Perf 97 / A11y 100 / BP 96 / SEO 100 / LCP 1.0s / CLS 0** · Docker `up` **200**.

## Escopo e integridade

- Diff restrito a `assistencia-tecnica/` (CIR-002). Nenhum commit feito. Sem PII/segredos em
  logs/screenshots/relatório.
- Specs **não** foram enfraquecidas. FR-019 “twelve” **não** foi “consertado” apagando slug — segue
  como ajuste de texto do Codex/spec.

## Permanece BLOCKED / owner (NÃO aprovado)

CodeQL (run real no CI); Socket/Dependabot/Secret Scanning/Push Protection/branch protection
(PD-005); GTM/GA4/Ads reais (PD-004); controlador/contato/retenção de privacidade (PD-003); DB de
produção + origem canônica (PD-001/PD-004); política LGPL do `sharp` (R-2); arquivo Impeccable do
diretório-pai (D-1); texto FR-019 (Codex/spec).

## Para o re-review do Codex

1. Revalide F1 (honeypot values), F2 (footer contato), F3/F4/F7 (ledger + âmbar + badges) e
   F5/F6 (agrupamento + sync do checkbox).
2. Rode os gates independentes (§17) e a crítica Impeccable independente.
3. Se ainda restar P0/P1, gere `codex-to-claude-fix-...-02.md`; não edite código da aplicação.

Não realizei auto-aprovação; aguardo decisão do Codex.
