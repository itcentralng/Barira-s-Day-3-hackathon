import { useRouter, useRouterState } from "@tanstack/react-router";
import { useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { SECTIONS } from "@/data/history";
import { at } from "@/lib/utils";

export type CurtainPhase = "idle" | "cover" | "reveal";

type ExhibitContextValue = {
  phase: CurtainPhase;
  label: { n: string; title: string };
  /** Navigate with the flight-curtain transition. Accepts a full href, e.g. "/timeline?m=3". */
  go: (href: string, opts?: { fromBack?: boolean; resetHistory?: boolean }) => void;
  back: () => void;
  canGoBack: boolean;
  exitOpen: boolean;
  requestExit: () => void;
  cancelExit: () => void;
};

const ExhibitContext = createContext<ExhibitContextValue | null>(null);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function labelForPath(pathname: string): { n: string; title: string } {
  const s = SECTIONS.find((x) => pathname.startsWith(x.path));
  if (s) return { n: s.n, title: s.title };
  return { n: "01", title: "The History Experience" };
}

export function ExhibitProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<CurtainPhase>("idle");
  const [label, setLabel] = useState(labelForPath("/"));
  const [exitOpen, setExitOpen] = useState(false);
  const [historyDepth, setHistoryDepth] = useState(0);
  const stack = useRef<string[]>([]);
  const busy = useRef(false);

  const go = useCallback<ExhibitContextValue["go"]>(
    async (href, opts) => {
      if (busy.current) return;
      const loc = router.state.location;
      const current = loc.href;
      if (href === current) return;
      busy.current = true;
      const samePage = href.split("?")[0] === loc.pathname;
      if (opts?.resetHistory) stack.current = [];
      else if (!opts?.fromBack) stack.current.push(current);
      setHistoryDepth(stack.current.length);

      if (samePage) {
        await router.navigate({ href, replace: true });
        busy.current = false;
        return;
      }

      setLabel(labelForPath(href));
      setPhase("cover");
      await wait(reduce ? 120 : 560);
      await router.navigate({ href });
      setPhase("reveal");
      await wait(reduce ? 120 : 720);
      setPhase("idle");
      busy.current = false;
    },
    [router, reduce],
  );

  const back = useCallback(() => {
    const prev = stack.current.pop();
    setHistoryDepth(stack.current.length);
    if (prev) go(prev, { fromBack: true });
    else {
      // No in-exhibit history: step back to the previous gallery, or the welcome screen.
      const path = router.state.location.pathname;
      const idx = SECTIONS.findIndex((s) => path.startsWith(s.path));
      go(idx > 0 ? at(SECTIONS, idx - 1).path : "/", { fromBack: true });
    }
  }, [go, router]);

  const value = useMemo<ExhibitContextValue>(
    () => ({
      phase,
      label,
      go,
      back,
      canGoBack: historyDepth > 0,
      exitOpen,
      requestExit: () => setExitOpen(true),
      cancelExit: () => setExitOpen(false),
    }),
    [phase, label, go, back, historyDepth, exitOpen],
  );

  return <ExhibitContext.Provider value={value}>{children}</ExhibitContext.Provider>;
}

export function useExhibit() {
  const ctx = useContext(ExhibitContext);
  if (!ctx) throw new Error("useExhibit must be used inside ExhibitProvider");
  return ctx;
}

/**
 * Seconds to hold a screen's entrance choreography so it plays as the
 * flight curtain lifts. Captured once at mount.
 */
export function useEntranceDelay(): number {
  const { phase } = useExhibit();
  const ref = useRef<number | null>(null);
  if (ref.current === null) ref.current = phase === "idle" ? 0.05 : 0.32;
  return ref.current;
}

/** Return to the welcome screen after a period without any touch. */
export function useIdleReturn(timeoutMs: number, onIdle: () => void) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (pathname === "/") return;
    let t = setTimeout(onIdle, timeoutMs);
    const reset = () => {
      clearTimeout(t);
      t = setTimeout(onIdle, timeoutMs);
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [pathname, timeoutMs, onIdle]);
}
