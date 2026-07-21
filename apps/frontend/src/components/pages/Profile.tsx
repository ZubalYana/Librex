import { useAuthStore } from '../../store/authStore';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { LogOut, Pencil } from 'lucide-react';
import ProfileEditing from '../ui/popups/ProfileEditing';
import type { User } from '../../store/authStore';
import { apiFetch } from '../../api/apiFetch';


export default function Profile(){
    const [editingMode, setEditingMode] = useState(false);
    // const user = useAuthStore((state)=>(state.user))
    const [user, setUser]= useState<User | null>(null)
    const logOut = useAuthStore((state)=>(state.logout));

    const onEdited = (data: any)=>{
        console.log('Data:',data);
    }

    useEffect(()=>{
        apiFetch('/user/profile', {
            method: 'GET'
        })
        .then((res)=>res.json())
        .then((data)=>{
            setUser(data.userWithoutPassword)
            console.log(data)
        })
    }, [])

    if(!user){
        return <div>Loading...</div>
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