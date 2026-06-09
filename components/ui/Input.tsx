"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/ui/cn";

const FIELD =
  "w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm " +
  "text-surface-fg outline-none transition placeholder:text-surface-muted " +
  "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

type FieldShellProps = {
  id: string;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

/** label(id 紐付け) + 必須印 + hint/error を共通化する内部シェル */
function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className="block">
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs font-semibold text-surface-muted">
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-surface-muted">{hint}</p>
      )}
      {error && (
        <p id={errId} className="mt-1 text-xs text-danger" role="alert">{error}</p>
      )}
    </div>
  );
}

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, required, className, ...rest },
  ref,
) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        ref={ref}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(FIELD, error && "border-danger focus:border-danger focus:ring-danger/20", className)}
        {...rest}
      />
    </FieldShell>
  );
});

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, className, rows = 4, ...rest },
  ref,
) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(FIELD, "resize-y", error && "border-danger focus:border-danger focus:ring-danger/20", className)}
        {...rest}
      />
    </FieldShell>
  );
});
