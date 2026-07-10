/**
 * Single source of truth for bounded form options (FR-014..FR-021, data-model.md).
 *
 * `value` is the STORAGE slug (never shown to users). `label` is the Portuguese UI text.
 * The Zod enums in `lib/validation/lead.ts` are derived from these arrays so values cannot drift
 * between the form UI, validation, and persistence.
 */
export type Option<V extends string = string> = { value: V; label: string };

const opt = <const V extends string>(value: V, label: string): Option<V> => ({ value, label });

export const REPAIR_CATEGORY_OPTIONS = [
  opt("celulares_tablets", "Celulares e tablets"),
  opt("computadores_notebooks", "Computadores e notebooks"),
  opt("eletronicos", "Eletrônicos"),
  opt("eletrodomesticos", "Eletrodomésticos"),
  opt("equipamentos_comerciais", "Equipamentos comerciais"),
  opt("ferramentas", "Ferramentas"),
  opt("outro", "Outro"),
] as const;

export const TEAM_SIZE_OPTIONS = [
  opt("solo", "Trabalho sozinho"),
  opt("2_3", "2 a 3 pessoas"),
  opt("4_6", "4 a 6 pessoas"),
  opt("7_10", "7 a 10 pessoas"),
  opt("mais_10", "Mais de 10 pessoas"),
] as const;

export const MONTHLY_INTAKE_OPTIONS = [
  opt("ate_30", "Até 30 por mês"),
  opt("31_100", "31 a 100 por mês"),
  opt("101_250", "101 a 250 por mês"),
  opt("251_500", "251 a 500 por mês"),
  opt("mais_500", "Mais de 500 por mês"),
] as const;

export const CURRENT_PROCESS_OPTIONS = [
  opt("papel", "Papel ou caderno"),
  opt("planilha", "Planilha"),
  opt("whatsapp", "WhatsApp"),
  opt("sistema_generico", "Sistema genérico"),
  opt("sistema_assistencia", "Sistema de assistência técnica"),
  opt("erp", "ERP"),
  opt("outro", "Outro"),
] as const;

export const MAIN_BOTTLENECK_OPTIONS = [
  opt("entrada_evidencia", "Entrada e evidências do aparelho"),
  opt("identificacao", "Identificação (IMEI/série)"),
  opt("diagnostico", "Diagnóstico"),
  opt("orcamento_aprovacao", "Orçamento e aprovação"),
  opt("status_cliente", "Passar status ao cliente"),
  opt("pecas", "Controle de peças"),
  opt("entrega_retirada", "Entrega e retirada"),
  opt("garantia", "Garantia"),
  opt("relatorios", "Relatórios"),
] as const;

// data-model.md enumerates 13 storage values for priority_features (1–5 selectable).
export const PRIORITY_FEATURE_OPTIONS = [
  opt("ficha_aparelho", "Ficha do aparelho"),
  opt("fotos", "Fotos na entrada"),
  opt("imei_serie", "IMEI ou número de série"),
  opt("etiquetas_qr", "Etiquetas e QR code"),
  opt("diagnostico", "Diagnóstico"),
  opt("orcamento", "Orçamento"),
  opt("aprovacao", "Aprovação do cliente"),
  opt("status", "Status do reparo"),
  opt("pecas", "Controle de peças"),
  opt("mensagens", "Mensagens ao cliente"),
  opt("entrega", "Entrega e retirada"),
  opt("garantia", "Garantia"),
  opt("relatorios", "Relatórios"),
] as const;

export const CUSTOMER_STATUS_FREQUENCY_OPTIONS = [
  opt("raramente", "Raramente"),
  opt("algumas_semana", "Algumas vezes por semana"),
  opt("diariamente", "Diariamente"),
  opt("muitas_dia", "Muitas vezes ao dia"),
] as const;

export const PRICE_RANGE_OPTIONS = [
  opt("ate_79", "Até R$ 79 por mês"),
  opt("80_129", "R$ 80 a R$ 129 por mês"),
  opt("130_199", "R$ 130 a R$ 199 por mês"),
  opt("200_299", "R$ 200 a R$ 299 por mês"),
  opt("300_mais", "R$ 300 ou mais por mês"),
  opt("nao_sei", "Ainda não sei"),
] as const;

/** Number of unique priority features a respondent may select. */
export const PRIORITY_FEATURE_MIN = 1;
export const PRIORITY_FEATURE_MAX = 5;

/**
 * The thirteen priority slugs grouped by workshop stage to reduce cognitive load (still one
 * fieldset, same slugs, same 1–5 unique rule) — design-brief §Key States / NFR-013.
 */
const featureByValue = new Map<string, Option>(
  PRIORITY_FEATURE_OPTIONS.map((o) => [o.value, o]),
);
const group = (label: string, values: readonly string[]): { label: string; options: Option[] } => ({
  label,
  options: values.map((v) => featureByValue.get(v)!),
});
export const PRIORITY_FEATURE_GROUPS = [
  group("Entrada e identificação", ["ficha_aparelho", "fotos", "imei_serie", "etiquetas_qr"]),
  group("Diagnóstico e orçamento", ["diagnostico", "orcamento", "aprovacao"]),
  group("Acompanhamento do cliente", ["status", "mensagens"]),
  group("Peças e finalização", ["pecas", "entrega", "garantia"]),
  group("Gestão", ["relatorios"]),
] as const;

/** Non-disclosed honeypot field name (CTR-001). Innocuous, not a password-manager target. */
export const HONEYPOT_FIELD = "company_website" as const;

const values = <V extends string>(options: readonly Option<V>[]): [V, ...V[]] =>
  options.map((o) => o.value) as [V, ...V[]];

export const REPAIR_CATEGORY_VALUES = values(REPAIR_CATEGORY_OPTIONS);
export const TEAM_SIZE_VALUES = values(TEAM_SIZE_OPTIONS);
export const MONTHLY_INTAKE_VALUES = values(MONTHLY_INTAKE_OPTIONS);
export const CURRENT_PROCESS_VALUES = values(CURRENT_PROCESS_OPTIONS);
export const MAIN_BOTTLENECK_VALUES = values(MAIN_BOTTLENECK_OPTIONS);
export const PRIORITY_FEATURE_VALUES = values(PRIORITY_FEATURE_OPTIONS);
export const CUSTOMER_STATUS_FREQUENCY_VALUES = values(CUSTOMER_STATUS_FREQUENCY_OPTIONS);
export const PRICE_RANGE_VALUES = values(PRICE_RANGE_OPTIONS);
