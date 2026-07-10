# Spec de Segurança — Código, Dependências e Cadeia de Suprimentos

> **Status:** Obrigatória para todas as landing pages e futuras aplicações do projeto  
> **Escopo atual:** Next.js + TypeScript + pnpm + PostgreSQL  
> **Escopo futuro:** Backend Go, contêineres e serviços adicionais  
> **Objetivo:** reduzir riscos de vulnerabilidades, dependências comprometidas, vazamento de segredos, configurações inseguras e código gerado por IA sem revisão adequada.

---

## 1. Princípios obrigatórios

1. Segurança deve fazer parte do ciclo normal de desenvolvimento, não ser executada apenas antes da publicação.
2. Nenhuma alteração deve ser considerada concluída sem passar pelos controles automatizados aplicáveis.
3. Dependências externas devem ser minimizadas e justificadas.
4. Vulnerabilidades críticas ou de alta severidade bloqueiam a entrega.
5. Nenhuma exceção de segurança pode ser silenciosa.
6. Código gerado por IA deve receber o mesmo nível de revisão que código escrito manualmente.
7. O Codex atua como planejador e revisor técnico; o Claude Code atua como implementador.

---

## 2. Ferramentas obrigatórias

### 2.1 Trivy

O Trivy será o scanner central do projeto.

Deverá verificar:

- vulnerabilidades conhecidas em dependências;
- dependências diretas e transitivas;
- segredos expostos;
- configurações inseguras;
- arquivos de infraestrutura;
- Dockerfiles;
- imagens de contêiner, quando existirem;
- licenças, quando aplicável.

Execução mínima:

```bash
trivy fs \
  --scanners vuln,secret,misconfig \
  --severity HIGH,CRITICAL \
  --exit-code 1 \
  .
```

Regras:

- achados `HIGH` ou `CRITICAL` devem bloquear o pipeline;
- vulnerabilidades não podem ser ignoradas apenas para liberar a entrega;
- qualquer exceção deve ser formalmente documentada.

Toda exceção deve registrar:

- identificador da vulnerabilidade;
- componente afetado;
- justificativa técnica;
- impacto estimado;
- mitigação existente;
- responsável pela aceitação;
- data limite para revisão.

---

### 2.2 Semgrep ou CodeQL

Utilizar análise estática para detectar problemas de segurança no código Next.js e TypeScript.

Cobertura esperada:

- validação insuficiente de entradas;
- injeção;
- XSS;
- uso inseguro de APIs;
- exposição de dados;
- manipulação insegura de URLs;
- falhas de autenticação e autorização, quando existirem;
- uso inseguro de Server Actions e Route Handlers;
- execução de comandos do sistema;
- padrões inseguros introduzidos por código gerado por IA.

Regras:

- executar em Pull Requests;
- executar antes da aprovação final do Codex;
- achados críticos ou de alta severidade devem ser corrigidos ou formalmente avaliados.

> O projeto pode utilizar Semgrep ou CodeQL. Não é obrigatório manter ambos se houver sobreposição sem benefício claro.

---

### 2.3 Dependabot

Habilitar:

- Dependabot Alerts;
- Dependabot Security Updates;
- atualização periódica de dependências.

Periodicidade recomendada:

```text
Semanal
```

Nenhuma atualização deve receber merge automático sem:

- testes aprovados;
- build aprovado;
- scanners aprovados;
- revisão do Codex.

---

### 2.4 Socket

Utilizar Socket para reduzir riscos de dependências maliciosas ou comprometidas.

Toda nova biblioteca deve ser avaliada quanto a:

- comportamento suspeito;
- scripts executados durante instalação;
- código ofuscado;
- acesso inesperado à rede;
- acesso ao shell;
- acesso ao sistema de arquivos;
- leitura de variáveis de ambiente;
- typosquatting;
- mudanças recentes de mantenedor;
- sinais de comprometimento da cadeia de suprimentos.

Regra:

> Nenhuma biblioteca deve ser adicionada apenas por conveniência quando a funcionalidade puder ser implementada de forma simples e segura com recursos já existentes na stack.

---

### 2.5 govulncheck — futuro backend Go

Quando o backend Go for criado, adicionar obrigatoriamente:

```bash
govulncheck ./...
```

Executar:

- localmente;
- em Pull Requests;
- no pipeline de CI;
- após alterações no `go.mod`;
- em verificações periódicas.

Responsabilidades:

- `govulncheck`: análise especializada de vulnerabilidades em código Go;
- `Trivy`: visão geral de dependências, segredos, configurações e imagens.

---

## 3. Política para novas dependências

O Claude Code não deve adicionar dependências silenciosamente.

Toda nova biblioteca deve aparecer no relatório de execução com:

| Campo | Informação obrigatória |
|---|---|
| Pacote | Nome completo |
| Versão | Versão adicionada |
| Finalidade | Problema resolvido |
| Necessidade | Por que a stack atual não foi suficiente |
| Alternativas | Alternativas consideradas |
| Licença | Licença identificada |
| Escopo | Produção ou desenvolvimento |
| Segurança | Resultado das verificações |

O Codex deve revisar obrigatoriamente:

```text
package.json
pnpm-lock.yaml
```

Alterações inesperadas ou dependências sem justificativa devem impedir a aprovação.

---

## 4. Gerenciamento seguro de dependências

O projeto deve:

- manter o lockfile versionado;
- utilizar instalações reproduzíveis;
- impedir alterações automáticas do lockfile no CI;
- evitar dependências abandonadas;
- remover dependências não utilizadas;
- minimizar a quantidade total de bibliotecas.

Instalação no CI:

```bash
pnpm install --frozen-lockfile
```

Executar também:

```bash
pnpm audit --audit-level high
```

A auditoria do gerenciador é complementar e não substitui Trivy, Semgrep, CodeQL, Socket ou revisão humana.

---

## 5. Proteção contra vazamento de segredos

É proibido armazenar credenciais em:

- código-fonte;
- arquivos versionados;
- documentação;
- testes;
- exemplos;
- logs;
- relatórios do Claude Code.

Segredos devem permanecer em mecanismos apropriados de variáveis de ambiente ou cofres de segredo.

Quando disponível, habilitar:

- GitHub Secret Scanning;
- GitHub Push Protection.

O Trivy deve continuar verificando segredos mesmo quando os recursos do GitHub estiverem ativos.

Em caso de exposição:

1. bloquear a entrega;
2. revogar a credencial;
3. gerar nova credencial;
4. revisar logs e histórico;
5. documentar o incidente.

---

## 6. Gate obrigatório de segurança

Todo Pull Request deve seguir, no mínimo:

```text
Lint
  ↓
Type check
  ↓
Testes unitários
  ↓
Testes de integração
  ↓
Build
  ↓
pnpm audit
  ↓
Trivy
  ↓
Semgrep ou CodeQL
  ↓
Testes E2E
  ↓
Relatório do Claude Code
  ↓
Revisão do Codex
```

A alteração somente pode ser aprovada quando:

- o build concluir com sucesso;
- os testes forem aprovados;
- não existirem vulnerabilidades `HIGH` ou `CRITICAL` não tratadas;
- não existirem segredos expostos;
- não existirem achados críticos de análise estática;
- novas dependências estiverem justificadas;
- o Codex tiver revisado o código e o relatório de execução.

---

## 7. Política de severidade

| Severidade | Ação obrigatória |
|---|---|
| Critical | Bloqueio imediato da entrega |
| High | Bloqueio da entrega |
| Medium | Análise e registro obrigatórios |
| Low | Correção planejada conforme risco |
| Secret exposto | Bloqueio imediato e rotação |

Nenhuma vulnerabilidade deve ser corrigida automaticamente sem revisão.

Evitar comandos destrutivos ou que alterem versões de forma ampla, como:

```bash
npm audit fix --force
```

Atualizações automáticas podem introduzir incompatibilidades, regressões ou alterações não revisadas.

---

## 8. Responsabilidades por agente

### Codex

Responsável por:

- planejar controles de segurança;
- revisar alterações de dependências;
- revisar o relatório do Claude Code;
- inspecionar código gerado;
- validar aderência à spec;
- identificar riscos não detectados automaticamente;
- aprovar ou reprovar a entrega.

O Codex não deve aprovar alterações apenas porque o pipeline passou.

---

### Claude Code

Responsável por:

- implementar conforme as specs;
- executar os controles aplicáveis;
- corrigir achados identificados;
- registrar novas dependências;
- produzir relatório de execução;
- informar limitações ou desvios.

O Claude Code não deve:

- ignorar vulnerabilidades;
- desativar scanners;
- reduzir severidade para liberar o pipeline;
- adicionar bibliotecas sem justificativa;
- alterar requisitos de segurança sem autorização.

---

## 9. Conteúdo mínimo do relatório de execução

Toda entrega do Claude Code deve incluir:

```text
## Segurança

- Trivy executado: sim/não
- Semgrep ou CodeQL executado: sim/não
- pnpm audit executado: sim/não
- Testes executados: sim/não
- Novas dependências: lista ou nenhuma
- Vulnerabilidades encontradas: resumo
- Vulnerabilidades corrigidas: resumo
- Exceções pendentes: lista ou nenhuma
- Segredos detectados: sim/não
- Riscos conhecidos: lista ou nenhum
```

---

## 10. Critérios de aceite

A implementação será considerada aderente quando:

- [ ] Trivy estiver configurado e executando;
- [ ] Semgrep ou CodeQL estiver configurado;
- [ ] Dependabot estiver habilitado;
- [ ] Socket estiver integrado ao fluxo de dependências;
- [ ] GitHub Secret Scanning estiver habilitado, quando disponível;
- [ ] o lockfile estiver versionado;
- [ ] o CI utilizar instalação reproduzível;
- [ ] vulnerabilidades críticas e altas bloquearem a entrega;
- [ ] novas dependências exigirem justificativa;
- [ ] o Claude Code gerar relatório de segurança;
- [ ] o Codex revisar código, dependências e relatório;
- [ ] nenhuma exceção permanecer sem registro formal.

---

## 11. Evolução futura

Quando o projeto evoluir, considerar adicionar:

- `govulncheck` para backend Go;
- scan de imagens Docker com Trivy;
- SBOM para releases;
- assinatura de artefatos;
- proteção de branches;
- revisão obrigatória por CODEOWNERS;
- SAST e secret scanning em todos os repositórios;
- DAST em ambiente de homologação;
- testes de segurança específicos para APIs;
- política formal de resposta a vulnerabilidades.

---

## 12. Resumo operacional

Stack de segurança atual:

```text
Trivy
  +
Semgrep ou CodeQL
  +
Dependabot
  +
Socket
  +
GitHub Secret Scanning
  +
Revisão do Codex
```

Stack futura com Go:

```text
Trivy
  +
Semgrep ou CodeQL
  +
Dependabot
  +
Socket
  +
govulncheck
  +
Revisão do Codex
```

> Segurança automatizada reduz risco, mas não substitui revisão técnica, análise de contexto e decisões conscientes sobre dependências e arquitetura.
