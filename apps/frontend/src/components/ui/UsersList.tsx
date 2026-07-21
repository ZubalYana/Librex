import { useState, useEffect } from "react";
import { apiFetch } from "../../api/apiFetch";
import type { User } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";
import { Trash2 } from 'lucide-react'
import ConfirmDialog from "./popups/ConfirmDialog";
import { useAuthStore } from "../../store/authStore";


export default function UsersList(){
    const [users, setUsers] = useState<User[] | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const thisUser = useAuthStore((state)=>(state.user))
    // const [loading, setLoading] = useState(false);
    const [usersPagination, setUsersPagination] = useState({
        page: 1,
        userLimit: 15,
        totalCount: 0,
        totalPages: 0
    })
    const setAlert = useAlertStore((state)=>(state.setAlert));

    useEffect(()=>{
        apiFetch('/admin/users')
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            setUsers(data.users);
            setUsersPagination(data.pagination);
        })
        .catch((err)=>{
            setAlert("error", 'Error fetching users');
            console.error(err);
        })
    }, [])

    const deleteUser = ()=>{
        apiFetch(`/admin/users/${deletingUser.id}`, {
            method: 'DELETE'
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            setAlert('success', `Deleted ${deletingUser.email} successfully`);
            setDeletingUser(null);
        })
        .catch((err)=>{
            setAlert("error", err.message)
        })
    }

    if(!users){
        return <div>Loading...</div>
    }
    return(
        <div className="w-full">
            {users.length === 0? <div>No users yet</div> :
            <div className="w-full flex flex-col gap-y-2">
                {users.map((user)=>(
                    <div 
                    key={user.id}
                    className={`rounded-md flex justify-between items-center w-full py-2 px-4 ${user.id === thisUser.id? 'bg-accent/30' : 'bg-navy/30'}`}
                    >
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                        <Trash2 size={18} className="cursor-pointer hover:scale-[1.1]" onClick={()=>{setDeletingUser(user)}}/>
                    </div>
                ))}
            </div>
            }

            {deletingUser && (
                            <ConfirmDialog 
            open={deletingUser !== null? true : false} 
            onCancel={()=>setDeletingUser(null)}
            title={`Are you sure you want to delete ${deletingUser.email}?`}
            description="This action cannot be undone"
            onConfirm={()=>deleteUser()}
            />
            )}


        </div>
    )
}