import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Photo } from "@/data/media";
import { at, cn } from "@/lib/utils";
import { ExhibitButton } from "../ExhibitButton";
import { JetIcon } from "../JetIcon";
import { ContextTag } from "../PhotoFrame";
import { useSwipe } from "../useSwipe";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The flight line: a large feature aircraft with a filmstrip of every type in the archive. */
export function AircraftView({ photos, onOpen, delay = 0 }: { photos: Photo[]; onOpen: (i: number) => void; delay?: number }) {
  const [[idx, dir], setState] = useState<[number, number]>([0, 0]);
  const strip = useRef<HTMLDivElement>(null);
  const p = at(photos, idx);
  const goTo = (i: number) => {
    const n = (i + photos.length) % photos.length;
    setState([n, n > idx ? 1 : -1]);
  };
  const swipe = useSwipe(
    () => goTo(idx + 1),
    () => goTo(idx - 1),
  );

  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-i="${idx}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [idx]);

  return (
    <div className="flex h-full flex-col gap-[1.25rem]">
      <motion.div
        className="relative min-h-0 flex-1 overflow-hidden rounded-[1rem] bg-navy shadow-plate touch-pan-y"
        onPanEnd={swipe.onPanEnd}
        initial={{ clipPath: "inset(0 0 0 100%)" }}
        animate={{ clipPath: "inset(0 0 0 0%)" }}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.button
            key={p.id}
            custom={dir}
            className="absolute inset-0"
            onClick={() => !swipe.justSwiped() && onOpen(idx)}
            initial={{ x: `${dir * 100}%`, scale: 1.08 }}
            animate={{ x: "0%", scale: 1 }}
            exit={{ x: `${dir * -35}%`, opacity: 0.2 }}
            transition={{ duration: 0.85, ease: EASE }}
            aria-label={`Open photograph: ${p.title}`}
          >
            {p.lowRes ? (
              <div className="flex h-full w-full items-center justify-center paper-grain bg-sky">
                <img src={p.src} alt={p.title} className="print-frame max-h-[70%] w-auto" style={{ height: `${Math.min(p.h * 2, 600)}px` }} draggable={false} />
              </div>
            ) : (
              <img src={p.src} alt={p.title} className="h-full w-full object-cover" draggable={false} />
            )}
          </motion.button>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-side-fade opacity-90" />

        <div className="pointer-events-none absolute bottom-[2.5rem] left-[3rem] max-w-[42rem] text-on-dark">
          <AnimatePresence mode="wait">
            <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
              <p className="eyebrow text-brass-soft">
                Aircraft {String(idx + 1).padStart(2, "0")} of {photos.length}
              </p>
              <h3 className="mt-3 font-display text-[4.8rem] leading-[1] font-semibold">{p.title}</h3>
              <p className="mt-3 text-[1.45rem] text-on-dark-muted">{p.subtitle}</p>
              {p.note && <p className="mt-2 text-[1.1rem] text-on-dark-muted italic">{p.note}</p>}
              {p.context && <ContextTag dark className="mt-4" />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute right-[2rem] top-[2rem] flex gap-3">
          <ExhibitButton variant="glass" onClick={() => onOpen(idx)}>
            <Expand className="size-[1.3rem]" /> View full photograph
          </ExhibitButton>
        </div>
        <div className="absolute bottom-[2.5rem] right-[2rem] flex gap-3">
          <ExhibitButton variant="glass" size="iconLg" onClick={() => goTo(idx - 1)} aria-label="Previous aircraft">
            <ChevronLeft className="size-[2rem]" />
          </ExhibitButton>
          <ExhibitButton variant="brass" size="iconLg" onClick={() => goTo(idx + 1)} aria-label="Next aircraft">
            <ChevronRight className="size-[2rem]" />
          </ExhibitButton>
        </div>
      </motion.div>

      <div ref={strip} className="scrollbar-none relative flex h-[8.75rem] shrink-0 gap-[0.75rem] overflow-x-auto pt-[1.5rem]">
        {photos.map((t, i) => (
          <motion.button
            key={t.id}
            data-i={i}
            onClick={() => goTo(i)}
            className="relative h-full w-[11rem] shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.4 + i * 0.03, duration: 0.5 }}
            whileTap={{ scale: 0.94 }}
            aria-label={`Show ${t.title}`}
            aria-current={i === idx ? "true" : undefined}
          >
            {i === idx && (
              <motion.span layoutId="aircraft-marker" className="absolute -top-[1.45rem] left-1/2 -translate-x-1/2" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                <JetIcon className="w-[2.2rem] rotate-90 text-brass" />
              </motion.span>
            )}
            <span className={cn("block h-full w-full overflow-hidden rounded-[0.5rem] ring-[3px] transition-all duration-300", i === idx ? "ring-brass" : "ring-transparent opacity-70")}>
              <img src={t.src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
            </span>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[0.5rem] bg-navy-deep/75 px-2 py-1 text-[0.85rem] font-semibold text-on-dark truncate">{t.title}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
