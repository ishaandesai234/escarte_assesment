import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import Foxy from "@/components/Foxy";
import EscarteLogo from "@/components/EscarteLogo";
import ChunkyButton from "@/components/ChunkyButton";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Dashboard() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [cats, setCats] = useState([]);
  const [badges, setBadges] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [c, b, h] = await Promise.all([
          api.get("/categories"),
          api.get("/badges"),
          api.get("/submissions/me"),
        ]);
        setCats(c.data);
        setBadges(b.data);
        setHistory(h.data);
      } catch (e) {
        toast.error("Couldn't load. Try again.");
      }
    })();
  }, []);

  const userBadges = user?.badges || [];

  return (
    <div className="min-h-screen bg-parchment" data-testid="dashboard-page">
      {/* Top bar */}
      <header className="bg-[#FFF8EA] border-b-2 border-[#D9CDB0]">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <EscarteLogo size="sm" showTagline />
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <button onClick={() => nav("/admin")} data-testid="nav-admin-btn" className="text-sm font-bold text-[#E5A934]">Admin</button>
            )}
            <button onClick={() => nav("/profile")} data-testid="nav-profile-btn" className="text-sm font-bold text-slate-700">Profile</button>
            <button onClick={async () => { await logout(); nav("/"); }} data-testid="logout-btn" className="text-sm font-bold text-slate-500">Log out</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6">
        {/* Greeting */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-[0_6px_0_0_rgba(226,232,240,1)] mb-6 flex items-center gap-4">
          <Foxy mood="happy" size={90} />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">Hi {user?.name || "friend"}! 👋</h1>
            <p className="text-slate-600 text-sm mt-1">Pick a skill below to start — or take the full test to unlock a big report.</p>
          </div>
        </div>

        {/* Full test CTA */}
        <div className="rounded-3xl p-5 mb-6 border-2 border-[#1A2A4F] bg-gradient-to-r from-[#F5EFE0] to-[#FFE8D6] shadow-[0_6px_0_0_rgba(255,130,45,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase text-[#1A2A4F]">⭐ Recommended</div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-800 mt-1">Take the Full Skill Test</h2>
              <p className="text-sm text-slate-600 mt-1">All 6 categories • ~15 min • Detailed report + PDF</p>
            </div>
            <div className="shrink-0">
              <ChunkyButton data-testid="start-full-test-btn" variant="orange" className="!py-3" onClick={() => nav("/quiz/full")}>
                Start Full Test
              </ChunkyButton>
            </div>
          </div>
        </div>

        {/* Categories */}
        <h3 className="font-display text-xl font-bold text-slate-800 mb-3">Or pick a category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cats.map((c) => (
            <button
              key={c.id}
              data-testid={`category-card-${c.id}`}
              onClick={() => nav(`/quiz/${c.id}`)}
              className="text-left bg-white rounded-3xl border-2 border-slate-200 border-b-[5px] p-5 hover:border-[#1A2A4F] active:translate-y-[3px] active:border-b-2 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl">{c.emoji}</div>
                <div className="text-xs font-bold text-slate-400">{c.question_count} Qs</div>
              </div>
              <div className="font-bold text-slate-800">{c.name}</div>
              <div className="text-xs text-slate-500 mt-1">{c.description}</div>
            </button>
          ))}
        </div>

        {/* Badges */}
        <div className="mt-8">
          <h3 className="font-display text-xl font-bold text-slate-800 mb-3">Your Trophy Shelf 🏆</h3>
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 min-h-[80px]">
            {userBadges.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-3">No badges yet. Nail a power question to earn one!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {userBadges.map((b) => (
                  <div key={b} data-testid={`badge-${b}`} className="flex items-center gap-2 bg-[#F5EFE0] border-2 border-[#1A2A4F] rounded-full pl-2 pr-4 py-1">
                    <span className="text-xl">{badges[b]?.emoji || "🎖️"}</span>
                    <span className="text-sm font-bold text-[#0F1B37]">{badges[b]?.name || b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display text-xl font-bold text-slate-800 mb-3">Recent Attempts</h3>
            <div className="space-y-2">
              {history.slice(0, 5).map((h) => (
                <button
                  key={h.id}
                  data-testid={`history-${h.id}`}
                  onClick={() => nav(`/results/${h.id}`)}
                  className="w-full text-left bg-white rounded-2xl border-2 border-slate-200 p-4 flex items-center justify-between hover:border-[#1A2A4F]"
                >
                  <div>
                    <div className="font-bold text-slate-800">{h.category ? h.category : "Full Test"}</div>
                    <div className="text-xs text-slate-500">{new Date(h.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-[#1A2A4F]">{h.score_pct}%</div>
                    <div className="text-xs text-slate-500">{h.rank}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
