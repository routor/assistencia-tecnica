# Data Model: Landing Assistência Técnica

## Model Goals

- Store only qualified validation/contact data with explicit consent.
- Support three comparable landing verticals through common columns and structured vertical answers.
- Enforce same-vertical WhatsApp idempotency under concurrency.
- Remain portable across standard managed PostgreSQL providers.
- Permit targeted lead deletion without an admin SaaS or retained raw IP.

## Entity: `leads`

| Field | Logical type | Null | Validation / purpose |
|---|---|---:|---|
| `id` | UUID | no | Server/database-generated primary key; never sent to analytics. |
| `vertical` | bounded text/enum | no | Server authoritative; current value `assistencia-tecnica`; future known verticals require approved migration/config. |
| `name` | text | no | Trimmed, 2-100 characters; PII, never logged/analysed externally. |
| `business_name` | text | no | Trimmed, 2-120 characters; PII, never sent to analytics. |
| `whatsapp_normalized` | text | no | Digits-only normalized contact, 10-15 digits after validation. |
| `email` | text | yes | Trimmed/lowercased valid address, max 254 characters. |
| `city` | text | yes | Max 100; not collected by this form, stored as null for schema comparability. |
| `state` | char(2) | yes | Uppercase Brazilian UF; not collected by this form, stored as null. |
| `segment` | bounded text | no | One primary repair category selected in step 1. |
| `team_size` | bounded text | no | Mirrors `answers.team_size` for cross-vertical analysis. |
| `monthly_volume` | bounded text | no | Mirrors `answers.monthly_intakes`. |
| `current_tool` | bounded text | no | Mirrors `answers.current_process`. |
| `main_pain` | bounded text | no | Mirrors `answers.main_bottleneck`; no extra open pain field is collected. |
| `desired_features` | JSONB string array | no | 1-5 unique values mirroring `answers.priority_features`. |
| `willingness_to_pay` | bounded text | no | Mirrors `answers.price_range`. |
| `interview_permission` | boolean | no | Separate optional permission; default false. |
| `privacy_consent` | boolean | no | Must be true to insert; never default true. |
| `privacy_notice_version` | text | no | Immutable version identifier of the accepted notice. |
| `consented_at` | timestamptz | no | Server time for accepted consent. |
| `answers` | JSONB object | no | Validated `AssistanceTechnicalAnswers`, no arbitrary keys. |
| `utm_source` | text | yes | Trimmed inert attribution, max 200. |
| `utm_medium` | text | yes | Trimmed inert attribution, max 200. |
| `utm_campaign` | text | yes | Trimmed inert attribution, max 200. |
| `utm_term` | text | yes | Trimmed inert attribution, max 200. |
| `utm_content` | text | yes | Trimmed inert attribution, max 200. |
| `gclid` | text | yes | Trimmed inert click identifier, max 256; never executed/interpolated into HTML. |
| `landing_path` | bounded text | no | Server authoritative `/assistencia-tecnica`. |
| `created_at` | timestamptz | no | Database/server time in UTC. |

## Structured Type: `AssistanceTechnicalAnswers`

| Key | Shape | Allowed values / rule |
|---|---|---|
| `repair_categories` | array | Exactly one value matching primary `segment`: `celulares_tablets`, `computadores_notebooks`, `eletronicos`, `eletrodomesticos`, `equipamentos_comerciais`, `ferramentas`, `outro`. |
| `team_size` | scalar | `solo`, `2_3`, `4_6`, `7_10`, `mais_10`. |
| `monthly_intakes` | scalar | `ate_30`, `31_100`, `101_250`, `251_500`, `mais_500`. |
| `current_process` | scalar | `papel`, `planilha`, `whatsapp`, `sistema_generico`, `sistema_assistencia`, `erp`, `outro`. |
| `main_bottleneck` | scalar | `entrada_evidencia`, `identificacao`, `diagnostico`, `orcamento_aprovacao`, `status_cliente`, `pecas`, `entrega_retirada`, `garantia`, `relatorios`. |
| `priority_features` | unique array | 1-5 of `ficha_aparelho`, `fotos`, `imei_serie`, `etiquetas_qr`, `diagnostico`, `orcamento`, `aprovacao`, `status`, `pecas`, `mensagens`, `entrega`, `garantia`, `relatorios`. |
| `customer_status_frequency` | scalar | `raramente`, `algumas_semana`, `diariamente`, `muitas_dia`. |
| `price_range` | scalar | `ate_79`, `80_129`, `130_199`, `200_299`, `300_mais`, `nao_sei`. |

Storage keys are never user-facing labels. Unknown keys/values fail validation. The object is built
server-side from explicit fields, not persisted as an unfiltered form payload.

## Constraints and Indexes

1. Primary key on `id`.
2. Unique index on `(vertical, whatsapp_normalized)`; this is the concurrency/idempotency authority.
3. Check/enum constraint for `vertical` and server allowlist for the matching landing path.
4. `privacy_consent = true` and `consented_at`/notice version required for any inserted row.
5. JSONB values are schema-validated before insert; database JSONB is not an arbitrary extension bag.
6. Optional strings normalize to null when empty; no meaningless empty-string persistence.
7. No raw IP, user agent, password, device credential, customer repair record, or analytics cookie is
   part of the business entity.

## Insertion and Idempotency State Model

```text
received
  -> invalid            (no write; no redirect; no success event)
  -> suspected_bot      (generic safe response; no write; no redirect; no success event)
  -> persistence_error  (safe retry; no redirect; no success event)
  -> inserted           (one row; public success; success event once; redirect)
  -> existing           (zero new rows; same public success; success event once; redirect)
```

`inserted` and `existing` MUST be indistinguishable in the public action result to avoid disclosing
participant membership. The canonical qualified-lead metric is unique database rows. Browser funnel
success measures accepted form completions and may include a genuine repeat submission.

## Deletion Lifecycle

After identity/request verification by an authorized operator, locate the minimum matching record
using normalized contact data, confirm scope, hard-delete the row in a transaction, and record the
request outcome in the approved external operational ticket without copying lead PII into project
logs or reports. There is no soft-delete column because no product audit dashboard is in scope.

## Migration Requirements

- Migrations are generated, reviewed, committed, replayable from empty PostgreSQL, and tested in CI.
- A recovery procedure for a failed migration must be documented; destructive automatic rollback
  is forbidden when it could lose submitted leads.
- Schema changes after launch require backup/restore evidence and a data migration plan.
- Provider-specific extensions are disallowed unless separately approved.
