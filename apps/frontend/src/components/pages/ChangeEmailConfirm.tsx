import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiFetch } from "../../api/apiFetch";

type Status = "loading" | "success" | "error";

export default function ChangeEmailConfirm() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This confirmation link is missing its token.");
      return;
    }

    async function confirm() {
      try {
        const res = await apiFetch("/user/confirm-newEmail", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.message || "Invalid or expired confirmation link");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Email was updated successfully");
      } catch {
        setStatus("error");
        setMessage("Something went wrong reaching the server.");
      }
    }

    confirm();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
      <div className="w-full max-w-md bg-white border border-[#2B2D42]/10 rounded-xl p-8 text-center shadow-sm">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 h-8 w-8 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin" />
            <h1 className="text-xl text-[#2B2D42] mb-1">
              Confirming your email
            </h1>
            <p className="text-sm text-[#2B2D42]/60">
              Hang on a moment while we verify your link.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#E07A5F]/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-[#E07A5F]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl text-[#2B2D42] mb-1">
              Email updated
            </h1>
            <p className="text-sm text-[#2B2D42]/60 mb-6">
              {message}
            </p>
            <Link
              to="/login"
              className="inline-block text-sm font-medium bg-[#14213D] text-white px-5 py-2.5 rounded-lg hover:bg-[#2B2D42] transition-colors"
            >
              Go to login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl text-[#2B2D42] mb-1">
              Confirmation failed
            </h1>
            <p className="text-sm text-[#2B2D42]/60 mb-6">
              {message}
            </p>
            <Link
              to="/app/me"
              className="inline-block text-sm font-medium border border-[#2B2D42]/20 text-[#2B2D42] px-5 py-2.5 rounded-lg hover:bg-[#2B2D42]/5 transition-colors"
            >
              Back to profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}