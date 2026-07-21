import type { User } from "../../../store/authStore";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import AvatarUploader from "../AvatarUploader";
import { Input } from "../Input";
import { Button } from "../Button";
import { apiFetch } from "../../../api/apiFetch";
import { useAlertStore } from "../../../store/alertStore";
import { PasswordInput } from "../PasswordInput";
// import { useAuthStore } from "../../../store/authStore";

interface ProfileEditingProps {
  user: User;
  onClose: () => void;
  onEdited: (newUser: User) => void;
}

export default function ProfileEditing({
  user,
  onClose,
  onEdited,
}: ProfileEditingProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarChanged, setAvatarChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const setAlert = useAlertStore((state)=>(state.setAlert));
    // const setUser = useAuthStore((state)=>(state.setAuth))

    const initialLoad = ()=>{
        setName(user.name);
        setEmail(user.email);
        // setAvatar(user.avatar)
    }

    useEffect(()=>{
        initialLoad();
    }, [])

    useEffect(()=>{
        setDisabled(!avatarChanged && name === user.name && email === user.email)
    }, [avatarChanged, name, email])

    useEffect(()=>{
        email !== user.email? setShowPassword(true) : setShowPassword(false);
    }, [email])

    const onEdit = ()=>{
        setLoading(true);
        const formData = new FormData;
        formData.append("avatar", avatar);

        if(avatarChanged){
            apiFetch('/user/upload-avatar', {
                method: 'PUT',
                body: formData
            })
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data);
                setAlert('success', 'Avatar changed successfully');
                onClose();
                onEdited(data);
            })
            .catch((err)=>{
                console.error(err);
                setAlert("error", 'Error uploading your avatar');
            })
            .finally(()=>setLoading(false));
        }

        if(name != user.name){
            apiFetch(`/user/edit-name`, {
                method: 'PUT',
                body: JSON.stringify({newUserName: name})
            })
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data);
                setAlert('success', 'Name changed successfully');
                // setUser()
                onEdited(data);
                onClose();
            })
            .catch((err)=>{
                console.error(err);
                setAlert('error', 'Error changing your name');
            })
            .finally(()=>setLoading(false));
        }

        if(email != user.email){
            apiFetch('/user/edit-email', {
                method: 'POST',
                body: JSON.stringify({newEmail: email, currentPassword: password})
            })
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data);
                setAlert('info', 'Confirmation link has been sent to your new email');
            })
            .catch((err)=>{
                console.error(err);
                setAlert('error', 'Error while sending you a confirmation link');
            })
            .finally(()=>setLoading(false));
        }

        setLoading(false);
        
    }
  return (
    <div
      className="w-full h-screen fixed z-50 top-0 left-0 bg-navy/40 backdrop-blur-sm flex justify-center items-center p-[20px] md:p-[40px]"
      onClick={(e) => {
        onClose();
        e.stopPropagation();
      }}
    >
      <div
        className="w-full md:w-[450px] min-h-0 bg-parchment rounded-md p-[20px] md:p-[30px] relative z-50"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <X
          onClick={() => onClose()}
          className="absolute cursor-pointer top-[20px] right-[20px] md:top-[30px] md:right-[30px]"
        />
         <h2 className="text-[20px] font-semibold">Edit your profile</h2>
         <div className="w-full flex gap-x-10 mt-6">
            <AvatarUploader 
            onChange={(file)=>{
                setAvatar(file);
                setAvatarChanged(true);
            }} 
            url={user.avatar} 
            value={avatar}
            />
            <div className="flex flex-col gap-y-3">
                <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
                <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
                {showPassword && (
                    <PasswordInput showStrength={false} value={password} onChange={((e)=>setPassword(e.target.value))} placeholder="Password"/>
                )}
            </div>
         </div>
         {showPassword && (
            <p className="text-[12px] text-navy/70 mt-4">*We need you to enter password before changing your email to confirm your identity.</p>
         )}
         <div className="w-full flex justify-between gap-x-4 mt-8">
              <Button variant="secondary" size="lg" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                isLoading={loading}
                size="lg"
                className="w-[270px]"
                onClick={() => onEdit()}
                disabled={disabled}
              >
                Confirm changes
              </Button>
            </div>
      </div>
    </div>
  );
}
