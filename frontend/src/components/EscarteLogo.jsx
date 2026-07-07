/**
 * EscarteLogo — the wordmark inspired by the Escarté Learning Labs logo.
 * Renders "Escarté" in Playfair with the navy/red divider streak beneath.
 */
export default function EscarteLogo({ size = "md", showTagline = false }) {
  const sizeMap = {
    sm: { txt: "text-xl", tag: "text-[9px] tracking-[0.25em]" },
    md: { txt: "text-2xl", tag: "text-[10px] tracking-[0.28em]" },
    lg: { txt: "text-4xl", tag: "text-xs tracking-[0.32em]" },
    xl: { txt: "text-5xl sm:text-6xl", tag: "text-sm tracking-[0.35em]" },
  }[size] || { txt: "text-2xl", tag: "text-[10px] tracking-[0.28em]" };

  return (
    <div className="inline-flex flex-col items-start">
      <div className={`font-display font-bold text-[#1A2A4F] leading-none ${sizeMap.txt}`}>
        Escart<span className="text-[#B71C1C]">é</span>
      </div>
      <div className="w-full mt-1.5 escarte-divider" />
      {showTagline && (
        <div className={`mt-1.5 font-semibold text-[#1A2A4F] uppercase ${sizeMap.tag}`}>
          Learning Labs
        </div>
      )}
    </div>
  );
}
