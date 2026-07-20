import { useState, useEffect } from 'react';
import type { Book } from '../../types/Book';
import { apiFetch } from '../../api/apiFetch';
import { useParams, Link } from 'react-router-dom';
import { useAlertStore } from '../../store/alertStore';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, User, RefreshCw, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

export default function BookDetails() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const setAlert = useAlertStore((state) => state.setAlert);
  const { bookId } = useParams();

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    setCoverFailed(false);
    setAvatarFailed(false);
    apiFetch(`/books/${bookId}`, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => setAlert("error", err.message))
      .finally(() => setLoading(false));
  }, [bookId]);
  const userId = useAuthStore((state)=>(state.user.id))

  const onRequestExchange = () => {
    if (!book) return;
    setLoading(true);
    apiFetch(`/exchange/${book.id}/request-exchange`, { method: 'POST' })
      .then((res) => res.json())
      .then(() => setAlert("success", 'An email has been sent to the book owner.'))
      .catch((err) => {
        if(book.owner.id === userId){
            setAlert("error", 'You cannot request an exchange on your own book.');
        }else{
            setAlert("error", 'An error occurred when requesting exchange.');
        }
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  if (!book) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-ink/50 font-sans text-sm">
        Could not find the book.
      </div>
    );
  }

  const showCover = book.photoUrl && !coverFailed;
  const showAvatar = book.owner.avatar && !avatarFailed;

  return (
    <div className="w-full min-h-screen p-[20px] lg:px-[40px] text-ink">
      <Link
        to="/app/books"
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
      >
        <ArrowLeft size={16} /> Back to books
      </Link>

      <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 mt-6">
        <div className="w-full md:w-[350px] shrink-0">
          <div className="w-full max-w-[260px] md:max-w-none mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-navy/10 flex items-center justify-center">
            {showCover ? (
              <img
                src={book.photoUrl}
                alt={book.name}
                onError={() => setCoverFailed(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <BookOpen className="text-navy/40" size={56} strokeWidth={1.5} />
            )}
          </div>
        </div>

        <div className="w-full md:flex-1 flex flex-col">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold">{book.name}</h1>

          <p className="flex items-center gap-1.5 text-sm text-ink/60 mt-2">
            <User size={16} /> {book.author}
          </p>

          <p className="text-sm text-ink/80 leading-relaxed mt-4">{book.description}</p>

          <div className="mt-6 pt-6 border-t border-ink/10">
            <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">Owner</p>
            <div className="flex items-center gap-2.5">
              {showAvatar ? (
                <img
                  src={book.owner.avatar}
                  alt="Owner avatar"
                  onError={() => setAvatarFailed(true)}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center">
                  <User className="text-navy/40" size={18} />
                </div>
              )}
              <p className="text-sm font-medium">{book.owner.name}</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onRequestExchange}
            className="mt-8 w-full md:w-fit"
            isLoading={loading}
          >
            <RefreshCw size={18} /> Request exchange
          </Button>
        </div>
      </div>
    </div>
  );
}