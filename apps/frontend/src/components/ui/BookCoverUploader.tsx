import { useRef, useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "./Cn";

interface BookCoverUploaderProps {
  value?: File | null;
  url?: string | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function BookCoverUploader({ value, url, onChange, error }: BookCoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(url || null);
      return;
    }
    const createdUrl = URL.createObjectURL(value);
    setPreviewUrl(createdUrl);
    return () => URL.revokeObjectURL(createdUrl);
  }, [value, url]);

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return; 
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onChange(null);
    if (inputRef.current) inputRef.current.value = ""; 
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
      />

      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative w-full aspect-[3/4] max-w-[220px] rounded-lg border-2 border-dashed cursor-pointer overflow-hidden",
          "flex flex-col items-center justify-center gap-2 text-center transition-colors",
          "border-ink/20 hover:border-accent hover:bg-accent/5",
          error && "border-red-500"
        )}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Cover preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-navy/80 text-parchment rounded-full p-1 hover:bg-navy transition-colors"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <ImagePlus className="text-ink/30" size={28} strokeWidth={1.5} />
            <p className="text-xs text-ink/50 px-4">Click to upload a cover</p>
          </>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}