# Contexto de retomada — Domínio, Google Ads e próximo GTM

## Finalidade

Índice de retomada para chat novo. Não substitui specs/constituição. Use ao retomar setup de ads/analytics após o domínio em produção.

Data do estado: 2026-07-11.

## Vereditos alcançados

| Etapa | Veredito |
|-------|----------|
| Domínio / Cloudflare / Vercel | Domínio e origin aprovados (pendências menores abaixo) |
| Google Ads (conversão) | `GOOGLE ADS PRONTO PARA GTM` |
| Google Ads (limpeza Silkness) | Conta Consertify; campanhas/conversões Silkness REMOVED; GA4 `427904424` **desvinculado** (confirmado) |
| GTM / GA4 no site | **CÓDIGO CMP PRONTO (local)** — banner + Consent Mode v2 Basic + GTM condicional implementados; ainda **não** publicar container nem setar `NEXT_PUBLIC_GTM_ID` em Production até validação/proprietário; ADC sem scopes Tag Manager/Analytics Admin permanece fora desta etapa |

## Domínio e produção

| Item | Valor |
|------|--------|
| Site canônico | `https://www.consertify.com.br` |
| Landing | `/assistencia-tecnica` |
| Thank-you | `/obrigado` |
| Apex | `consertify.com.br` → www (308) |
| Projeto Vercel | `assistencia-tecnica/assistencia-tecnica` |
| Branch Production | `main` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.consertify.com.br` (Production) |
| `NEXT_PUBLIC_GTM_ID` | **ainda ausente** em Production (loader GTM no app já é condicional; sem ID = analytics off) |
| DNS Cloudflare | CNAMEs proxied → `bb05dabc72d75e9f.vercel-dns-017.com` |
| Origin verify | Header `x-consertify-origin-verify` (Transform Rule no CF; WAF Vercel Deny se ausente/errado) |
| SEO | Canonical absoluto; landing `index,follow`; `/obrigado` `noindex` |

Pendências menores de domínio (não bloqueiam GTM):

- Confirmar SSL Cloudflare **Full (strict)** se ainda não confirmado
- UX de `/` raiz (404) — decisão de produto
- Segredo de origin: gerado em `/tmp` na sessão; não versionar; se `/tmp` limpo, rotacionar no CF + Vercel WAF

## Google Ads — contas

| Conta | ID | Papel |
|-------|-----|--------|
| Consertify Manager | `932-281-6268` | Manager (ENABLED, BRL, America/Sao_Paulo) |
| Cliente Consertify | `965-357-5598` | Única cliente (renomeada de SILKNESS → Consertify) |

- Conversion tracking: self-managed; auto-tagging on
- Conversion tracking ID da conta: `AW-16667014695`
- Snippets globais legados na API ainda citam `AW-16574593253` no `global_site_tag`; `send_to` ativo usa `AW-16667014695` — usar o ID da conta atual no GTM
- Campanhas: todas REMOVED (0 ENABLED / 0 PAUSED); não criar campanha/orçamento/anúncio nesta fase
- Merchant Center `5403912189` desvinculado; asset sets MC REMOVED
- GA4 legado `427904424` / Loja SILKNESS: **desvinculado** (confirmado; `product_link` vazio)
- Conta sem créditos de mídia: conversão isolada não gasta
- Auditoria pré-limpeza (não sensível): `/tmp/consertify-google-ads-cleanup-before.json`

## Conversão Consertify (criada via API)

| Campo | Valor |
|-------|--------|
| Nome | `Consertify — Lead enviado` |
| Action ID | `7681171874` |
| Conversion ID | `AW-16667014695` |
| Conversion Label | `n1asCKLD1c4cEKfsuYs-` |
| send_to | `AW-16667014695/n1asCKLD1c4cEKfsuYs-` |
| Resource | `customers/9653575598/conversionActions/7681171874` |
| Tipo | WEBPAGE / SUBMIT_LEAD_FORM / ONE_PER_CLICK |
| Principal + Conversions | sim |
| Atribuição | Data-driven |
| Valor | 0 |
| Status | ENABLED |

Conversões Silkness / Shopping App / imports GA4 da property `427904424`: status REMOVED. Preservar apenas `Consertify — Lead enviado`.

## App — disparo esperado no GTM

- Após Server Action de lead com `success`, o client emite `lead_submit_success` no dataLayer e então navega para `/obrigado`
- `thank_you_view` em `/obrigado` ≠ conversão de lead (acesso direto não conta)
- Trigger GTM recomendado: custom event `lead_submit_success` (não pageview bare de `/obrigado`)

## Credenciais e ferramentas

| Ferramenta | Capacidade |
|------------|------------|
| MCP `user-google-ads-mcp` | **Somente leitura** (`search`, metadata, list customers) |
| Google Ads API REST (v21) | **Leitura + mutate** com as mesmas credenciais do MCP (ADC + developer token + login customer em `~/.cursor/mcp.json`) |
| OAuth scope | `https://www.googleapis.com/auth/adwords` |

Não imprimir developer token, origin secret nem tokens em relatórios/chat.

## Rate limits Google Ads (developer token)

| Limite | Valor |
|--------|--------|
| Ops / mutate request | até 10.000 |
| Action ops / mutate | até 100 |
| Cota diária Explorer | 2.880 (get + mutate; cada item alterado = 1) |
| Basic | 15.000 / dia |
| Standard | Ilimitado* (*ainda há QPS de sistema) |
| Planning | ~1 QPS / CID em alguns métodos |
| Falhas `GoogleAdsFailure` | consomem cota |
| Quota restante | sem endpoint público |

Próximas escritas: agrupar mutates; evitar probes que falham; preferir MCP/search pontual.

## O que NÃO foi feito (próximo chat / manual)

### Bloqueio de publicação (obrigatório)
- Site **não** tem banner/CMP nem Google Consent Mode v2 (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`).
- Consentimento do formulário (cadastro) ≠ consentimento de cookies/analytics/ads.
- Configurar GTM no workspace **sem publicar** coleta irrestrita; **não** setar `NEXT_PUBLIC_GTM_ID` até haver consentimento funcional + container publicado.

### Acesso / recursos externos
- ADC: scopes `adwords` + `cloud-platform` → sem Tag Manager API / Analytics Admin API (criação GTM/GA4 = manual).
- GA4 legado `427904424`: **já desvinculado** (product_link vazio na conta Ads).
- `NEXT_PUBLIC_GTM_ID`: **ausente** em Production (confirmado via `vercel env ls`).

### Depois do consentimento + containers
1. Container Web GTM Consertify + GA4 + Web Stream `www.consertify.com.br`
2. Vincular GA4 nova ↔ Ads `965-357-5598`
3. Tags: Google tag GA4; evento `lead_submit_success`; Conversion Linker; Ads Conversion `AW-16667014695/n1asCKLD1c4cEKfsuYs-` só no Custom Event `lead_submit_success`
4. `NEXT_PUBLIC_GTM_ID` só Production + redeploy
5. Validar Tag Assistant / DebugView / Ads
6. Não criar campanhas

App já implementa: loader GTM condicional, allowlist `dataLayer`, `lead_submit_success` pós-Server Action, `thank_you_view` sem conversão.

## Prompt mínimo para chat novo

> Leia `CONTEXTO_RETOMADA_GOOGLE_ADS_GTM.md`. App analytics pronto; publicação GTM bloqueada por ausência de Consent Mode v2/CMP. Próximo: implementar consentimento OU configurar workspace GTM sem publicar. Conversão Ads: `AW-16667014695/n1asCKLD1c4cEKfsuYs-`. Não criar campanhas.

## Transcrição da sessão

Chat longo (domínio + Ads): agent transcript `5d140ac4-3f70-4e4e-a790-7b437e49334c`.
