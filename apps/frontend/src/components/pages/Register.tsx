import { useState } from "react"
import { Input } from "../ui/Input"
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function Register(){
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<string>('');

    const disabled = !name || !email || !password;
    const navigate = useNavigate();

    return(
        <div className="text-[#2B2D42] w-full h-screen p-[20px] flex jusitfy-center items-center md:p-[40px] md:justify-between">
            <div className="w-full md:w-[400px] min-h-[300px] bg-[#FDFBF7] shadow-md p-[20px] md:p-[30px] rounded-md">
                <h3 className="text-[24px] font-bold mb-4">Register</h3>
                <div className="flex flex-col gap-y-3">
                <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
                <Input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <PasswordInput placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                </div>
                <Button className="mt-4 w-full" variant="primary" size="md" disabled={disabled}><p className="uppercase text-[18px] font-semibold text-parchment">Register</p></Button>
                <p className="w-full flex justify-center cursor-pointer text-[12px] text-accent mt-2" onClick={()=>navigate('/login')}>Already a user? <span className="underline ml-1"> Log in.</span></p>
            </div>
        </div>
    )
}