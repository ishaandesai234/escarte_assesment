/**
 * Foxy — a sleek, sophisticated fox mascot for Escarté Learning Labs.
 * Rust-copper body, cream face, navy scholar collar, gold monocle & tassel.
 * Angular, geometric — cool not childish.
 *
 * Props: mood: "neutral" | "happy" | "sad" | "thinking" | "cheer" | "focused"
 */
export default function Foxy({ mood = "neutral", size = 160, className = "" }) {
  const eyeColor = "#0F1B37";

  const eyes = () => {
    if (mood === "sad") {
      return (
        <>
          <path d="M 62 78 Q 72 84 82 78" stroke={eyeColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 108 78 Q 118 84 128 78" stroke={eyeColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <ellipse cx="60" cy="94" rx="3" ry="7" fill="#7BB4E3" opacity="0.85" />
        </>
      );
    }
    if (mood === "happy" || mood === "cheer") {
      return (
        <>
          <path d="M 60 80 Q 72 68 84 80" stroke={eyeColor} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 106 80 Q 118 68 130 80" stroke={eyeColor} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    }
    if (mood === "thinking") {
      return (
        <>
          {/* Half-closed contemplative eyes */}
          <path d="M 60 82 L 82 82" stroke={eyeColor} strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="115" cy="82" rx="6" ry="4" fill={eyeColor} />
          <circle cx="117" cy="80" r="1.5" fill="#F5EFE0" />
        </>
      );
    }
    if (mood === "focused") {
      return (
        <>
          <ellipse cx="72" cy="82" rx="5" ry="6" fill={eyeColor} />
          <ellipse cx="118" cy="82" rx="5" ry="6" fill={eyeColor} />
          <circle cx="74" cy="80" r="1.6" fill="#F5EFE0" />
          <circle cx="120" cy="80" r="1.6" fill="#F5EFE0" />
          {/* Determined brow lines */}
          <path d="M 58 68 L 82 74" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 132 68 L 108 74" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    }
    // neutral
    return (
      <>
        <ellipse cx="72" cy="82" rx="5.5" ry="6.5" fill={eyeColor} />
        <ellipse cx="118" cy="82" rx="5.5" ry="6.5" fill={eyeColor} />
        <circle cx="74" cy="80" r="1.8" fill="#F5EFE0" />
        <circle cx="120" cy="80" r="1.8" fill="#F5EFE0" />
      </>
    );
  };

  const mouth = () => {
    if (mood === "sad") return <path d="M 82 118 Q 95 108 108 118" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />;
    if (mood === "cheer" || mood === "happy") return (
      <>
        <path d="M 78 110 Q 95 128 112 110 Z" fill={eyeColor} />
        <path d="M 86 120 Q 95 124 104 120" fill="#B71C1C" />
      </>
    );
    if (mood === "thinking") return <path d="M 86 116 L 100 118" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />;
    if (mood === "focused") return <path d="M 86 116 Q 95 118 104 116" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />;
    return <path d="M 86 115 Q 95 121 104 115" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />;
  };

  return (
    <div
      className={`inline-block ${mood === "cheer" ? "animate-pop" : ""} ${mood === "sad" ? "animate-shake" : ""} ${className}`}
      data-testid={`foxy-${mood}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="furGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C55A2A" />
            <stop offset="100%" stopColor="#9C3E1B" />
          </linearGradient>
          <linearGradient id="collarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2A4F" />
            <stop offset="100%" stopColor="#0F1B37" />
          </linearGradient>
        </defs>

        {/* Neck / scholar collar */}
        <path d="M 60 165 Q 100 148 140 165 L 130 190 L 70 190 Z" fill="url(#collarGrad)" />
        <path d="M 92 150 L 100 172 L 108 150 Z" fill="#E5A934" />

        {/* Ears (angular, sharp) */}
        <path d="M 40 66 L 56 22 L 74 58 Z" fill="url(#furGrad)" />
        <path d="M 160 66 L 144 22 L 126 58 Z" fill="url(#furGrad)" />
        <path d="M 50 58 L 58 32 L 66 56 Z" fill="#F5EFE0" />
        <path d="M 150 58 L 142 32 L 134 56 Z" fill="#F5EFE0" />

        {/* Head — geometric diamond-ish shape */}
        <path d="M 100 40 L 158 92 L 142 150 Q 100 168 58 150 L 42 92 Z" fill="url(#furGrad)" />
        {/* Face lighter patch */}
        <path d="M 100 78 L 138 100 L 128 145 Q 100 158 72 145 L 62 100 Z" fill="#F5EFE0" />

        {/* Cheek accents */}
        <path d="M 46 100 L 62 108 L 56 130 Z" fill="#9C3E1B" opacity="0.4" />
        <path d="M 154 100 L 138 108 L 144 130 Z" fill="#9C3E1B" opacity="0.4" />

        {/* Eyes */}
        {eyes()}

        {/* Nose (small triangle) */}
        <path d="M 94 100 L 106 100 L 100 108 Z" fill={eyeColor} />
        <line x1="100" y1="108" x2="100" y2="115" stroke={eyeColor} strokeWidth="2" />

        {/* Mouth */}
        {mouth()}

        {/* Gold monocle over right eye (for cool/focused/happy vibes) */}
        {(mood === "focused" || mood === "thinking" || mood === "neutral") && (
          <>
            <circle cx="118" cy="82" r="12" fill="none" stroke="#E5A934" strokeWidth="2.5" />
            <line x1="130" y1="88" x2="136" y2="98" stroke="#E5A934" strokeWidth="2" />
          </>
        )}

        {/* Blush for happy/cheer */}
        {(mood === "happy" || mood === "cheer") && (
          <>
            <ellipse cx="58" cy="118" rx="8" ry="5" fill="#B71C1C" opacity="0.35" />
            <ellipse cx="142" cy="118" rx="8" ry="5" fill="#B71C1C" opacity="0.35" />
          </>
        )}

        {/* Tear for sad */}
        {mood === "sad" && (
          <ellipse cx="60" cy="108" rx="3" ry="7" fill="#7BB4E3" />
        )}

        {/* Graduation cap — sleek navy with gold tassel */}
        <rect x="58" y="20" width="84" height="8" fill="#1A2A4F" rx="1.5" />
        <path d="M 50 24 L 100 6 L 150 24 L 100 42 Z" fill="#1A2A4F" />
        <circle cx="100" cy="24" r="3" fill="#E5A934" />
        <path d="M 100 24 L 138 34 L 138 52" stroke="#E5A934" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <g>
          <path d="M 134 52 L 142 52 L 140 62 L 136 62 Z" fill="#E5A934" />
          <path d="M 133 60 L 143 60 L 138 68 Z" fill="#E5A934" />
        </g>
      </svg>
    </div>
  );
}
