import type { User } from "../../../store/authStore";
import { X } from "lucide-react";

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
  return (
    <div
      className="w-full h-screen fixed z-50 top-0 left-0 bg-navy/40 backdrop-blur-sm flex justify-center items-center p-[20px] md:p-[40px]"
      onClick={(e) => {
        onClose();
        e.stopPropagation();
      }}
    >
      <div
        className="w-full md:w-[600px] min-h-0 bg-parchment rounded-md p-[20px] md:p-[30px] relative z-50"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <X
          onClick={() => onClose()}
          className="absolute cursor-pointer top-[20px] right-[20px] md:top-[30px] md:right-[30px]"
        />
         <h2 className="text-[20px] font-semibold">Edit your profile</h2>
      </div>
    </div>
  );
}
