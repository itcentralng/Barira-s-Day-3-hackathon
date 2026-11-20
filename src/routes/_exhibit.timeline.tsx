import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ExhibitButton } from "@/components/exhibit/ExhibitButton";
import { useEntranceDelay, useExhibit } from "@/components/exhibit/ExhibitProvider";
import { JetIcon } from "@/components/exhibit/JetIcon";
import { Lightbox } from "@/components/exhibit/Lightbox";
import { ContextTag } from "@/components/exhibit/PhotoFrame";
import { useFirstRender } from "@/components/exhibit/useFirstRender";
import { useSwipe } from "@/components/exhibit/useSwipe";
import { ERAS, MILESTONES } from "@/data/history";
import { photo } from "@/data/media";
import { at, cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_exhibit/timeline")({
  validateSearch: (search: Record<string, unknown>): { m?: number } => {
    const m = Number(search["m"]);
    return Number.isInteger(m) && m >= 0 && m < MILESTONES.length ? { m } : {};
  },
  head: () =>
    pageHead("Interactive Historical Timeline", "Ten approved milestones of the Department of Air Warfare, from 16 March 1978 to December 2024."),
  component: Timeline,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY_MS = 8000;
const ERA_TINTS = ["bg-olive/15 text-olive", "bg-aviation/12 text-aviation", "bg-brass/18 text-brass", "bg-navy/10 text-navy"];

function Timeline() {
  const { m } = Route.useSearch();
  const { go } = useExhibit();
  const delay = useEntranceDelay();
  const first = useFirstRender(1800);
  const d = first ? delay : 0;
  const [[idx, dir], setState] = useState<[number, number]>([m ?? 0, 0]);
  const [playing, setPlaying] = useState(false);
  const [lb, setLb] = useState<number | null>(null);
  const ms = at(MILESTONES, idx);
  const img = photo(ms.photoId);
  const era = at(ERAS, ms.era);

  useEffect(() => {
    if (m !== undefined) setState(([cur, d]) => (m === cur ? [cur, d] : [m, m > cur ? 1 : -1]));
  }, [m]);

  const goTo = useCallback((i: number) => {
    setState(([cur]) => {
      const n = Math.max(0, Math.min(MILESTONES.length - 1, i));
      return n === cur ? [cur, 0] : [n, n > cur ? 1 : -1];
    });
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setState(([cur]) => [(cur + 1) % MILESTONES.length, 1]), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [playing, idx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lb !== null) return;
      if (e.key === "ArrowRight") goTo(idx + 1);
      if (e.key === "ArrowLeft") goTo(idx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, idx, lb]);

  const swipe = useSwipe(
    () => goTo(idx + 1),
    () => goTo(idx - 1),
  );
  const pct = (i: number) => 4 + (i / (MILESTONES.length - 1)) * 92;

  return (
    <div className="relative flex h-full flex-col bg-paper">
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" />

      {/* Stage */}
      <motion.div className="relative grid min-h-0 flex-1 grid-cols-[44fr_56fr] gap-[3.5rem] px-[4rem] pt-[2.5rem] touch-pan-y" onPanEnd={swipe.onPanEnd}>
        <div className="flex min-h-0 flex-col justify-center">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: d }}
          >
            <span className="eyebrow text-olive">Milestone</span>
            <span className="font-display text-[1.6rem] text-navy tabular-nums">
              {String(idx + 1).padStart(2, "0")}
              <span className="text-muted-foreground"> / {MILESTONES.length}</span>
            </span>
            <ExhibitButton
              className="relative ml-auto"
              variant={playing ? "navy" : "paper"}
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause guided tour" : "Play guided tour"}
            >
              {playing ? <Pause className="size-[1.3rem]" /> : <Play className="size-[1.3rem]" />}
              {playing ? "Pause tour" : "Play tour"}
              {playing && (
                <motion.span
                  key={idx}
                  className="absolute inset-x-[1.4rem] bottom-[0.55rem] h-[2px] origin-left rounded-full bg-brass"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                />
              )}
            </ExhibitButton>
          </motion.div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, x: dir * -40, transition: { duration: 0.25 } }}
              variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: d + 0.1 } } }}
            >
              <motion.p
                className="mt-6 font-display text-[5.6rem] leading-[1] font-semibold text-navy"
                variants={{
                  hidden: { opacity: 0, x: dir * 60 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
                }}
              >
                {ms.date.split(" ").map((w, i, arr) => (
                  <span key={i} className={i === arr.length - 1 || /^\d{4}$/.test(w) ? "text-brass" : ""}>
                    {w}
                    {i < arr.length - 1 ? " " : ""}
                  </span>
                ))}
              </motion.p>
              <motion.div
                className="mt-6 h-[3px] w-[7rem] origin-left bg-brass"
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, ease: EASE } } }}
              />
              <motion.h2
                className="mt-6 max-w-[42rem] font-display text-[3rem] leading-[1.15] text-ink text-balance"
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
              >
                {ms.text}
              </motion.h2>
              <motion.div
                className="mt-8 flex items-center gap-4"
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              >
                <button
                  onClick={() => go(`/eras?e=${ms.era}`)}
                  className={cn("pressable rounded-full px-5 py-2.5 text-[1.05rem] font-bold", ERA_TINTS[ms.era])}
                >
                  Era {era.numeral} · {era.title} →
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative min-h-0 pb-[1rem]">
          <AnimatePresence mode="popLayout" custom={dir}>
            <motion.figure
              key={idx}
              className="print-frame absolute inset-0 flex flex-col"
              initial={{ clipPath: dir >= 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", rotate: dir * 1.5 }}
              animate={{ clipPath: "inset(0 0 0 0%)", rotate: 0 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.45 } }}
              transition={{ duration: 0.95, ease: EASE, delay: d + 0.1 }}
            >
              <button onClick={() => !swipe.justSwiped() && setLb(0)} className="relative min-h-0 flex-1 overflow-hidden bg-muted" aria-label={`Open photograph: ${img.title}`}>
                <motion.img
                  src={img.src}
                  alt={img.title}
                  className="h-full w-full object-cover"
                  initial={{ scale: 1.22 }}
                  animate={{ scale: 1.02 }}
                  transition={{ duration: 6, ease: "easeOut", delay: d }}
                  draggable={false}
                />
                {img.context && <ContextTag dark className="absolute left-4 top-4" />}
              </button>
              <figcaption className="flex items-baseline justify-between gap-4 px-1 pt-3">
                <span className="text-[1.1rem] font-semibold text-navy">{img.title}</span>
                <span className="text-[1rem] text-muted-foreground">{img.subtitle}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Track */}
      <motion.div
        className="relative flex items-center gap-[1.5rem] px-[2.5rem] pb-[1.5rem] pt-[1.5rem]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay, duration: 0.5 }}
      >
        <ExhibitButton size="iconLg" onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Previous milestone">
          <ChevronLeft className="size-[2rem]" />
        </ExhibitButton>

        <div className="relative h-[11.5rem] flex-1">
          {/* Line */}
          <motion.div
            className="absolute inset-x-0 top-[4.6rem] h-[3px] origin-left rounded-full bg-sand"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: EASE, delay: delay + 0.1 }}
          />
          <motion.div
            className="absolute left-0 top-[4.6rem] h-[3px] rounded-full bg-brass-gradient"
            initial={{ width: "0%" }}
            animate={{ width: `${pct(idx)}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 20, delay: first ? delay + 0.6 : 0 }}
          />
          {/* Aircraft on the line */}
          <motion.div
            className="pointer-events-none absolute top-[1.2rem] z-10 -translate-x-1/2"
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: `${pct(idx)}%`, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 18, delay: first ? delay + 0.6 : 0 }}
          >
            <JetIcon className={cn("w-[3.6rem] text-navy transition-transform duration-500", dir >= 0 ? "-scale-x-100" : "")} />
          </motion.div>

          {/* Markers */}
          {MILESTONES.map((x, i) => {
            const active = i === idx;
            return (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                className="absolute top-[3.55rem] flex w-[8.5rem] -translate-x-1/2 flex-col items-center"
                style={{ left: `${pct(i)}%` }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.35 + i * 0.06, duration: 0.5 }}
                whileTap={{ scale: 0.92 }}
                aria-label={`${x.date}: ${x.text}`}
                aria-current={active ? "step" : undefined}
              >
                <span className="relative flex size-[2.3rem] items-center justify-center">
                  {active && <span className="animate-pulse-ring absolute inset-0 rounded-full bg-brass/40" />}
                  <span
                    className={cn(
                      "rounded-full border-[3px] transition-all duration-500",
                      active ? "size-[2.3rem] border-brass bg-brass shadow-plate" : i < idx ? "size-[1.3rem] border-brass bg-brass-soft" : "size-[1.3rem] border-sage bg-paper",
                    )}
                  />
                </span>
                <span className={cn("mt-2 font-display tabular-nums transition-all duration-300", active ? "text-[1.55rem] font-bold text-navy" : "text-[1.2rem] text-muted-foreground")}>
                  {x.year}
                </span>
              </motion.button>
            );
          })}

          {/* Era bands */}
          {ERAS.map((e, i) => {
            const a = pct(at(e.milestoneIdx, 0));
            const b = pct(at(e.milestoneIdx, e.milestoneIdx.length - 1));
            const inEra = ms.era === i;
            return (
              <motion.button
                key={e.numeral}
                onClick={() => goTo(at(e.milestoneIdx, 0))}
                className={cn(
                  "pressable absolute bottom-0 flex h-[2.4rem] items-center justify-center rounded-full px-4 text-[0.95rem] font-bold whitespace-nowrap transition-all",
                  ERA_TINTS[i],
                  inEra ? "ring-2 ring-current" : "opacity-70",
                )}
                style={{ left: `calc(${a}% - 3.6rem)`, width: `calc(${b - a}% + 7.2rem)` }}
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: inEra ? 1 : 0.7, scaleX: 1 }}
                transition={{ delay: delay + 0.8 + i * 0.1, duration: 0.5 }}
              >
                {e.numeral} · {e.title}
              </motion.button>
            );
          })}
        </div>

        <ExhibitButton size="iconLg" variant="navy" onClick={() => goTo(idx + 1)} disabled={idx === MILESTONES.length - 1} aria-label="Next milestone">
          <ChevronRight className="size-[2rem]" />
        </ExhibitButton>
      </motion.div>

      <Lightbox photos={[img]} index={lb} onChange={setLb} collection={`Milestone ${idx + 1} · ${ms.date}`} />
    </div>
  );
}
