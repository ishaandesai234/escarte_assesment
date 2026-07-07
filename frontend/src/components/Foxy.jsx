/**
 * Foxy — SkillFox head-only mascot. Expression via eyes & brows (no mouth).
 */
export default function Foxy({ mood = "neutral", size = 160, className = "" }) {
  const FUR = "#D4652A", FUR_DARK = "#A8481A", CREAM = "#F5F0E8";
  const NAVY = "#0A1628", AMBER = "#C9A84C", PUPIL = "#2D3436";

  const face = () => {
    if (mood === "sad") return (
      <>
        <path d="M 70 80 L 84 76" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 130 80 L 116 76" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="78" cy="92" rx="7" ry="8" fill={CREAM} />
        <ellipse cx="122" cy="92" rx="7" ry="8" fill={CREAM} />
        <ellipse cx="78" cy="93" rx="5.5" ry="6.5" fill={AMBER} />
        <ellipse cx="122" cy="93" rx="5.5" ry="6.5" fill={AMBER} />
        <ellipse cx="78" cy="94" rx="2.4" ry="3.2" fill={PUPIL} />
        <ellipse cx="122" cy="94" rx="2.4" ry="3.2" fill={PUPIL} />
        <circle cx="79.5" cy="92" r="1" fill={CREAM} />
        <circle cx="123.5" cy="92" r="1" fill={CREAM} />
      </>
    );
    if (mood === "happy" || mood === "cheer") return (
      <>
        <path d="M 66 80 Q 78 74 90 80" stroke={NAVY} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M 134 80 Q 122 74 110 80" stroke={NAVY} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M 66 92 Q 78 80 90 92" stroke={PUPIL} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 134 92 Q 122 80 110 92" stroke={PUPIL} strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    );
    if (mood === "thinking") return (
      <>
        <path d="M 66 76 L 90 74" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 110 76 Q 122 68 134 76" stroke={NAVY} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="78" cy="92" rx="6.5" ry="7.5" fill={CREAM} />
        <ellipse cx="122" cy="92" rx="6.5" ry="7.5" fill={CREAM} />
        <ellipse cx="80" cy="90" rx="5" ry="5.5" fill={AMBER} />
        <ellipse cx="124" cy="90" rx="5" ry="5.5" fill={AMBER} />
        <ellipse cx="82" cy="88" rx="2.2" ry="2.8" fill={PUPIL} />
        <ellipse cx="126" cy="88" rx="2.2" ry="2.8" fill={PUPIL} />
      </>
    );
    if (mood === "focused") return (
      <>
        <path d="M 66 76 L 90 78" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        <path d="M 110 78 L 134 76" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        <path d="M 68 88 Q 78 96 88 88 Q 78 84 68 88 Z" fill={AMBER} />
        <path d="M 132 88 Q 122 96 112 88 Q 122 84 132 88 Z" fill={AMBER} />
        <ellipse cx="78" cy="90" rx="2.2" ry="2.8" fill={PUPIL} />
        <ellipse cx="122" cy="90" rx="2.2" ry="2.8" fill={PUPIL} />
      </>
    );
    return (
      <>
        <path d="M 66 78 Q 78 71 90 78" stroke={NAVY} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M 110 74 L 134 76" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        <path d="M 66 90 Q 78 97 90 90 Q 78 83 66 90 Z" fill={CREAM} />
        <path d="M 110 90 Q 122 97 134 90 Q 122 83 110 90 Z" fill={CREAM} />
        <ellipse cx="78" cy="90" rx="5.5" ry="5" fill={AMBER} />
        <ellipse cx="122" cy="90" rx="5.5" ry="5" fill={AMBER} />
        <ellipse cx="79" cy="91" rx="2.2" ry="2.8" fill={PUPIL} />
        <ellipse cx="123" cy="91" rx="2.2" ry="2.8" fill={PUPIL} />
        <circle cx="80" cy="89" r="1" fill={CREAM} />
        <circle cx="124" cy="89" r="1" fill={CREAM} />
      </>
    );
  };

  return (
    <div
      className={`inline-block ${mood === "cheer" ? "animate-pop" : ""} ${mood === "sad" ? "animate-shake" : ""} ${className}`}
      data-testid={`foxy-${mood}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="20 15 160 145" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="furGradHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={FUR} />
            <stop offset="100%" stopColor={FUR_DARK} />
          </linearGradient>
          <linearGradient id="flameGradHead" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={FUR} />
            <stop offset="100%" stopColor={AMBER} />
          </linearGradient>
          <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={FUR} stopOpacity="0.35" />
            <stop offset="100%" stopColor={FUR} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Flame aura for cheer */}
        {mood === "cheer" && (
          <g className="animate-flicker" style={{ transformOrigin: "100px 90px" }}>
            <path d="M 28 100 Q 18 68 40 50 Q 34 78 52 88 Q 44 105 28 100 Z" fill="url(#flameGradHead)" opacity="0.9" />
            <path d="M 172 100 Q 182 68 160 50 Q 166 78 148 88 Q 156 105 172 100 Z" fill="url(#flameGradHead)" opacity="0.9" />
            <path d="M 100 18 Q 86 34 96 52 Q 100 42 104 52 Q 114 34 100 18 Z" fill="url(#flameGradHead)" opacity="0.95" />
          </g>
        )}

        {/* Ears */}
        <path d="M 52 78 L 46 28 L 80 62 Z" fill="url(#furGradHead)" stroke={FUR_DARK} strokeWidth="1" />
        <path d="M 148 78 L 154 32 Q 144 42 138 55 L 120 62 Z" fill="url(#furGradHead)" stroke={FUR_DARK} strokeWidth="1" />
        <path d="M 58 68 L 56 40 L 74 60 Z" fill={CREAM} />
        <path d="M 142 68 L 148 42 Q 142 50 137 58 Z" fill={CREAM} />

        {/* Head — triangular tapered */}
        <path
          d="M 100 38 Q 132 42 152 84 Q 148 128 130 138 Q 100 148 70 138 Q 52 128 48 84 Q 68 42 100 38 Z"
          fill="url(#furGradHead)"
          stroke={FUR_DARK} strokeWidth="1.2"
        />

        {/* Cream face patch */}
        <path
          d="M 100 82 Q 132 92 138 110 Q 130 134 100 142 Q 70 134 62 110 Q 68 92 100 82 Z"
          fill={CREAM}
        />

        {/* Cheek warmth */}
        <ellipse cx="72" cy="110" rx="12" ry="8" fill="url(#cheekGlow)" />
        <ellipse cx="128" cy="110" rx="12" ry="8" fill="url(#cheekGlow)" />

        {/* Face — eyes + brows */}
        {face()}

        {/* Nose */}
        <path d="M 94 108 L 106 108 L 100 118 Z" fill={NAVY} />
        <line x1="100" y1="118" x2="100" y2="124" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" />

        {/* Gold hoop earring */}
        <circle cx="56" cy="72" r="3.5" fill="none" stroke={AMBER} strokeWidth="1.8" />
        <circle cx="56" cy="72" r="3.5" fill={AMBER} opacity="0.15" />

        {/* Glasses for thinking */}
        {mood === "thinking" && (
          <>
            <circle cx="78" cy="92" r="11" fill="none" stroke={AMBER} strokeWidth="2" />
            <circle cx="122" cy="92" r="11" fill="none" stroke={AMBER} strokeWidth="2" />
            <line x1="89" y1="92" x2="111" y2="92" stroke={AMBER} strokeWidth="1.6" />
          </>
        )}

        {/* Tear for sad */}
        {mood === "sad" && (
          <ellipse cx="72" cy="104" rx="2.6" ry="6" fill="#7BB4E3" />
        )}
      </svg>
    </div>
  );
}
