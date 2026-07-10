/**
 * Fit / non-fit (FR-008). States who it serves and explicitly EXCLUDES generic field service,
 * automotive shops, large authorized networks, and consumers seeking a repair, so the validation
 * audience stays specific (SC-013). Non-color cue: explicit "É para" / "Não é para" headings.
 */
const fits = [
  "Assistências de celulares, tablets e computadores",
  "Conserto de eletrônicos e eletrodomésticos",
  "Reparo de equipamentos comerciais e ferramentas",
  "Negócios de bancada, balcão ou oficina, de 1 a 10 pessoas",
];

const notFits = [
  "Serviço de campo genérico (instalação/manutenção externa)",
  "Oficinas automotivas",
  "Grandes redes autorizadas com sistema próprio",
  "Consumidor procurando onde consertar o próprio aparelho",
];

export function AudienceFit() {
  return (
    <section aria-labelledby="publico-title" className="border-t border-line bg-surface/40 py-[var(--spacing-section)]">
      <div className="content-wrap">
        <h2 id="publico-title" className="text-[clamp(2rem,4vw,3rem)] font-[620]">
          Para quem é, e para quem não é
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-bg p-6">
            <h3 className="text-lg font-semibold text-success">É para você se</h3>
            <ul className="mt-4 space-y-3">
              {fits.map((item) => (
                <li key={item} className="flex gap-3 text-ink-2">
                  <span aria-hidden="true" className="mt-1 font-semibold text-success">
                    +
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-bg p-6">
            <h3 className="text-lg font-semibold text-ink-2">Provavelmente não é para</h3>
            <ul className="mt-4 space-y-3">
              {notFits.map((item) => (
                <li key={item} className="flex gap-3 text-ink-muted">
                  <span aria-hidden="true" className="mt-1 font-semibold">
                    −
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
