/**
 * "Projeto em validação" notice (DESIGN.md validation notice). Content, not a dismissible alert.
 * Repeated at decision points (hero + form) so the visitor never mistakes the concept for a
 * released product. Non-color cue: an explicit text label, not just a colored dot.
 */
export function ValidationBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-sm font-semibold text-ink-2 ${className}`}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
      Projeto em validação, ainda não é um produto disponível
    </span>
  );
}
