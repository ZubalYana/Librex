import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { LogOut, Pencil } from 'lucide-react';
import ProfileEditing from '../ui/popups/ProfileEditing';


export default function Profile(){
    const [editingMode, setEditingMode] = useState(false);
    const user = useAuthStore((state)=>(state.user))
    const logOut = useAuthStore((state)=>(state.logout));
    console.log(user)

    const onEdited = (data: any)=>{
        console.log(data);
    }

    return(
        <div className="w-full text-navy">
            <h1 className="text-[20px] md:text-[24px] font-semibold">My Profile:</h1>

            <div className="flex items-center mt-4">
                <div className="w-[100px] h-[100px] bg-accent rounded-full"></div>
                <div className='ml-4'>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <p className={`${user.role === 'ADMIN' ? 'bg-accent/40' : 'bg-navy/40'} lowercase capitalize`}>{user.role}</p>
                </div>
            </div>
            <div className='flex gap-x-4'>
            <Button variant='secondary' onClick={()=>logOut()} className='mt-6'><LogOut/> Log out</Button>
            <Button variant='primary' onClick={()=>setEditingMode(true)} className='mt-6'><Pencil/> Edit</Button>
            </div>

            {editingMode && (
                <ProfileEditing user={user} onClose={()=>setEditingMode(false)} onEdited={()=>onEdited}/>
            )}
        </div>
    )
}