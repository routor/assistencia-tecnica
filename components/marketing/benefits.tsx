/**
 * Benefits (FR-007), framed as proposed value, never as delivered capability or fabricated proof.
 * Serves every supported domain without collapsing into generic field service.
 */
const benefits = [
  {
    title: "Cada aparelho com um histórico só dele",
    body: "Entrada, evidências, IMEI ou número de série e acessórios ligados ao item, não a um caderno que some.",
  },
  {
    title: "Menos “cadê meu conserto?”",
    body: "A ideia é que a etapa atual fique clara, para reduzir as interrupções que param a bancada.",
  },
  {
    title: "Orçamento e aprovação com registro",
    body: "Valor combinado e aceite do cliente guardados com data, proposta para evitar discussões depois.",
  },
  {
    title: "Garantia que você consegue comprovar",
    body: "Prazos e evidências no mesmo lugar, pensados para consultar em segundos.",
  },
];

export function Benefits() {
  return (
    <section aria-labelledby="beneficios-title" className="border-t border-line py-[var(--spacing-section)]">
      <div className="content-wrap">
        <h2 id="beneficios-title" className="max-w-[26ch] text-[clamp(2rem,4vw,3rem)] font-[620]">
          O que queremos que isso resolva
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {benefits.map((b) => (
            <article key={b.title} className="rounded-lg border border-line bg-surface p-6">
              <h3 className="text-lg font-semibold text-ink">{b.title}</h3>
              <p className="mt-2 text-ink-2">{b.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
