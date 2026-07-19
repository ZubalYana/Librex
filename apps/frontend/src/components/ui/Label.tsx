import type { LabelHTMLAttributes } from "react";
import { cn } from "./Cn";

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block font-sans text-sm font-medium text-ink mb-1.5",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}