import { useAuthStore } from '../../store/authStore';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { LogOut, Pencil } from 'lucide-react';
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
    return <div>Loading...</div>;
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full text-navy">
      <h1 className="text-[20px] md:text-[24px] font-semibold">My Profile:</h1>

      <div className="flex items-center mt-4">
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
        <div className="ml-4">
          <h2 className="text-[18px] font-semibold">{user.name}</h2>
          <p className="text-navy/70">{user.email}</p>
          <div className="flex items-center gap-x-2 mt-1.5">
            <span className={`${user.role === 'ADMIN' ? 'bg-accent/40' : 'bg-navy/10'} px-2 py-0.5 rounded-full text-[11px] font-medium lowercase`}>
              {user.role}
            </span>
            <span className="text-[13px] text-navy/60">{user.books.length ?? 0} books</span>
          </div>
        </div>
      </div>

      <div className='flex gap-x-4'>
        <Button variant='secondary' onClick={() => logOut()} className='mt-6'><LogOut /> Log out</Button>
        <Button variant='primary' onClick={() => setEditingMode(true)} className='mt-6'><Pencil /> Edit</Button>
      </div>

      {editingMode && (
        <ProfileEditing user={user} onClose={() => setEditingMode(false)} onEdited={onEdited} />
      )}
    </div>
  );
}