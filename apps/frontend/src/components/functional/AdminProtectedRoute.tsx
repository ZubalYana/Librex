import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminProtectedRoute(){
    const user = useAuthStore((state)=>(state.user));

    if(user?.role !== 'ADMIN'){
        return <Navigate to="/app/books" replace/>
    }

    return <Outlet/>
}