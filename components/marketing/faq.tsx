/**
 * FAQ (FR-002 scenario 5). Native semantic disclosure (<details>/<summary>), large targets,
 * visible focus, no icon dependency (DESIGN.md FAQ). Answers the six domains: supported categories,
 * mobile access as a FUTURE intent (not a released claim), future pricing uncertainty, data
 * purpose, and current validation status.
 */
const faqs = [
  {
    q: "Isso já é um sistema que posso usar hoje?",
    a: "Não. É um projeto em validação. Estamos ouvindo assistências técnicas para decidir se e como construir. Nada nesta página é um produto disponível.",
  },
  {
    q: "Que tipos de assistência técnica são atendidos?",
    a: "Celulares e tablets, computadores e notebooks, eletrônicos, eletrodomésticos, equipamentos comerciais e ferramentas. O foco é bancada, balcão e oficina, não serviço de campo genérico.",
  },
  {
    q: "Vou conseguir usar pelo celular?",
    a: "A intenção é que funcione bem no celular, já que boa parte do trabalho acontece longe do computador. Isso é um objetivo do projeto, não uma funcionalidade já pronta.",
  },
  {
    q: "Quanto vai custar?",
    a: "Ainda não sabemos. Faz parte da validação entender qual seria um preço justo. Participar agora é gratuito e sem compromisso.",
  },
  {
    q: "Para que vocês usam os meus dados?",
    a: "Apenas para pesquisa de validação e para eventual contato sobre entrevista ou piloto futuro. Não enviamos seus dados de contato para ferramentas de análise. Detalhes na página de privacidade.",
  },
  {
    q: "Participar me obriga a alguma coisa?",
    a: "Não. Você pode registrar interesse, escolher se aceita ou não uma conversa, e pedir a remoção do seu cadastro quando quiser.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-line bg-surface/40 py-[var(--spacing-section)]">
      <div className="content-wrap max-w-[820px]">
        <h2 id="faq-title" className="text-[clamp(2rem,4vw,3rem)] font-[620]">
          Perguntas frequentes
        </h2>
        <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-bg">
          {faqs.map((item) => (
            <details key={item.q} className="group px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold text-ink marker:content-none focus-visible:outline-focus">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-ink-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 text-ink-2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
