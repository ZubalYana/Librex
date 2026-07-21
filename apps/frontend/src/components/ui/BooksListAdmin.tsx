import { useState, useEffect } from "react";
import { apiFetch } from "../../api/apiFetch";
import { useAlertStore } from "../../store/alertStore";
import { Trash2, BookOpen } from "lucide-react";
import ConfirmDialog from "./popups/ConfirmDialog";
import { Button } from "./Button";

type BookOwner = { id: string; name: string; email: string };
type AdminBook = {
  id: string;
  name: string;
  author: string;
  photoUrl: string | null;
  owner: BookOwner;
};

export default function BooksListAdmin() {
  const [books, setBooks] = useState<AdminBook[] | null>(null);
  const [deletingBook, setDeletingBook] = useState<AdminBook | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    bookLimit: 15,
    totalCount: 0,
    totalPages: 0,
  });
  const setAlert = useAlertStore((state) => state.setAlert);

  useEffect(() => {
    apiFetch(`/books/books?page=${pagination.page}&limit=${pagination.bookLimit}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setPagination(data.pagination);
      })
      .catch((err) => {
        setAlert("error", "Error fetching books");
        console.error(err);
      });
  }, [pagination.page]);

  const deleteBook = () => {
    if (!deletingBook) return;
    apiFetch(`/admin/books/${deletingBook.id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setAlert("success", `Deleted "${deletingBook.name}"`);
        setBooks((prev) => prev?.filter((b) => b.id !== deletingBook.id) ?? null);
        setDeletingBook(null);
      })
      .catch((err) => {
        setAlert("error", err.message);
        setDeletingBook(null);
      });
  };

  if (!books) {
    return <div className="text-sm text-ink/50 font-sans">Loading...</div>;
  }

  return (
    <div className="w-full">
      {books.length === 0 ? (
        <div className="text-sm text-ink/50 font-sans">No books yet</div>
      ) : (
        <div className="w-full flex flex-col gap-y-2">
          {books.map((book) => (
            <div
              key={book.id}
              className="rounded-lg flex items-center justify-between w-full py-3 px-4 border border-ink/10 bg-white/40 hover:bg-white/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-navy/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {book.photoUrl ? (
                    <img src={book.photoUrl} alt={book.name} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="text-navy/40" size={16} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{book.name}</p>
                  <p className="text-xs text-ink/50 truncate">
                    {book.author} · owned by {book.owner.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDeletingBook(book)}
                aria-label={`Delete ${book.name}`}
                className="cursor-pointer p-2 rounded-full text-ink/40 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="w-full flex items-center justify-center gap-3 mt-6">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-ink/60">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {deletingBook && (
        <ConfirmDialog
          open={true}
          onCancel={() => setDeletingBook(null)}
          title={`Delete "${deletingBook.name}"?`}
          description="This action cannot be undone."
          onConfirm={deleteBook}
        />
      )}
    </div>
  );
}