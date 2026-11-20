import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ExhibitButton } from "./ExhibitButton";
import { JetIcon } from "./JetIcon";

/** Waypoint navigator: a dotted route with an aircraft that flies to the selected stop. */
export function FlightRoute({
  stops,
  index,
  onSelect,
  delay = 0,
}: {
  stops: { label: string; sub?: string }[];
  index: number;
  onSelect: (i: number) => void;
  delay?: number;
}) {
  const pct = (i: number) => (stops.length === 1 ? 50 : (i / (stops.length - 1)) * 100);
  return (
    <div className="flex items-center gap-[2rem]">
      <ExhibitButton size="iconLg" onClick={() => onSelect(index - 1)} disabled={index === 0} aria-label="Previous">
        <ChevronLeft className="size-[2rem]" />
      </ExhibitButton>
      <div className="relative mx-[5.5rem] h-[6rem] flex-1">
        <div className="absolute inset-x-0 top-[2.2rem] h-[2px] dotted-rule opacity-70" />
        <motion.div
          className="absolute left-0 top-[2.1rem] h-[4px] origin-left rounded-full bg-brass"
          initial={{ width: 0 }}
          animate={{ width: `${pct(index)}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22, delay }}
        />
        <motion.div
          className="pointer-events-none absolute top-[0.35rem] z-10 -translate-x-1/2"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: `${pct(index)}%`, opacity: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, delay }}
        >
          <JetIcon className="w-[3.4rem] -scale-x-100 text-navy" />
        </motion.div>
        {stops.map((s, i) => (
          <button
            key={s.label}
            onClick={() => onSelect(i)}
            className="pressable absolute top-0 flex -translate-x-1/2 flex-col items-center pt-[1.55rem]"
            style={{ left: `${pct(i)}%` }}
            aria-current={i === index ? "step" : undefined}
            aria-label={`Go to ${s.label}`}
          >
            <span
              className={cn(
                "size-[1.35rem] rounded-full border-[3px] transition-all duration-300",
                i <= index ? "border-brass bg-brass" : "border-sand bg-paper",
                i === index && "scale-125 ring-[0.45rem] ring-brass/20",
              )}
            />
            <span className={cn("mt-2 whitespace-nowrap text-[1.05rem] transition-colors", i === index ? "font-bold text-navy" : "font-medium text-muted-foreground")}>
              {s.label}
            </span>
          </button>
        ))}
      </div>
      <ExhibitButton size="iconLg" variant="navy" onClick={() => onSelect(index + 1)} disabled={index === stops.length - 1} aria-label="Next">
        <ChevronRight className="size-[2rem]" />
      </ExhibitButton>
    </div>
  );
}
