/**
 * Two of the eleven content areas (FR-004):
 *  - a recognizable bench/workshop scene the owner identifies with;
 *  - the risks of the current paper / spreadsheet / WhatsApp process.
 * Organizes visible complexity without pretending the work is simple (PRODUCT.md principle 3).
 */

const risks = [
  {
    title: "O aparelho entra e o histórico se perde",
    body: "Condição de entrada, acessórios e o que o cliente falou ficam no papel, na memória ou em fotos soltas no celular.",
  },
  {
    title: "“Cadê o meu conserto?” o dia inteiro",
    body: "Sem um status claro, cada cliente vira uma interrupção no WhatsApp, e a bancada para para responder.",
  },
  {
    title: "Orçamento e aprovação sem rastro",
    body: "O que foi combinado, o valor aprovado e a data ficam difíceis de comprovar quando surge uma dúvida.",
  },
  {
    title: "Garantia vira discussão",
    body: "Sem registro de evidências e prazos, a garantia depende de lembrar de cabeça o que foi feito.",
  },
];

export function CurrentProcess() {
  return (
    <>
      <section aria-labelledby="cena-title" className="border-t border-line bg-surface/40 py-[var(--spacing-section)]">
        <div className="content-wrap grid gap-[clamp(24px,4vw,56px)] lg:grid-cols-[5fr_7fr] lg:items-center">
          <div>
            <h2 id="cena-title" className="text-[clamp(2rem,4vw,3rem)] font-[620]">
              Você reconhece essa manhã?
            </h2>
            <p className="mt-5 max-w-[58ch] text-lg text-ink-2">
              Um cliente esperando no balcão, três aparelhos na bancada, o WhatsApp piscando e uma
              anotação em papel que já não dá para achar. O trabalho técnico é bom, o que falta é
              onde registrar cada passo sem parar o serviço.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2" aria-label="Sinais do dia a dia">
            {["Papel e caderno", "Planilha", "WhatsApp", "Memória"].map((tool) => (
              <li
                key={tool}
                className="rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink-2"
              >
                <span className="font-semibold text-ink">{tool}</span>, some quando você mais
                precisa.
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="riscos-title" className="py-[var(--spacing-section)]">
        <div className="content-wrap">
          <h2 id="riscos-title" className="max-w-[26ch] text-[clamp(2rem,4vw,3rem)] font-[620]">
            O que costuma dar errado hoje
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {risks.map((risk) => (
              <li key={risk.title} className="bg-bg p-6">
                <h3 className="text-lg font-semibold text-ink">{risk.title}</h3>
                <p className="mt-2 text-ink-2">{risk.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
