import CombinedLogo from "../../ui/CombinedLogo";
import { Button } from "../../ui/Button";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col p-[20px] lg:px-[40px]">
      <CombinedLogo />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-x-16 gap-y-8 mt-6 md:mt-0">
        <div className="max-w-[480px] text-center lg:text-left">
          <h1 className="text-[32px] md:text-[40px] font-semibold text-navy leading-tight">
            Exchange books with readers all over the globe
          </h1>
          <p className="mt-4 text-navy/70 text-[16px] md:text-[18px]">
            Trade books with people, discover new stories or authors and keep your book shelfs up to date!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
        </div>

        <img
          src="/illustrations/LandingMain.svg"
          alt="People reading books together"
          className="w-full max-w-[480px] lg:max-w-[520px]"
        />
      </div>
    </div>
  );
}