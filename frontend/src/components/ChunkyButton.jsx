import { cn } from "@/lib/utils";

/**
 * ChunkyButton — Escarté luxury chunky button.
 * variants: navy (primary), gold, ivory (secondary), ember (danger), ghost
 */
export default function ChunkyButton({
  children, variant = "navy", className = "", disabled = false, ...props
}) {
  const variants = {
    navy:   "bg-[#1A2A4F] text-[#F5EFE0] border-[#0A1330] hover:brightness-110",
    gold:   "bg-[#E5A934] text-[#1A2A4F] border-[#B78522] hover:brightness-105",
    ivory:  "bg-[#FFF8EA] text-[#1A2A4F] border-[#D9CDB0] hover:bg-[#F5EFE0]",
    ember:  "bg-[#B71C1C] text-[#F5EFE0] border-[#7A1212] hover:brightness-110",
    ghost:  "bg-transparent text-[#1A2A4F] border-transparent hover:bg-[#F5EFE0]",
    // legacy aliases still used in some files
    primary: "bg-[#1A2A4F] text-[#F5EFE0] border-[#0A1330] hover:brightness-110",
    orange:  "bg-[#E5A934] text-[#1A2A4F] border-[#B78522] hover:brightness-105",
    secondary: "bg-[#FFF8EA] text-[#1A2A4F] border-[#D9CDB0] hover:bg-[#F5EFE0]",
    danger:  "bg-[#B71C1C] text-[#F5EFE0] border-[#7A1212] hover:brightness-110",
  };

  return (
    <button
      className={cn(
        "chunky-btn w-full rounded-2xl py-3 px-5 font-bold text-sm sm:text-base tracking-wide uppercase",
        "border-b-[5px] active:border-b-0 active:translate-y-[5px]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0",
        variants[variant] || variants.navy,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
