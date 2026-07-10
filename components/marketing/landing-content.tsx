import { AudienceFit } from "@/components/marketing/audience-fit";
import { Benefits } from "@/components/marketing/benefits";
import { CurrentProcess } from "@/components/marketing/current-process";
import { Faq } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { LeadInterestForm } from "@/components/forms/lead-interest-form";
import { Pilot } from "@/components/marketing/pilot";
import { ProductVision } from "@/components/marketing/product-vision";
import { RepairLifecycle } from "@/components/marketing/repair-lifecycle";
import { ValidationBadge } from "@/components/marketing/validation-badge";
import { LandingViewTracker } from "@/components/analytics/landing-view-tracker";
import { PRIVACY_PATH } from "@/lib/constants";
import {
  attributionAnalyticsProps,
  type Attribution,
} from "@/lib/analytics/attribution";

/**
 * Full landing content (the eleven areas of FR-004). Synchronous so it is unit-testable; the route
 * wraps it after `await connection()` to enable the per-request CSP nonce.
 */
export function LandingContent({ attribution = {} }: { attribution?: Attribution }) {
  return (
    <>
      <LandingViewTracker analyticsProps={attributionAnalyticsProps(attribution)} />
      <header className="border-b border-line">
        <div className="content-wrap flex items-center justify-between py-4">
          <span className="text-sm font-semibold text-ink-2">
            Assistência técnica · projeto em validação
          </span>
          <a
            href={PRIVACY_PATH}
            className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Privacidade
          </a>
        </div>
      </header>

      <main id="conteudo">
        <Hero />
        <CurrentProcess />
        <RepairLifecycle />
        <Benefits />
        <ProductVision />
        <AudienceFit />
        <Pilot />
        <Faq />

        <section
          id="formulario"
          aria-labelledby="form-title"
          className="scroll-mt-6 border-t border-line py-[var(--spacing-section)]"
        >
          <div className="content-wrap max-w-[760px]">
            <ValidationBadge />
            <h2
              id="form-title"
              data-form-focus
              tabIndex={-1}
              className="mt-6 text-[clamp(2rem,4vw,3rem)] font-[620] focus-visible:outline-focus"
            >
              Quero participar do piloto
            </h2>
            <p className="mt-5 max-w-[60ch] text-lg text-ink-2">
              Em cerca de 2 minutos, conte sobre o seu negócio e a sua rotina. É gratuito, sem
              compromisso, e você escolhe se aceita ou não uma conversa.
            </p>
            <div className="mt-8">
              <LeadInterestForm attribution={attribution} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
