import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { useEntranceDelay } from "@/components/exhibit/ExhibitProvider";
import { FlightRoute } from "@/components/exhibit/FlightRoute";
import { Lightbox } from "@/components/exhibit/Lightbox";
import { PhotoFrame } from "@/components/exhibit/PhotoFrame";
import { useFirstRender } from "@/components/exhibit/useFirstRender";
import { useSwipe } from "@/components/exhibit/useSwipe";
import { STORY } from "@/data/history";
import { photo } from "@/data/media";
import { pageHead } from "@/lib/seo";
import { at } from "@/lib/utils";

export const Route = createFileRoute("/_exhibit/story")({
  head: () =>
    pageHead(
      "Story of the Department",
      "How the Air Faculty of 1978 became the Department of Air Warfare at the Armed Forces Command and Staff College, Jaji.",
    ),
  component: Story,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const ROMAN = ["I", "II", "III", "IV", "V"];

function Story() {
  const delay = useEntranceDelay();
  const [[idx, dir], setState] = useState<[number, number]>([0, 0]);
  const [lb, setLb] = useState<number | null>(null);
  const ch = at(STORY, idx);
  const main = photo(ch.mainId);
  const second = photo(ch.secondId);
  const first = useFirstRender();
  const d = first ? delay : 0;

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= STORY.length || i === idx) return;
      setState([i, i > idx ? 1 : -1]);
    },
    [idx],
  );
  const swipe = useSwipe(
    () => goTo(idx + 1),
    () => goTo(idx - 1),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lb !== null) return;
      if (e.key === "ArrowRight") goTo(idx + 1);
      if (e.key === "ArrowLeft") goTo(idx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, idx, lb]);

  const open = (i: number) => !swipe.justSwiped() && setLb(i);

  return (
    <div className="relative flex h-full flex-col bg-sky-wash">
      {/* Giant chapter numeral */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={idx}
          className="pointer-events-none absolute bottom-[7rem] right-[2rem] font-display text-[22rem] leading-none font-semibold text-sand/40 select-none"
          initial={{ opacity: 0, x: dir * 120 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -120 }}
          transition={{ duration: 0.8, ease: EASE }}
          aria-hidden="true"
        >
          {ROMAN[idx]}
        </motion.span>
      </AnimatePresence>

      <motion.div
        className="relative grid min-h-0 flex-1 grid-cols-[58fr_42fr] gap-[3.5rem] px-[3.5rem] pt-[2.75rem] touch-pan-y"
        onPanEnd={swipe.onPanEnd}
      >
        {/* Photographic composition */}
        <div className="relative min-h-0">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={idx} className="absolute inset-0" exit={{ opacity: 0, x: dir * -50, transition: { duration: 0.3 } }}>
              <motion.div
                className="absolute inset-y-0 left-0 right-[7rem] bottom-[3.5rem]"
                initial={{ clipPath: dir >= 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", opacity: 0.4 }}
                animate={{ clipPath: "inset(0 0 0 0%)", opacity: 1 }}
                transition={{ duration: 1.0, ease: EASE, delay: d }}
              >
                <PhotoFrame photo={main} kenBurns className="h-full w-full" onOpen={() => open(0)} />
              </motion.div>
              <motion.div
                className="absolute right-0 top-[2.5rem] h-[16rem] w-[23rem]"
                initial={{ opacity: 0, y: 90, rotate: 9 }}
                animate={{ opacity: 1, y: 0, rotate: 2.5 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: d + 0.45 }}
              >
                <PhotoFrame photo={second} caption={false} className="h-full w-full" onOpen={() => open(1)} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Narrative */}
        <div className="relative flex min-h-0 flex-col justify-center pb-[2rem]">
          <AnimatePresence mode="wait">
            <motion.article
              key={idx}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
              variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: d + 0.2 } } }}
              className="flex flex-col"
            >
              {[
                <div key="k" className="flex items-center gap-4">
                  <span className="eyebrow text-olive">
                    Chapter {ROMAN[idx]} · {ch.kicker}
                  </span>
                </div>,
                <p key="r" className="mt-5 font-display text-[2.4rem] text-brass italic">
                  {ch.range}
                </p>,
                <h2 key="t" className="mt-1 font-display text-[4.4rem] leading-[1.04] font-semibold text-navy text-balance">
                  {ch.title}
                </h2>,
                <div key="rule" className="mt-6 h-[3px] w-[6rem] bg-brass" />,
                ...ch.paragraphs.map((t, i) => (
                  <p key={`p${i}`} className="mt-5 max-w-[40rem] text-[1.45rem] leading-[1.6] text-ink/85">
                    {t}
                  </p>
                )),
                <ul key="dates" className="mt-7 flex flex-col gap-3 border-t border-sand pt-5">
                  {ch.dates.map((x) => (
                    <li key={x.date} className="flex items-baseline gap-4 text-[1.15rem]">
                      <span className="size-[0.55rem] shrink-0 translate-y-[-0.15rem] rounded-full bg-brass" />
                      <span className="font-bold text-navy">{x.date}</span>
                      <span className="text-muted-foreground">{x.text}</span>
                    </li>
                  ))}
                </ul>,
              ].map((node, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
                    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
                  }}
                >
                  {node}
                </motion.div>
              ))}
            </motion.article>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="relative px-[3.5rem] pb-[1.5rem] pt-[1rem]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: delay + 0.4, ease: EASE }}
      >
        <FlightRoute stops={STORY.map((c) => ({ label: c.title }))} index={idx} onSelect={goTo} />
      </motion.div>

      <Lightbox photos={[main, second]} index={lb} onChange={setLb} collection={`Chapter ${ROMAN[idx]} · ${ch.title}`} />
    </div>
  );
}
