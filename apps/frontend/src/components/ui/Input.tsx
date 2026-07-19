import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from 'react';
import { cn } from "./Cn";
import { Label } from "./Label";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedBy = error
      ? `${inputId}-error`
      : helperText
      ? `${inputId}-helper`
      : undefined;

    return (
      <div className="w-full">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full h-10 rounded-md border bg-parchment px-3 font-sans text-sm text-ink",
            "placeholder:text-ink/40",
            "border-ink/20 transition-[box-shadow,border-color] duration-150 ease-out",
            "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
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
Input.displayName = "Input";