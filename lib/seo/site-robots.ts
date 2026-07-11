import type { Metadata } from "next";
import { getPublicEnv } from "@/lib/env";

/**
 * HTML robots for the public site. Indexing is allowed only when a real absolute HTTPS
 * origin (`NEXT_PUBLIC_SITE_URL`) is configured — Preview/local without that origin stay
 * `noindex, nofollow` (PD-004). Does not invent a domain or read the Vercel hostname.
 */
export function siteRobots(): NonNullable<Metadata["robots"]> {
  const indexed = Boolean(getPublicEnv().NEXT_PUBLIC_SITE_URL);
  return { index: indexed, follow: indexed };
}
