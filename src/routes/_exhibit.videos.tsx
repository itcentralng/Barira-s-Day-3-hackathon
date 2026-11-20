import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Maximize, Minimize, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ExhibitButton } from "@/components/exhibit/ExhibitButton";
import { useEntranceDelay } from "@/components/exhibit/ExhibitProvider";
import { useFullscreen } from "@/components/exhibit/useFullscreen";
import { FILM_CHAPTERS, FILM_OBJECTIVES } from "@/data/history";
import { film } from "@/data/media";
import { at, cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_exhibit/videos")({
  head: () => pageHead("Video Archive", "Watch the archive film on the birth of the Nigerian Air Force, chapter by chapter."),
  component: VideoArchive,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const FALLBACK_DURATION = 125;

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

function VideoArchive() {
  const delay = useEntranceDelay();
  const video = useRef<HTMLVideoElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const fs = useFullscreen(shell);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [controls, setControls] = useState(true);
  const [objectives, setObjectives] = useState(false);
  const [error, setError] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const chapterIdx = FILM_CHAPTERS.reduce((acc, c, i) => (time >= c.start - 0.05 ? i : acc), 0);
  const chapter = at(FILM_CHAPTERS, chapterIdx);

  const poke = useCallback(() => {
    setControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (video.current && !video.current.paused) setControls(false);
    }, 3200);
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  useEffect(() => {
    if (video.current) {
      video.current.volume = volume;
      video.current.muted = muted;
    }
  }, [volume, muted]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setError(true));
    else v.pause();
    poke();
  };

  const seek = (t: number, autoplay = false) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration - 0.1, t));
    setTime(v.currentTime);
    if (autoplay && v.paused) v.play().catch(() => setError(true));
    poke();
  };

  const toChapter = (i: number) => seek(at(FILM_CHAPTERS, i).start + 0.01, true);

  const scrubAt = (clientX: number) => {
    const r = bar.current?.getBoundingClientRect();
    if (!r) return;
    seek(((clientX - r.left) / r.width) * duration);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "ArrowRight") toChapter(chapterIdx + 1);
      if (e.key === "ArrowLeft") toChapter(chapterIdx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="relative flex h-full gap-[2.5rem] overflow-hidden bg-ivory px-[3rem] py-[2rem] text-on-dark">
      {/* House lights dim as the visitor enters the theatre */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-navy-deep"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_35%_45%,color-mix(in_oklab,var(--aviation)_45%,transparent),transparent)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: delay + 0.4 }}
      />

      {/* Theatre */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <motion.div
          className="flex items-end justify-between pb-[1.25rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: delay + 0.3 }}
        >
          <div>
            <p className="eyebrow text-brass-soft">Archive film · {fmt(duration)} · {FILM_CHAPTERS.length} chapters</p>
            <h2 className="mt-2 font-display text-[3.2rem] leading-none">The Birth of the Nigerian Air Force</h2>
          </div>
          <ExhibitButton variant="glass" onClick={() => setObjectives((o) => !o)} aria-expanded={objectives}>
            Founding objectives in the film
            <ChevronDown className={cn("size-[1.3rem] transition-transform", objectives && "rotate-180")} />
          </ExhibitButton>
        </motion.div>

        <motion.div
          ref={shell}
          className="relative min-h-0 flex-1 overflow-hidden rounded-[1rem] bg-navy-deep shadow-lift ring-1 ring-on-dark/10"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: delay + 0.45 }}
          onPointerMove={poke}
        >
          <video
            ref={video}
            src={film.src}
            poster={film.poster}
            preload="metadata"
            playsInline
            className="absolute inset-0 h-full w-full bg-navy-deep object-contain"
            onClick={toggle}
            onPlay={() => {
              setPlaying(true);
              poke();
            }}
            onPause={() => {
              setPlaying(false);
              setControls(true);
            }}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || FALLBACK_DURATION)}
            onError={() => setError(true)}
            onEnded={() => setControls(true)}
          />

          {/* Chapter title overlay */}
          <div className="pointer-events-none absolute left-[2rem] top-[1.5rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={chapterIdx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: controls || !playing ? 1 : 0, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="rounded-full bg-navy-deep/70 px-5 py-2.5 backdrop-blur"
              >
                <span className="font-display text-[1.3rem] text-brass-soft">{String(chapterIdx + 1).padStart(2, "0")}</span>
                <span className="ml-3 text-[1.15rem] font-semibold">{chapter.title}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Big play */}
          <AnimatePresence>
            {!playing && !error && (
              <motion.button
                className="absolute left-1/2 top-1/2 flex size-[8rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brass text-navy-deep shadow-lift"
                onClick={toggle}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Play film"
              >
                <span className="animate-pulse-ring absolute inset-0 rounded-full ring-4 ring-brass" />
                <Play className="ml-1 size-[3.2rem] fill-current" />
              </motion.button>
            )}
          </AnimatePresence>

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-deep/90 text-center">
              <p className="font-display text-[2rem]">The film could not be played</p>
              <p className="text-[1.15rem] text-on-dark-muted">File: birth.mp4 — please check the display's connection and try again.</p>
              <ExhibitButton variant="brass" onClick={() => { setError(false); video.current?.load(); }}>Try again</ExhibitButton>
            </div>
          )}

          {/* Controls */}
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/60 to-transparent px-[2rem] pb-[1.4rem] pt-[4rem]"
            animate={{ opacity: controls ? 1 : 0, y: controls ? 0 : 20 }}
            transition={{ duration: 0.35 }}
            style={{ pointerEvents: controls ? "auto" : "none" }}
          >
            <div
              ref={bar}
              className="relative h-[2.6rem] cursor-pointer touch-none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                scrubAt(e.clientX);
              }}
              onPointerMove={(e) => e.buttons && scrubAt(e.clientX)}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(time)}
            >
              <div className="absolute inset-x-0 top-1/2 h-[0.4rem] -translate-y-1/2 rounded-full bg-on-dark/20" />
              <div className="absolute left-0 top-1/2 h-[0.4rem] -translate-y-1/2 rounded-full bg-brass" style={{ width: `${(time / duration) * 100}%` }} />
              {FILM_CHAPTERS.map((c, i) =>
                i === 0 ? null : (
                  <span key={c.start} className="absolute top-1/2 h-[1.1rem] w-[3px] -translate-y-1/2 rounded-full bg-on-dark/70" style={{ left: `${(c.start / duration) * 100}%` }} />
                ),
              )}
              <span className="absolute top-1/2 size-[1.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-dark shadow-plate ring-4 ring-brass" style={{ left: `${(time / duration) * 100}%` }} />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <ExhibitButton variant="glass" size="icon" onClick={() => toChapter(chapterIdx - 1)} aria-label="Previous chapter">
                <SkipBack className="size-[1.4rem]" />
              </ExhibitButton>
              <ExhibitButton variant="brass" size="iconLg" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
                {playing ? <Pause className="size-[1.8rem] fill-current" /> : <Play className="ml-1 size-[1.8rem] fill-current" />}
              </ExhibitButton>
              <ExhibitButton variant="glass" size="icon" onClick={() => toChapter(chapterIdx + 1)} aria-label="Next chapter">
                <SkipForward className="size-[1.4rem]" />
              </ExhibitButton>
              <span className="ml-3 text-[1.2rem] font-semibold tabular-nums">
                {fmt(time)} <span className="text-on-dark-muted">/ {fmt(duration)}</span>
              </span>
              <div className="ml-auto flex items-center gap-3">
                <ExhibitButton variant="glass" size="icon" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"}>
                  {muted || volume === 0 ? <VolumeX className="size-[1.4rem]" /> : <Volume2 className="size-[1.4rem]" />}
                </ExhibitButton>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setMuted(Number(e.target.value) === 0);
                  }}
                  className="h-[0.4rem] w-[9rem] cursor-pointer accent-brass"
                  aria-label="Volume"
                />
                {fs.supported && (
                  <ExhibitButton variant="glass" size="icon" onClick={fs.toggle} aria-label={fs.active ? "Exit fullscreen" : "Fullscreen"}>
                    {fs.active ? <Minimize className="size-[1.4rem]" /> : <Maximize className="size-[1.4rem]" />}
                  </ExhibitButton>
                )}
              </div>
            </div>
          </motion.div>

          {/* Objectives drawer */}
          <AnimatePresence>
            {objectives && (
              <motion.div
                className="absolute inset-y-0 right-0 w-[34rem] overflow-y-auto bg-paper p-[2rem] text-ink shadow-lift"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 32 }}
              >
                <p className="eyebrow text-olive">As shown on screen · chapter 03</p>
                <h3 className="mt-2 font-display text-[2.2rem] leading-tight text-navy">The founding objectives</h3>
                <ol className="mt-5 flex flex-col gap-4">
                  {FILM_OBJECTIVES.map((o, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                    >
                      <span className="font-display text-[1.6rem] leading-none text-brass">{i + 1}</span>
                      <span className="text-[1.15rem] leading-relaxed">{o}</span>
                    </motion.li>
                  ))}
                </ol>
                <ExhibitButton className="mt-6" variant="navy" onClick={() => { setObjectives(false); toChapter(2); }}>
                  <Play className="size-[1.2rem] fill-current" /> Watch this chapter
                </ExhibitButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Chapters */}
      <motion.aside
        className="relative flex w-[30rem] shrink-0 flex-col"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: delay + 0.55 }}
      >
        <p className="eyebrow pb-[0.9rem] text-on-dark-muted">Chapters</p>
        <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-[0.6rem] overflow-y-auto">
          {FILM_CHAPTERS.map((c, i) => {
            const on = i === chapterIdx;
            const end = FILM_CHAPTERS[i + 1]?.start ?? duration;
            const prog = on ? Math.min(1, (time - c.start) / (end - c.start)) : i < chapterIdx ? 1 : 0;
            return (
              <motion.button
                key={c.start}
                onClick={() => toChapter(i)}
                className={cn("relative flex shrink-0 items-center gap-4 overflow-hidden rounded-[0.8rem] p-[0.55rem] text-left transition-colors", on ? "bg-on-dark/12 ring-1 ring-brass/70" : "active:bg-on-dark/10")}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.65 + i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                aria-current={on ? "true" : undefined}
              >
                <span className="relative h-[4.4rem] w-[7.8rem] shrink-0 overflow-hidden rounded-[0.5rem]">
                  <img src={film.chapterThumb(c.thumb)} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
                  {on && playing && <span className="absolute inset-0 flex items-center justify-center bg-navy-deep/40"><span className="size-[0.7rem] animate-pulse rounded-full bg-brass" /></span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-[1.05rem] text-brass-soft tabular-nums">{fmt(c.start)}</span>
                    <span className="truncate text-[1.1rem] font-bold">{c.title}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[0.9rem] leading-snug text-on-dark-muted">{c.caption}</span>
                </span>
                <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-brass" style={{ transform: `scaleX(${prog})` }} />
              </motion.button>
            );
          })}
        </div>
      </motion.aside>
    </div>
  );
}
