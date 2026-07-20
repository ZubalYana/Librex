import { useState } from "react"
import { Input } from "../ui/Input"
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/apiFetch";
import { useAuthStore } from "../../store/authStore";
import CombinedLogo from "../ui/CombinedLogo";

export default function Login(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const disabled = !email || !password;
    const navigate = useNavigate();

    const onLogin = ()=>{
        setLoading(true);
        const data = JSON.stringify({email: email, password: password})
        apiFetch('/auth/login', {
            method: 'POST',
            body: data
        })
        .then((res)=>res.json())
        .then((data)=>{
            useAuthStore.getState().setAuth(data.user, data.token);
            setLoading(false);
            navigate('/app/books');
        }).catch((err)=>console.error(err));
    }

    return(
                <div className="text-[#2B2D42] w-full h-screen p-[20px] flex flex-col md:p-[40px] n">
                    <div className="w-full">
                        <CombinedLogo/>
                    </div>
                    <div className="w-full flex flex-1 items-center md:justify-between">
            <div className="w-full md:w-[400px] min-h-[300px] bg-[#FDFBF7] shadow-md p-[20px] md:p-[30px] rounded-md">
                <h3 className="text-[24px] font-bold mb-4">Login</h3>
                <div className="flex flex-col gap-y-3">
                <Input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <PasswordInput placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} showStrength={false}/>
                </div>
                <Button onClick={()=>onLogin()} isLoading={loading} className="mt-4 w-full" variant="primary" size="md" disabled={disabled}><p className="uppercase text-[18px] font-semibold text-parchment">Login</p></Button>
                <p className="w-full flex justify-center cursor-pointer text-[12px] text-accent mt-2" onClick={()=>navigate('/register')}>Not yet a user? <span className="underline ml-1">Register.</span></p>
            </div>
            <div className="hidden md:flex w-[50%] flex items-center justify-center">
                <img src="/illustrations/Booklover-bro.svg" alt="illustration" className="w-[500px]" />
            </div>
            </div>
        </div>
    )
}