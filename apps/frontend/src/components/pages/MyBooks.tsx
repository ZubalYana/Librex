import { useState, useEffect } from 'react';
import { apiFetch } from "../../api/apiFetch";
import { useAlertStore } from '../../store/alertStore';
import { Link } from 'react-router-dom';
import BookCard from '../ui/BookCard';
import { Button } from '../ui/Button';
import { BookOpen, Plus } from 'lucide-react';
import BookControl from '../ui/popups/BookControl';

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookCreation, setBookCreation] = useState(false);

  const setAlert = useAlertStore((state) => state.setAlert);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/userBooks/mine`, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => setBooks(data.usersBooks))
      .catch((err) => setAlert("error", err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-ink/50 font-sans text-sm">
        Loading books...
      </div>
    );
  }

  return (
    <div className="w-full h-full text-navy flex flex-col">
      <h1 className="text-[20px] font-semibold">My books:</h1>

      {books.length === 0 ? (
        <div className="w-full flex-1 flex flex-col items-center justify-center text-center gap-3 px-6">
          <div className="w-14 h-14 rounded-full bg-navy/10 flex items-center justify-center">
            <BookOpen className="text-navy/40" size={26} strokeWidth={1.5} />
          </div>
          <p className="text-sm text-ink/60 max-w-[280px]">
            Create your first book to start exchanging.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => {setBookCreation(true)}}
            className="mt-1"
          >
            <Plus size={18} /> Create a book
          </Button>
        </div>
      ) : (
        <div className='w-full h-full flex-1'>
        <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {books.map((book) => (
            <Link to={`/app/books/${book.id}`} key={book.id}>
              <BookCard book={book} openedInMyBooks={true} />
            </Link>
          ))}
          </div>

          <button
            onClick={() => {setBookCreation(true)}}
            className="mt-1 w-[55px] h-[55px] rounded-full bg-accent 
            flex items-center justify-center cursor-pointer absolute bottom-[20px] right-[20px] 
            md:bottom-[40px] md:right-[40px] text-parchment
            hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] 
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-parchment
            shadow-sm hover:bg-[#c96a4f] hover:shadow-md
            active:bg-[#b85f46] active:shadow-sm"
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      {bookCreation && (
        <div 
        className='w-full h-screen absolute top-0 left-0 bg-navy/70 flex justify-center items-center p-[20px] md:p-[40px]'
        onClick={()=>setBookCreation(false)}
        >
            <BookControl onClose={()=>setBookCreation(false) } mode='CREATE'/>
        </div>
      )}
    </div>
  );
}