import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { useEntranceDelay, useExhibit } from "@/components/exhibit/ExhibitProvider";
import { Lightbox } from "@/components/exhibit/Lightbox";
import { ContextTag } from "@/components/exhibit/PhotoFrame";
import { ERAS, MILESTONES } from "@/data/history";
import { photo } from "@/data/media";
import { at, cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_exhibit/eras")({
  validateSearch: (search: Record<string, unknown>): { e?: number } => {
    const e = Number(search["e"]);
    return Number.isInteger(e) && e >= 0 && e < ERAS.length ? { e } : {};
  },
  head: () =>
    pageHead("Era Explorer", "Explore the four periods of the Department of Air Warfare's development, drawn from its approved milestones."),
  component: EraExplorer,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function EraExplorer() {
  const { e } = Route.useSearch();
  const delay = useEntranceDelay();
  const [active, setActive] = useState(e ?? 0);
  const [lb, setLb] = useState<{ era: number; i: number } | null>(null);

  useEffect(() => {
    if (e !== undefined) setActive(e);
  }, [e]);

  return (
    <div className="relative flex h-full gap-[1rem] bg-ivory p-[1.75rem]">
      {ERAS.map((era, i) => (
        <EraPanel
          key={era.numeral}
          index={i}
          active={active === i}
          onSelect={() => setActive(i)}
          onOpenPhoto={(p) => setLb({ era: i, i: p })}
          delay={delay + i * 0.1}
        />
      ))}
      <Lightbox
        photos={lb ? at(ERAS, lb.era).photoIds.map(photo) : []}
        index={lb ? lb.i : null}
        onChange={(i) => setLb((cur) => (cur && i !== null ? { ...cur, i } : null))}
        collection={lb ? `Era ${at(ERAS, lb.era).numeral} · ${at(ERAS, lb.era).title}` : undefined}
      />
    </div>
  );
}

function EraPanel({
  index,
  active,
  onSelect,
  onOpenPhoto,
  delay,
}: {
  index: number;
  active: boolean;
  onSelect: () => void;
  onOpenPhoto: (i: number) => void;
  delay: number;
}) {
  const { go } = useExhibit();
  const era = at(ERAS, index);
  const cover = photo(era.coverId);

  return (
    <motion.section
      className={cn("relative min-w-0 overflow-hidden rounded-[1.25rem] shadow-plate", active ? "bg-paper" : "bg-navy")}
      style={{ flexBasis: 0 }}
      initial={{ opacity: 0, y: 60, flexGrow: active ? 5.2 : 1 }}
      animate={{ opacity: 1, y: 0, flexGrow: active ? 5.2 : 1 }}
      transition={{
        flexGrow: { type: "spring", stiffness: 120, damping: 22 },
        opacity: { delay, duration: 0.6 },
        y: { delay, duration: 0.8, ease: EASE },
      }}
      aria-label={`Era ${era.numeral}: ${era.title}, ${era.range}`}
    >
      {/* Collapsed face */}
      <AnimatePresence>
        {!active && (
          <motion.button
            key="collapsed"
            onClick={onSelect}
            className="absolute inset-0 flex flex-col items-center justify-between py-[2.5rem] text-on-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <img src={cover.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale-[35%]" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/55 to-navy-deep/95" />
            <span className="relative font-display text-[4.5rem] leading-none text-brass-soft">{era.numeral}</span>
            <span className="relative font-display text-[2.4rem] whitespace-nowrap [writing-mode:vertical-rl] rotate-180">{era.title}</span>
            <span className="relative flex flex-col items-center gap-3">
              <span className="eyebrow text-on-dark-muted">{era.range}</span>
              <span className="flex size-[3.4rem] items-center justify-center rounded-full bg-on-dark/15 ring-1 ring-on-dark/30">
                <ArrowRight className="size-[1.5rem]" />
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded face */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="expanded"
            className="absolute inset-y-0 left-0 grid w-[calc((100vw-6.5rem)*5.2/8.2)] grid-cols-[52fr_48fr]"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
          >
            <motion.div
              className="relative overflow-hidden"
              variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, show: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.9, ease: EASE } } }}
            >
              <button className="absolute inset-0" onClick={() => onOpenPhoto(0)} aria-label={`Open photograph: ${cover.title}`}>
                <img src={cover.src} alt={cover.title} className="animate-ken-burns h-full w-full object-cover" draggable={false} />
              </button>
              <div className="pointer-events-none absolute inset-0 bg-photo-fade" />
              <span className="pointer-events-none absolute left-[2rem] top-[1.5rem] font-display text-[9rem] leading-none text-on-dark/90 drop-shadow-lg">
                {era.numeral}
              </span>
              {cover.context && <ContextTag dark className="absolute right-4 top-4" />}
              <div className="absolute inset-x-[1.5rem] bottom-[1.5rem] flex gap-3">
                {era.photoIds.slice(1).map((id, i) => {
                  const p = photo(id);
                  return (
                    <motion.button
                      key={id}
                      onClick={() => onOpenPhoto(i + 1)}
                      className="pressable relative h-[7.5rem] flex-1 overflow-hidden rounded-[0.5rem] ring-2 ring-on-dark/70"
                      variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                      aria-label={`Open photograph: ${p.title}`}
                    >
                      <img src={p.src} alt="" className="h-full w-full object-cover" draggable={false} />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <div className="flex min-h-0 flex-col justify-center gap-0 px-[2.75rem] py-[2rem]">
              <motion.p className="eyebrow text-olive" variants={rise}>
                Era {era.numeral} · {era.range}
              </motion.p>
              <motion.h2 className="mt-3 font-display text-[3.6rem] leading-[1.05] font-semibold text-navy" variants={rise}>
                {era.title}
              </motion.h2>
              <motion.div className="mt-5 h-[3px] w-[5.5rem] bg-brass" variants={rise} />
              <motion.p className="mt-5 text-[1.3rem] leading-[1.6] text-ink/85" variants={rise}>
                {era.summary}
              </motion.p>
              <motion.p className="mt-7 eyebrow text-muted-foreground" variants={rise}>
                Developments in this era
              </motion.p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {era.milestoneIdx.map((mi) => (
                  <motion.li key={mi} variants={rise}>
                    <button
                      onClick={() => go(`/timeline?m=${mi}`)}
                      className="pressable flex w-full items-start gap-4 rounded-[0.75rem] bg-ivory px-4 py-3 text-left ring-1 ring-sand active:bg-sand/50"
                    >
                      <span className="w-[10.5rem] shrink-0 text-[1.05rem] font-bold text-brass">{at(MILESTONES, mi).date}</span>
                      <span className="flex-1 text-[1.1rem] leading-snug text-navy">{at(MILESTONES, mi).text}</span>
                      <ArrowRight className="mt-1 size-[1.2rem] shrink-0 text-aviation" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
