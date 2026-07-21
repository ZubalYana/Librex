import { useState, useEffect } from 'react';
import { apiFetch } from "../../api/apiFetch";
import { useAlertStore } from '../../store/alertStore';
import BookCard from '../ui/BookCard';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('name-asc');
  const [pagination, setPagination] = useState({
    booksLimit: 10,
    page: 1,
    totalCount: 0,
    totalPages: 0,
  });

  const setAlert = useAlertStore((state) => state.setAlert);

  const order = sort.endsWith('desc') ? 'desc' : 'asc';

  useEffect(() => {
    setLoading(true);
    apiFetch(
      `/books/books?page=${pagination.page}&limit=${pagination.booksLimit}&order=${order}`,
      { method: 'GET' }
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setPagination(data.pagination);
      })
      .catch((err) => setAlert("error", err.message))
      .finally(() => setLoading(false));
  }, [pagination.page, order]);

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div className="w-full text-navy">
      <div className="w-full flex justify-between items-end">
        <h1 className="text-[20px] md:text-[24px] font-semibold">Community books:</h1>
        <div className="w-[160px]">
          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPagination((p) => ({ ...p, page: 1 })); 
            }}
            options={[
              { value: 'name-asc', label: 'Title A–Z' },
              { value: 'name-desc', label: 'Title Z–A' },
            ]}
          />
        </div>
      </div>


      {books.length === 0 ? (
        <div className="mt-4">No books found</div>
      ) : (
        <div className="w-full mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {books.map((book) => (
            <a href={`/app/books/${book.id}`} key={book.id} >
            <BookCard book={book} />
            </a>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="w-full flex items-center justify-center gap-3 mt-10">
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
    </div>
  );
}