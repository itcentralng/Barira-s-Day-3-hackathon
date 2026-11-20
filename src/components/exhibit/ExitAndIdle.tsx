import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { brand } from "@/data/media";
import { Modal } from "./Modal";
import { useExhibit, useIdleReturn } from "./ExhibitProvider";
import { ExhibitButton } from "./ExhibitButton";

const IDLE_MS = 150_000;
const IDLE_COUNTDOWN = 15;

/** Exit confirmation, kiosk standby screen and idle reset, mounted once at the root. */
export function ExitAndIdle() {
  const { exitOpen, cancelExit, go } = useExhibit();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [standby, setStandby] = useState(false);
  const [idlePrompt, setIdlePrompt] = useState(false);
  const [count, setCount] = useState(IDLE_COUNTDOWN);
  const onWelcome = pathname === "/";

  const confirmExit = () => {
    cancelExit();
    if (onWelcome) {
      // Browsers only let scripts close windows they opened themselves; try, then rest on standby.
      try {
        window.close();
      } catch {
        /* ignored */
      }
      setStandby(true);
    } else {
      go("/", { resetHistory: true });
    }
  };

  const onIdle = useCallback(() => {
    setCount(IDLE_COUNTDOWN);
    setIdlePrompt(true);
  }, []);
  useIdleReturn(IDLE_MS, onIdle);

  useEffect(() => {
    if (!idlePrompt) return;
    if (count <= 0) {
      setIdlePrompt(false);
      go("/", { resetHistory: true });
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [idlePrompt, count, go]);

  return (
    <>
      <Modal open={exitOpen} onClose={cancelExit} labelledBy="exit-title">
        <div className="flex flex-col gap-6 p-[2.75rem]">
          <div className="flex items-center gap-5">
            <img src={brand.logo} alt="AFCSC logo" className="h-[4.5rem] w-auto" />
            <div>
              <p className="eyebrow text-olive">Close experience</p>
              <h2 id="exit-title" className="font-display text-[2.4rem] leading-tight text-navy">
                Leave the History Experience?
              </h2>
            </div>
          </div>
          <p className="text-[1.3rem] leading-relaxed text-muted-foreground">
            {onWelcome
              ? "The exhibition will close and the display will rest on the standby screen for the kiosk host. A browser window can't always close itself, so the standby screen stays visible."
              : "Your visit will end and the display will return to the welcome screen for the next visitor."}
          </p>
          <div className="flex justify-end gap-4">
            <ExhibitButton variant="ghost" onClick={cancelExit}>
              Keep exploring
            </ExhibitButton>
            <ExhibitButton variant="navy" onClick={confirmExit} data-autofocus>
              <LogOut className="size-[1.4rem]" />
              {onWelcome ? "Close experience" : "Return to welcome"}
            </ExhibitButton>
          </div>
        </div>
      </Modal>

      <Modal open={idlePrompt} onClose={() => setIdlePrompt(false)} labelledBy="idle-title">
        <div className="flex flex-col items-center gap-5 p-[2.75rem] text-center">
          <p className="eyebrow text-olive">Still exploring?</p>
          <h2 id="idle-title" className="font-display text-[2.4rem] text-navy">
            Returning to the welcome screen in {count}
          </h2>
          <ExhibitButton variant="navy" onClick={() => setIdlePrompt(false)} data-autofocus>
            Continue my visit
          </ExhibitButton>
        </div>
      </Modal>

      <AnimatePresence>
        {standby && (
          <motion.button
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-8 bg-sky-wash text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setStandby(false)}
            aria-label="Begin the History Experience again"
          >
            <motion.img
              src={brand.logo}
              alt="Armed Forces Command and Staff College logo"
              className="h-[13rem] w-auto"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="flex flex-col gap-3">
              <span className="eyebrow text-olive">Department of Air Warfare</span>
              <span className="font-display text-[3.2rem] text-navy">The History Experience is closed</span>
              <span className="text-[1.35rem] text-muted-foreground">Touch anywhere to begin again</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
