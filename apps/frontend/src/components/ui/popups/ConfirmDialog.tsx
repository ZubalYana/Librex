import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "../Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      <div
        className="w-full max-w-sm bg-parchment rounded-lg shadow-lg p-6 text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="text-red-600" size={20} />
        </div>

        <h2 className="font-serif text-lg font-semibold mb-1">{title}</h2>
        <p className="text-sm text-ink/60 leading-relaxed">{description}</p>

        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1 !bg-red-600 hover:!bg-red-700 active:!bg-red-800"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}