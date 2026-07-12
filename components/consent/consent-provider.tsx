"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  acceptAllDecision,
  applyConsentMode,
  buildDecision,
  loadGoogleTagManager,
  rejectOptionalDecision,
  shouldLoadGtm,
  syncConsentAndMaybeLoadGtm,
  writeConsentCookie,
  type ConsentDecision,
} from "@/lib/consent";
import { CookieBanner } from "./cookie-banner";
import { CookiePreferencesPanel } from "./cookie-preferences-panel";

type ConsentContextValue = {
  decision: ConsentDecision | null;
  openPreferences: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (prefs: { analytics: boolean; advertising: boolean }) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}

/** Safe for chrome that may render outside the provider in tests. */
export function useConsentOptional(): ConsentContextValue | null {
  return useContext(ConsentContext);
}

function gtmAlreadyLoaded(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((window as Window & { __consertifyGtmLoaded?: string }).__consertifyGtmLoaded);
}

function consentAlreadyApplied(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as Window & { __consertifyConsentApplied?: string }).__consertifyConsentApplied,
  );
}

/**
 * Persist + Consent Mode + conditional GTM.
 * Reject-all on a cold visit must NOT create `dataLayer` (keeps analytics fully off).
 * Revocation after a prior grant still emits `consent update` to denied.
 */
function applyDecisionSideEffects(next: ConsentDecision, gtmId: string | undefined): void {
  writeConsentCookie(next);
  if (shouldLoadGtm(next) || gtmAlreadyLoaded() || consentAlreadyApplied()) {
    applyConsentMode(next);
  }
  if (gtmId && shouldLoadGtm(next)) {
    loadGoogleTagManager(gtmId);
  }
}

export function ConsentProvider({
  children,
  initialDecision,
  gtmId,
}: {
  children: ReactNode;
  initialDecision: ConsentDecision | null;
  gtmId?: string;
}) {
  const [decision, setDecision] = useState<ConsentDecision | null>(initialDecision);
  const [bannerOpen, setBannerOpen] = useState(initialDecision === null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Returning visitor with a granting cookie: apply consent + load GTM during render so
  // child mount effects (e.g. landing_view) already see dataLayer.
  if (typeof window !== "undefined" && decision && shouldLoadGtm(decision) && gtmId) {
    syncConsentAndMaybeLoadGtm(decision, gtmId);
  }

  useEffect(() => {
    if (!decision || !gtmId || !shouldLoadGtm(decision)) return;
    applyConsentMode(decision);
    loadGoogleTagManager(gtmId);
  }, [decision, gtmId]);

  const persist = useCallback(
    (next: ConsentDecision) => {
      applyDecisionSideEffects(next, gtmId);
      setDecision(next);
      setBannerOpen(false);
      setPreferencesOpen(false);
    },
    [gtmId],
  );

  const acceptAll = useCallback(() => {
    persist(acceptAllDecision());
  }, [persist]);

  const rejectOptional = useCallback(() => {
    persist(rejectOptionalDecision());
  }, [persist]);

  const savePreferences = useCallback(
    (prefs: { analytics: boolean; advertising: boolean }) => {
      persist(buildDecision(prefs));
    },
    [persist],
  );

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
    setBannerOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      decision,
      openPreferences,
      acceptAll,
      rejectOptional,
      savePreferences,
    }),
    [decision, openPreferences, acceptAll, rejectOptional, savePreferences],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {bannerOpen ? (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectOptional={rejectOptional}
          onConfigure={openPreferences}
        />
      ) : null}
      {preferencesOpen ? (
        <CookiePreferencesPanel
          initialAnalytics={decision?.analytics ?? false}
          initialAdvertising={decision?.advertising ?? false}
          onSave={savePreferences}
          onAcceptAll={acceptAll}
          onRejectOptional={rejectOptional}
          onClose={() => setPreferencesOpen(false)}
        />
      ) : null}
    </ConsentContext.Provider>
  );
}
