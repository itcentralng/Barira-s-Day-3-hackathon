import { motion } from "motion/react";

const RINGS = [170, 270, 390, 530];

/** Concentric range rings, compass ticks and a slow radar sweep behind the crest. */
export function RadarField({ delay = 0 }: { delay?: number }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <div className="pointer-events-none absolute left-1/2 top-[27%] size-[75rem] -translate-x-1/2 -translate-y-1/2">
      <div
        className="animate-radar absolute inset-[6%] rounded-full opacity-60"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, color-mix(in oklab, var(--aviation) 14%, transparent) 345deg, color-mix(in oklab, var(--brass) 30%, transparent) 360deg)",
          maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
        }}
      />
      <svg viewBox="-600 -600 1200 1200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {RINGS.map((r, i) => (
          <motion.circle
            key={r}
            r={r}
            fill="none"
            stroke="var(--aviation)"
            strokeOpacity={0.16 - i * 0.025}
            strokeWidth={i === 1 ? 1.5 : 1}
            strokeDasharray={i % 2 ? "4 8" : undefined}
            initial={i % 2 ? { scale: 0.92, opacity: 0 } : { pathLength: 0, opacity: 0 }}
            animate={i % 2 ? { scale: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: delay + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotate: -90 }}
          />
        ))}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.6, duration: 1.2 }}>
          {ticks.map((deg) => (
            <line
              key={deg}
              x1="0"
              y1={-552}
              x2="0"
              y2={deg % 30 === 0 ? -575 : -562}
              stroke={deg % 90 === 0 ? "var(--brass)" : "var(--aviation)"}
              strokeOpacity={deg % 30 === 0 ? 0.5 : 0.22}
              strokeWidth={deg % 90 === 0 ? 2.5 : 1}
              transform={`rotate(${deg})`}
            />
          ))}
          <line x1="-600" y1="0" x2="600" y2="0" stroke="var(--aviation)" strokeOpacity="0.07" />
          <line x1="0" y1="-600" x2="0" y2="600" stroke="var(--aviation)" strokeOpacity="0.07" />
        </motion.g>
      </svg>
    </div>
  );
}
