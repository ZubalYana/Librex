import { create } from 'zustand';

type User = {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
    avatar: string | null;
};

type AuthState = {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: ()=>void;
}

export const useAuthStore = create<AuthState>((set)=>({
    user: null,
    token: null,
    setAuth: ( user, token) => set({user, token}),
    logout: () => set({user: null, token: null})
}));