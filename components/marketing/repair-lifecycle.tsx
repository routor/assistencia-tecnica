/**
 * The signature component (DESIGN.md "Lifecycle") rendered as a carbon-copy service-intake LEDGER —
 * a single ordered strip of ruled rows, NOT eight identical bordered cards. It is the one and only
 * numbered/ordered sequence on the page (FR-005): intake -> registration/evidence -> diagnosis ->
 * quote -> approval -> repair/status -> delivery -> warranty. Numbers are muted, tabular ledger
 * markers (no amber wallpaper — the amber budget is reserved for the CTA and the concept's next
 * action). Each stage has a concrete noun, a short consequence, and a non-color numeric cue. Reads
 * as a ruled ledger on mobile and desktop; order and full labels are always preserved (NFR-004).
 */

const stages = [
  { name: "Entrada", detail: "Condição, acessórios e o relato do cliente registrados na chegada." },
  { name: "Registro e evidências", detail: "Fotos e IMEI/nº de série ligados ao aparelho, não a um caderno." },
  { name: "Diagnóstico", detail: "O que foi identificado, com histórico de quem mexeu e quando." },
  { name: "Orçamento", detail: "Peças e serviço com valor claro, pronto para enviar." },
  { name: "Aprovação", detail: "O aceite do cliente fica registrado, com data e valor." },
  { name: "Reparo e status", detail: "A etapa atual visível, menos “cadê meu conserto?”." },
  { name: "Entrega e retirada", detail: "Baixa do aparelho e comprovação do que foi entregue." },
  { name: "Garantia", detail: "Prazo e evidências guardados para consultar sem discussão." },
];

export function RepairLifecycle() {
  return (
    <section
      aria-labelledby="fluxo-title"
      className="border-y border-line bg-surface/40 py-[var(--spacing-section)]"
    >
      <div className="content-wrap">
        <h2 id="fluxo-title" className="max-w-[24ch] text-[clamp(2rem,4vw,3.25rem)] font-[620]">
          Um caminho para cada aparelho, do balcão à garantia
        </h2>
        <p className="mt-5 max-w-[62ch] text-lg text-ink-2">
          A proposta é organizar a rotina em etapas na ordem em que elas acontecem, sem promessa de
          mágica, só cada passo no lugar.
        </p>

        <ol
          aria-label="Etapas do fluxo proposto"
          className="mt-10 divide-y divide-line overflow-hidden rounded-lg border border-line bg-bg lg:mt-12"
        >
          {stages.map((stage, i) => (
            <li
              key={stage.name}
              className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[2.5rem_14rem_1fr] sm:py-5"
            >
              <span
                aria-hidden="true"
                className="font-mono text-sm tabular-nums text-ink-muted"
              >
                {i + 1}/8
              </span>
              <span className="text-base font-semibold text-ink">{stage.name}</span>
              <span className="col-span-2 text-sm text-ink-2 sm:col-span-1">{stage.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
