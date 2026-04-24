"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

type ApiMessageResponse = {
  message?: string;
  error?: string;
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userId =  searchParams.get("id") ;
  console.log("ResetPasswordPage - token:", token, "userId:", userId);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!token || !userId) {
      setStatus({ type: "error", text: "Reset token and user ID are required." });
      return;
    }

    if (!password || !confirmPassword) {
      setStatus({ type: "error", text: "Please fill both password fields." });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          userId,
          password,
          confirmPassword,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiMessageResponse;

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to reset password.");
      }

      setStatus({
        type: "success",
        text: data.message || "Password reset successful.",
      });
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setStatus({ type: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-14">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        {!token || !userId ? (
          <p className="mt-3 text-sm text-red-400">
            Missing reset token or user ID. Open this page from the reset link.
          </p>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-slate-200">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-10 text-white outline-none focus:border-sky-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200
                hover:cursor-pointer"
                aria-label={showPassword ? "Hide new password" : "Show new password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm text-slate-200">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full   hover:cursor-pointer rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-10 text-white outline-none focus:border-sky-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="  hover:cursor-pointer absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg   hover:cursor-pointer bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Submitting..." : "Reset Password"}
          </button>

          {status && (
            <p className={status.type === "success" ? "text-emerald-400 text-sm" : "text-red-400 text-sm"}>
              {status.text}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}