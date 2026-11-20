import { animate, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef } from "react";

import { brand } from "@/data/media";

// The cut-out A-29 (from the supplied aircraft archive) points its nose at 157.5° in screen space.
const NOSE_ANGLE = 157.5;
const IMG_W = 1000;
const IMG_H = 572;

type Props = {
  path: string;
  duration: number;
  delay?: number;
  /** Seconds between repeat flypasts; omit for a single pass. */
  repeatEvery?: number;
  scale?: [number, number];
  opacity?: number;
  /** Draw a dotted contrail that follows the aircraft. */
  trail?: boolean;
  className?: string;
};

/** An aircraft from the archive flying along an SVG path in a 1920x1080 stage. */
export function FlightLayer({ path, duration, delay = 0, repeatEvery, scale = [0.4, 0.6], opacity = 1, trail, className }: Props) {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const maskId = useId().replace(/:/g, "");

  useEffect(() => {
    const p = pathRef.current;
    const plane = planeRef.current;
    if (!p || !plane) return;
    const L = p.getTotalLength();
    if (trailRef.current) {
      trailRef.current.style.strokeDasharray = `${L}`;
      trailRef.current.style.strokeDashoffset = `${L}`;
    }
    if (reduce) {
      plane.style.opacity = "0";
      if (trailRef.current) trailRef.current.style.strokeDashoffset = "0";
      return;
    }

    let stopped = false;
    let controls: ReturnType<typeof animate> | null = null;
    let timer: ReturnType<typeof setTimeout>;

    const fly = () => {
      if (stopped) return;
      plane.style.opacity = "1";
      controls = animate(0, 1, {
        duration,
        ease: [0.42, 0, 0.25, 1],
        onUpdate: (t) => {
          const at = t * L;
          const a = p.getPointAtLength(at);
          const b = p.getPointAtLength(Math.min(L, at + 2));
          const c = at + 2 > L ? p.getPointAtLength(Math.max(0, at - 2)) : a;
          const ang = (Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI;
          const s = scale[0] + (scale[1] - scale[0]) * Math.sin(Math.PI * t);
          plane.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang - NOSE_ANGLE}) scale(${s})`);
          if (trailRef.current) trailRef.current.style.strokeDashoffset = `${L * (1 - t)}`;
        },
        onComplete: () => {
          plane.style.opacity = "0";
          if (repeatEvery) timer = setTimeout(fly, repeatEvery * 1000);
        },
      });
    };
    timer = setTimeout(fly, delay * 1000);
    return () => {
      stopped = true;
      clearTimeout(timer);
      controls?.stop();
    };
  }, [duration, delay, repeatEvery, scale, reduce]);

  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
      aria-hidden="true"
    >
      <defs>
        <mask id={`m-${maskId}`}>
          <path ref={trailRef} d={path} fill="none" stroke="white" strokeWidth="12" />
        </mask>
      </defs>
      <path ref={pathRef} d={path} fill="none" stroke="none" />
      {trail && (
        <path
          d={path}
          fill="none"
          stroke="var(--brass)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 14"
          mask={`url(#m-${maskId})`}
          opacity="0.85"
        />
      )}
      <g opacity={opacity}>
        <g ref={planeRef} style={{ opacity: 0 }}>
          <image href={brand.flightCutout} x={-IMG_W / 2} y={-IMG_H / 2} width={IMG_W} height={IMG_H} />
        </g>
      </g>
    </svg>
  );
}
