/**
 * FireStreak — animated flame icon for streaks + streak counter.
 * Props: count (number), size
 */
export default function FireStreak({ count = 0, size = 40, showCount = true }) {
  return (
    <div className="inline-flex items-center gap-1.5" data-testid="fire-streak">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" width="100%" height="100%" className="animate-flicker">
          <defs>
            <linearGradient id="flame-outer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD84D" />
              <stop offset="45%" stopColor="#F0921C" />
              <stop offset="100%" stopColor="#B71C1C" />
            </linearGradient>
            <linearGradient id="flame-inner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF3C4" />
              <stop offset="100%" stopColor="#E5A934" />
            </linearGradient>
          </defs>
          {/* Outer flame */}
          <path
            d="M 32 6 C 24 20 14 26 14 40 C 14 52 22 60 32 60 C 42 60 50 52 50 40 C 50 32 44 26 42 22 C 38 30 36 24 32 6 Z"
            fill="url(#flame-outer)"
          />
          {/* Inner flame */}
          <path
            d="M 32 22 C 28 30 24 34 24 42 C 24 50 28 55 32 55 C 36 55 40 50 40 42 C 40 36 36 32 32 22 Z"
            fill="url(#flame-inner)"
          />
          {/* White hot core */}
          <ellipse cx="32" cy="46" rx="3" ry="5" fill="#FFF8EA" opacity="0.85" />
        </svg>
      </div>
      {showCount && (
        <span className="font-display font-bold text-lg text-[#B71C1C]" data-testid="streak-count">{count}</span>
      )}
    </div>
  );
}
