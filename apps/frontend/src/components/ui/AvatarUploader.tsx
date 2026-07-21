import { useRef, useState, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { cn } from './Cn';

interface AvatarUploaderProps {
    value?: File | null;
    url?: string | null;
    onChange: (file: File | null) => void;
    error?: string; 
};

export default function AvatarUploader({ value, url, onChange, error }: AvatarUploaderProps) {
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
        <div className="flex flex-col items-center w-max">
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
                    "relative w-[100px] h-[100px] rounded-full border-2 border-dashed cursor-pointer overflow-hidden flex-shrink-0 group",
                    "flex flex-col items-center justify-center text-center transition-colors",
                    "border-ink/20 hover:border-accent hover:bg-accent/5",
                    error && "border-red-500"
                )}
            >
                {previewUrl ? (
                    <>
                        <img 
                            src={previewUrl} 
                            alt="Avatar preview" 
                            className="w-full h-full object-cover" 
                        />
                        
                        <div className="absolute inset-0 bg-navy/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-parchment hover:text-red-400 transition-colors p-2"
                                aria-label="Remove image"
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <ImagePlus className="text-ink/30 group-hover:text-accent transition-colors" size={26} strokeWidth={1.5} />
                    </>
                )}
            </div>

            {error && (
                <p className="mt-2 text-xs text-red-600 text-center max-w-[120px]">
                    {error}
                </p>
            )}
        </div>
    );
}