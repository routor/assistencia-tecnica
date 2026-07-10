"use client";

import type { CtaLocation } from "@/lib/analytics/events";
import { pushAnalyticsEvent } from "@/lib/analytics/events";

/**
 * Primary pilot CTA (FR-003). Moves focus to the interest form and emits `primary_cta_click`
 * (US3; no-ops safely when GTM is absent). No deceptive urgency, direct pilot intent copy.
 */
export function PrimaryCta({
  location,
  children = "Quero participar do piloto",
  className = "",
}: {
  location: CtaLocation;
  children?: React.ReactNode;
  className?: string;
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    pushAnalyticsEvent("primary_cta_click", { cta_location: location });
    const target = document.getElementById("formulario");
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Move focus to the form region heading for keyboard/AT users.
      const focusTarget =
        target.querySelector<HTMLElement>("[data-form-focus]") ??
        target.querySelector<HTMLElement>("h2");
      focusTarget?.focus();
      // Reflect the target in the URL without a jump.
      history.replaceState(null, "", "#formulario");
    }
  };

  return (
    <a
      href="#formulario"
      onClick={handleClick}
      className={`inline-flex min-h-[52px] items-center justify-center rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-hover focus-visible:outline-focus ${className}`}
    >
      {children}
    </a>
  );
}
