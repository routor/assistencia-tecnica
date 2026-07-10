# Contexto de retomada — QA independente da Feature 003

## Finalidade

Este arquivo é apenas um índice de retomada. Não substitui nem repete as fontes de verdade do projeto. Use-o para iniciar uma nova conversa com contexto limpo e conduzir o QA independente da implementação entregue pelo Claude Code.

## Estado atual

- O Spec Kit da feature `003-landing-assistencia-tecnica` foi concluído e seus artefatos estão em `specs/003-landing-assistencia-tecnica/`.
- O Claude Code declarou concluídas as tarefas T001–T087 e entregou implementação, testes, evidências, relatório e handoff.
- O relatório principal da execução é `reports/claude-execution-003-landing-assistencia-tecnica.md`.
- O resumo de transferência para revisão é `handoffs/claude-to-codex-003-landing-assistencia-tecnica.md`.
- O QA independente do Codex **ainda não foi concluído**. Não existe decisão válida de aprovação, aprovação com ressalvas ou rejeição.
- Recomeçar a verificação do zero; não reutilizar resultados parciais de sessões anteriores como evidência.

## Ordem mínima de leitura na nova conversa

1. `AGENTS.md` e `CLAUDE.md` — papéis, limites e workflow.
2. `plano_macro_landing_assistencia_tecnica_codex_claude.md` e `spec_seguranca_codigo_supply_chain.md` — fontes normativas originais; segurança prevalece em conflitos.
3. `PRODUCT.md`, `DESIGN.md` e `specs/003-landing-assistencia-tecnica/design-brief.md` — contexto de produto e direção visual.
4. `specs/003-landing-assistencia-tecnica/spec.md`, `plan.md`, `tasks.md`, `traceability.md`, contratos e checklists.
5. Relatório e handoff do Claude indicados acima.
6. Código, configuração, lockfile, workflows, testes e evidências, sempre comparados às fontes anteriores.

## Método de trabalho acordado

- Codex atua como planejador e revisor independente; não corrige código da aplicação.
- Claude Code implementa e, se necessário, executa uma rodada posterior de correções mediante novo handoff do Codex.
- Automação verde é necessária, mas não suficiente. O Codex deve reproduzir evidências e revisar comportamento, escopo, dependências, segurança, privacidade/LGPD, acessibilidade, performance, analytics, conteúdo verdadeiro e consistência visual.
- A auditoria visual deve usar Impeccable, inclusive crítica de desktop/mobile, estados do formulário, responsividade, acessibilidade e polimento.
- A revisão de segurança deve abranger ao menos `package.json`, `pnpm-lock.yaml`, justificativas de dependências, Trivy, SAST/CodeQL, Socket, Dependabot, secret scanning/push protection, ordem do CI, política de vulnerabilidades e ausência de segredos/PII.
- Dependências novas ou alteradas exigem justificativa explícita e registro no relatório; Critical/High não aceitos, segredos, controles ausentes ou exceções silenciosas implicam `CHANGES_REQUIRED`.
- O Codex deve usar o fluxo Spec Kit de convergência após a análise: lacunas viram novas tarefas anexadas a `tasks.md`, sem reescrever tarefas concluídas.
- Se houver falhas, produzir relatório de QA e novo handoff de correção; não editar caminhos de implementação.
- A aprovação final pertence ao Codex e só ocorre após todos os gates aplicáveis e evidências obrigatórias estarem satisfeitos. Itens externos bloqueados não podem ser tratados como aprovados.

## Pontos que exigem decisão ou comprovação na revisão

O Claude registrou no relatório, e o novo QA deve validar sem assumir correção:

- desvios de versão de TypeScript/ESLint por compatibilidade;
- achado de licença LGPL relacionado a `sharp/libvips`;
- divergência documental sobre 12 versus 13 opções de `priority_features`;
- gates externos ainda bloqueados, incluindo execução real de CodeQL e readbacks administrativos de segurança;
- valores reais ainda pendentes para GTM, privacidade, domínio e banco de produção;
- arquivo de configuração do Impeccable criado fora da pasta do projeto, mencionado pelo Claude para decisão do responsável.

Consulte as seções correspondentes do relatório, sem duplicar aqui justificativas ou evidências.

## Resultado esperado da próxima conversa

1. Relatório independente de QA com veredito explícito e evidência reproduzível.
2. Checklist de release revisado item a item.
3. Matriz de rastreabilidade atualizada entre requisitos, tarefas, testes, segurança e achados.
4. Se necessário, tarefas de convergência e handoff de correção para Claude Code.
5. Lista separada de bloqueios externos e decisões do responsável, sem confundi-los com passes.

## Prompt curto para retomar

> Leia `CONTEXTO_RETOMADA_QA.md` e siga a ordem de leitura indicada. Execute do zero o QA independente da Feature 003 conforme `AGENTS.md`, a constituição, as fontes normativas, os artefatos do Spec Kit e o relatório do Claude. Use Impeccable e Spec Kit Converge. Não implemente nem corrija código; registre achados, reproduza os gates e produza relatório, checklist e handoff de correção se necessário.
