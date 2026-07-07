import { Link, useNavigate } from "react-router-dom";
import Foxy from "@/components/Foxy";
import FireStreak from "@/components/FireStreak";
import EscarteLogo from "@/components/EscarteLogo";
import ChunkyButton from "@/components/ChunkyButton";
import { useAuth } from "@/context/AuthContext";

export default function Landing() {
  const nav = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-parchment" data-testid="landing-page">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
        <EscarteLogo size="md" showTagline />
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <ChunkyButton variant="navy" className="!py-2 !text-xs !w-auto !px-4">Dashboard</ChunkyButton>
            </Link>
          ) : (
            <>
              <Link to="/login" data-testid="nav-login-link" className="font-bold text-sm text-[#1A2A4F] hover:text-[#B71C1C] transition-colors">Log in</Link>
              <Link to="/register">
                <ChunkyButton data-testid="nav-signup-btn" variant="gold" className="!py-2 !text-xs !w-auto !px-4">Sign up</ChunkyButton>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-6 sm:pt-10 pb-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#1A2A4F] text-[#E5A934] px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A934] animate-pulse" />
            Escarté Learning Labs — Skill Assessment
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A2A4F] leading-[1.05] tracking-tight">
            Where do <span className="italic text-[#B71C1C]">you</span> stand<br/>on real-world skills?
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#4B5A78] leading-relaxed max-w-lg">
            A refined, gamified skill assessment for ages 10–18. Six categories. Instant, private, insightful reports — guided by <span className="text-[#B71C1C] font-bold">Foxy</span>, your scholar-in-residence.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md">
            <ChunkyButton data-testid="hero-cta-btn" variant="navy" onClick={() => nav(user ? "/dashboard" : "/register")}>
              Take Free Assessment
            </ChunkyButton>
            <ChunkyButton data-testid="hero-login-btn" variant="ivory" onClick={() => nav("/login")}>
              I have an account
            </ChunkyButton>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-[#4B5A78] uppercase tracking-widest">
            <span>✓ 6 categories</span>
            <span>✓ Instant PDF report</span>
            <span>✓ 100% free</span>
          </div>
        </div>

        {/* Hero visual — Foxy on a plinth with orbiting illustrations */}
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-[#FFF8EA] via-[#EFE7D3] to-[#D9CDB0] rounded-[42px] rotate-2" />
          <div className="relative bg-[#FFF8EA] rounded-[36px] p-8 border-4 border-[#1A2A4F] shadow-[0_16px_0_0_#1A2A4F,0_20px_40px_-10px_rgba(26,42,79,0.4)] min-h-[380px] grain">
            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-4 border-l-4 border-[#E5A934]" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-4 border-r-4 border-[#E5A934]" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-4 border-l-4 border-[#E5A934]" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-4 border-r-4 border-[#E5A934]" />

            <div className="flex justify-center items-center min-h-[280px]">
              <div className="relative">
                <Foxy mood="focused" size={280} />
                {/* Fire streak orbiting */}
                <div className="absolute top-1/2 left-1/2 animate-orbit">
                  <FireStreak count={7} showCount={false} size={44} />
                </div>
              </div>
            </div>

            {/* Score card */}
            <div className="mt-2 flex items-center justify-between bg-[#1A2A4F] text-[#F5EFE0] rounded-2xl px-4 py-3">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#E5A934]">Today's Insight</div>
                <div className="font-display text-sm mt-0.5">Emotional IQ climbing</div>
              </div>
              <div className="shimmer-gold font-display font-bold text-2xl">+42 XP</div>
            </div>
          </div>

          {/* Floating chips */}
          <div className="absolute -top-3 -right-3 bg-[#B71C1C] text-[#F5EFE0] font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full rotate-6 shadow-lg">
            🔥 3-day streak
          </div>
          <div className="absolute -bottom-3 -left-3 bg-[#E5A934] text-[#1A2A4F] font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full -rotate-6 shadow-lg">
            🏆 Badge unlocked
          </div>
        </div>
      </section>

      {/* Divider quote */}
      <section className="max-w-4xl mx-auto px-5 py-8 text-center">
        <div className="escarte-divider mx-auto w-24" />
        <p className="mt-5 font-display italic text-xl sm:text-2xl text-[#1A2A4F] leading-snug">
          "Sharp minds are made — one honest question at a time."
        </p>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#4B5A78]">— Foxy, Chief Learning Fox</p>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#B71C1C]">The Curriculum</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2A4F] mt-1">Six skills. One elegant test.</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: "Basic English", emoji: "📚", key: "english" },
            { name: "Communication", emoji: "💬", key: "communication" },
            { name: "Financial Literacy", emoji: "💰", key: "finance" },
            { name: "Leadership", emoji: "👑", key: "leadership" },
            { name: "Critical Thinking", emoji: "🧠", key: "critical" },
            { name: "Emotional IQ", emoji: "💖", key: "emotional" },
          ].map((c, i) => (
            <div
              key={c.key}
              className="bg-[#FFF8EA] rounded-2xl p-5 border-2 border-[#1A2A4F] border-b-[6px] group hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{c.emoji}</div>
                <div className="font-display text-2xl text-[#E5A934] font-bold">0{i + 1}</div>
              </div>
              <div className="font-display font-bold text-[#1A2A4F] text-lg">{c.name}</div>
              <div className="mt-3 escarte-divider w-8" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D9CDB0] mt-8">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <EscarteLogo size="sm" showTagline />
          <p className="text-xs uppercase tracking-widest text-[#4B5A78]">© Escarté Learning Labs • For teens 10–18</p>
        </div>
      </footer>
    </div>
  );
}
