import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Foxy from "@/components/Foxy";
import EscarteLogo from "@/components/EscarteLogo";
import ChunkyButton from "@/components/ChunkyButton";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", name: "", age: "", grade: "" });
  const [loading, setLoading] = useState(false);

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
        age: form.age ? parseInt(form.age) : null,
        grade: form.grade || null,
      });
      toast.success(`Yay! Welcome ${form.name}!`);
      nav("/dashboard");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-5 py-10" data-testid="register-page">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4"><EscarteLogo size="lg" showTagline /></div>
          <Foxy mood="cheer" size={110} />
          <h1 className="font-display text-3xl font-bold text-slate-800 mt-2">Let's get started</h1>
          <p className="text-slate-500 text-sm">Foxy is excited to meet you.</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-[0_8px_0_0_rgba(226,232,240,1)] space-y-3">
          <div>
            <label className="text-sm font-bold text-slate-700">Your name</label>
            <input data-testid="reg-name-input" required className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold focus:outline-none focus:border-[#1A2A4F]" value={form.name} onChange={upd("name")} placeholder="Alex" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-slate-700">Age</label>
              <input data-testid="reg-age-input" type="number" min="8" max="20" className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold focus:outline-none focus:border-[#1A2A4F]" value={form.age} onChange={upd("age")} placeholder="14" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700">Class / Grade</label>
              <input data-testid="reg-grade-input" className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold focus:outline-none focus:border-[#1A2A4F]" value={form.grade} onChange={upd("grade")} placeholder="8" />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input data-testid="reg-email-input" type="email" required className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold focus:outline-none focus:border-[#1A2A4F]" value={form.email} onChange={upd("email")} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700">Password</label>
            <input data-testid="reg-password-input" type="password" required minLength={6} className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold focus:outline-none focus:border-[#1A2A4F]" value={form.password} onChange={upd("password")} placeholder="At least 6 characters" />
          </div>
          <ChunkyButton data-testid="reg-submit-btn" type="submit" variant="orange" disabled={loading}>
            {loading ? "Creating..." : "Create My Account"}
          </ChunkyButton>
        </form>

        <p className="text-center mt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" data-testid="reg-goto-login" className="font-bold text-[#1A2A4F]">Log in</Link>
        </p>
      </div>
    </div>
  );
}
