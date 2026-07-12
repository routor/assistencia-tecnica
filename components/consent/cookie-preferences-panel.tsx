"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Modal preferences panel with focus trap, initial focus, Escape to close, and focus restore.
 * Optional categories start unchecked unless the visitor already granted them.
 */
export function CookiePreferencesPanel({
  initialAnalytics,
  initialAdvertising,
  onSave,
  onAcceptAll,
  onRejectOptional,
  onClose,
}: {
  initialAnalytics: boolean;
  initialAdvertising: boolean;
  onSave: (prefs: { analytics: boolean; advertising: boolean }) => void;
  onAcceptAll: () => void;
  onRejectOptional: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const analyticsId = useId();
  const advertisingId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [advertising, setAdvertising] = useState(initialAdvertising);

  useEffect(() => {
    previouslyFocused.current =
      typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Fechar preferências de cookies"
        className="absolute inset-0 bg-bg/70"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-surface-raised p-5 shadow-lg sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-xl font-semibold text-ink">
            Preferências de cookies
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-2 hover:text-ink"
          >
            Fechar
          </button>
        </div>

        <p className="mt-3 text-sm text-ink-2">
          Escolha o que autoriza. Cookies necessários ficam sempre ativos. Analytics e publicidade
          são opcionais e começam desmarcados.
        </p>

        <ul className="mt-6 space-y-4">
          <li className="rounded-md border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">Cookies necessários</p>
                <p className="mt-1 text-sm text-ink-2">
                  Essenciais para segurança, funcionamento da página e para lembrar esta escolha.
                  Sempre ativos.
                </p>
              </div>
              <span className="shrink-0 rounded border border-line px-2 py-1 text-xs font-semibold text-ink-muted">
                Sempre ativos
              </span>
            </div>
          </li>

          <li className="rounded-md border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <input
                id={analyticsId}
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 size-4 accent-[var(--color-accent)]"
              />
              <label htmlFor={analyticsId} className="min-w-0">
                <span className="font-semibold text-ink">Analytics</span>
                <span className="mt-1 block text-sm text-ink-2">
                  Ajuda a medir, de forma agregada e sem dados pessoais do formulário, como a página
                  e o funil de interesse são usados (por exemplo via Google Analytics, quando
                  ativado).
                </span>
              </label>
            </div>
          </li>

          <li className="rounded-md border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <input
                id={advertisingId}
                type="checkbox"
                checked={advertising}
                onChange={(e) => setAdvertising(e.target.checked)}
                className="mt-1 size-4 accent-[var(--color-accent)]"
              />
              <label htmlFor={advertisingId} className="min-w-0">
                <span className="font-semibold text-ink">Publicidade</span>
                <span className="mt-1 block text-sm text-ink-2">
                  Permite medir conversões e anúncios com tecnologias Google (Tag Manager / Google
                  Ads), ainda sem enviar nome, WhatsApp, e-mail ou respostas do cadastro.
                </span>
              </label>
            </div>
          </li>
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onRejectOptional}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-strong"
          >
            Rejeitar não essenciais
          </button>
          <button
            type="button"
            onClick={() => onSave({ analytics, advertising })}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-strong"
          >
            Salvar preferências
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
