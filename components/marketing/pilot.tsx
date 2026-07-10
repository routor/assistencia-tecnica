import { ValidationBadge } from "./validation-badge";

/**
 * Pilot explanation (FR-002/FR-029). Sets honest expectations: signal validation before persuasion
 * (PRODUCT.md principle 2). No commitment, no charge, no promise the product exists.
 */
const steps = [
  {
    title: "Você registra interesse",
    body: "Conta um pouco sobre o seu negócio e a sua rotina. Cerca de 2 minutos, sem compromisso.",
  },
  {
    title: "A gente pode conversar",
    body: "Se você permitir, entramos em contato para uma entrevista curta para entender melhor a sua realidade.",
  },
  {
    title: "Se fizer sentido, um piloto no futuro",
    body: "Quem topar pode ser convidado a testar uma primeira versão quando ela existir. Sem fila, sem taxa agora.",
  },
];

export function Pilot() {
  return (
    <section aria-labelledby="piloto-title" className="border-t border-line py-[var(--spacing-section)]">
      <div className="content-wrap">
        <ValidationBadge />
        <h2 id="piloto-title" className="mt-6 max-w-[24ch] text-[clamp(2rem,4vw,3rem)] font-[620]">
          Como funciona participar da validação
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Passos da validação">
          {steps.map((step) => (
            <li key={step.title} className="rounded-lg border border-line bg-surface p-6">
              <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
