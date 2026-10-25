import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TaglineProps = {
  children: ReactNode;
  className?: string;
  /** Reveal delay (CSS time) for the line-draw / letter-spacing animation. */
  delay?: string;
};

/** Accent line + spaced uppercase label ("— A HIKING GUIDE"). */
export const Tagline = ({ children, className, delay = "0s" }: TaglineProps) => (
  <p
    className={cn(
      "flex items-center gap-4 text-sm font-extrabold uppercase leading-[22px] tracking-[0.3333em] text-accent sm:gap-6 sm:text-lg",
      className,
    )}
    style={{ "--d": delay } as CSSProperties}
  >
    <span aria-hidden className="fx-line h-0.5 w-12 shrink-0 bg-accent sm:w-[72px]" />
    <span className="fx-track">{children}</span>
  </p>
);
