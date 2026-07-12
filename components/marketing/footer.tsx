import { CookiePreferencesTrigger } from "@/components/consent/cookie-preferences-trigger";
import { PRIVACY_PATH } from "@/lib/constants";

/**
 * Footer (FR-036). Links to privacy and contact information and repeats the validation status.
 * Does NOT create cross-links between campaign verticals (each landing stands alone).
 */
export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="content-wrap flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">
            Assistência técnica organizada, projeto em validação
          </p>
          <p className="mt-1 max-w-[60ch] text-sm text-ink-muted">
            Esta página apresenta um conceito em pesquisa. Não é um produto disponível, nem coleta
            dados de aparelhos ou de clientes das assistências.
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={PRIVACY_PATH} className="text-ink-2 underline underline-offset-4 hover:text-ink">
            Privacidade e dados
          </a>
          <a
            href={`${PRIVACY_PATH}#direitos`}
            className="text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Contato e remoção de dados
          </a>
          <CookiePreferencesTrigger className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink" />
          <a href="#formulario" className="text-ink-2 underline underline-offset-4 hover:text-ink">
            Participar do piloto
          </a>
        </nav>
      </div>
    </footer>
  );
}
