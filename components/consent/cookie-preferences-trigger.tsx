"use client";

import { useConsentOptional } from "./consent-provider";

/** Persistent control to reopen the cookie preferences panel. */
export function CookiePreferencesTrigger({
  className = "text-ink-2 underline underline-offset-4 hover:text-ink",
}: {
  className?: string;
}) {
  const consent = useConsentOptional();
  if (!consent) return null;

  return (
    <button type="button" onClick={consent.openPreferences} className={className}>
      Preferências de cookies
    </button>
  );
}
