"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Option } from "@/lib/domain/options";
import { HONEYPOT_FIELD } from "@/lib/domain/options";

/** Shared label row with a required/optional cue that never relies on color alone. */
function LabelRow({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
      {label}{" "}
      {required ? (
        <span className="text-ink-muted">(obrigatório)</span>
      ) : (
        <span className="text-ink-muted">(opcional)</span>
      )}
    </label>
  );
}

/** Stable error region (always present) to limit layout shift / CLS (NFR-001, DESIGN.md form). */
function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className="mt-1 min-h-[1.25rem] text-sm font-medium text-danger">
      {message}
    </p>
  );
}

const baseControl =
  "w-full rounded-md border bg-bg px-3.5 py-3 text-ink placeholder:text-ink-muted focus-visible:outline-focus";

export function TextField({
  name,
  label,
  required,
  type = "text",
  autoComplete,
  inputMode,
  hint,
  error,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  hint?: string;
  error?: string;
  defaultValue?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  return (
    <div>
      <LabelRow htmlFor={id} label={label} required={required} />
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${hint ? `${hintId} ` : ""}${errorId}`}
        className={`mt-1.5 ${baseControl} ${error ? "border-danger" : "border-line-strong"}`}
      />
      <ErrorText id={errorId} message={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  required,
  options,
  placeholder = "Selecione…",
  error,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  options: readonly Option[];
  placeholder?: string;
  error?: string;
  defaultValue?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <LabelRow htmlFor={id} label={label} required={required} />
      <select
        id={id}
        name={name}
        required={required}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        defaultValue={defaultValue ?? ""}
        className={`mt-1.5 ${baseControl} ${error ? "border-danger" : "border-line-strong"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ErrorText id={errorId} message={error} />
    </div>
  );
}

export function RadioField({
  name,
  legend,
  options,
  required,
  error,
  defaultValue,
}: {
  name: string;
  legend: string;
  options: readonly Option[];
  required?: boolean;
  error?: string;
  defaultValue?: string;
}) {
  const errorId = useId();
  return (
    <fieldset aria-describedby={errorId} aria-invalid={error ? true : undefined}>
      <legend className="text-sm font-semibold text-ink">
        {legend}{" "}
        <span className="text-ink-muted">{required ? "(obrigatório)" : "(opcional)"}</span>
      </legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-2.5 rounded-md border border-line bg-bg px-3.5 py-2.5 text-sm text-ink has-[:checked]:border-accent has-[:focus-visible]:outline-focus"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required}
              defaultChecked={defaultValue === o.value}
              className="size-4 accent-[var(--color-accent)]"
            />
            {o.label}
          </label>
        ))}
      </div>
      <ErrorText id={errorId} message={error} />
    </fieldset>
  );
}

type OptionGroup = { label: string; options: readonly Option[] };

export function CheckboxGroupField({
  name,
  legend,
  options,
  groups,
  min,
  max,
  error,
  defaultValues = [],
}: {
  name: string;
  legend: string;
  options?: readonly Option[];
  groups?: readonly OptionGroup[];
  min: number;
  max: number;
  error?: string;
  defaultValues?: string[];
}) {
  const errorId = useId();
  const [selected, setSelected] = useState<string[]>(defaultValues);

  // T093: re-sync checked state from server-echoed values on invalid/error re-render (FR-022).
  // Only syncs when the echoed set actually changes, so local toggles are never clobbered.
  const echoed = defaultValues.join(",");
  const lastEchoed = useRef(echoed);
  useEffect(() => {
    if (echoed !== lastEchoed.current) {
      lastEchoed.current = echoed;
      setSelected(defaultValues);
    }
  }, [echoed, defaultValues]);

  const atMax = selected.length >= max;
  const toggle = (value: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)));
  };

  const renderOption = (o: Option) => {
    const isChecked = selected.includes(o.value);
    return (
      <label
        key={o.value}
        className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-sm text-ink has-[:focus-visible]:outline-focus ${
          isChecked ? "border-line-strong bg-surface-raised" : "border-line bg-bg"
        } ${!isChecked && atMax ? "opacity-55" : ""}`}
      >
        <input
          type="checkbox"
          name={name}
          value={o.value}
          checked={isChecked}
          disabled={!isChecked && atMax}
          onChange={(e) => toggle(o.value, e.target.checked)}
          className="size-4 accent-[var(--color-accent)]"
        />
        {o.label}
      </label>
    );
  };

  return (
    <fieldset aria-describedby={`${errorId} ${errorId}-count`} aria-invalid={error ? true : undefined}>
      <legend className="text-sm font-semibold text-ink">
        {legend} <span className="text-ink-muted">(escolha de {min} a {max})</span>
      </legend>
      <p id={`${errorId}-count`} className="mt-1 text-sm text-ink-muted" aria-live="polite">
        {selected.length} de {max} selecionadas
      </p>
      {groups ? (
        <div className="mt-3 space-y-4">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-xs font-semibold text-ink-2">{g.label}</p>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                {g.options.map(renderOption)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">{(options ?? []).map(renderOption)}</div>
      )}
      <ErrorText id={errorId} message={error} />
    </fieldset>
  );
}

export function CheckboxField({
  name,
  error,
  defaultChecked,
  children,
}: {
  name: string;
  error?: string;
  defaultChecked?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-ink-2">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent)]"
        />
        <span>{children}</span>
      </label>
      <ErrorText id={errorId} message={error} />
    </div>
  );
}

/**
 * Non-disclosed honeypot (CTR-001). Off-screen, aria-hidden, not focusable, not a password-manager
 * target. Real users never see or fill it; automated fills are rejected server-side.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>Não preencha este campo</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
