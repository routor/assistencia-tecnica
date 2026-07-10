---
title: "Plano Macro — Landing Page: Gestão para Assistência Técnica"
aliases:
  - "Landing Page: Gestão para Assistência Técnica"
tags:
  - startup
  - validacao-de-mercado
  - landing-page
  - nextjs
  - speckit
  - impeccable
  - assistencia-tecnica
status: planejamento
vertical: assistencia-tecnica
updated: 2026-07-09
---

# Plano Macro — Landing Page: Gestão para Assistência Técnica

> [!IMPORTANT]
> Este documento é um briefing macro e um prompt operacional para o fluxo **Codex → Claude Code → Codex**. A página deve validar demanda antes da construção do SaaS. Não apresentar a solução como produto já disponível.

## 1. Objetivo da validação

Validar se pequenas assistências técnicas de celulares, eletrônicos, informática, eletrodomésticos e equipamentos possuem dor recorrente e disposição para participar de um piloto de software especializado.

A hipótese é que o valor não está apenas em gerar uma ordem de serviço, mas em controlar cada aparelho desde a entrada: condição, acessórios, diagnóstico, orçamento, aprovação, reparo, status, retirada e garantia.

### Pergunta central

> Pequenas assistências técnicas demonstram intenção de pagar por uma solução simples que organize entrada do aparelho, diagnóstico, orçamento, aprovação, status, peças, entrega e garantia?

### Conversão principal

Cadastro qualificado para:

- lista de acesso antecipado;
- convite para entrevista;
- participação em futuro piloto.

### Rota

`/assistencia-tecnica`

### Identificador da feature no Spec Kit

Sugestão: `003-landing-assistencia-tecnica`.

---

## 2. Público inicial

**ICP primário:**

- proprietário ou gestor de pequena assistência técnica;
- equipe de 1 a 10 pessoas;
- atendimento em balcão, oficina ou bancada;
- volume recorrente de aparelhos/equipamentos;
- controle atual em papel, planilha, WhatsApp ou sistema insatisfatório.

**Segmentos de entrada:**

- celulares e tablets;
- computadores e notebooks;
- eletrônicos;
- eletrodomésticos;
- equipamentos comerciais;
- ferramentas e equipamentos técnicos.

**Não é o ICP desta página:**

- empresas de serviços de campo genéricos;
- oficinas automotivas;
- grandes redes autorizadas com sistema corporativo;
- consumidor procurando conserto.

### Dores que a página deve reconhecer

- ficha de entrada incompleta;
- dúvida sobre condição do aparelho e acessórios entregues;
- identificação por IMEI, série ou etiqueta dispersa;
- diagnóstico sem histórico;
- orçamento aguarda aprovação e é esquecido;
- cliente pergunta repetidamente pelo status;
- peças e aparelhos se confundem;
- retirada demora e ocupa espaço;
- garantia é controlada manualmente;
- dono não enxerga entradas, pendências e entregas do período.

---

## 3. Proposta de valor

**Promessa central:**

> Organizar cada aparelho do recebimento à entrega, com histórico, diagnóstico, orçamento, status e garantia em um fluxo simples para pequenas assistências.

**Resultado desejado percebido pelo visitante:**

- reduzir perda de informação;
- saber onde está cada reparo;
- aprovar orçamento com mais clareza;
- responder rapidamente ao cliente;
- organizar entrega e garantia;
- profissionalizar o atendimento.

### Hero de trabalho

**Headline:**

> Cada aparelho, orçamento e reparo no lugar certo.

**Subheadline:**

> Ajude a criar uma solução simples para controlar entrada, diagnóstico, aprovação, status, peças, entrega e garantia da sua assistência técnica.

**CTA primário:**

> Quero participar do piloto

**Microcopy:**

> Projeto em validação. Cadastro sem cobrança e sem compromisso.

O texto definitivo deve ser refinado pelo Codex na spec e pelo Impeccable na fase de `shape`, sem alterar a promessa central.

---

## 4. Estrutura de conteúdo da página

1. **Hero:** público, problema, proposta, CTA e aviso de validação.
2. **Cena reconhecível:** aparelho no balcão, conversa no WhatsApp, papel, peça e cliente pedindo status.
3. **Riscos do processo atual:** informação incompleta, orçamento parado, troca de aparelho/acessório, atraso e garantia sem histórico.
4. **Fluxo proposto:** entrada → registro/evidência → diagnóstico → orçamento → aprovação → reparo/status → entrega/garantia.
5. **Benefícios:** rastreabilidade, velocidade de resposta, organização da bancada, confiança e visão do negócio.
6. **Visão do produto:** ficha e timeline conceituais, claramente identificadas.
7. **Para quem é / para quem não é.**
8. **Como funcionará o piloto.**
9. **FAQ:** tipos de assistência, celular/computador, uso no celular, preço futuro, dados e status do produto.
10. **Formulário de interesse.**
11. **Rodapé:** privacidade, contato e aviso de validação.


## 5. Stack técnica obrigatória

> [!DECISION]
> Nesta fase não haverá backend Go. A validação será implementada como uma aplicação Next.js full-stack enxuta. Go fica reservado para o produto SaaS validado, quando existirem integrações, filas, webhooks e regras de negócio que justifiquem um backend separado.

| Camada | Tecnologia | Regra |
|---|---|---|
| Framework | Next.js com App Router | Usar a versão estável vigente na inicialização e registrar a versão no lockfile |
| Linguagem | TypeScript | `strict: true`; evitar `any` e casts sem justificativa |
| UI | React + Tailwind CSS | Componentes próprios orientados pelo `DESIGN.md`; não transformar shadcn/ui em identidade visual |
| Design | Impeccable | Uso obrigatório para contexto, direção visual, crítica, responsividade, auditoria e polimento |
| Especificações | GitHub Spec Kit | Uso obrigatório antes de qualquer implementação |
| Formulário | Server Actions + `useActionState` | Validação server-side e estados de sucesso/erro acessíveis |
| Validação | Zod | Um schema compartilhado para servidor e testes |
| Banco | PostgreSQL gerenciado | Neon ou Supabase PostgreSQL; a aplicação não deve depender de recursos proprietários do provedor |
| ORM | Drizzle ORM | Migrações versionadas no repositório |
| Analytics | Google Tag Manager | GA4 e Google Ads configurados pelo GTM; eventos enviados ao `dataLayer` |
| Testes unitários | Vitest + Testing Library | Cobrir validação, componentes críticos e estados do formulário |
| Testes E2E | Playwright | Fluxo completo de conversão em desktop e mobile |
| Acessibilidade | axe-core no Playwright | Sem violações críticas ou sérias nas páginas principais |
| Deploy | Vercel | Preview por pull request e produção após aprovação |
| Package manager | pnpm | Lockfile obrigatório |
| Runtime | Node.js LTS vigente | Registrar em `.nvmrc` ou `package.json#engines` |

### Dependências: princípio de contenção

- Não instalar biblioteca para resolver algo simples que React, Next.js, CSS ou a plataforma web já resolvem.
- Não adicionar CMS, autenticação, fila, Redis, microserviço, backend Go, painel administrativo ou biblioteca de componentes completa.
- Não criar abstrações para um futuro SaaS ainda não validado.
- Componentes compartilhados devem surgir de repetição real entre as três landing pages, não de antecipação.
- Preferir HTML semântico e controles nativos acessíveis.


## 6. Processo obrigatório: Codex → Claude Code → Codex

Este projeto usa separação explícita de responsabilidades.

| Agente | Responsabilidade | Pode alterar código da aplicação? |
|---|---|---:|
| Codex — fase 1 | Pesquisa do repositório, constituição, especificação, plano, tarefas, checklists e handoff | **Não** |
| Claude Code | Implementação, testes, ajustes visuais e relatório de execução | **Sim** |
| Codex — fase 2 | QA independente, inspeção do código, execução de testes, comparação com specs e relatório | **Não** |
| Claude Code — correções | Corrigir somente os problemas aprovados e gerar novo relatório | **Sim** |

### 6.1 Regras permanentes do repositório

Criar ou atualizar:

#### `AGENTS.md` — instruções do Codex

Deve deixar explícito:

- O Codex é o **planejador e revisor independente**.
- O Codex não deve implementar features nem corrigir diretamente arquivos em `app/`, `components/`, `lib/`, `db/`, `styles/` ou equivalentes.
- O Codex pode criar e alterar apenas especificações, planos, checklists, handoffs e relatórios de QA.
- O Codex deve usar Spec Kit antes de liberar trabalho para Claude Code.
- O Codex deve verificar aderência funcional, qualidade, segurança, acessibilidade, performance, analytics, LGPD, ausência de escopo extra e consistência visual.
- Problemas encontrados viram um novo handoff de correção; não são corrigidos pelo Codex.

#### `CLAUDE.md` — instruções do Claude Code

Deve deixar explícito:

- O Claude Code é o **executor de código**.
- Antes de editar, deve ler `AGENTS.md`, `CLAUDE.md`, a constituição, a spec, o plano, as tarefas, `PRODUCT.md`, `DESIGN.md` e o handoff vigente.
- Não deve redefinir requisitos, trocar a stack, ampliar escopo ou criar arquitetura futura.
- Não deve editar a constituição ou as especificações para “fazer o código caber”.
- Quando houver conflito ou bloqueio real, deve registrar no relatório e implementar apenas o que for seguro e inequívoco.
- Deve usar Impeccable durante a implementação visual.
- Deve executar toda a suíte de verificação antes de declarar conclusão.
- Deve gerar relatório de execução em Markdown.

### 6.2 Fase 1 — planejamento no Codex

#### Pré-requisitos

1. Inspecionar o repositório antes de criar arquivos.
2. Se Spec Kit ainda não estiver inicializado, configurar no diretório atual em modo de skills para Codex.
3. Se Impeccable ainda não estiver instalado para os dois agentes, instalar em escopo de projeto.
4. Não sobrescrever specs, `PRODUCT.md`, `DESIGN.md`, `AGENTS.md` ou `CLAUDE.md` existentes sem comparar conteúdo e preservar decisões válidas.

Comandos de referência:

```bash
# Spec Kit no Codex em modo skills
specify init --here --integration codex --integration-options="--skills"

# Impeccable para os dois agentes, no projeto
npx impeccable install --providers=claude,codex --scope=project
```

No Codex em modo skills, usar os equivalentes disponíveis:

1. `$speckit-constitution`
2. `$speckit-specify`
3. `$speckit-clarify`
4. `$impeccable` para `init` quando necessário e `shape` para a direção de UX/UI
5. `$speckit-plan`
6. `$speckit-tasks`
7. `$speckit-analyze`
8. `$speckit-checklist`

> [!IMPORTANT]
> O Codex **não deve executar** `$speckit-implement`. A implementação pertence ao Claude Code.

#### Artefatos mínimos antes do handoff

- `.specify/memory/constitution.md`
- `specs/<id-da-feature>/spec.md`
- `specs/<id-da-feature>/plan.md`
- `specs/<id-da-feature>/tasks.md`
- `specs/<id-da-feature>/research.md`, quando gerado
- `specs/<id-da-feature>/data-model.md`
- contratos ou schemas necessários
- checklist de requisitos
- `PRODUCT.md`
- `DESIGN.md`
- `handoffs/codex-to-claude-<feature>.md`

O handoff deve apontar para os artefatos, definir ordem de execução, comandos de verificação e proibir mudanças de escopo.

### 6.3 Fase 2 — execução no Claude Code

O Claude Code deve:

1. Ler todos os artefatos de planejamento.
2. Confirmar no início do relatório quais documentos foram lidos.
3. Implementar as tarefas na ordem e respeitar dependências.
4. Manter a página mobile-first e fiel ao `DESIGN.md`.
5. Usar Impeccable obrigatoriamente, no mínimo:
   - `/impeccable critique <landing>`
   - `/impeccable adapt <landing>`
   - `/impeccable audit <landing>`
   - `/impeccable polish <landing>`
6. Corrigir problemas apontados pelos comandos antes de concluir.
7. Executar:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

8. Gerar `reports/claude-execution-<feature>.md`.

#### Conteúdo obrigatório do relatório do Claude

- Resumo do que foi implementado.
- Hash ou nome da branch/commit, quando disponível.
- Lista de arquivos criados, alterados e removidos.
- Tarefas concluídas e não concluídas.
- Decisões técnicas tomadas dentro da liberdade permitida.
- Resultado de cada comando de teste e build.
- Evidências visuais: caminhos das screenshots desktop e mobile.
- Eventos de analytics implementados.
- Migrações criadas.
- Riscos, limitações e débitos conhecidos.
- Qualquer desvio da spec, com motivo explícito.
- Instruções para executar localmente.

### 6.4 Fase 3 — QA independente no Codex

O Codex deve ler:

- spec, plano, tarefas e checklist;
- `PRODUCT.md` e `DESIGN.md`;
- relatório do Claude;
- diff completo e código final.

Depois deve:

1. Executar novamente lint, typecheck, testes, E2E e build.
2. Inspecionar o fluxo de conversão em desktop e mobile.
3. Confirmar persistência no banco e idempotência do formulário.
4. Conferir eventos no `dataLayer`.
5. Verificar PII em logs, segredos no cliente e tratamento de erros.
6. Usar `$speckit-converge` para comparar implementação com os artefatos.
7. Usar Impeccable para crítica e auditoria visual/técnica.
8. Verificar que não há fake testimonials, números inventados, logos não autorizados ou indicação de produto já disponível.
9. Produzir `reports/codex-qa-<feature>.md` com um dos estados:
   - `APPROVED`
   - `APPROVED_WITH_NOTES`
   - `CHANGES_REQUIRED`

Se houver correções, criar `handoffs/codex-to-claude-fix-<feature>-NN.md` com itens objetivos, severidade, evidência, requisito violado e critério de aceite. O ciclo se repete até aprovação.


## 7. Arquitetura do repositório

As três páginas devem viver no **mesmo projeto Next.js**, para compartilhar infraestrutura e reduzir variáveis no experimento.

Estrutura-alvo:

```text
.
├── app/
│   ├── (marketing)/
│   │   ├── ordem-de-servico/
│   │   │   └── page.tsx
│   │   ├── climatizacao-pmoc/
│   │   │   └── page.tsx
│   │   └── assistencia-tecnica/
│   │       └── page.tsx
│   ├── privacidade/
│   │   └── page.tsx
│   ├── obrigado/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── marketing/
│   ├── forms/
│   └── ui/
├── db/
│   ├── schema.ts
│   └── migrations/
├── lib/
│   ├── actions/
│   ├── analytics/
│   ├── env.ts
│   ├── validation/
│   └── utils/
├── public/
├── specs/
├── handoffs/
├── reports/
├── tests/
├── AGENTS.md
├── CLAUDE.md
├── PRODUCT.md
├── DESIGN.md
└── README.md
```

### Regras para comparação justa entre nichos

- Mesma base visual, tipografia, qualidade, hierarquia, quantidade aproximada de seções e padrão de CTA.
- Mesmo mecanismo de formulário, persistência, consentimento, analytics e página de obrigado.
- Não criar links entre as três landing pages nas campanhas; cada anúncio deve chegar diretamente à sua vertical.
- Diferenças permitidas: copy, exemplos, perguntas específicas, ilustrações conceituais e conteúdo de domínio.
- Não transformar uma página em experiência muito mais rica que as outras; isso contaminaria o teste de nicho.


## 8. Dados, formulário e analytics compartilhados

### 8.1 Modelo de dados

Usar uma tabela comum `leads` e um campo estruturado para respostas específicas da vertical.

Campos mínimos:

```text
id: uuid
vertical: enum/text
name: text
business_name: text
whatsapp_normalized: text
email: text nullable
city: text nullable
state: char(2) nullable
segment: text
team_size: text
monthly_volume: text
current_tool: text
main_pain: text
desired_features: jsonb
willingness_to_pay: text
interview_permission: boolean
privacy_consent: boolean
answers: jsonb
utm_source: text nullable
utm_medium: text nullable
utm_campaign: text nullable
utm_term: text nullable
utm_content: text nullable
gclid: text nullable
landing_path: text
created_at: timestamptz
```

Regras:

- Normalizar WhatsApp no servidor.
- Impedir duplicidade acidental na mesma vertical por telefone normalizado; reenvio deve retornar sucesso idempotente, sem criar vários leads.
- Não registrar conteúdo de PII em logs.
- Não guardar IP bruto como dado de negócio.
- Armazenar somente o necessário para validação e contato.
- Migrações versionadas e reproduzíveis.

### 8.2 Formulário

Padrão recomendado: duas etapas curtas.

**Etapa 1 — contato e perfil básico**

- Nome
- Nome da empresa ou negócio
- WhatsApp
- E-mail opcional
- Segmento principal

**Etapa 2 — contexto e validação**

- Tamanho da equipe
- Volume mensal
- Como controla hoje
- Principal dificuldade
- Funcionalidades mais importantes
- Faixa de valor que consideraria pagar
- Aceite para entrevista
- Consentimento de privacidade

Requisitos:

- Tempo estimado visível: “cerca de 2 minutos”.
- Estados de carregamento, erro e sucesso acessíveis.
- Botão protegido contra clique duplo.
- Honeypot e validação server-side.
- Mensagens em português claro, sem termos técnicos.
- Redirecionar para `/obrigado?vertical=<slug>` somente após persistência bem-sucedida.
- A página de obrigado deve explicar que o produto está em validação e que o contato poderá ocorrer para entrevista/piloto.

### 8.3 Eventos

Enviar ao `dataLayer`, no mínimo:

```text
landing_view
primary_cta_click
lead_form_start
lead_form_step_1_complete
lead_form_validation_error
lead_submit_attempt
lead_submit_success
lead_submit_error
thank_you_view
```

Propriedades comuns:

```text
vertical
landing_path
cta_location
form_step
utm_source
utm_medium
utm_campaign
utm_term
utm_content
gclid_present
```

Regras:

- Conversão do Google Ads deve disparar apenas em `lead_submit_success`.
- Não enviar nome, telefone, e-mail ou respostas abertas ao GA4, GTM ou Google Ads.
- Preservar UTMs e `gclid` até o envio do formulário.
- Documentar configuração manual necessária no GTM em `docs/analytics-setup.md`.


### 8.4 Perguntas específicas desta vertical

Incluir no campo `answers`:

- `repair_categories`: celulares/tablets, computadores/notebooks, eletrônicos, eletrodomésticos, equipamentos comerciais, ferramentas, outro;
- `team_size`: trabalha sozinho, 2–3, 4–6, 7–10, mais de 10;
- `monthly_intakes`: até 30, 31–100, 101–250, 251–500, mais de 500;
- `current_process`: papel, planilha, WhatsApp, sistema genérico, sistema de assistência, ERP, outro;
- `main_bottleneck`: entrada/evidência, identificação, diagnóstico, orçamento/aprovação, status ao cliente, peças, entrega/retirada, garantia, relatórios;
- `priority_features`: ficha do aparelho, fotos, IMEI/série, etiquetas/QR, diagnóstico, orçamento, aprovação, status, peças, mensagens, entrega, garantia, relatórios;
- `customer_status_frequency`: raramente, algumas vezes por semana, diariamente, muitas vezes ao dia;
- `price_range`: até R$ 79, R$ 80–129, R$ 130–199, R$ 200–299, R$ 300+, não sei.


## 9. Direção visual obrigatória com Impeccable

### 9.1 Identidade compartilhada

A identidade deve ser:

- escura;
- premium, técnica e confiável;
- contemporânea sem parecer “startup de IA genérica”;
- clara para pequenos empresários brasileiros;
- visualmente forte, mas orientada à conversão.

Direção inicial:

- fundo grafite/azul-petróleo **tingido**, evitando preto puro;
- superfícies com contraste suficiente e poucas camadas;
- uma cor de acento técnica, consistente entre as três páginas;
- tipografia com personalidade e excelente legibilidade;
- composição editorial com ritmo, respiro e hierarquia;
- microanimações discretas, úteis e respeitando `prefers-reduced-motion`;
- ilustrações conceituais, diagramas operacionais ou mockups claramente identificados como “visão do produto”.

Evitar:

- gradiente roxo-azul clichê;
- estética gamer, cyberpunk ou neon exagerado;
- Inter, Arial ou fonte de sistema como escolha automática;
- card dentro de card;
- ícone em quadrado arredondado acima de todos os títulos;
- excesso de pills, bordas, sombras e blur;
- dashboard falso apresentado como produto já existente;
- texto cinza de baixo contraste;
- animações decorativas que atrapalham leitura;
- imagens genéricas de banco com pessoas sorrindo para notebook.

### 9.2 Impeccable no fluxo

Se `PRODUCT.md` e `DESIGN.md` não existirem, o Codex deve iniciar o contexto do Impeccable. Se já existirem, deve preservar o sistema compartilhado e adicionar somente a seção específica da vertical.

Antes do plano técnico, o Codex deve usar Impeccable para:

- definir objetivo emocional;
- hierarquia e narrativa;
- anti-referências;
- linguagem visual;
- comportamento responsivo;
- estrutura da conversão.

Durante a implementação, o Claude deve usar Impeccable para crítica, adaptação, auditoria e polimento.

No QA, o Codex deve comparar a página com o `DESIGN.md` e registrar problemas visuais com evidência.

### 9.3 Restrições éticas da landing page

- Informar claramente que a solução está em validação/desenvolvimento.
- Não usar depoimentos inventados.
- Não exibir quantidade fictícia de clientes, receita, avaliações ou logos.
- Não prometer funcionalidades já disponíveis quando são apenas proposta.
- Mockups conceituais devem ser identificados como conceito/visão.
- O CTA deve ser de lista piloto, acesso antecipado ou entrevista — não “começar a usar agora”.


### 9.4 Elementos visuais específicos desta vertical

- Representar o ciclo de vida de um aparelho dentro da assistência, da entrada à entrega.
- Destacar rastreabilidade por equipamento, status e comunicação com o cliente.
- Mostrar mockup conceitual de ficha do aparelho, timeline de status e orçamento, rotulado como “visão do produto”.
- O visual deve sugerir bancada organizada e processo confiável, sem parecer e-commerce ou sistema industrial.
- Evitar imagens genéricas de celular quebrado como único elemento e evitar estética de loja de eletrônicos promocional.


## 10. Segurança, privacidade, qualidade e performance

### Segurança

- Validar toda entrada no servidor com Zod.
- Não confiar em valores de `vertical`, `landing_path`, UTM ou preço enviados pelo cliente.
- Usar queries parametrizadas via ORM.
- Não expor `DATABASE_URL` ou segredos em bundles do cliente.
- Não logar PII nem payload completo do formulário.
- Tratar falhas de banco sem revelar detalhes internos.
- Adicionar headers de segurança compatíveis com a aplicação.
- Verificar dependências e evitar pacotes abandonados.

### LGPD e transparência

- Página `/privacidade` em português claro.
- Consentimento explícito para contato e armazenamento dos dados enviados.
- Informar finalidade: pesquisa, contato sobre piloto e validação do produto.
- Não usar consentimento pré-marcado.
- Não enviar PII a plataformas de analytics.
- Documentar um procedimento simples de exclusão de lead.

### Acessibilidade

- Navegação completa por teclado.
- Foco visível.
- Labels reais; placeholder não substitui label.
- Mensagens de erro associadas aos campos.
- Contraste adequado no tema escuro.
- Respeitar `prefers-reduced-motion`.
- HTML semântico e ordem correta de headings.
- Sem violações críticas/sérias no axe.

### Performance

Metas de aceite em produção ou preview equivalente:

- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90.
- LCP ≤ 2,5 s em condição de teste consistente.
- CLS ≤ 0,1.
- Evitar imagens pesadas, vídeos autoplay e JavaScript desnecessário.
- Fontes locais ou carregadas de forma otimizada.
- Não bloquear a renderização por scripts de analytics.

### Compatibilidade

Testar pelo menos:

- Chromium desktop;
- viewport mobile 390 × 844;
- viewport desktop 1440 × 900;
- JavaScript habilitado;
- estado de rede lenta para loading do formulário.


### Regras específicas de domínio

- Não solicitar senha, padrão de desbloqueio ou credencial de aparelho no formulário da landing.
- Não prometer integração automática com WhatsApp, emissão fiscal, estoque ou pagamento como recurso pronto.
- Não afirmar que o sistema evita toda disputa de garantia ou responsabilidade.
- Não misturar fluxo de assistência em bancada com field service genérico.
- A linguagem deve servir a vários tipos de assistência sem perder exemplos concretos.


## 11. Fora do escopo desta fase

Não implementar:

- aplicação SaaS;
- autenticação;
- dashboard de cliente;
- dashboard administrativo;
- emissão de nota;
- pagamentos;
- integração real com WhatsApp;
- agenda operacional;
- ordem de serviço funcional;
- geração de PMOC;
- controle de estoque real;
- notificações;
- backend Go;
- microserviços;
- filas;
- IA de atendimento;
- planos pagos;
- sistema de convite;
- CMS;
- blog completo.

A landing page valida interesse. Mockups e fluxos são conceituais.


## 12. SEO e intenção de busca

**Tema principal:** sistema de gestão para assistência técnica.

**Clusters úteis para conteúdo e anúncios:**

- sistema para assistência técnica;
- software para assistência técnica;
- programa para assistência técnica;
- sistema de ordem de serviço para assistência técnica;
- sistema para assistência técnica de celular;
- software para conserto de celular;
- gestão de assistência técnica.

**Sugestão de metadata:**

- `title`: Sistema para Assistência Técnica | Controle de Reparos e Acesso Antecipado
- `description`: Ajude a criar uma solução para organizar entrada, diagnóstico, orçamento, status, reparo, entrega e garantia.

Regras:

- Uma única intenção principal por página.
- Título e description naturais, sem keyword stuffing.
- Canonical absoluto.
- Open Graph e metadata completos.
- Conteúdo escrito para o público, não para robôs.
- Não criar páginas doorway ou repetir a mesma copy trocando apenas palavras.

---

## 13. Critérios de aceite da feature

- Rota `/assistencia-tecnica` renderiza sem erros e possui metadata própria.
- Hero comunica imediatamente que a solução é para assistência técnica.
- Página apresenta o fluxo completo da entrada à garantia.
- CTA principal aparece acima da dobra e leva ao formulário.
- Formulário de duas etapas valida, persiste e redireciona corretamente.
- Lead salvo com `vertical = assistencia-tecnica`.
- Respostas específicas são persistidas em `answers`.
- UTMs e `gclid` são preservados.
- Evento `lead_submit_success` dispara uma única vez após persistência.
- Layout aprovado em 390×844 e 1440×900.
- Mockups conceituais estão identificados.
- Formulário não solicita credenciais de aparelho.
- Não há afirmações enganosas ou prova social inventada.
- Testes, build, acessibilidade e metas de performance são atendidos.

### Gate para liberar a campanha

A landing só pode receber tráfego pago quando:

- Codex emitir `APPROVED` ou `APPROVED_WITH_NOTES`;
- deploy de produção estiver funcional;
- persistência real de lead tiver sido testada;
- evento de conversão tiver sido validado;
- política de privacidade estiver publicada;
- não existirem erros de console;
- screenshots desktop/mobile tiverem sido revisadas;
- a página indicar claramente que o produto está em validação.

---

## 14. Prompt mestre — Codex (planejamento)

```text
Atue exclusivamente como planejador e futuro revisor independente desta feature. Não implemente nem edite código da aplicação.

Objetivo: especificar /assistencia-tecnica para validar interesse de pequenas assistências em uma solução que organize entrada do equipamento, evidências, diagnóstico, orçamento, aprovação, status, reparo, entrega e garantia.

Inspecione o repositório e reutilize infraestrutura e design system. Preserve a divisão AGENTS.md/CLAUDE.md: Codex planeja e faz QA; Claude Code implementa.

Use obrigatoriamente Spec Kit: constitution quando necessário, specify, clarify, checklist, plan, tasks e analyze. Diferencie assistência de bancada de serviços técnicos externos.

Use Impeccable obrigatoriamente. Reutilize PRODUCT.md/DESIGN.md e adicione contexto da vertical; faça shape da narrativa e UX mantendo a comparabilidade entre as três landings.

Não use speckit implement. Não escreva código.

Produza handoff com artefatos, tarefas, critérios de aceite, analytics, LGPD, regras de domínio, comandos de teste e relatório obrigatório do Claude.
```

---

## 15. Prompt mestre — Claude Code (execução)

```text
Atue exclusivamente como executor de código de /assistencia-tecnica.

Leia AGENTS.md, CLAUDE.md, constituição, spec, plano, tarefas, checklist, PRODUCT.md, DESIGN.md e handoff. Não redefina escopo, stack ou arquitetura.

Implemente:
- landing especializada;
- fluxo conceitual entrada → garantia;
- mockups identificados;
- formulário de duas etapas com perguntas específicas;
- Zod server-side;
- PostgreSQL/Drizzle;
- deduplicação;
- UTMs/gclid;
- dataLayer;
- privacidade;
- testes.

Não solicite credenciais de aparelhos. Não prometa integrações ou funcionalidades prontas.

Use Impeccable obrigatoriamente para critique, adapt, audit e polish. Preserve o design system compartilhado e a qualidade das outras páginas.

Execute lint, typecheck, testes, E2E e build. Gere screenshots 390×844 e 1440×900.

Gere reports/claude-execution-landing-assistencia-tecnica.md com evidências, arquivos, testes, decisões e desvios.
```

---

## 16. Prompt mestre — Codex (QA)

```text
Atue como QA independente. Não corrija código.

Compare /assistencia-tecnica com constituição, spec, plano, tarefas, checklist, PRODUCT.md e DESIGN.md. Leia relatório, diff e código.

Reexecute lint, typecheck, testes, E2E e build. Verifique persistência, deduplicação, respostas específicas, UTMs/gclid, dataLayer, consentimento, erros e ausência de PII em logs.

Use speckit converge e Impeccable critique/audit.

Confirme:
- fluxo de bancada claramente distinto de field service;
- nenhuma solicitação de senha/credencial de aparelho;
- nenhum recurso futuro apresentado como disponível;
- mockups conceituais identificados;
- ausência de prova social falsa;
- consistência estrutural com as outras landings.

Gere reports/codex-qa-landing-assistencia-tecnica.md com status e achados. Se necessário, crie handoff de correção para Claude Code.
```

---

## 17. Saídas esperadas

### Codex — planejamento

- constituição atualizada;
- spec funcional;
- clarificações registradas;
- contexto `PRODUCT.md` e `DESIGN.md`;
- plano técnico;
- data model;
- tarefas;
- análise cruzada;
- checklist;
- handoff para Claude.

### Claude Code

- código;
- migrações;
- testes;
- screenshots;
- relatório de execução.

### Codex — QA

- relatório independente;
- classificação dos achados;
- status final;
- handoff de correção, se necessário.

---

## 18. Nota sobre a execução das três páginas

Esta landing é uma das três variações do mesmo experimento. Reutilizar a mesma base técnica e o mesmo design system. O objetivo não é descobrir “qual design vence”, mas comparar a resposta dos nichos a propostas de valor específicas. Mudanças estruturais em uma página devem ser avaliadas para as demais antes do início das campanhas.
