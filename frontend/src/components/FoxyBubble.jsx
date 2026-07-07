import Foxy from "./Foxy";

/**
 * Speech bubble beside Foxy.
 */
export default function FoxyBubble({ mood = "neutral", text, size = 120, side = "right" }) {
  return (
    <div className={`flex items-end gap-3 ${side === "left" ? "flex-row-reverse" : ""}`} data-testid="foxy-bubble">
      <Foxy mood={mood} size={size} />
      <div
        className="relative bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 shadow-[0_4px_0_0_rgba(226,232,240,1)] max-w-[75%] animate-float-up"
      >
        <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">{text}</p>
        <div
          className={`absolute bottom-4 ${side === "left" ? "right-[-8px]" : "left-[-8px]"} w-4 h-4 bg-white border-2 border-slate-200 rotate-45 ${side === "left" ? "border-l-0 border-t-0" : "border-r-0 border-b-0"}`}
        />
      </div>
    </div>
  );
}
