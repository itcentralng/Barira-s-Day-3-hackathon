import { createFileRoute } from "@tanstack/react-router";
import { motion, type Variants } from "motion/react";
import { ArrowRight, X } from "lucide-react";

import { useExhibit } from "@/components/exhibit/ExhibitProvider";
import { ExhibitButton } from "@/components/exhibit/ExhibitButton";
import { FlightLayer } from "@/components/exhibit/welcome/FlightLayer";
import { RadarField } from "@/components/exhibit/welcome/RadarField";
import { SECTIONS } from "@/data/history";
import { brand } from "@/data/media";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Welcome",
      "Enter the immersive history exhibition of the Department of Air Warfare, Armed Forces Command and Staff College, Jaji.",
    ),
  component: Welcome,
});

const EASE = [0.22, 1, 0.36, 1] as const;

// Intro flypast: the aircraft crosses in front of the crest, revealing the exhibition in its wake.
const INTRO_PATH = "M 2250 860 C 1700 820 1350 560 980 430 S 260 330 -480 520";
// Ambient flypasts: high and distant, behind the content.
const AMBIENT_PATH = "M -400 210 C 300 120 900 250 1400 150 S 2000 120 2350 60";
const DECOR_PATHS = [
  "M -60 940 C 420 800 760 1010 1160 890 S 1720 690 1990 760",
  "M -60 300 C 260 220 520 360 860 250",
  "M 1100 1010 C 1350 900 1600 980 1990 860",
];

const word: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 0.9, ease: EASE, delay: 2.15 + i * 0.12 } }),
};

const fade = (delay: number, y = 18) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

function Welcome() {
  const { go, requestExit } = useExhibit();

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-sky-wash">
      {/* Atmosphere */}
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_70%_at_50%_40%,black,transparent)]" />
      <div className="animate-float-slow pointer-events-none absolute -left-[10rem] top-[8rem] h-[18rem] w-[60rem] rounded-full bg-on-dark/70 blur-3xl" />
      <div className="animate-float-slow pointer-events-none absolute -right-[12rem] top-[30rem] h-[14rem] w-[56rem] rounded-full bg-on-dark/60 blur-3xl [animation-delay:-3s]" />
      <RadarField delay={0.1} />

      {/* Decorative dotted flight paths */}
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {/* Dotted lines are revealed through a drawn mask, so the dot pattern survives the animation. */}
        <defs>
          {DECOR_PATHS.map((d, i) => (
            <mask key={d} id={`decor-reveal-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
              <motion.path
                d={d}
                fill="none"
                stroke="white"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.4, delay: 0.4 + i * 0.3, ease: EASE }}
              />
            </mask>
          ))}
        </defs>
        {DECOR_PATHS.map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            mask={`url(#decor-reveal-${i})`}
            stroke={i === 0 ? "var(--olive)" : "var(--aviation)"}
            strokeOpacity={0.45}
            strokeWidth="2.5"
            strokeDasharray="1 12"
            strokeLinecap="round"
          />
        ))}
      </svg>

      <FlightLayer path={AMBIENT_PATH} duration={11} delay={9} repeatEvery={16} scale={[0.16, 0.22]} opacity={0.75} />

      {/* Corners */}
      <motion.div className="absolute left-[3rem] top-[2.5rem] z-20 flex items-center gap-4" {...fade(2.9, -10)}>
        <span className="font-display text-[1.6rem] text-brass">01</span>
        <span className="h-px w-10 bg-brass/60" />
        <span className="eyebrow text-navy/70">Welcome</span>
      </motion.div>
      <motion.div className="absolute right-[3rem] top-[2.2rem] z-20" {...fade(2.9, -10)}>
        <ExhibitButton onClick={requestExit} aria-label="Close experience">
          <X className="size-[1.35rem]" /> Close
        </ExhibitButton>
      </motion.div>
      <motion.div className="absolute bottom-[2.5rem] left-[3rem] z-20 flex flex-col gap-1" {...fade(3.1, 10)}>
        <span className="eyebrow text-olive">Jaji · Kaduna State · Nigeria</span>
        <span className="text-[1.05rem] tabular-nums tracking-[0.12em] text-navy/60">10°49′N · 007°35′E</span>
      </motion.div>
      <motion.div className="absolute bottom-[2.5rem] right-[3rem] z-20 flex flex-col items-end gap-1 text-right" {...fade(3.1, 10)}>
        <span className="eyebrow text-olive">Air Faculty established</span>
        <span className="font-display text-[1.35rem] text-navy">16 March 1978</span>
      </motion.div>

      {/* Composition */}
      <div className="relative z-10 flex h-full flex-col items-center pt-[5.5rem] text-center">
        <div className="relative">
          <motion.svg
            viewBox="-100 -100 200 200"
            className="pointer-events-none absolute left-1/2 top-1/2 size-[21rem] -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <motion.circle
              r="96"
              fill="none"
              stroke="var(--brass)"
              strokeWidth="0.8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.8, delay: 1.5, ease: EASE }}
              style={{ rotate: -90 }}
            />
            <motion.circle
              r="88"
              fill="none"
              stroke="var(--brass)"
              strokeOpacity="0.4"
              strokeWidth="0.5"
              strokeDasharray="1 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.2 }}
            />
          </motion.svg>
          <motion.div
            className="relative h-[15.5rem]"
            initial={{ opacity: 0, scale: 0.72, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 1.25, ease: EASE }}
          >
            <img
              src={brand.logo}
              alt="Armed Forces Command and Staff College, Nigeria — official logo"
              className="h-full w-auto drop-shadow-[0_1.2rem_1.6rem_color-mix(in_oklab,var(--navy)_25%,transparent)]"
              draggable={false}
            />
            {/* Light glint, masked to the crest */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ maskImage: `url(${brand.logo})`, maskSize: "contain", maskRepeat: "no-repeat", WebkitMaskImage: `url(${brand.logo})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat" }}
            >
              <div className="animate-glint absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-on-dark/70 to-transparent [animation-delay:2.6s]" />
            </div>
          </motion.div>
        </div>

        <motion.p className="mt-[2.4rem] text-[1.3rem] font-bold tracking-[0.2em] text-navy uppercase" {...fade(1.85)}>
          Armed Forces Command and Staff College, Jaji
        </motion.p>

        <div className="mt-[1.1rem] flex items-center gap-4">
          <motion.span
            className="h-[2px] w-[9rem] origin-right bg-gradient-to-l from-brass to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 2.0, ease: EASE }}
          />
          <motion.span
            className="text-[1.45rem] font-semibold text-olive"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.04em" }}
            transition={{ duration: 1.1, delay: 2.0, ease: EASE }}
          >
            Department of Air Warfare
          </motion.span>
          <motion.span
            className="h-[2px] w-[9rem] origin-left bg-gradient-to-r from-brass to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 2.0, ease: EASE }}
          />
        </div>

        <h1 className="mt-[1.4rem] flex gap-[0.28em] font-display text-[7.4rem] leading-[1.02] font-semibold text-navy">
          {["The", "History", "Experience"].map((w, i) => (
            <span key={w} className="inline-block overflow-hidden pb-[0.12em]">
              <motion.span
                className={i === 0 ? "inline-block italic font-normal text-brass" : "inline-block"}
                variants={word}
                initial="hidden"
                animate="show"
                custom={i}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p className="mt-[1.2rem] max-w-[54rem] text-[1.5rem] leading-relaxed text-muted-foreground text-balance" {...fade(2.75)}>
          Step inside the story of the Department of Air Warfare — from the Air Faculty of 1978 to air warfare studies today,
          told through the College's own photographs, records and film.
        </motion.p>

        <motion.div className="relative mt-[2.6rem]" {...fade(3.0, 24)}>
          <span className="animate-pulse-ring absolute inset-0 rounded-full ring-2 ring-brass" />
          <span className="animate-pulse-ring absolute inset-0 rounded-full ring-2 ring-brass [animation-delay:1.2s]" />
          <button
            onClick={() => go("/story")}
            className="pressable group relative flex h-[5.8rem] items-center gap-5 rounded-full bg-navy-gradient pr-[1rem] pl-[2.75rem] text-[1.6rem] font-bold text-on-dark shadow-lift ring-1 ring-brass/60"
          >
            Enter Experience
            <span className="flex size-[4rem] items-center justify-center rounded-full bg-brass text-navy-deep transition-transform duration-300 group-active:translate-x-1">
              <ArrowRight className="size-[1.8rem]" />
            </span>
          </button>
        </motion.div>

        <motion.nav className="mt-[2.2rem] flex flex-wrap items-center justify-center gap-x-1 gap-y-2" aria-label="Go straight to a gallery" {...fade(3.25, 10)}>
          {SECTIONS.map((s, i) => (
            <span key={s.id} className="flex items-center">
              {i > 0 && <span className="mx-2 size-[0.35rem] rounded-full bg-brass/70" />}
              <button onClick={() => go(s.path)} className="pressable rounded-full px-3 py-2 text-[1.1rem] font-semibold text-navy/75 active:bg-sand/60">
                {s.short}
              </button>
            </span>
          ))}
        </motion.nav>
      </div>

      {/* Intro flypast, in front of the composition */}
      <FlightLayer
        path={INTRO_PATH}
        duration={3.1}
        delay={0.35}
        scale={[0.42, 0.62]}
        trail
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      />
    </div>
  );
}
