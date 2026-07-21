import { useAuthStore } from '../../store/authStore';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { LogOut, Pencil, Clock, Book as BookIcon } from 'lucide-react';
import ProfileEditing from '../ui/popups/ProfileEditing';
import type { User } from '../../store/authStore';
import { apiFetch } from '../../api/apiFetch';

export default function Profile() {
  const [editingMode, setEditingMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const logOut = useAuthStore((state) => state.logout);

  const onEdited = (updatedUser: User) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    apiFetch('/user/profile', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.userWithoutPassword);
      });
  }, []);

  if (!user) {
    return <div className="w-full flex justify-center mt-20 text-ink/50">Loading profile...</div>;
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full text-navy pb-12">
      <h1 className="text-[20px] md:text-[24px] font-semibold">My Profile:</h1>

      <div className="flex items-center mt-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-[100px] h-[100px] rounded-full object-cover ring-2 ring-accent/30"
          />
        ) : (
          <div className="w-[100px] h-[100px] bg-accent rounded-full flex items-center justify-center text-[24px] font-semibold text-navy ring-2 ring-accent/30">
            {initials}
          </div>
        )}
        <div className="ml-5">
          <h2 className="text-[18px] font-semibold">{user.name}</h2>
          <p className="text-navy/70 text-sm">{user.email}</p>
          <div className="flex items-center gap-x-2 mt-2">
            <span className={`${user.role === 'ADMIN' ? 'bg-accent/40' : 'bg-navy/10'} px-2.5 py-0.5 rounded-full text-[11px] font-semibold lowercase tracking-wide`}>
              {user.role}
            </span>
            <span className="text-[13px] text-navy/60">{user.books?.length ?? 0} books</span>
          </div>
        </div>
      </div>

      <div className='flex gap-x-4 mt-8'>
        <Button variant='primary' onClick={() => setEditingMode(true)}>
          <Pencil size={16} /> Edit Profile
        </Button>
        <Button variant='secondary' onClick={() => logOut()}>
          <LogOut size={16} /> Log out
        </Button>
      </div>

      <hr className="my-10 border-navy/10" />

      <h3 className="text-[18px] font-semibold mb-4">Sent Exchange Requests</h3>
      
      {!user.sentRequests || user.sentRequests.length === 0 ? (
        <div className="w-full py-8 rounded-lg bg-navy/5 border border-navy/10 text-center flex flex-col items-center justify-center">
          <BookIcon className="text-navy/20 mb-2" size={32} />
          <p className="text-sm text-navy/60">You haven't requested any exchanges yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-3">
          {user.sentRequests.map((request) => (
            <div 
              key={request.id} 
              className="flex items-center justify-between p-4 rounded-lg border border-navy/10 bg-white/50 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-x-4">
                <div className="w-12 h-16 bg-navy/10 rounded overflow-hidden flex-shrink-0">
                  {request.requestedBook?.photoUrl ? (
                    <img src={request.requestedBook.photoUrl} alt="cover" className="w-full h-full object-cover" />
                  ) : (
                    <BookIcon className="w-full h-full p-3 text-navy/30" />
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {request.requestedBook?.name || `Book ID: ${request.requestedBookId}`}
                  </span>
                  <span className="text-xs text-navy/60">
                    {request.requestedBook?.author || 'Unknown Author'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-x-1.5 text-xs text-navy/50 font-medium">
                <Clock size={14} />
                {new Date(request.createdAt).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingMode && (
        <ProfileEditing user={user} onClose={() => setEditingMode(false)} onEdited={onEdited} />
      )}
    </div>
  );
}