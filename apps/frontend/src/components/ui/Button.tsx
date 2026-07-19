import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from 'react';
import { cn } from "./Cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium " +
  "transition-[background-color,box-shadow,transform] duration-150 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-parchment " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
  "disabled:hover:translate-y-0 disabled:active:scale-100 cursor-pointer";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-parchment shadow-sm hover:bg-[#c96a4f] hover:shadow-md" +
    "active:bg-[#b85f46] active:shadow-sm",
  secondary:
    "bg-transparent text-navy border border-navy hover:bg-navy hover:text-parchment " +
    "active:bg-[#0e1830]",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5 active:bg-ink/10 hover:translate-y-0",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";