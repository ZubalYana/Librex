import { forwardRef, useId, useMemo, useState } from "react";
import type { InputHTMLAttributes } from 'react';
import { cn } from "./Cn";
import { Label } from "./Label";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  showStrength?: boolean;
}

function scorePassword(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4);
}

const STRENGTH_META = [
  { label: "Very weak", color: "bg-red-500" },
  { label: "Weak", color: "bg-red-400" },
  { label: "Fair", color: "bg-amber-400" },
  { label: "Good", color: "bg-emerald-400" },
  { label: "Strong", color: "bg-emerald-500" },
] as const;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { className, label, error, helperText, showStrength = true, id, value, defaultValue, onChange, ...props },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = useState(false);

    const [localValue, setLocalValue] = useState(
      (value ?? defaultValue ?? "") as string
    );
    const current = value !== undefined ? (value as string) : localValue;
    const score = useMemo(() => scorePassword(current), [current]);
    const meta = STRENGTH_META[score];

    const describedBy = error
      ? `${inputId}-error`
      : helperText
      ? `${inputId}-helper`
      : showStrength
      ? `${inputId}-strength`
      : undefined;

    return (
      <div className="w-full">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            onChange={(e) => {
              if (value === undefined) setLocalValue(e.target.value);
              onChange?.(e);
            }}
            className={cn(
              "w-full h-10 rounded-md border bg-parchment pl-3 pr-10 font-sans text-sm text-ink",
              "placeholder:text-ink/40",
              "border-ink/20 transition-[box-shadow,border-color] duration-150 ease-out",
              "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            tabIndex={0}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors"
          >
            {visible ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.24A9.9 9.9 0 0112 4c5.5 0 9 5 9.9 8-.3.98-.86 2.1-1.7 3.15M6.6 6.6C4.5 8 3.1 9.9 2.1 12c.98 3 4.5 8 9.9 8 1.3 0 2.5-.27 3.6-.75"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M2.1 12S5.6 4 12 4s9.9 8 9.9 8-3.5 8-9.9 8-9.9-8-9.9-8z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>

        {showStrength && current.length > 0 && (
          <div id={`${inputId}-strength`} className="mt-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full bg-ink/10 transition-colors duration-200",
                    i < score && meta.color
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-ink/50">{meta.label}</p>
          </div>
        )}

        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-ink/50">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";