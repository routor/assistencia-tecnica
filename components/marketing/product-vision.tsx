/**
 * Conceptual product view (FR-006, DESIGN.md "Concept view"). Explicitly labeled
 * "Visão do produto, conceito". Uses fictitious neutral identifiers, never realistic person-like
 * PII, and never implies the product already exists (FR-009, SC-013).
 */

const timeline = [
  { label: "Entrada registrada", when: "seg, 09:12", done: true },
  { label: "Diagnóstico concluído", when: "seg, 15:40", done: true },
  { label: "Orçamento enviado", when: "ter, 08:05", done: true },
  { label: "Aguardando aprovação", when: "a definir", done: false },
];

export function ProductVision() {
  return (
    <section aria-labelledby="conceito-title" className="py-[var(--spacing-section)]">
      <div className="content-wrap">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="conceito-title" className="text-[clamp(2rem,4vw,3rem)] font-[620]">
            Visão do produto
          </h2>
          <span className="rounded-full border border-line-strong bg-surface px-3 py-1 text-sm font-semibold text-ink-2">
            Conceito · ainda não é um produto disponível
          </span>
        </div>
        <p className="mt-5 max-w-[60ch] text-lg text-ink-2">
          Um exemplo de como o aparelho poderia ser acompanhado. As telas abaixo são ilustrações do
          conceito, com dados fictícios, não é um sistema em funcionamento.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[7fr_5fr]">
          {/* Device record + quote */}
          <figure className="rounded-lg border border-line bg-surface p-6">
            <figcaption className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-ink">Ficha do aparelho</span>
              <span className="rounded-full border border-line px-2 py-0.5 text-xs text-ink-muted">Conceito</span>
            </figcaption>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-ink-muted">Aparelho</dt>
                <dd className="mt-1 text-ink">Smartphone, tela quebrada</dd>
              </div>
              <div>
                <dt className="text-ink-muted">IMEI (fictício)</dt>
                <dd className="mt-1 font-mono tabular-nums text-ink">00-000000-000000-0</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Acessórios</dt>
                <dd className="mt-1 text-ink">Capa, chip</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Garantia proposta</dt>
                <dd className="mt-1 text-ink">90 dias (exemplo)</dd>
              </div>
            </dl>
            {/* Flattened (no nested card): a divider separates the quote row from the record. */}
            <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
              <div>
                <span className="text-sm text-ink-muted">Orçamento (exemplo)</span>
                <p className="text-lg font-semibold text-ink">Peça e serviço</p>
              </div>
              <span className="rounded-full border border-line-strong bg-surface-strong px-3 py-1 text-sm font-semibold text-ink-2">
                aguardando aprovação
              </span>
            </div>
          </figure>

          {/* Status timeline */}
          <figure className="rounded-lg border border-line bg-surface p-6">
            <figcaption className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-ink">Linha do tempo do reparo</span>
              <span className="rounded-full border border-line px-2 py-0.5 text-xs text-ink-muted">Conceito</span>
            </figcaption>
            <ol className="space-y-4">
              {timeline.map((step) => (
                <li key={step.label} className="flex items-start gap-3">
                  {/* Amber marks ONLY the single current/next-action step (DESIGN.md: "one amber
                      inspection mark shows the next action"); completed steps are neutral. */}
                  <span
                    aria-hidden="true"
                    className={`mt-1 size-3 shrink-0 rounded-full border ${
                      step.done
                        ? "border-line-strong bg-line-strong"
                        : "border-accent bg-accent"
                    }`}
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {step.label}
                      {!step.done && (
                        <span className="ml-2 font-normal text-ink-muted">(etapa atual)</span>
                      )}
                    </span>
                    <span className="block text-sm text-ink-muted">{step.when}</span>
                  </span>
                </li>
              ))}
            </ol>
          </figure>
        </div>
      </div>
    </section>
  );
}
