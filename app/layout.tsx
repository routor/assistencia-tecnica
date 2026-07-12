import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Atkinson_Hyperlegible, Geologica } from "next/font/google";
import { GoogleTagManagerNoscript } from "@/components/analytics/google-tag-manager";
import { ConsentProvider } from "@/components/consent/consent-provider";
import {
  CONSENT_COOKIE_NAME,
  parseConsentCookieValue,
  shouldLoadGtm,
} from "@/lib/consent";
import { getPublicEnv } from "@/lib/env";
import { siteRobots } from "@/lib/seo/site-robots";
import "./globals.css";

/**
 * Optimized, self-hosted (build-time) fonts via next/font — no runtime external font request,
 * compatible with `font-src 'self'` (NFR-007, DESIGN.md typography, PD-006 license record).
 * Both families are SIL Open Font License (redistributable).
 */
const geologica = Geologica({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-geologica",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

export function generateMetadata(): Metadata {
  return {
    title: {
      default: "Assistência técnica organizada — projeto em validação",
      template: "%s",
    },
    description:
      "Da entrada do aparelho à garantia, sem perder nada no caminho. Estamos validando um sistema simples para assistências técnicas de bancada. Participe do piloto.",
    robots: siteRobots(),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { NEXT_PUBLIC_GTM_ID } = getPublicEnv();
  const cookieStore = await cookies();
  const initialDecision = parseConsentCookieValue(
    cookieStore.get(CONSENT_COOKIE_NAME)?.value,
  );
  // Basic Consent Mode: GTM script loads client-side only after an applicable grant.
  // Noscript iframe only when a prior granting choice already exists (JS-disabled visitors
  // cannot interact with the CMP; without a stored grant we keep tracking off).
  const noscriptGtm =
    NEXT_PUBLIC_GTM_ID && shouldLoadGtm(initialDecision) ? NEXT_PUBLIC_GTM_ID : undefined;

  return (
    <html lang="pt-BR" className={`${geologica.variable} ${atkinson.variable}`}>
      <body>
        {noscriptGtm ? <GoogleTagManagerNoscript gtmId={noscriptGtm} /> : null}
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <ConsentProvider initialDecision={initialDecision} gtmId={NEXT_PUBLIC_GTM_ID}>
          {children}
        </ConsentProvider>
      </body>
    </html>
  );
}
