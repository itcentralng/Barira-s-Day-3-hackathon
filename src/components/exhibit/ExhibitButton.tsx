import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const exhibitButton = cva(
  "pressable inline-flex select-none items-center justify-center gap-3 rounded-full font-semibold disabled:pointer-events-none disabled:opacity-35",
  {
    variants: {
      variant: {
        navy: "bg-navy text-on-dark shadow-plate active:bg-navy-deep",
        brass: "bg-brass text-navy-deep shadow-plate active:bg-brass-soft",
        ghost: "bg-transparent text-navy ring-1 ring-sand active:bg-sand/60",
        paper: "bg-paper text-navy shadow-plate ring-1 ring-sand/70 active:bg-sand/60",
        glass: "bg-on-dark/10 text-on-dark ring-1 ring-on-dark/25 backdrop-blur-md active:bg-on-dark/20",
      },
      size: {
        md: "h-[3.6rem] px-[1.6rem] text-[1.15rem]",
        lg: "h-[4.6rem] px-[2.4rem] text-[1.35rem]",
        icon: "size-[3.6rem] text-[1.15rem]",
        iconLg: "size-[4.6rem] text-[1.35rem]",
      },
    },
    defaultVariants: { variant: "paper", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof exhibitButton>;

export const ExhibitButton = forwardRef<HTMLButtonElement, Props>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(exhibitButton({ variant, size }), className)} {...props} />
));
ExhibitButton.displayName = "ExhibitButton";
