import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <a
    href="/"
    aria-label="MNTN home"
    className={cn("font-display text-[32px] font-bold leading-6 tracking-[0.01em] text-foreground", className)}
  >
    MNTN
  </a>
);
