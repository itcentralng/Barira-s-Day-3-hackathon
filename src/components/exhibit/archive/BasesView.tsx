import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useState } from "react";

import { BASES } from "@/data/history";
import { photo } from "@/data/media";
import { NIGERIA, project } from "@/data/nigeria";
import { at, cn } from "@/lib/utils";
import { ExhibitButton } from "../ExhibitButton";
import { useFirstRender } from "../useFirstRender";

const EASE = [0.22, 1, 0.36, 1] as const;
const PAD = 40;

/** Interactive map of the bases photographed in the archive, with flight lines from Jaji. */
export function BasesView({ onOpen, delay = 0 }: { onOpen: (photoId: string) => void; delay?: number }) {
  const [sel, setSel] = useState(0);
  const first = useFirstRender(2000);
  const base = at(BASES, sel);
  const p = photo(base.photoId);
  const hub = at(BASES, 0);
  const jaji = project(hub.lon, hub.lat);
  const W = NIGERIA.width + PAD * 2;
  const H = NIGERIA.height + PAD * 2;

  return (
    <div className="grid h-full grid-cols-[50fr_50fr] gap-[2rem]">
      <motion.div
        className="relative overflow-hidden rounded-[1rem] bg-sky shadow-plate"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        <div className="paper-grain absolute inset-0 opacity-60" />
        <p className="absolute left-[1.75rem] top-[1.5rem] eyebrow text-aviation">Locations in the archive · tap a point</p>
        <svg viewBox={`${-PAD} ${-PAD} ${W} ${H}`} className="absolute inset-0 h-full w-full p-[1.5rem] pt-[3.5rem]" aria-label="Map of Nigeria">
          <motion.path
            d={NIGERIA.path}
            fill="var(--paper)"
            stroke="var(--olive)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{ pathLength: { duration: 2, ease: EASE, delay }, fillOpacity: { duration: 0.8, delay: delay + 1.2 } }}
          />
          {/* Flight lines from Jaji */}
          {BASES.slice(1).map((b, i) => {
            const t = project(b.lon, b.lat);
            const mx = (jaji.x + t.x) / 2;
            const my = (jaji.y + t.y) / 2;
            const dx = t.x - jaji.x;
            const dy = t.y - jaji.y;
            const c = { x: mx - dy * 0.22, y: my + dx * 0.22 };
            const d = `M ${jaji.x} ${jaji.y} Q ${c.x} ${c.y} ${t.x} ${t.y}`;
            const on = sel === i + 1;
            return (
              <g key={b.name}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke={on ? "var(--brass)" : "var(--aviation)"}
                  strokeOpacity={on ? 1 : 0.35}
                  strokeWidth={on ? 3.5 : 2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: EASE, delay: delay + 1 + i * 0.08 }}
                />
                {on && <path d={d} fill="none" stroke="var(--navy)" strokeWidth="3" strokeDasharray="6 18" className="animate-dash-flow" />}
              </g>
            );
          })}
          {BASES.map((b, i) => {
            const pt = project(b.lon, b.lat);
            const on = sel === i;
            const hub = i === 0;
            return (
              <motion.g
                key={b.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 1.3 + i * 0.07, type: "spring", stiffness: 260, damping: 18 }}
                style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
              >
                <g className="cursor-pointer" onClick={() => setSel(i)} role="button" aria-label={`Show ${b.name}`}>
                  <circle cx={pt.x} cy={pt.y} r="34" fill="transparent" />
                  {on && <circle cx={pt.x} cy={pt.y} r="22" fill="var(--brass)" className="animate-pulse-ring" style={{ transformOrigin: `${pt.x}px ${pt.y}px` }} />}
                  <circle cx={pt.x} cy={pt.y} r={on ? 13 : hub ? 11 : 9} fill={on ? "var(--brass)" : hub ? "var(--navy)" : "var(--paper)"} stroke={hub ? "var(--brass)" : "var(--navy)"} strokeWidth="3.5" />
                  <text
                    x={pt.x + (b.labelSide === "right" ? 22 : -22)}
                    y={pt.y + 8}
                    textAnchor={b.labelSide === "right" ? "start" : "end"}
                    className={cn("font-sans", on ? "fill-navy font-bold" : "fill-ink/75 font-semibold")}
                    style={{ fontSize: on ? 30 : 25 }}
                  >
                    {b.name}
                  </text>
                </g>
              </motion.g>
            );
          })}
        </svg>
        <div className="absolute bottom-[1.5rem] left-[1.75rem] flex items-center gap-3 text-[0.95rem] font-semibold text-muted-foreground">
          <span className="size-[0.9rem] rounded-full border-[3px] border-brass bg-navy" /> Jaji — Armed Forces Command and Staff College
        </div>
      </motion.div>

      <div className="flex min-h-0 flex-col">
        <div className="relative min-h-0 flex-1">
          <AnimatePresence mode="popLayout">
            <motion.figure
              key={p.id}
              className="print-frame absolute inset-0 flex flex-col"
              initial={{ opacity: 0, x: 80, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -60, rotate: -2 }}
              transition={{ duration: 0.7, ease: EASE, delay: first ? delay + 0.3 : 0 }}
            >
              <button className="relative min-h-0 flex-1 overflow-hidden" onClick={() => onOpen(p.id)} aria-label={`Open photograph: ${p.title}`}>
                <img src={p.src} alt={p.title} className="animate-ken-burns h-full w-full object-cover" draggable={false} />
              </button>
              <figcaption className="flex items-end justify-between gap-6 px-2 pb-1 pt-4">
                <div>
                  <p className="eyebrow text-olive">Location {String(sel + 1).padStart(2, "0")} of {BASES.length}</p>
                  <h3 className="mt-1 font-display text-[3rem] leading-none text-navy">{base.name}</h3>
                  <p className="mt-2 text-[1.2rem] text-muted-foreground">{p.subtitle}</p>
                </div>
                <ExhibitButton onClick={() => onOpen(p.id)}>
                  <Expand className="size-[1.2rem]" /> Enlarge
                </ExhibitButton>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between gap-4 pt-[1.25rem]">
          <ExhibitButton size="icon" onClick={() => setSel((s) => (s - 1 + BASES.length) % BASES.length)} aria-label="Previous location">
            <ChevronLeft className="size-[1.6rem]" />
          </ExhibitButton>
          <div className="flex flex-wrap justify-center gap-2">
            {BASES.map((b, i) => (
              <button
                key={b.name}
                onClick={() => setSel(i)}
                className={cn("pressable rounded-full px-3 py-1.5 text-[0.95rem] font-semibold", i === sel ? "bg-navy text-on-dark" : "bg-paper text-navy ring-1 ring-sand")}
              >
                {b.name}
              </button>
            ))}
          </div>
          <ExhibitButton size="icon" variant="navy" onClick={() => setSel((s) => (s + 1) % BASES.length)} aria-label="Next location">
            <ChevronRight className="size-[1.6rem]" />
          </ExhibitButton>
        </div>
      </div>
    </div>
  );
}
