import type { SVGProps } from "react";

/** Top-view jet silhouette, nose pointing left. Used for transitions and markers. */
export function JetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 60" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M2 30 C10 26.5 28 25.2 46 25 L104 26 L116 21.5 L119 21.5 L115 29 L115 31 L119 38.5 L116 38.5 L104 34 L46 35 C28 34.8 10 33.5 2 30 Z" />
      <path d="M42 26 L72 3 L81 3 L68 26 Z" />
      <path d="M42 34 L72 57 L81 57 L68 34 Z" />
      <path d="M96 26.3 L107 13 L112.5 13 L107.5 27 Z" />
      <path d="M96 33.7 L107 47 L112.5 47 L107.5 33 Z" />
    </svg>
  );
}
