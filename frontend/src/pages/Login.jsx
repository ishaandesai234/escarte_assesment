import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Foxy from "@/components/Foxy";
import EscarteLogo from "@/components/EscarteLogo";
import ChunkyButton from "@/components/ChunkyButton";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-5 py-10" data-testid="login-page">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4"><EscarteLogo size="lg" showTagline /></div>
          <Foxy mood="happy" size={110} />
          <h1 className="font-display text-3xl font-bold text-slate-800 mt-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Foxy missed you.</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-[0_8px_0_0_rgba(226,232,240,1)] space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input
              data-testid="login-email-input"
              type="email" required
              className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold focus:outline-none focus:border-[#1A2A4F]"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700">Password</label>
            <input
              data-testid="login-password-input"
              type="password" required minLength={6}
              className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold focus:outline-none focus:border-[#1A2A4F]"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>
          <ChunkyButton data-testid="login-submit-btn" type="submit" variant="orange" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </ChunkyButton>
        </form>

        <p className="text-center mt-5 text-sm text-slate-600">
          New to Escarté?{" "}
          <Link to="/register" data-testid="login-goto-register" className="font-bold text-[#1A2A4F]">Create account</Link>
        </p>
      </div>
    </div>
  );
}
