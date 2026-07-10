import type { Metadata } from "next";
import { connection } from "next/server";
import { LandingContent } from "@/components/marketing/landing-content";
import { parseAttribution } from "@/lib/analytics/attribution";
import { LANDING_PATH } from "@/lib/constants";
import { getPublicEnv } from "@/lib/env";

const TITLE = "Assistência técnica organizada — projeto em validação";
const DESCRIPTION =
  "Da entrada do aparelho à garantia, sem perder nada no caminho. Estamos validando, com assistências técnicas de bancada, um sistema simples para organizar cada reparo. Participe do piloto, grátis e sem compromisso.";

export function generateMetadata(): Metadata {
  const { NEXT_PUBLIC_SITE_URL } = getPublicEnv();
  const canonical = NEXT_PUBLIC_SITE_URL
    ? new URL(LANDING_PATH, NEXT_PUBLIC_SITE_URL).toString()
    : LANDING_PATH;
  return {
    metadataBase: NEXT_PUBLIC_SITE_URL ? new URL(NEXT_PUBLIC_SITE_URL) : undefined,
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      title: TITLE,
      description: DESCRIPTION,
      siteName: "Assistência técnica em validação",
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default async function AssistenciaTecnicaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Dynamic rendering so the per-request CSP nonce (proxy.ts) is applied to framework scripts,
  // keeping `script-src 'strict-dynamic'` strict (R-008). Content is still fully server-rendered.
  await connection();
  const attribution = parseAttribution(await searchParams);
  return <LandingContent attribution={attribution} />;
}
