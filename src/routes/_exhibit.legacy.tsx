import { createFileRoute } from "@tanstack/react-router";
import { animate, motion, useInView } from "motion/react";
import { ArrowRight, RotateCcw, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ExhibitButton } from "@/components/exhibit/ExhibitButton";
import { useEntranceDelay, useExhibit } from "@/components/exhibit/ExhibitProvider";
import { Lightbox } from "@/components/exhibit/Lightbox";
import { MILESTONES } from "@/data/history";
import { brand, photo } from "@/data/media";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_exhibit/legacy")({
  head: () =>
    pageHead("Department Facts & Legacy", "Verified dates and developments that define the legacy of the Department of Air Warfare, AFCSC Jaji."),
  component: Legacy,
});

const EASE = [0.22, 1, 0.36, 1] as const;

type Fact = {
  value: number;
  from: number;
  suffix?: string;
  label: string;
  detail: string;
  back: { title: string; lines: string[] };
  tone: "navy" | "brass" | "paper" | "olive" | "sky";
  span: string;
};

// Every figure below is taken or computed directly from the approved milestones.
const FACTS: Fact[] = [
  {
    value: 1978,
    from: 1960,
    label: "Air Faculty established",
    detail: "16 March 1978 · running Senior Course only",
    back: { title: "The beginning", lines: ["16 March 1978 — Air Faculty established, running Senior Course only.", "26 February 1979 — Junior Division Staff Course established at NAF Base Kaduna."] },
    tone: "navy",
    span: "col-span-2 row-span-2",
  },
  {
    value: 2002,
    from: 1986,
    label: "Department of Air Warfare",
    detail: "Redesignated 2 December 2002",
    back: { title: "A new name", lines: ["2 December 2002 — Air Faculty redesignated Department of Air Warfare."] },
    tone: "brass",
    span: "col-span-2",
  },
  {
    value: 10,
    from: 0,
    label: "Milestones",
    detail: "In the approved record",
    back: { title: "The record", lines: [`Ten milestones, from ${MILESTONES[0]?.date} to ${MILESTONES[MILESTONES.length - 1]?.date}.`, "Explore each on the timeline."] },
    tone: "paper",
    span: "col-span-1",
  },
  {
    value: 3,
    from: 0,
    label: "Commissioned",
    detail: "Building, hall, centre",
    back: {
      title: "Commissioned",
      lines: ["1987 · DAW building", "2000 · Isaac Alfa Hall", "2019 · SB Abubakar Centre"],
    },
    tone: "olive",
    span: "col-span-1",
  },
  {
    value: 46,
    from: 0,
    suffix: " yrs",
    label: "Spanned by the record",
    detail: "16 March 1978 → December 2024",
    back: { title: "Across the years", lines: ["From the Air Faculty's establishment in 1978 to the review of the DAW Handbook in December 2024."] },
    tone: "sky",
    span: "col-span-2",
  },
];

const TONES: Record<Fact["tone"], string> = {
  navy: "bg-navy-gradient text-on-dark",
  brass: "bg-brass text-navy-deep",
  paper: "bg-paper text-navy ring-1 ring-sand",
  olive: "bg-olive text-on-dark",
  sky: "bg-sky text-navy ring-1 ring-aviation-soft",
};

const RIBBON = [
  "acsc-1",
  "college-hq",
  "department-of-air-warfare-hero-seminar-2024",
  "alpha-jet",
  "csc-1",
  "2026-05-13-senior-course-48-group-photo",
  "jaji-college-campus",
  "c-130h",
  "inaugural-speech",
  "2026-05-13-senior-course-48-in-the-field",
  "do-27",
  "today-officer-research-context",
].map(photo);

function Legacy() {
  const { go } = useExhibit();
  const delay = useEntranceDelay();
  const [lb, setLb] = useState<number | null>(null);

  return (
    <div className="relative flex h-full flex-col bg-sky-wash">
      <div className="grid min-h-0 flex-1 grid-cols-[38fr_62fr] gap-[3rem] px-[3.5rem] pt-[2.5rem]">
        {/* Closing statement */}
        <motion.div
          className="flex min-h-0 flex-col justify-center"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: delay + 0.1 } } }}
        >
          <motion.img variants={rise} src={brand.logo} alt="Armed Forces Command and Staff College logo" className="h-[5.5rem] w-fit" />
          <motion.p variants={rise} className="mt-5 eyebrow text-olive">
            Department of Air Warfare · AFCSC Jaji
          </motion.p>
          <motion.h2 variants={rise} className="mt-3 font-display text-[3.9rem] leading-[1.05] font-semibold text-navy text-balance">
            A legacy of <span className="text-brass italic">Leadership</span> and <span className="text-brass italic">Knowledge</span>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 max-w-[38rem] text-[1.25rem] leading-[1.55] text-ink/85">
            From an Air Faculty running the Senior Course only, to a Department marked by a purpose-built building, a commissioned
            hall and centre, a new seminar and a bi-service exercise — the approved record charts how air warfare studies grew at
            the College, under a crest that carries the motto “Leadership and Knowledge”.
          </motion.p>
          <motion.div variants={rise} className="mt-7 flex flex-wrap gap-4">
            <ExhibitButton variant="navy" onClick={() => go("/timeline")}>
              Revisit the timeline <ArrowRight className="size-[1.4rem]" />
            </ExhibitButton>
            <ExhibitButton onClick={() => go("/", { resetHistory: true })}>
              <RotateCcw className="size-[1.3rem]" /> Return to the beginning
            </ExhibitButton>
          </motion.div>
        </motion.div>

        {/* Facts */}
        <div className="grid min-h-0 grid-cols-4 grid-rows-[1fr_1fr_1fr] gap-[1.25rem] pb-[1.5rem]">
          {FACTS.map((f, i) => (
            <FactTile key={f.label} fact={f} delay={delay + 0.25 + i * 0.1} />
          ))}
          <motion.button
            className="relative col-span-2 overflow-hidden rounded-[1.25rem] text-left text-on-dark shadow-plate"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + 0.75 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => go("/timeline?m=8")}
          >
            <img src={photo("2026-05-13-senior-course-48-in-the-field").src} alt="" className="animate-ken-burns absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-side-fade" />
            <div className="relative flex h-full flex-col justify-end p-[1.6rem]">
              <p className="eyebrow text-brass-soft">February 2024 · first bi-service</p>
              <p className="mt-1 font-display text-[2.6rem] leading-none">IMONGO DOO</p>
              <p className="mt-2 text-[1.05rem] text-on-dark-muted">Air-Land Exercise · context image</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Photographic ribbon */}
      <motion.div
        className="relative h-[10.5rem] shrink-0 overflow-hidden border-t border-sand bg-paper/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.9, duration: 0.8 }}
      >
        <div className="animate-marquee flex h-full w-max gap-[1rem] py-[1rem] pl-[1rem] hover:[animation-play-state:paused]">
          {[...RIBBON, ...RIBBON].map((p, i) => (
            <button key={i} onClick={() => setLb(i % RIBBON.length)} className="pressable h-full shrink-0 overflow-hidden rounded-[0.5rem] shadow-plate" style={{ aspectRatio: "1.5" }} aria-label={`Open photograph: ${p.title}`}>
              <img src={p.src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
            </button>
          ))}
        </div>
      </motion.div>

      <Lightbox photos={RIBBON} index={lb} onChange={setLb} collection="Highlights from the archive" />
    </div>
  );
}

function FactTile({ fact, delay }: { fact: Fact; delay: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.button
      className={cn("relative [perspective:1600px]", fact.span)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${fact.label}. Tap to ${flipped ? "show the figure" : "read more"}.`}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
      >
        <div className={cn("absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.25rem] p-[1.4rem] text-left shadow-plate [backface-visibility:hidden]", TONES[fact.tone])}>
          <span className="flex items-center justify-between">
            <span className="eyebrow opacity-80">{fact.label}</span>
            <RefreshCw className="size-[1.2rem] opacity-60" />
          </span>
          <span>
            <CountUp to={fact.value} from={fact.from} delay={delay + 0.2} suffix={fact.suffix} className={cn("font-display leading-none font-semibold tabular-nums", fact.span.includes("row-span-2") ? "text-[8.5rem]" : fact.span === "col-span-1" ? "text-[3.8rem]" : "text-[4.6rem]")} />
            <span className="mt-1 block text-[1.05rem] opacity-85">{fact.detail}</span>
          </span>
        </div>
        <div className={cn("absolute inset-0 flex flex-col overflow-hidden rounded-[1.25rem] p-[1.6rem] text-left shadow-plate [backface-visibility:hidden] [transform:rotateY(180deg)]", TONES[fact.tone])}>
          <span className="eyebrow opacity-80">{fact.back.title}</span>
          <ul className="mt-3 flex flex-col gap-2">
            {fact.back.lines.map((l) => (
              <li key={l} className={cn("leading-snug", fact.span.includes("col-span-1") ? "text-[0.95rem]" : "text-[1.1rem]")}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.button>
  );
}

function CountUp({ to, from, delay, suffix, className }: { to: number; from: number; delay: number; suffix?: string | undefined; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const c = animate(from, to, { duration: 1.8, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, from, to, delay]);
  return (
    <span ref={ref} className={cn("block", className)}>
      {v}
      {suffix && <span className="text-[0.4em] font-normal">{suffix}</span>}
    </span>
  );
}

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
