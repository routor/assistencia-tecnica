import { PrimaryCta } from "./primary-cta";
import { ValidationBadge } from "./validation-badge";

/**
 * Hero (FR-002, FR-003): one dominant promise, validation message, primary CTA, microcopy, and a
 * single operational artifact, no hero-metric template, no fabricated proof. Split layout on
 * desktop (narrative + artifact); single column on mobile.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-[clamp(40px,7vw,88px)] pb-[var(--spacing-section)]">
      <div className="content-wrap grid items-center gap-[clamp(32px,5vw,64px)] lg:grid-cols-[7fr_5fr]">
        <div>
          <ValidationBadge />
          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-[650] leading-[0.98] tracking-[-0.03em]"
          >
            Da entrada do aparelho à garantia, sem perder nada no caminho.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-ink-2">
            Estamos desenhando, junto com assistências técnicas de bancada, um sistema simples para
            organizar cada aparelho, da entrada e das evidências ao diagnóstico, orçamento,
            aprovação, reparo, entrega e garantia. Queremos entender se isso resolve a sua rotina
            antes de construir.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <PrimaryCta location="hero" />
            <span className="text-sm text-ink-muted">
              Cadastro gratuito e sem compromisso, cerca de 2 minutos.
            </span>
          </div>

          <p className="mt-4 max-w-[56ch] text-sm text-ink-muted">
            Para quem recebe e conserta celulares, computadores, eletrônicos, eletrodomésticos,
            equipamentos comerciais ou ferramentas em balcão, bancada ou oficina.
          </p>
        </div>

        {/* One operational artifact, a code-native intake row. Clearly a concept, no real PII. */}
        <aside aria-label="Exemplo conceitual de ordem de bancada" className="lg:justify-self-end">
          <figure className="w-full max-w-[420px] rounded-lg border border-line bg-surface p-5">
            <figcaption className="mb-4 flex items-center justify-between text-sm text-ink-muted">
              <span className="font-semibold text-ink-2">Ordem de bancada</span>
              <span className="rounded-full border border-line-strong px-2 py-0.5 text-xs">
                conceito
              </span>
            </figcaption>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-ink-muted">Aparelho</dt>
                <dd className="text-right text-ink">Notebook, não liga</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-ink-muted">Nº de série</dt>
                <dd className="text-right font-mono tabular-nums text-ink">SN-4471-XT</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-ink-muted">Acessórios</dt>
                <dd className="text-right text-ink">Fonte, capa</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-muted">Etapa atual</dt>
                <dd className="inline-flex items-center gap-2 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-ink">
                  Aguardando aprovação
                </dd>
              </div>
            </dl>
          </figure>
        </aside>
      </div>
    </section>
  );
}
