import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

import { ChronologyDocument } from "@/components/exhibit/ChronologyDocument";
import { ExhibitButton } from "@/components/exhibit/ExhibitButton";
import { useEntranceDelay } from "@/components/exhibit/ExhibitProvider";
import { useFullscreen } from "@/components/exhibit/useFullscreen";
import { RECORDS, type RecordItem } from "@/data/history";
import { photo } from "@/data/media";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_exhibit/records")({
  head: () =>
    pageHead("Memorabilia & Historical Records", "Archival prints, the College crest and the approved chronology of the Department of Air Warfare, on an interactive light table."),
  component: Records,
});

const EASE = [0.22, 1, 0.36, 1] as const;

// Hand-placed positions on the light table (percent of table), rotation and width in rem.
const LAYOUT: Record<string, { x: number; y: number; r: number; w: number }> = {
  inaugural: { x: 2, y: 5, r: -3, w: 26 },
  acsc1: { x: 27, y: 4, r: 2, w: 30 },
  crest: { x: 55, y: 6, r: 0, w: 8 },
  hq: { x: 64, y: 6, r: -2, w: 23 },
  dh2: { x: 86, y: 5, r: 4, w: 14 },
  csc1: { x: 3, y: 50, r: 2.5, w: 23 },
  chronology: { x: 27, y: 38, r: -1.5, w: 15 },
  dh1: { x: 43, y: 46, r: 3, w: 20 },
  dh3: { x: 63, y: 52, r: -3, w: 18 },
};

function Records() {
  const delay = useEntranceDelay();
  const [open, setOpen] = useState<number | null>(null);
  const [tidy, setTidy] = useState(0);
  const table = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);

  return (
    <div className="relative flex h-full flex-col bg-ivory">
      <div className="flex items-end justify-between px-[3rem] pb-[1rem] pt-[1.75rem]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay }}>
          <p className="eyebrow text-olive">The light table</p>
          <h2 className="mt-1 font-display text-[3.2rem] leading-none text-navy">Memorabilia &amp; Historical Records</h2>
        </motion.div>
        <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.3 }}>
          <span className="text-[1.1rem] text-muted-foreground">Tap a record to examine it · drag to rearrange</span>
          <ExhibitButton onClick={() => setTidy((t) => t + 1)}>
            <LayoutGrid className="size-[1.2rem]" /> Tidy the table
          </ExhibitButton>
        </motion.div>
      </div>

      <div ref={table} className="relative mx-[2rem] mb-[1.75rem] min-h-0 flex-1 overflow-hidden rounded-[1.25rem] bg-sand/45 shadow-[inset_0_2px_30px_color-mix(in_oklab,var(--navy)_12%,transparent)]">
        <div className="paper-grain absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,color-mix(in_oklab,var(--paper)_80%,transparent),transparent)]" />
        <div key={tidy} className="absolute inset-0">
          {RECORDS.map((rec, i) => {
            const l = LAYOUT[rec.id] ?? { x: 10, y: 10, r: 0, w: 18 };
            return (
              <motion.button
                key={rec.id}
                drag
                dragConstraints={table}
                dragElastic={0.08}
                dragMomentum={false}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={() => setTimeout(() => (dragged.current = false), 50)}
                onClick={() => !dragged.current && setOpen(i)}
                className="absolute cursor-grab text-left active:cursor-grabbing"
                style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}rem`, zIndex: rec.id === "crest" ? 5 : i + 1 }}
                initial={{ opacity: 0, y: 260, rotate: l.r * 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, rotate: l.r, scale: 1 }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: delay + 0.15 + i * 0.08 }}
                whileTap={{ scale: 1.04, zIndex: 50 }}
                whileDrag={{ scale: 1.06, rotate: 0, zIndex: 60, boxShadow: "var(--shadow-lift-v)" }}
                aria-label={`Examine record: ${rec.title}`}
              >
                <TableItem rec={rec} n={i + 1} />
              </motion.button>
            );
          })}
        </div>
      </div>

      <RecordViewer index={open} onChange={setOpen} />
    </div>
  );
}

function TableItem({ rec, n }: { rec: RecordItem; n: number }) {
  if (rec.kind === "chronology") {
    return (
      <div className="shadow-print">
        <div className="aspect-[0.75] w-full">
          <ChronologyDocument compact />
        </div>
        <Tag n={n} title={rec.title} />
      </div>
    );
  }
  const p = photo(rec.photoId!);
  if (rec.id === "crest") {
    return (
      <div className="flex flex-col items-center">
        <img src={p.src} alt={rec.title} className="w-full drop-shadow-[0_0.8rem_1rem_color-mix(in_oklab,var(--ink)_35%,transparent)]" draggable={false} />
        <Tag n={n} title="College crest" />
      </div>
    );
  }
  return (
    <div className="print-frame">
      <img src={p.src} alt={rec.title} className="block w-full" style={{ aspectRatio: `${p.w} / ${p.h}` }} draggable={false} />
      <Tag n={n} title={rec.title} />
    </div>
  );
}

function Tag({ n, title }: { n: number; title: string }) {
  return (
    <p className="mt-2 flex items-baseline gap-2 truncate px-1 text-[0.85rem] text-ink/75">
      <span className="font-bold text-brass">Fig. {n}</span>
      <span className="truncate">{title}</span>
    </p>
  );
}

function RecordViewer({ index, onChange }: { index: number | null; onChange: (i: number | null) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const zoom = useRef<ReactZoomPanPinchRef>(null);
  const fs = useFullscreen(root);
  const rec = index !== null ? RECORDS[index] : null;

  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onChange((index + d + RECORDS.length) % RECORDS.length);
    },
    [index, onChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onChange, step]);

  const close = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onChange(null);
  };
  const p = rec?.photoId ? photo(rec.photoId) : null;

  return (
    <AnimatePresence>
      {rec && (
        <motion.div
          ref={root}
          className="fixed inset-0 z-[95] grid grid-cols-[1fr_34rem] bg-paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Record viewer: ${rec.title}`}
        >
          <div className="relative overflow-hidden bg-sand/50">
            <div className="paper-grain absolute inset-0 opacity-60" />
            <AnimatePresence mode="wait">
              <motion.div
                key={rec.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.92, rotate: -1.5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <TransformWrapper ref={zoom} minScale={1} maxScale={5} centerOnInit doubleClick={{ mode: "toggle", step: 1.4 }}>
                  <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                    <div className="flex h-full w-full items-center justify-center p-[3.5rem]">
                      {rec.kind === "chronology" ? (
                        <div className="aspect-[0.78] h-full shadow-print">
                          <ChronologyDocument />
                        </div>
                      ) : rec.id === "crest" ? (
                        <img src={p!.src} alt={rec.title} className="h-[70%] w-auto drop-shadow-2xl" draggable={false} />
                      ) : (
                        <img src={p!.src} alt={rec.title} className="print-frame max-h-full max-w-full" draggable={false} />
                      )}
                    </div>
                  </TransformComponent>
                </TransformWrapper>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-[1.75rem] left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-paper/90 p-2 shadow-lift backdrop-blur">
              <ExhibitButton size="icon" variant="ghost" onClick={() => zoom.current?.zoomOut(0.6)} aria-label="Zoom out">
                <Minus className="size-[1.4rem]" />
              </ExhibitButton>
              <ExhibitButton size="icon" variant="ghost" onClick={() => zoom.current?.resetTransform()} aria-label="Reset zoom">
                <RotateCcw className="size-[1.3rem]" />
              </ExhibitButton>
              <ExhibitButton size="icon" variant="navy" onClick={() => zoom.current?.zoomIn(0.6)} aria-label="Zoom in">
                <Plus className="size-[1.4rem]" />
              </ExhibitButton>
            </div>
            <p className="absolute left-[2rem] top-[1.75rem] rounded-full bg-paper/85 px-4 py-2 text-[1rem] font-semibold text-muted-foreground backdrop-blur">
              Pinch or use + / − to examine details
            </p>
          </div>

          <aside className="flex flex-col border-l border-sand bg-paper px-[2.5rem] py-[2rem]">
            <div className="flex justify-end gap-3">
              {fs.supported && (
                <ExhibitButton size="icon" onClick={fs.toggle} aria-label={fs.active ? "Exit fullscreen" : "Fullscreen"}>
                  <Maximize className="size-[1.3rem]" />
                </ExhibitButton>
              )}
              <ExhibitButton variant="navy" onClick={close}>
                <X className="size-[1.4rem]" /> Close
              </ExhibitButton>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={rec.id}
                className="mt-[2.5rem] flex flex-1 flex-col"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              >
                <motion.p variants={rise} className="font-display text-[1.6rem] text-brass">
                  Fig. {index! + 1} of {RECORDS.length}
                </motion.p>
                <motion.h3 variants={rise} className="mt-2 font-display text-[2.8rem] leading-[1.08] text-navy">
                  {rec.title}
                </motion.h3>
                <motion.p variants={rise} className="mt-3 eyebrow text-olive">
                  {rec.type}
                </motion.p>
                <motion.div variants={rise} className="mt-6 h-[3px] w-[5rem] bg-brass" />
                {rec.transcription && (
                  <motion.div variants={rise} className="mt-6 rounded-[0.75rem] bg-ivory p-5 ring-1 ring-sand">
                    <p className="eyebrow text-muted-foreground">Transcription</p>
                    <p className="mt-2 font-display text-[1.45rem] leading-snug text-ink italic">{rec.transcription}</p>
                  </motion.div>
                )}
                <motion.p variants={rise} className="mt-6 text-[1.25rem] leading-relaxed text-ink/85">
                  {rec.description}
                </motion.p>
                <motion.p variants={rise} className={cn("mt-auto text-[0.95rem] text-muted-foreground")}>
                  Source: supplied exhibition archive{p ? ` · ${p.key.split("/").pop()}` : ""}
                </motion.p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex gap-3">
              <ExhibitButton className="flex-1" onClick={() => step(-1)}>
                <ChevronLeft className="size-[1.5rem]" /> Previous
              </ExhibitButton>
              <ExhibitButton className="flex-1" variant="navy" onClick={() => step(1)}>
                Next <ChevronRight className="size-[1.5rem]" />
              </ExhibitButton>
            </div>
          </aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
