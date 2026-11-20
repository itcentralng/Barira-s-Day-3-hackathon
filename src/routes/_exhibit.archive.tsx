import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Landmark, MapPinned, Plane, ScrollText, Shield, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AircraftView } from "@/components/exhibit/archive/AircraftView";
import { BasesView } from "@/components/exhibit/archive/BasesView";
import { ChiefsView } from "@/components/exhibit/archive/ChiefsView";
import { WallView } from "@/components/exhibit/archive/WallView";
import { useEntranceDelay } from "@/components/exhibit/ExhibitProvider";
import { Lightbox } from "@/components/exhibit/Lightbox";
import { useFirstRender } from "@/components/exhibit/useFirstRender";
import { photosIn, type PhotoCategory } from "@/data/media";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

type ArchiveCategory = Exclude<PhotoCategory, "records">;

const CATEGORIES: { id: ArchiveCategory; label: string; blurb: string; icon: typeof Plane }[] = [
  { id: "historic", label: "Historic Prints", blurb: "Archival prints from the College's beginnings, with their printed captions.", icon: ScrollText },
  { id: "chiefs", label: "Chiefs", blurb: "Official portraits supplied for the exhibition.", icon: Shield },
  { id: "bases", label: "Bases", blurb: "Locations across Nigeria recorded in the archive.", icon: MapPinned },
  { id: "aircraft", label: "Aircraft", blurb: "Aircraft photographs, including type reference images.", icon: Plane },
  { id: "college", label: "College", blurb: "Context images from across the Armed Forces Command and Staff College.", icon: Landmark },
  { id: "air-warfare", label: "Air Warfare", blurb: "The Department of Air Warfare at work.", icon: Users },
];

export const Route = createFileRoute("/_exhibit/archive")({
  validateSearch: (search: Record<string, unknown>): { c?: ArchiveCategory } => {
    const c = CATEGORIES.find((x) => x.id === search["c"]);
    return c ? { c: c.id } : {};
  },
  head: () =>
    pageHead("Photographic Archive", "Historic prints, chiefs, bases, aircraft, College and Air Warfare photographs from the Department's archive."),
  component: Archive,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function Archive() {
  const { c } = Route.useSearch();
  const delay = useEntranceDelay();
  const first = useFirstRender(1200);
  const [cat, setCat] = useState<ArchiveCategory>(c ?? "historic");
  const [lb, setLb] = useState<number | null>(null);
  const photos = useMemo(() => photosIn(cat), [cat]);
  const meta = CATEGORIES.find((x) => x.id === cat)!;
  const d = first ? delay + 0.2 : 0.15;

  useEffect(() => {
    if (c) setCat(c);
  }, [c]);

  const select = (id: ArchiveCategory) => {
    setLb(null);
    setCat(id);
  };

  return (
    <div className="relative flex h-full bg-ivory">
      {/* Category rail */}
      <motion.aside
        className="relative flex w-[23rem] shrink-0 flex-col border-r border-sand bg-paper px-[1.5rem] py-[2rem]"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay }}
      >
        <p className="eyebrow px-3 text-olive">Collections</p>
        <h2 className="mt-2 px-3 font-display text-[2.6rem] leading-tight text-navy">The Archive</h2>
        <div className="mt-[1.5rem] flex flex-col gap-[0.5rem]">
          {CATEGORIES.map((x, i) => {
            const on = x.id === cat;
            const Icon = x.icon;
            return (
              <motion.button
                key={x.id}
                onClick={() => select(x.id)}
                className={cn("relative flex h-[4.9rem] items-center gap-4 rounded-[0.9rem] px-4 text-left", on ? "text-on-dark" : "text-navy active:bg-sand/50")}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.15 + i * 0.06, duration: 0.5 }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={on}
              >
                {on && <motion.span layoutId="archive-cat" className="absolute inset-0 rounded-[0.9rem] bg-navy-gradient shadow-plate" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <span className={cn("relative flex size-[2.9rem] items-center justify-center rounded-full", on ? "bg-brass text-navy-deep" : "bg-sand/60 text-navy")}>
                  <Icon className="size-[1.4rem]" />
                </span>
                <span className="relative flex-1 text-[1.25rem] font-bold">{x.label}</span>
                <span className={cn("relative font-display text-[1.3rem] tabular-nums", on ? "text-brass-soft" : "text-muted-foreground")}>{photosIn(x.id).length}</span>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={cat}
            className="mt-auto px-3 text-[1.1rem] leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {meta.blurb}
          </motion.p>
        </AnimatePresence>
      </motion.aside>

      {/* Collection view */}
      <div className="relative min-w-0 flex-1 p-[2rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            className="flex h-full flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
          >
            <div className="mb-[1.25rem] flex items-end justify-between">
              <motion.h3
                className="font-display text-[3rem] leading-none text-navy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: d - 0.1 }}
              >
                {meta.label}
              </motion.h3>
              <span className="text-[1.1rem] font-semibold text-muted-foreground">
                {photos.length} photograph{photos.length === 1 ? "" : "s"} · tap any to enlarge
              </span>
            </div>
            <div className="min-h-0 flex-1">
              {cat === "aircraft" ? (
                <AircraftView photos={photos} onOpen={setLb} delay={d} />
              ) : cat === "bases" ? (
                <BasesView onOpen={(id) => setLb(photos.findIndex((p) => p.id === id))} delay={d} />
              ) : cat === "chiefs" ? (
                <ChiefsView photos={photos} onOpen={setLb} layoutPrefix={`arch-${cat}`} delay={d} />
              ) : (
                <WallView photos={photos} onOpen={setLb} layoutPrefix={`arch-${cat}`} delay={d} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Lightbox photos={photos} index={lb} onChange={setLb} collection={meta.label} layoutPrefix={`arch-${cat}`} />
    </div>
  );
}
