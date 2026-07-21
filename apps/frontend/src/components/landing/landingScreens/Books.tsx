import { useState, useEffect } from 'react';
import { apiFetch } from '../../../api/apiFetch';
import { useAlertStore } from '../../../store/alertStore';
import { Button } from '../../ui/Button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../../../types/Book';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const setAlert = useAlertStore((state) => state.setAlert);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/books/books', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books.slice(0, 5));
      })
      .catch((err) => {
        console.error(err);
        setAlert('error', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-[20px] lg:px-[40px] py-10">
      <h3 className="text-[18px] md:text-[20px] font-semibold text-navy">
        Books awaiting to be traded:
      </h3>

      {books.length === 0 ? (
        <p className="text-navy/60 mt-4">No books available right now.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex flex-col cursor-pointer group"
              onClick={() => navigate(`/app/books/${book.id}`)}
            >
              <div className="aspect-[2/3] w-full rounded-md overflow-hidden bg-navy/10">
                {book.photoUrl ? (
                  <img
                    src={book.photoUrl}
                    alt={book.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-navy/40 text-[12px] px-2 text-center">
                    {book.name}
                  </div>
                )}
              </div>
              <p className="mt-2 text-[14px] font-medium text-navy truncate">
                {book.name}
              </p>
              <p className="text-[12px] text-navy/60 truncate">{book.author}</p>
            </div>
          ))}
        </div>
      )}

      <div className="w-full flex justify-center  mt-8">
        <Button variant="primary" size="lg" onClick={() => navigate('/app/books')}>
          <Search /> Explore more books
        </Button>
      </div>
    </div>
  );
}