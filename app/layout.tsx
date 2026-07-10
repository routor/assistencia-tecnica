import type { Metadata } from "next";
import { headers } from "next/headers";
import { Atkinson_Hyperlegible, Geologica } from "next/font/google";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@/components/analytics/google-tag-manager";
import { getPublicEnv } from "@/lib/env";
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

export const metadata: Metadata = {
  title: {
    default: "Assistência técnica organizada — projeto em validação",
    template: "%s",
  },
  description:
    "Da entrada do aparelho à garantia, sem perder nada no caminho. Estamos validando um sistema simples para assistências técnicas de bancada. Participe do piloto.",
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const { NEXT_PUBLIC_GTM_ID } = getPublicEnv();

  return (
    <html lang="pt-BR" className={`${geologica.variable} ${atkinson.variable}`}>
      <head>
        {NEXT_PUBLIC_GTM_ID ? (
          <GoogleTagManager gtmId={NEXT_PUBLIC_GTM_ID} nonce={nonce} />
        ) : null}
      </head>
      <body>
        {NEXT_PUBLIC_GTM_ID ? <GoogleTagManagerNoscript gtmId={NEXT_PUBLIC_GTM_ID} /> : null}
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
