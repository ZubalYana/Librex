import { useState } from "react";
import { BookOpen } from "lucide-react";

import type { Book } from "../../types/Book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = book.photoUrl && !imgFailed;

  return (
    <div className="w-[170px] h-[260px] md:w-[260px] md:h-[340px] relative rounded-lg overflow-hidden shadow-sm group cursor-pointer">
      {showImage ? (
        <img
          src={book.photoUrl!}
          alt={book.name}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full absolute inset-0 bg-navy/10 flex items-center justify-center">
          <BookOpen className="text-navy/40" size={48} strokeWidth={1.5} />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />

      <div className="absolute left-0 bottom-0 w-full p-3 text-parchment">
        <h3 className="font-serif text-sm font-semibold truncate">{book.name}</h3>
        <p className="text-xs text-parchment/70 truncate mb-1">{book.author}</p>
        <p className="text-xs text-parchment/80 line-clamp-2">{book.description}</p>
      </div>
    </div>
  );
}