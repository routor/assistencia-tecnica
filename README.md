# Consertify — landing para assistência técnica

Landing page em português brasileiro para validar a demanda de pequenas assistências técnicas por
um fluxo organizado da entrada do aparelho à garantia. A página apresenta o produto como um
**conceito em validação**, coleta interesse para entrevistas/piloto e registra os leads com controles
de privacidade, idempotência e segurança.

> Este repositório não é um SaaS completo. Não inclui autenticação, painel operacional, pagamentos,
> estoque, filas, CMS nem integração real com WhatsApp.

## Acesso rápido

- Aplicação local: <http://localhost:3000/assistencia-tecnica>
- Política de privacidade local: <http://localhost:3000/privacidade>
- Repositório: <https://github.com/routor/assistencia-tecnica>

## Stack

Next.js 16 (App Router e Server Actions), React 19, TypeScript estrito, Tailwind CSS 4, Zod,
Drizzle ORM, Postgres.js, PostgreSQL 16, GTM condicional, Vitest, Testing Library, Playwright,
axe-core, pnpm e Node.js 24 LTS.

## Clonar e executar com Docker

O `docker-compose.yml` sobe dois serviços:

- `app`: build de produção do Next.js, disponível na porta `3000`;
- `db`: PostgreSQL 16 local, disponível na porta `5433` do computador.

A migração inicial é aplicada automaticamente quando o volume do banco é criado. Esse Compose é
destinado exclusivamente a desenvolvimento e testes locais; as credenciais nele presentes são
descartáveis e não devem ser reutilizadas em produção.

### Windows

Pré-requisitos:

1. Instale o [Git for Windows](https://git-scm.com/download/win).
2. Instale o [Docker Desktop para Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
   com o backend WSL 2.
3. Abra o Docker Desktop e aguarde o engine ficar ativo.

No PowerShell:

```powershell
git clone https://github.com/routor/assistencia-tecnica.git
Set-Location assistencia-tecnica
docker compose up --build --detach
docker compose ps
Start-Process "http://localhost:3000/assistencia-tecnica"
```

Se o PowerShell informar que `docker` não existe, feche e abra o terminal depois da instalação do
Docker Desktop. Os comandos podem ser executados no PowerShell, Windows Terminal ou terminal WSL.

### Linux

Pré-requisitos:

1. Instale o Git pelo gerenciador de pacotes da sua distribuição.
2. Instale o [Docker Engine](https://docs.docker.com/engine/install/) e o
   [plugin Docker Compose](https://docs.docker.com/compose/install/linux/).
3. Confirme que o daemon está ativo e que seu usuário consegue executar Docker:

```bash
docker --version
docker compose version
```

Depois:

```bash
git clone https://github.com/routor/assistencia-tecnica.git
cd assistencia-tecnica
docker compose up --build --detach
docker compose ps
```

Acesse <http://localhost:3000/assistencia-tecnica>. Em ambientes gráficos, você também pode usar:

```bash
xdg-open http://localhost:3000/assistencia-tecnica
```

Se houver erro de permissão no socket do Docker, siga a
[configuração pós-instalação oficial](https://docs.docker.com/engine/install/linux-postinstall/); não
altere permissões do socket de forma indiscriminada.

### macOS

Pré-requisitos:

1. Instale o Git — pelo Xcode Command Line Tools ou pelo gerenciador de sua preferência.
2. Instale o [Docker Desktop para Mac](https://docs.docker.com/desktop/setup/install/mac-install/),
   escolhendo a versão compatível com Apple Silicon ou Intel.
3. Abra o Docker Desktop e aguarde o engine ficar ativo.

No Terminal:

```bash
git clone https://github.com/routor/assistencia-tecnica.git
cd assistencia-tecnica
docker compose up --build --detach
docker compose ps
open http://localhost:3000/assistencia-tecnica
```

### Operações comuns do Docker

```bash
# acompanhar logs
docker compose logs --follow app

# parar os containers sem apagar o banco local
docker compose down

# reconstruir após mudanças no código
docker compose up --build --detach

# apagar containers E também o volume/banco local
docker compose down --volumes
```

O último comando remove todos os leads gravados no banco Docker local.

## Desenvolvimento sem Docker para a aplicação

Use esta opção quando quiser hot reload. Ela exige Node.js 24, Corepack/pnpm e um PostgreSQL
acessível separadamente.

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm db:migrate
pnpm dev
```

No Windows PowerShell, substitua a cópia do arquivo por:

```powershell
Copy-Item .env.example .env.local
```

Preencha somente valores locais em `.env.local`. O arquivo é ignorado pelo Git; nunca versione
credenciais reais.

## Variáveis de ambiente

| Variável | Escopo | Observação |
|---|---|---|
| `DATABASE_URL` | secreta, servidor | Conexão PostgreSQL da aplicação. |
| `TEST_DATABASE_URL` | secreta, testes | Banco descartável e isolado para integração. Nunca use produção. |
| `NEXT_PUBLIC_SITE_URL` | pública | Origem HTTPS canônica. |
| `NEXT_PUBLIC_GTM_ID` | pública | ID `GTM-...`; ausente desativa analytics sem bloquear o formulário. |
| `PRIVACY_CONTROLLER_NAME` | conteúdo público | Controlador informado na política de privacidade. |
| `PRIVACY_CONTACT` | conteúdo público | Canal para solicitações de dados e remoção. |
| `LEAD_RETENTION_DAYS` | política pública | Prazo positivo de retenção. |

O Compose local configura apenas o necessário para aplicação e banco. GTM permanece desativado e a
página de privacidade exibe o estado seguro de ambiente de teste quando os valores de produção não
estão presentes.

## Qualidade e segurança

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm audit --audit-level high
trivy fs --scanners vuln,secret,misconfig --severity HIGH,CRITICAL --exit-code 1 .
trivy fs --scanners license .
pnpm test:e2e
pnpm test:lighthouse
```

Os testes de integração exigem `TEST_DATABASE_URL`. CodeQL roda no CI depois do gate do Trivy;
E2E e Lighthouse são executados somente depois da análise estática. Dependências novas exigem
justificativa, lockfile atualizado e revisão dos controles de supply chain.

## Estrutura e documentação

- `app/`, `components/`, `lib/` e `db/`: aplicação e persistência;
- `tests/`: testes unitários, de integração e E2E;
- `specs/003-landing-assistencia-tecnica/`: especificação, plano, contratos e rastreabilidade;
- `docs/security-operations.md`: gates, scanners e resposta a incidentes;
- `docs/dependency-policy.md`: política para dependências;
- `docs/analytics-setup.md`: configuração manual de GTM, GA4 e Google Ads;
- `docs/lead-deletion.md`: procedimento operacional de remoção de lead.

## Limites de produção

O ambiente local não representa autorização para campanha ou produção. Banco, domínio canônico,
GTM/GA4/Ads, dados do controlador, retenção e controles administrativos do GitHub precisam estar
configurados e validados no ambiente correto. Gates bloqueados não devem ser tratados como aprovados.

## Licença

Projeto privado (`UNLICENSED`). O conteúdo do repositório não concede permissão de cópia,
redistribuição ou uso comercial além do autorizado pelo responsável.
