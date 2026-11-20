import { motion } from "motion/react";

import type { Photo } from "@/data/media";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Official portraits presented as framed gallery pieces. No biographies are given. */
export function ChiefsView({ photos, onOpen, layoutPrefix, delay = 0 }: { photos: Photo[]; onOpen: (i: number) => void; layoutPrefix: string; delay?: number }) {
  return (
    <div className="relative flex h-full items-center justify-center gap-[5rem]">
      <div className="pointer-events-none absolute inset-x-[10%] top-1/2 h-px -translate-y-1/2 dotted-rule opacity-50" />
      {photos.map((p, i) => (
        <motion.figure
          key={p.id}
          className="relative flex h-full flex-col items-center"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.18 }}
        >
          <motion.button
            onClick={() => onOpen(i)}
            className="relative min-h-0 flex-1 bg-paper p-[1.1rem] shadow-lift ring-1 ring-sand"
            style={{ aspectRatio: `${p.w} / ${p.h}` }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Open portrait: ${p.title}`}
          >
            {/* Brass corner marks */}
            {["left-2 top-2 border-l-2 border-t-2", "right-2 top-2 border-r-2 border-t-2", "left-2 bottom-2 border-l-2 border-b-2", "right-2 bottom-2 border-r-2 border-b-2"].map((c) => (
              <span key={c} className={`absolute size-[1.6rem] border-brass ${c}`} />
            ))}
            <motion.div layoutId={`${layoutPrefix}-${p.id}`} className="h-full w-full overflow-hidden">
              <motion.img
                src={p.src}
                alt={p.title}
                className="h-full w-full object-cover"
                initial={{ scale: 1.15, filter: "grayscale(1)" }}
                animate={{ scale: 1, filter: "grayscale(0)" }}
                transition={{ duration: 1.6, ease: EASE, delay: delay + 0.3 + i * 0.18 }}
                draggable={false}
              />
            </motion.div>
          </motion.button>
          <figcaption className="mt-[1.4rem] text-center">
            <p className="font-display text-[2.2rem] leading-tight text-navy">{p.title}</p>
            <p className="mt-1 text-[1.1rem] text-muted-foreground">{p.subtitle}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
