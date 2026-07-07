import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import Foxy from "@/components/Foxy";
import ChunkyButton from "@/components/ChunkyButton";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const nav = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [badges, setBadges] = useState({});
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    refreshUser();
    (async () => {
      const [b, s] = await Promise.all([api.get("/badges"), api.get("/submissions/me")]);
      setBadges(b.data); setSubs(s.data);
    })();
  }, []);

  const userBadges = user?.badges || [];

  return (
    <div className="min-h-screen bg-parchment" data-testid="profile-page">
      <header className="bg-white border-b-2 border-slate-100">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Foxy size={40} />
            <span className="font-display text-xl font-bold text-slate-800">Escarté</span>
          </Link>
          <button onClick={async () => { await logout(); nav("/"); }} data-testid="profile-logout-btn" className="text-sm font-bold text-slate-500">Log out</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-6">
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-[0_6px_0_0_rgba(226,232,240,1)] flex items-center gap-5">
          <Foxy mood="happy" size={100} />
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-800">{user?.name}</h1>
            <div className="text-sm text-slate-500">{user?.email}</div>
            {(user?.age || user?.grade) && (
              <div className="text-xs text-slate-500 mt-1">
                {user?.age && <>Age {user.age}</>}{user?.age && user?.grade && " • "}{user?.grade && <>Grade {user.grade}</>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-xl font-bold text-slate-800 mb-3">Trophy Shelf 🏆</h2>
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 grid grid-cols-3 sm:grid-cols-5 gap-3">
            {Object.entries(badges).map(([id, b]) => {
              const earned = userBadges.includes(id);
              return (
                <div key={id} data-testid={`badge-slot-${id}`} className={`text-center p-3 rounded-2xl border-2 ${earned ? "bg-[#F5EFE0] border-[#1A2A4F]" : "bg-slate-50 border-slate-200 opacity-50"}`}>
                  <div className="text-3xl">{b.emoji}</div>
                  <div className="text-xs font-bold text-slate-700 mt-1">{b.name}</div>
                  {!earned && <div className="text-[10px] text-slate-400 mt-1">Locked</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-xl font-bold text-slate-800 mb-3">History</h2>
          {subs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No attempts yet.</p>
              <Link to="/dashboard"><ChunkyButton variant="orange">Take your first test</ChunkyButton></Link>
            </div>
          ) : (
            <div className="space-y-2">
              {subs.map((s) => (
                <Link key={s.id} to={`/results/${s.id}`} data-testid={`profile-history-${s.id}`} className="block bg-white rounded-2xl border-2 border-slate-200 p-4 flex items-center justify-between hover:border-[#1A2A4F]">
                  <div>
                    <div className="font-bold text-slate-800">{s.category || "Full Test"}</div>
                    <div className="text-xs text-slate-500">{new Date(s.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-[#1A2A4F]">{s.score_pct}%</div>
                    <div className="text-xs text-slate-500">{s.rank}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
