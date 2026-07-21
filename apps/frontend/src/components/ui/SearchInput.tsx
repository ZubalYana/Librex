import { Search, X } from "lucide-react";
import { cn } from "./Cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 rounded-md border bg-parchment pl-9 pr-9 font-sans text-sm text-ink",
          "placeholder:text-ink/40",
          "border-ink/20 transition-[box-shadow,border-color] duration-150 ease-out",
          "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}