import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Trash2, Pencil } from "lucide-react";
import { apiFetch } from "../../api/apiFetch";
import { useAlertStore } from "../../store/alertStore";
import ConfirmDialog from "./popups/ConfirmDialog";

import type { Book } from "../../types/Book";

interface BookCardProps {
  book: Book;
  openedInMyBooks?: boolean;
}

export default function BookCard({ book, openedInMyBooks }: BookCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [confirmationOpened, setConfirmationOpened] = useState(false);
  const showImage = book.photoUrl && !imgFailed;
  const setAlert = useAlertStore((state) => state.setAlert);

  const onDeleteBook = () => {
    apiFetch(`/usersBook/${book.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAlert("success", "Deleted successfully");
      })
      .catch((err) => {
        console.error(err);
        setAlert("error", err.message);
      });
  };

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
      {openedInMyBooks && (
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-navy/70 to-transparent" />
      )}

      <div className="absolute left-0 bottom-0 w-full p-3 text-parchment">
        <h3 className="font-serif text-sm font-semibold truncate">
          {book.name}
        </h3>
        <p className="text-xs text-parchment/70 truncate mb-1">{book.author}</p>
        <p className="text-xs text-parchment/80 line-clamp-2">
          {book.description}
        </p>
      </div>

      {openedInMyBooks && (
        <div className="absolute top-2 right-2 flex gap-x-2">
          <button
            className="cursor-pointer p-1.5 rounded-full bg-navy/60 backdrop-blur-sm text-parchment hover:bg-navy/80 hover:scale-110 transition-all duration-200"
            aria-label="Edit book"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Pencil size={15} />
          </button>
          <button
            className="cursor-pointer p-1.5 rounded-full bg-navy/60 backdrop-blur-sm text-parchment hover:bg-red-500/80 hover:scale-110 transition-all duration-200"
            aria-label="Delete book"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setConfirmationOpened(true);
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}

      {confirmationOpened && (
        <ConfirmDialog
          open={confirmationOpened}
          title="Delete this book?"
          description="This can't be undone. The book will be permanently removed from your account."
          onConfirm={() => {
            onDeleteBook();
            setConfirmationOpened(false);
          }}
          onCancel={() => setConfirmationOpened(false)}
        />
      )}
    </div>
  );
}
