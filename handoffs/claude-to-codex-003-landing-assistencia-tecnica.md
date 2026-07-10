# Handoff Claude Code → Codex: 003 Landing Assistência Técnica

**Status:** Implementação concluída e verificada localmente. **NÃO é uma auto-aprovação.** A decisão
final (`APPROVED` / `APPROVED_WITH_NOTES` / `CHANGES_REQUIRED`) é do Codex, via
`checklists/release-review.md`.

**Relatório completo (fonte de verdade das evidências):**
`reports/claude-execution-003-landing-assistencia-tecnica.md` — consulte-o para tabelas detalhadas.

---

## 1. Resumo executivo

Implementada integralmente a feature `003-landing-assistencia-tecnica`: landing honesta em PT-BR em
`/assistencia-tecnica` que apresenta o fluxo proposto entrada→garantia **rotulado como conceito em
validação**, com formulário de interesse em duas etapas acessível, Server Action com persistência
PostgreSQL idempotente, analytics de funil sem PII, páginas `/privacidade` e `/obrigado`, e toda a
infraestrutura de segurança/CI. Stack fixa respeitada (Next.js 16, React 19, TS estrito, Tailwind 4,
Zod, Drizzle+Postgres.js, pnpm, Node 24). Nenhum escopo SaaS excluído foi implementado. Todos os
portões locais aplicáveis passam; itens que dependem de credenciais/serviços externos estão
explicitamente **BLOCKED** (nunca marcados como aprovados).

## 2. Tarefas concluídas e pendentes

- **T001–T087: concluídas** (ver `tasks.md`, todas as caixas marcadas).
- **Pendências externas (não são tarefas de código; bloqueiam release, não a implementação):**
  execução real do CodeQL no GitHub Actions; readbacks de Dependabot/Socket/Secret Scanning/Push
  Protection/branch protection; valores de produção de privacidade/domínio/GTM; provisionamento do
  banco de produção. Ver §11 e a matriz de campanha (§16 do relatório).

## 3. Arquivos criados / alterados / removidos

- **Criados:** todos os listados na §4 do relatório (app, components, lib, db, docs, tests, CI,
  configs, relatório, screenshots). Escopados a `assistencia-tecnica/`.
- **Alterados fora do projeto:** nenhum por mim. **Exceção registrada (D-1):** o instalador do
  Impeccable gravou `/home/rafael/claude-code/.claude/settings.local.json` no diretório-pai
  (vizinho); o harness bloqueou minha remoção por estar fora do escopo. **Ação sugerida ao
  responsável:** remover esse arquivo se o hook global não for desejado (é inócuo).
- **Removidos:** nenhum. **Nenhum commit foi feito** (não solicitado; commit amplo tocaria trabalho
  vizinho — CIR-002).

## 4. Dependências adicionadas

Ver a tabela de 8 campos completa na §3 do relatório. Resumo: baseline aprovada da stack fixa
(`next`, `react`, `react-dom`, `zod`, `drizzle-orm`, `postgres`, `server-only`) + dev
(`typescript`, `tailwindcss`, `eslint(+next)`, `vitest`+TL+jsdom, `@playwright/test`,
`@axe-core/playwright`, `@lhci/cli`, `drizzle-kit`, `impeccable`). Todas **exact-pinned** (0 ranges),
lockfile versionado, `--frozen-lockfile` reproduzível. `impeccable@3.2.1` revisado (Apache-2.0, sem
scripts de install, mantenedor único estabelecido, assinado). Overrides de segurança direcionados:
`tmp`, `postcss`, `uuid`, `esbuild` (patched). Licenças: MIT/Apache-2.0/Unlicense/MPL-2.0; **1 achado
HIGH de licença** = `LGPL-3.0` do binário `libvips` (via `sharp`) — análise: aceitável para uso
server-side dinâmico; **requer confirmação de política do responsável** (§7.4, R-2).

## 5. Decisões técnicas

- **Dec-1:** TypeScript **5.9.3** e ESLint **9.39.4** (não os "latest" 7.0.2/10.6.0) por
  incompatibilidade real com o ecossistema de lint do Next (peers). Ver §6 do relatório.
- **Dec-2:** `proxy.ts` (renomeação do middleware no Next 16) gera o nonce da CSP.
- **CSP nonce + `strict-dynamic`** exige renderização dinâmica → todas as rotas são `ƒ`; performance
  medida e ótima (Perf 100, LCP 0.6s).
- Ação do servidor retorna `success` sem redirect no servidor; cliente emite 1 `lead_submit_success`
  e navega (conversão depende do resultado, não da URL). `inserted`/`existing` indistinguíveis.

## 6. Desvios / diferenças

- **D-1** arquivo do Impeccable no diretório-pai (acima). **D-3** nome da migração
  `0000_create_leads.sql` (drizzle) vs `0001_...` do plano. **D-4** `priority_features`: FR-019 diz
  "doze", `data-model.md` enumera **treze** — implementei os treze (fonte canônica de campo).
  **R-4** normalização de WhatsApp é dígitos-apenas (determinística; não canoniza `+55` porque `55`
  também é DDD válido). Todos sem impacto de segurança; registrados para o Codex.

## 7. Comandos executados

Ver §11 e §15 do relatório (lista ordenada exata com exit codes e durações).

## 8. Resultados reais (lint / typecheck / testes / build / E2E)

- lint **0** · typecheck **0** · unit **64 passed** · integration **25 passed** · build **0** ·
  **E2E 50 passed** (390×844 e 1440×900). Lighthouse **Perf 100 / A11y 100 / BP 96 / SEO 100 /
  LCP 0.6s / CLS 0**.

## 9. Resultados reais dos scanners / segurança

- `pnpm audit --audit-level high`: **0** (após overrides direcionados; antes: 1 HIGH `tmp` dev).
- Trivy `vuln,secret,misconfig HIGH,CRITICAL exit 1`: **0/0/0**. Trivy license: 1 HIGH LGPL (sharp,
  política).
- Segredos: **nenhum** (Trivy + inspeção de diff/bundle). CSP nonce + headers verificados via curl.
- CodeQL: configurado (ordenado após Trivy, antes do E2E); **execução real PENDENTE** no CI.

## 10. Evidências visuais / responsivas / acessibilidade

- Screenshots sintéticos em `reports/screenshots/003-landing-assistencia-tecnica/` (landing, form,
  erro, obrigado, privacidade × 2 viewports). axe: **0 violações sérias/críticas**; Lighthouse A11y
  **100**. Impeccable detect: sem defeitos reais (apenas 2 falsos-positivos de cor no skip-link).

## 11. Limitações por credenciais / permissões / config externa

- CodeQL (run real), Dependabot/Socket/Secret-Scanning/Push-Protection/branch-protection (readbacks
  de admin — PD-005), GTM/GA4/Ads reais (PD-004), controlador/contato/retenção de privacidade
  (PD-003; a página de privacidade **fica fechada/inválida para produção** sem eles), `DATABASE_URL`
  de produção e origem canônica (PD-001/PD-004). Todos **BLOCKED**, nunca "pass".

## 12. Riscos residuais

Ver §14 do relatório: licença LGPL (política), normalização de WhatsApp dígitos-apenas,
discrepância FR-019/data-model, e o arquivo do Impeccable no pai.

## 13. Itens que exigem validação / decisão do responsável

- Aprovar política de licença LGPL (ou remover `sharp`). Fornecer PD-001…PD-006. Habilitar e dar
  readback dos controles externos. Decidir sobre canonizar `+55` no WhatsApp (opcional). Remover o
  arquivo `.claude/settings.local.json` do diretório-pai, se desejado.

## 14. Instruções para execução local

Ver §15 do relatório e `README.md`. Resumo: `corepack enable` → `pnpm install --frozen-lockfile` →
subir PostgreSQL (Docker) → exportar `DATABASE_URL`/`TEST_DATABASE_URL`/`NEXT_PUBLIC_SITE_URL`
(placeholders) → `pnpm db:migrate` → gates (`lint`, `typecheck`, `test`, `test:integration`,
`build`, `pnpm audit`, `trivy fs …`, `test:e2e`, `test:lighthouse`).

## 15. Instruções para o QA final do Codex

1. Use `checklists/release-review.md` (QA001–QA060) e `traceability.md`.
2. Rode os gates de forma independente (§11 do relatório) e compare com os resultados registrados.
3. Inspecione `package.json`/`pnpm-lock.yaml` contra a tabela de 8 campos; confirme 0 ranges e os
   overrides de segurança.
4. Verifique a fronteira da Server Action, parametrização, autoridade de `vertical`/`landing_path`,
   e a igualdade pública `inserted`/`existing` com dados sintéticos.
5. Confirme ausência de PII em analytics/logs/bundle/screenshots/relatório.
6. Rode o CodeQL no GitHub Actions e obtenha os readbacks externos; enquanto ausentes, mantenha o
   portão de campanha **BLOCKED**.
7. Se houver correções, gere `handoffs/codex-to-claude-fix-003-landing-assistencia-tecnica-NN.md`
   com evidência objetiva; **não edite o código da aplicação**.

**Não realizei auto-aprovação.** Entrego o relatório completo e o diff para revisão independente.
