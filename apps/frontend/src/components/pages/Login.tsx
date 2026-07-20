import { useState } from "react"
import { Input } from "../ui/Input"
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const disabled = !email || !password;
    const navigate = useNavigate();

    return(
        <div className="text-[#2B2D42] w-full h-screen p-[20px] flex jusitfy-center items-center md:p-[40px] md:justify-between">
            <div className="w-full md:w-[400px] min-h-[300px] bg-[#FDFBF7] shadow-md p-[20px] md:p-[30px] rounded-md">
                <h3 className="text-[24px] font-bold mb-4">Login</h3>
                <div className="flex flex-col gap-y-3">
                <Input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <PasswordInput placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} showStrength={false}/>
                </div>
                <Button className="mt-4 w-full" variant="primary" size="md" disabled={disabled}><p className="uppercase text-[18px] font-semibold text-parchment">Login</p></Button>
                <p className="w-full flex justify-center cursor-pointer text-[12px] text-accent mt-2" onClick={()=>navigate('/register')}>Not yet a user? <span className="underline ml-1">Register.</span></p>
            </div>
        </div>
    )
}