import { MILESTONES } from "@/data/history";
import { brand } from "@/data/media";
import { cn } from "@/lib/utils";

/** The ten approved milestones typeset as a single exhibition record. */
export function ChronologyDocument({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex h-full w-full flex-col bg-paper text-ink", compact ? "p-[1.1rem]" : "p-[3rem]", className)}>
      <div className={cn("flex items-center border-b-2 border-navy", compact ? "gap-2 pb-2" : "gap-5 pb-5")}>
        <img src={brand.logo} alt="" className={compact ? "h-[2.2rem] w-auto" : "h-[5rem] w-auto"} />
        <div>
          <p className={cn("font-bold tracking-[0.14em] text-olive uppercase", compact ? "text-[0.5rem]" : "text-[0.95rem]")}>Department of Air Warfare · AFCSC Jaji</p>
          <p className={cn("font-display text-navy", compact ? "text-[1rem]" : "text-[2.4rem]")}>Approved Chronology</p>
        </div>
      </div>
      <ol className={cn("flex flex-1 flex-col justify-between", compact ? "mt-2 gap-1" : "mt-6 gap-3")}>
        {MILESTONES.map((m, i) => (
          <li key={i} className={cn("flex items-baseline border-b border-dashed border-sand", compact ? "gap-2 pb-[0.15rem]" : "gap-6 pb-3")}>
            <span className={cn("shrink-0 font-display text-brass tabular-nums", compact ? "w-[0.9rem] text-[0.6rem]" : "w-[2rem] text-[1.3rem]")}>{i + 1}.</span>
            <span className={cn("shrink-0 font-bold text-navy", compact ? "w-[5.6rem] text-[0.55rem]" : "w-[17rem] text-[1.2rem]")}>{m.date}</span>
            <span className={cn("text-ink/85", compact ? "truncate text-[0.55rem]" : "text-[1.2rem]")}>{m.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
