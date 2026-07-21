import { useState } from "react";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/apiFetch";
import { useAuthStore } from "../../store/authStore";
import CombinedLogo from "../ui/CombinedLogo";
import { useAlertStore } from "../../store/alertStore";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordResetMode, setPasswordResetMode] = useState(false);

  const setAlert = useAlertStore((state) => state.setAlert);

  const disabled = !email || !password;
  const resetButtonDisabled = !email;
  const navigate = useNavigate();

  const onLogin = () => {
    setLoading(true);
    const data = JSON.stringify({ email: email, password: password });
    apiFetch("/auth/login", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        useAuthStore.getState().setAuth(data.user, data.token);
        navigate("/app/books");
      })
      .catch((err) => setAlert("error", err.message))
      .finally(() => setLoading(false));
  };

  const forgotPassword = () => {
    if(!email){
        setAlert('error', 'Email is required');
        return
    }
    apiFetch("/user/forgot-password", {
      method: "POST",
      body: JSON.stringify({email}),
    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data)
        setAlert("info", "Confirmation link has been sent to your email");
    })
    .catch((err)=>{
        console.log(err);
        setAlert("error", err.message)
    })
  };

  return (
    <div className="text-[#2B2D42] w-full h-screen p-[20px] flex flex-col md:p-[40px] n">
      <div className="w-full">
        <CombinedLogo />
      </div>
      <div className="w-full flex flex-1 items-center md:justify-between">
        <div className={`w-full  md:w-[400px] ${passwordResetMode? 'md:h-[250px]' : 'min-h-[300px]'} bg-[#FDFBF7] shadow-md p-[20px] md:p-[30px] rounded-md`}>
          {!passwordResetMode ? (
            <div>
              <h3 className="text-[24px] font-bold mb-4">Login</h3>
              <div className="flex flex-col gap-y-3">
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordInput
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showStrength={false}
                />
              </div>
              <Button
                onClick={() => onLogin()}
                isLoading={loading}
                className="mt-4 w-full"
                variant="primary"
                size="md"
                disabled={disabled}
              >
                <p className="uppercase text-[18px] font-semibold text-parchment">
                  Login
                </p>
              </Button>
              <p
                className="w-full flex justify-center cursor-pointer text-[12px] text-accent mt-2"
                onClick={() => navigate("/register")}
              >
                Not yet a user?
                <span className="underline ml-1">Register.</span>
              </p>
              <p
                className="w-full flex justify-center cursor-pointer text-[12px] text-accent mt-2"
                onClick={() => setPasswordResetMode(true)}
              >
                Forgot password?
                <span className="underline ml-1">Reset.</span>
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-[24px] font-bold mb-4">Reset password</h3>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={() => forgotPassword()}
                isLoading={loading}
                className="mt-4 w-full"
                variant="primary"
                size="md"
                disabled={resetButtonDisabled}
              >
                <p className="text-[18px] font-semibold text-parchment">
                  Send confirmation link
                </p>
              </Button>
              <p
                className="w-full flex justify-center cursor-pointer text-[12px] text-accent mt-2"
                onClick={() => navigate("/register")}
              >
                Not yet a user?
                <span className="underline ml-1">Register.</span>
              </p>
                <p
                className="w-full flex justify-center cursor-pointer text-[12px] text-accent mt-2"
                onClick={() => setPasswordResetMode(false)}
              >
                Back to
                <span className="underline ml-1">Log in.</span>
              </p>
            </div>
          )}
        </div>
        <div className="hidden md:flex w-[50%] flex items-center justify-center">
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
