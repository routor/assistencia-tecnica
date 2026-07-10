import type { Metadata } from "next";
import { connection } from "next/server";
import { ThankYouTracker } from "@/components/analytics/thank-you-tracker";
import { VERTICAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cadastro recebido — projeto em validação",
  description: "Recebemos o seu interesse no piloto. Projeto em validação.",
  robots: { index: false, follow: false },
};

/**
 * Thank-you route (FR-028, FR-029). Reiterates the validation/interview/pilot status. Only the
 * supported vertical emits `thank_you_view`. Direct navigation never manufactures a lead success.
 */
export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<{ vertical?: string }>;
}) {
  await connection();
  const { vertical } = await searchParams;
  const supported = vertical === VERTICAL;

  return (
    <main id="conteudo" className="flex min-h-screen items-center py-[var(--spacing-section)]">
      <div className="content-wrap max-w-[680px]">
        <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-sm font-semibold text-ink-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
          Cadastro recebido
        </span>
        <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-[650] leading-tight">
          Obrigado! Recebemos o seu interesse.
        </h1>
        <p className="mt-5 text-lg text-ink-2">
          Este é um projeto em validação, ainda não é um produto disponível. Se você autorizou o
          contato, podemos chamar para uma conversa rápida sobre a sua rotina e, se fizer sentido,
          convidar para um piloto no futuro.
        </p>
        <p className="mt-4 text-ink-2">
          Não é preciso fazer mais nada agora. Enquanto isso, seu cadastro fica guardado apenas para
          esta pesquisa, conforme a política de privacidade.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/assistencia-tecnica"
            className="text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Voltar para a página
          </a>
          <a href="/privacidade" className="text-ink-2 underline underline-offset-4 hover:text-ink">
            Como usamos seus dados
          </a>
        </div>
      </div>
      {supported ? <ThankYouTracker /> : null}
    </main>
  );
}
