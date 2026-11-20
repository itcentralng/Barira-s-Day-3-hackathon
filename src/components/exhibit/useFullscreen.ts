import { useCallback, useEffect, useState, type RefObject } from "react";

export function useFullscreen(target: RefObject<HTMLElement | null>) {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setSupported(typeof document !== "undefined" && !!document.fullscreenEnabled);
    const onChange = () => setActive(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await target.current?.requestFullscreen();
    } catch {
      /* Fullscreen can be refused by the browser or kiosk policy. */
    }
  }, [target]);

  return { supported, active, toggle };
}
