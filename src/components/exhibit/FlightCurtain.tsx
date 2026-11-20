import { AnimatePresence, motion } from "motion/react";

import { brand } from "@/data/media";
import { JetIcon } from "./JetIcon";
import { useExhibit } from "./ExhibitProvider";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Aircraft-led screen transition: a jet tows layered panels across the
 * display from right to left, announcing the next gallery, then clears it.
 */
export function FlightCurtain() {
  const { phase, label } = useExhibit();
  const active = phase !== "idle";
  const covering = phase === "cover";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="curtain"
          className="pointer-events-auto fixed inset-0 z-[90] overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.01 } }}
          aria-hidden="true"
        >
          {/* Lead layer — brass */}
          <motion.div
            className="absolute inset-0 bg-brass-soft"
            initial={{ x: "100%" }}
            animate={{ x: covering ? "0%" : "-100%" }}
            transition={{ duration: covering ? 0.46 : 0.6, ease: EASE, delay: covering ? 0 : 0.1 }}
          />
          {/* Main layer — navy, carrying the jet on its leading edge */}
          <motion.div
            className="absolute inset-0 bg-navy-gradient"
            initial={{ x: "100%" }}
            animate={{ x: covering ? "0%" : "-100%" }}
            transition={{ duration: covering ? 0.52 : 0.62, ease: EASE, delay: covering ? 0.05 : 0 }}
          >
            <div className="absolute inset-y-0 left-0 w-[0.25rem] bg-brass" />
            <div className="absolute left-0 top-1/2 -translate-x-[85%] -translate-y-1/2">
              <JetIcon className="w-[9rem] text-navy drop-shadow-[0_0.6rem_1rem_rgba(0,0,0,0.25)]" />
            </div>
            {/* Contrail lines */}
            <div className="absolute left-[3rem] top-[calc(50%-1.9rem)] h-px w-[60%] bg-gradient-to-r from-on-dark/50 to-transparent" />
            <div className="absolute left-[3rem] top-[calc(50%+1.9rem)] h-px w-[60%] bg-gradient-to-r from-on-dark/50 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-on-dark">
              <motion.img
                src={brand.logo}
                alt=""
                className="h-[6.5rem] w-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: covering ? 1 : 0, scale: covering ? 1 : 0.9 }}
                transition={{ duration: 0.35, delay: covering ? 0.25 : 0 }}
              />
              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: covering ? 1 : 0, y: covering ? 0 : -10 }}
                transition={{ duration: 0.35, delay: covering ? 0.3 : 0 }}
              >
                <span className="eyebrow text-brass-soft">Gallery {label.n}</span>
                <span className="font-display text-[3.5rem] leading-none">{label.title}</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
