import { motion } from "motion/react";

import type { Photo } from "@/data/media";
import { cn } from "@/lib/utils";

export function ContextTag({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.85rem] font-bold tracking-[0.06em] uppercase",
        dark ? "bg-navy-deep/70 text-brass-soft backdrop-blur" : "bg-brass/15 text-brass",
        className,
      )}
    >
      <span className="size-[0.45rem] rounded-full bg-current" /> Context image
    </span>
  );
}

/** A photograph mounted like an exhibition print, with optional caption. */
export function PhotoFrame({
  photo,
  className,
  imgClassName,
  caption = true,
  kenBurns,
  layoutId,
  onOpen,
}: {
  photo: Photo;
  className?: string;
  imgClassName?: string;
  caption?: boolean;
  kenBurns?: boolean;
  layoutId?: string | undefined;
  onOpen?: (() => void) | undefined;
}) {
  return (
    <figure className={cn("print-frame flex flex-col", className)}>
      <button
        onClick={onOpen}
        disabled={!onOpen}
        className="relative min-h-0 flex-1 overflow-hidden bg-muted disabled:cursor-default"
        aria-label={onOpen ? `Open photograph: ${photo.title}` : undefined}
      >
        <motion.div {...(layoutId ? { layoutId } : {})} className="absolute inset-0 overflow-hidden">
          <img
            src={photo.src}
            alt={photo.title}
            draggable={false}
            className={cn("h-full w-full object-cover", kenBurns && "animate-ken-burns", photo.lowRes && "object-contain", imgClassName)}
          />
        </motion.div>
        {photo.context && <ContextTag dark className="absolute left-3 top-3" />}
      </button>
      {caption && (
        <figcaption className="flex items-baseline justify-between gap-4 px-1 pt-3">
          <span className="truncate text-[1.05rem] font-semibold text-navy">{photo.title}</span>
          <span className="shrink-0 text-[0.95rem] text-muted-foreground">{photo.subtitle}</span>
        </figcaption>
      )}
    </figure>
  );
}
