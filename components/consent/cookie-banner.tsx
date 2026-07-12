"use client";

/**
 * First-visit cookie banner. Non-modal: does not trap focus or block page content.
 * Reject is as prominent as Accept (no dark patterns).
 */
export function CookieBanner({
  onAcceptAll,
  onRejectOptional,
  onConfigure,
}: {
  onAcceptAll: () => void;
  onRejectOptional: () => void;
  onConfigure: () => void;
}) {
  return (
    <div
      role="region"
      aria-label="Preferências de cookies"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-raised p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] sm:p-5"
    >
      <div className="content-wrap flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[62ch]">
          <p className="font-display text-lg font-semibold text-ink">Cookies neste site</p>
          <p className="mt-2 text-sm text-ink-2">
            Usamos cookies necessários para o site funcionar. Analytics e publicidade são opcionais
            e só são ativados se você autorizar. Você pode mudar a escolha a qualquer momento.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={onRejectOptional}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-strong"
          >
            Rejeitar não essenciais
          </button>
          <button
            type="button"
            onClick={onConfigure}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-strong"
          >
            Configurar
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
