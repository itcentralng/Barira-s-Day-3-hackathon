import type { PanInfo } from "motion/react";
import { useCallback, useRef } from "react";

/** Horizontal swipe detection for touchscreens; also suppresses the click that ends a swipe. */
export function useSwipe(onNext: () => void, onPrev: () => void, threshold = 80) {
  const last = useRef(0);
  const onPanEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const { x } = info.offset;
      if (Math.abs(x) < threshold || Math.abs(info.offset.y) > Math.abs(x)) return;
      last.current = Date.now();
      if (x < 0) onNext();
      else onPrev();
    },
    [onNext, onPrev, threshold],
  );
  const justSwiped = useCallback(() => Date.now() - last.current < 350, []);
  return { onPanEnd, justSwiped };
}
