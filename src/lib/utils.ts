import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Index into a list that is known to contain the position (clamped for safety). */
export function at<T>(list: readonly T[], i: number): T {
  const v = list[Math.max(0, Math.min(list.length - 1, i))];
  if (v === undefined) throw new Error("at(): empty list");
  return v;
}
