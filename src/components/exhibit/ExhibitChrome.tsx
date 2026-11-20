import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, House, X } from "lucide-react";

import { SECTIONS } from "@/data/history";
import { brand } from "@/data/media";
import { cn } from "@/lib/utils";
import { ExhibitButton } from "./ExhibitButton";
import { JetIcon } from "./JetIcon";
import { useExhibit } from "./ExhibitProvider";

function useActiveIndex() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return SECTIONS.findIndex((s) => pathname.startsWith(s.path));
}

export function TopBar() {
  const { back, go, requestExit } = useExhibit();
  const idx = useActiveIndex();
  const section = SECTIONS[idx];

  return (
    <header className="relative z-30 flex h-[5.75rem] shrink-0 items-center justify-between border-b border-sand/80 bg-paper/85 px-[2.5rem] backdrop-blur-md">
      <button onClick={() => go("/", { resetHistory: true })} className="pressable flex items-center gap-4 text-left" aria-label="Go to welcome screen">
        <img src={brand.logo} alt="Armed Forces Command and Staff College logo" className="h-[4.1rem] w-auto" />
        <div className="flex flex-col">
          <span className="text-[0.95rem] font-bold tracking-[0.08em] text-olive uppercase">Armed Forces Command and Staff College, Jaji</span>
          <span className="font-display text-[1.45rem] leading-tight text-navy">
            Department of Air Warfare <span className="text-brass">·</span> The History Experience
          </span>
        </div>
      </button>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence mode="wait">
          {section && (
            <motion.div
              key={section.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
            >
              <span className="font-display text-[1.5rem] text-brass tabular-nums">{section.n}</span>
              <span className="h-px w-8 bg-brass/60" />
              <span className="text-[1.2rem] font-semibold text-navy">{section.title}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex items-center gap-3" aria-label="Exhibition controls">
        <ExhibitButton onClick={back} aria-label="Back">
          <ArrowLeft className="size-[1.35rem]" /> Back
        </ExhibitButton>
        <ExhibitButton onClick={() => go("/", { resetHistory: true })} aria-label="Home">
          <House className="size-[1.35rem]" /> Home
        </ExhibitButton>
        <ExhibitButton variant="navy" onClick={requestExit} aria-label="Close experience">
          <X className="size-[1.35rem]" /> Close
        </ExhibitButton>
      </nav>
    </header>
  );
}

export function SectionDock() {
  const { go } = useExhibit();
  const idx = useActiveIndex();
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;

  return (
    <nav
      className="relative z-30 flex h-[6.75rem] shrink-0 items-stretch bg-navy-gradient text-on-dark"
      aria-label="Exhibition galleries"
    >
      <button
        onClick={() => (prev ? go(prev.path) : go("/"))}
        className="pressable flex w-[14rem] shrink-0 items-center gap-3 border-r border-on-dark/10 px-[1.75rem] text-left active:bg-on-dark/10"
        aria-label={prev ? `Previous gallery: ${prev.title}` : "Back to welcome"}
      >
        <ChevronLeft className="size-[2rem] text-brass-soft" />
        <span className="flex flex-col">
          <span className="text-[0.85rem] font-bold tracking-[0.14em] text-on-dark-muted uppercase">Previous</span>
          <span className="text-[1.1rem] font-semibold">{prev ? prev.short : "Welcome"}</span>
        </span>
      </button>

      <div className="relative flex flex-1 items-stretch">
        {SECTIONS.map((s, i) => {
          const active = i === idx;
          return (
            <button
              key={s.id}
              onClick={() => go(s.path)}
              className={cn(
                "pressable relative flex flex-1 flex-col items-center justify-center gap-1",
                active ? "text-on-dark" : "text-on-dark-muted active:bg-on-dark/5",
              )}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="dock-indicator"
                  className="absolute inset-x-[0.75rem] top-0 h-[0.3rem] rounded-b-full bg-brass"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                >
                  <JetIcon className="absolute left-1/2 top-[0.55rem] w-[2.1rem] -translate-x-1/2 rotate-90 text-brass-soft" />
                </motion.span>
              )}
              {active && (
                <motion.span
                  layoutId="dock-glow"
                  className="absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_0%,color-mix(in_oklab,var(--brass)_28%,transparent),transparent)]"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className={cn("relative mt-3 font-display text-[1.25rem] tabular-nums", active ? "text-brass-soft" : "")}>{s.n}</span>
              <span className={cn("relative text-[1.15rem]", active ? "font-bold" : "font-medium")}>{s.short}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => next && go(next.path)}
        disabled={!next}
        className="pressable flex w-[14rem] shrink-0 items-center justify-end gap-3 border-l border-on-dark/10 px-[1.75rem] text-right active:bg-on-dark/10 disabled:opacity-30"
        aria-label={next ? `Next gallery: ${next.title}` : "No next gallery"}
      >
        <span className="flex flex-col">
          <span className="text-[0.85rem] font-bold tracking-[0.14em] text-on-dark-muted uppercase">Next</span>
          <span className="text-[1.1rem] font-semibold">{next ? next.short : "—"}</span>
        </span>
        <ChevronRight className="size-[2rem] text-brass-soft" />
      </button>
    </nav>
  );
}
