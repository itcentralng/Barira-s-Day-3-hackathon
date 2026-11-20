import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Photo } from "@/data/media";
import { cn } from "@/lib/utils";
import { ExhibitButton } from "./ExhibitButton";
import { useFullscreen } from "./useFullscreen";

type Props = {
  photos: Photo[];
  index: number | null;
  onChange: (index: number | null) => void;
  /** Optional collection name shown in the viewer header. */
  collection?: string | undefined;
  /** Shared-element prefix: tiles using `${layoutPrefix}-${id}` morph into the viewer. */
  layoutPrefix?: string | undefined;
};

const slide = {
  enter: (dir: number) => ({ x: dir * 160, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir * -160, opacity: 0, scale: 0.96 }),
};

/** Immersive photograph viewer with swipe, keyboard, thumbnails and fullscreen. */
export function Lightbox({ photos, index, onChange, collection, layoutPrefix }: Props) {
  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState(0);
  const openedAt = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const fs = useFullscreen(root);
  const open = index !== null;

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open && openedAt.current === null) openedAt.current = index;
    if (!open) openedAt.current = null;
  }, [open, index]);

  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      setDir(d);
      onChange((index + d + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onChange(null);
  }, [onChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  useEffect(() => {
    if (index === null) return;
    strip.current
      ?.querySelector<HTMLElement>(`[data-thumb="${index}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -90 || info.velocity.x < -500) step(1);
    else if (info.offset.x > 90 || info.velocity.x > 500) step(-1);
  };

  if (!mounted) return null;
  const p = index !== null ? photos[index] : null;
  const shared = layoutPrefix && p && index === openedAt.current ? `${layoutPrefix}-${p.id}` : undefined;

  return createPortal(
    <AnimatePresence>
      {p && (
        <motion.div
          ref={root}
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph viewer: ${p.title}`}
          className="fixed inset-0 z-[95] flex flex-col bg-navy-deep text-on-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.05 } }}
          transition={{ duration: 0.35 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,color-mix(in_oklab,var(--aviation)_35%,transparent),transparent)]" />

          {/* Header */}
          <div className="relative flex items-center justify-between px-[2.5rem] pt-[1.75rem]">
            <div className="flex items-baseline gap-5">
              <span className="font-display text-[2rem] text-brass-soft tabular-nums">
                {String(index! + 1).padStart(2, "0")}
                <span className="text-on-dark-muted"> / {String(photos.length).padStart(2, "0")}</span>
              </span>
              {collection && <span className="eyebrow text-on-dark-muted">{collection}</span>}
            </div>
            <div className="flex gap-3">
              {fs.supported && (
                <ExhibitButton variant="glass" onClick={fs.toggle} aria-label={fs.active ? "Exit fullscreen" : "Fullscreen"}>
                  {fs.active ? <Minimize className="size-[1.4rem]" /> : <Maximize className="size-[1.4rem]" />}
                  {fs.active ? "Exit fullscreen" : "Fullscreen"}
                </ExhibitButton>
              )}
              <ExhibitButton variant="glass" onClick={close} aria-label="Close viewer">
                <X className="size-[1.5rem]" /> Close
              </ExhibitButton>
            </div>
          </div>

          {/* Stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-[8rem] py-[1.5rem]">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={p.id}
                custom={dir}
                variants={shared ? {} : slide}
                initial={shared ? false : "enter"}
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 32 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={onDragEnd}
                className="flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
              >
                <motion.div
                  {...(shared ? { layoutId: shared } : {})}
                  className={cn("relative overflow-hidden rounded-[0.5rem] shadow-lift", p.lowRes && "bg-paper p-[1rem]")}
                  style={{
                    aspectRatio: `${p.w} / ${p.h}`,
                    maxHeight: "100%",
                    maxWidth: "100%",
                    height: p.lowRes ? `min(100%, ${p.h * 2.2}px)` : "100%",
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 30 }}
                >
                  <img src={p.src} alt={p.title} className="h-full w-full object-cover" draggable={false} />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <ExhibitButton
              variant="glass"
              size="iconLg"
              className="absolute left-[2rem] top-1/2 -translate-y-1/2"
              onClick={() => step(-1)}
              aria-label="Previous photograph"
            >
              <ChevronLeft className="size-[2rem]" />
            </ExhibitButton>
            <ExhibitButton
              variant="glass"
              size="iconLg"
              className="absolute right-[2rem] top-1/2 -translate-y-1/2"
              onClick={() => step(1)}
              aria-label="Next photograph"
            >
              <ChevronRight className="size-[2rem]" />
            </ExhibitButton>
          </div>

          {/* Caption + thumbnails */}
          <div className="relative flex items-end gap-[2.5rem] px-[2.5rem] pb-[1.75rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                className="w-[38rem] shrink-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display text-[2.1rem] leading-tight">{p.title}</h3>
                <p className="mt-1 text-[1.2rem] text-on-dark-muted">{p.subtitle}</p>
                {p.note && <p className="mt-2 text-[1.05rem] italic text-on-dark-muted">{p.note}</p>}
                {p.context && (
                  <p className="mt-3 inline-flex rounded-full bg-brass/20 px-4 py-1.5 text-[0.95rem] font-semibold text-brass-soft">
                    Contextual photograph — illustrates the topic
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
            <div ref={strip} className="scrollbar-none flex min-w-0 flex-1 gap-3 overflow-x-auto py-2">
              {photos.map((t, i) => (
                <button
                  key={t.id}
                  data-thumb={i}
                  onClick={() => {
                    setDir(i > index! ? 1 : -1);
                    onChange(i);
                  }}
                  aria-label={`Show ${t.title}`}
                  className={cn(
                    "pressable relative h-[5.5rem] shrink-0 overflow-hidden rounded-[0.4rem] ring-2 transition-all",
                    i === index ? "ring-brass opacity-100" : "ring-transparent opacity-50",
                  )}
                  style={{ aspectRatio: `${Math.min(Math.max(t.w / t.h, 0.7), 1.8)}` }}
                >
                  <img src={t.src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
