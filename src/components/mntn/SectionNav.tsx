import type { CSSProperties } from "react";

const SLIDES = [
  { label: "Start", href: "#top" },
  { label: "01", href: "#section-01" },
  { label: "02", href: "#section-02" },
  { label: "03", href: "#section-03" },
];

const delay = (s: string) => ({ "--d": `calc(var(--intro) + ${s})` }) as CSSProperties;

/*
 * Fixed section navigator (Figma "Slider"). Starts exactly where the design puts
 * it (80px from the right, aligned to the hero copy) and stays pinned while
 * scrolling. motion.ts moves the thumb with scroll progress between sections
 * and marks the active label (.is-active + aria-current).
 * Thumb steps are 60px, matching the 62px label rhythm (22px line + 40px gap).
 */
export const SectionNav = () => (
  <nav
    aria-label="Sections"
    data-reveal="intro"
    className="fixed right-20 top-[calc(var(--top)+39px)] z-20 hidden gap-8 xl:flex"
  >
    <ol className="flex flex-col items-end gap-10 pt-4 text-lg font-bold">
      {SLIDES.map((slide, i) => (
        <li key={slide.label} className="fx-up" style={delay(`${1.3 + i * 0.08}s`)}>
          <a href={slide.href} data-slide className="hover:text-accent">
            {slide.label}
          </a>
        </li>
      ))}
    </ol>
    <div className="fx-fade relative h-60 w-[3px] bg-foreground/50" style={delay("1.3s")}>
      <span data-slider-indicator className="absolute inset-x-0 top-0 h-[60px] bg-foreground" />
    </div>
  </nav>
);
