import { CheckCircle2, CircleX, CircleQuestionMark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAlertStore } from "../../store/alertStore";
import { cn } from "./Cn";

const ICONS: Record<"success" | "error" | "info", LucideIcon> = {
  success: CheckCircle2,
  error: CircleX,
  info: CircleQuestionMark,
};

const STYLES: Record<"success" | "error" | "info", string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-[#c4c9d6d9] text-navy border-navy/20",
};

export function AlertBanner() {
  const alert = useAlertStore((s) => s.alert);

  if (!alert) return null;

  const Icon = ICONS[alert.type];

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-100",
        "flex items-center gap-2 rounded-md border px-4 py-2.5 shadow-md",
        "font-sans text-sm z-9999",
        STYLES[alert.type]
      )}
    >
      <Icon size={18} />
      <span>{alert.text}</span>
    </div>
  );
}