import { useState } from "react";
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../api/apiFetch";
import CombinedLogo from "../ui/CombinedLogo";
import { useAlertStore } from "../../store/alertStore";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const setAlert = useAlertStore((state) => state.setAlert);
  const navigate = useNavigate();

  const disabled = !newPassword || !confirmPassword || newPassword !== confirmPassword;

  const onResetPassword = () => {
    if (!token || !email) {
      setAlert("error", "Invalid or missing reset token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert("error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    
    apiFetch("/user/reset-password", {
      method: "PUT",
      body: JSON.stringify({ email, token, newPassword }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to reset password");
        }
        return res.json();
      })
      .then(() => {
        setAlert("success", "Password reset successfully. You can now log in.");
        navigate("/login");
      })
      .catch((err) => setAlert("error", err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="text-[#2B2D42] w-full h-screen p-[20px] flex flex-col md:p-[40px]">
      <div className="w-full">
        <CombinedLogo />
      </div>
      
      <div className="w-full flex flex-1 items-center md:justify-between">
        <div className="w-full md:w-[400px] min-h-[300px] bg-[#FDFBF7] shadow-md p-[20px] md:p-[30px] rounded-md">
          <h3 className="text-[24px] font-bold mb-4">Create new password</h3>
          
          <div className="flex flex-col gap-y-3">
            <PasswordInput
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              showStrength={true} 
            />
            <PasswordInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showStrength={false}
            />
          </div>

          <Button
            onClick={() => onResetPassword()}
            isLoading={loading}
            className="mt-6 w-full"
            variant="primary"
            size="md"
            disabled={disabled}
          >
            <p className="uppercase text-[18px] font-semibold text-parchment">
              Reset Password
            </p>
          </Button>

          <p
            className="w-full flex justify-center cursor-pointer text-[12px] text-accent mt-4"
            onClick={() => navigate("/login")}
          >
            Remember your password?
            <span className="underline ml-1">Log in.</span>
          </p>
        </div>

        <div className="hidden md:flex w-[50%] items-center justify-center">
          <img
            src="/illustrations/Booklover-bro.svg"
            alt="illustration"
            className="w-[500px]"
          />
        </div>
      </div>
    </div>
  );
}