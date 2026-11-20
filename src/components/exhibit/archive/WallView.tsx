import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Photo } from "@/data/media";
import { cn } from "@/lib/utils";
import { ExhibitButton } from "../ExhibitButton";
import { ContextTag } from "../PhotoFrame";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A horizontally travelling exhibition wall: one feature print and two staggered rows. */
export function WallView({ photos, onOpen, layoutPrefix, delay = 0 }: { photos: Photo[]; onOpen: (i: number) => void; layoutPrefix: string; delay?: number }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(true);
  const drag = useDragScroll(scroller);

  const [feature, ...rest] = photos;
  const rows = [rest.filter((_, i) => i % 2 === 0), rest.filter((_, i) => i % 2 === 1)];

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanScroll(max > 4);
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [photos]);

  const by = (d: number) => scroller.current?.scrollBy({ left: d * scroller.current.clientWidth * 0.6, behavior: "smooth" });
  let n = 0;

  return (
    <div className="relative flex h-full flex-col">
      <div
        ref={scroller}
        {...drag.handlers}
        className="scrollbar-none flex min-h-0 flex-1 cursor-grab gap-[1.25rem] overflow-x-auto overflow-y-hidden pr-[6rem] active:cursor-grabbing"
      >
        {feature && (
          <Tile photo={feature} feature onOpen={() => !drag.moved() && onOpen(0)} layoutId={`${layoutPrefix}-${feature.id}`} delay={delay} />
        )}
        <div className="flex h-full shrink-0 flex-col gap-[1.25rem]">
          {rows.map((row, r) => (
            <div key={r} className="flex min-h-0 flex-1 gap-[1.25rem]">
              {row.map((p) => {
                const i = photos.indexOf(p);
                n += 1;
                return (
                  <Tile
                    key={p.id}
                    photo={p}
                    onOpen={() => !drag.moved() && onOpen(i)}
                    layoutId={`${layoutPrefix}-${p.id}`}
                    delay={delay + 0.12 + n * 0.05}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {canScroll && (
        <div className="flex items-center gap-5 pt-[1.25rem]">
          <ExhibitButton size="icon" onClick={() => by(-1)} aria-label="Scroll wall left">
            <ChevronLeft className="size-[1.6rem]" />
          </ExhibitButton>
          <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-sand">
            <motion.div className="absolute inset-y-0 left-0 w-[18%] rounded-full bg-brass" animate={{ left: `${progress * 82}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
          </div>
          <span className="text-[1rem] font-semibold text-muted-foreground">Swipe or use arrows to explore</span>
          <ExhibitButton size="icon" variant="navy" onClick={() => by(1)} aria-label="Scroll wall right">
            <ChevronRight className="size-[1.6rem]" />
          </ExhibitButton>
        </div>
      )}
    </div>
  );
}

function Tile({ photo, feature, onOpen, layoutId, delay }: { photo: Photo; feature?: boolean; onOpen: () => void; layoutId: string; delay: number }) {
  const ratio = Math.min(Math.max(photo.w / photo.h, feature ? 0.75 : 0.7), feature ? 1.45 : 2.4);
  return (
    <motion.button
      onClick={onOpen}
      className={cn("group relative h-full shrink-0 overflow-hidden rounded-[0.6rem] bg-navy text-left shadow-plate", feature && "rounded-[0.9rem]")}
      style={{ aspectRatio: `${ratio}` }}
      initial={{ clipPath: "inset(100% 0 0 0)", y: 40 }}
      animate={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      whileTap={{ scale: 0.97 }}
      aria-label={`Open photograph: ${photo.title}`}
    >
      <motion.div layoutId={layoutId} className="absolute inset-0 overflow-hidden">
        <motion.img
          src={photo.src}
          alt={photo.title}
          className={cn("h-full w-full", photo.lowRes ? "bg-paper object-contain p-3" : "object-cover")}
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay }}
          draggable={false}
          loading="lazy"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-photo-fade opacity-90" />
      {photo.context && <ContextTag dark className="absolute left-3 top-3" />}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-[1.1rem] text-on-dark">
        <p className={cn("font-display leading-tight", feature ? "text-[2.2rem]" : "text-[1.3rem]")}>{photo.title}</p>
        <p className={cn("mt-1 text-on-dark-muted", feature ? "text-[1.15rem]" : "text-[0.95rem]")}>{photo.subtitle}</p>
        {feature && photo.note && <p className="mt-2 max-w-[30rem] text-[1rem] text-on-dark-muted italic">{photo.note}</p>}
      </div>
    </motion.button>
  );
}

/** Mouse drag-to-scroll (touch already scrolls natively). */
function useDragScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const state = useRef({ down: false, x: 0, left: 0, moved: false });
  return {
    moved: () => state.current.moved,
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        state.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: false };
      },
      onPointerMove: (e: React.PointerEvent) => {
        const s = state.current;
        if (!s.down || !ref.current) return;
        const dx = e.clientX - s.x;
        if (Math.abs(dx) > 6) s.moved = true;
        ref.current.scrollLeft = s.left - dx;
      },
      onPointerUp: () => {
        state.current.down = false;
        setTimeout(() => (state.current.moved = false), 0);
      },
      onPointerLeave: () => {
        state.current.down = false;
      },
    },
  };
}
