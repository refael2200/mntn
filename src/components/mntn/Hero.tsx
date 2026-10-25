import type { CSSProperties } from "react";
import { ArrowDownIcon, InstagramIcon, TwitterIcon } from "./icons";
import { SplitWords } from "./SplitWords";
import { Tagline } from "./Tagline";

/*
 * Parallax-style hero built from the three Figma layers (HG / MG / VG).
 * Scene coordinates come straight from the 1920px frame and are scaled by
 * --s (= scene width / 1920), defined on the page root in Index.tsx. Each layer
 * keeps its exact aspect ratio; on narrow screens the scene stays ≥1100px wide
 * and is cropped from the sides instead of shrinking.
 *
 * Motion (src/lib/motion.ts): data-speed = scroll parallax, data-depth = mouse
 * offset in px. The title sits under MG, so the mountains rise over it on scroll.
 * --top (hero copy offset) is defined on the page root, shared with SectionNav.
 */
const layer = "pointer-events-none absolute left-[var(--x)] w-[var(--W)] max-w-none select-none";
const after = (s: string) => `calc(var(--intro) + ${s})`;
const delay = (s: string) => ({ "--d": after(s) }) as CSSProperties;

export const Hero = () => (
  <section
    id="top"
    className="relative h-[calc(var(--s)*1900+var(--y))] overflow-hidden"
  >
    {/* HG — sky & far mountains */}
    <img
      src="/images/hero-bg.png"
      alt=""
      data-speed="0.5"
      data-depth="10"
      className={`${layer} fx-hero-bg top-[calc(var(--y)+var(--s)*-400)] h-[calc(var(--s)*1513)]`}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--s)*1200+var(--y))] bg-[linear-gradient(-19.67deg,hsl(var(--background)/0)_31.055%,hsl(var(--background))_108.93%)]"
    />

    <div
      data-reveal="intro"
      data-speed="0.35"
      data-depth="-8"
      data-fade
      className="absolute inset-x-0 top-[var(--top)] px-6 md:px-12 lg:left-[26.04%] lg:right-auto lg:px-0"
    >
      <Tagline className="lg:gap-8" delay={after("0.35s")}>
        A Hiking guide
      </Tagline>
      <h1 className="mt-6 max-w-[10.8em] font-display text-[clamp(2.5rem,4.5834cqw,5.5rem)] font-semibold capitalize leading-[1.1364] lg:mt-8">
        <SplitWords text="Be prepared for the Mountains and beyond!" delay={after("0.45s")} />
      </h1>
      <a
        href="#section-01"
        data-magnetic
        className="fx-up mt-6 inline-flex items-center gap-4 text-lg font-bold transition-colors hover:text-accent lg:mt-8"
        style={delay("1.2s")}
      >
        scroll down
        <ArrowDownIcon className="fx-bounce h-6 w-4" />
      </a>
    </div>

    {/* MG — hiker & mid mountains, VG — foreground grass */}
    <img
      src="/images/hero-mg.png"
      alt=""
      data-speed="0.25"
      data-depth="22"
      className={`${layer} fx-hero-mg top-[calc(var(--y)+var(--s)*464)] h-[calc(var(--s)*1422)]`}
    />
    <img
      src="/images/hero-vg.png"
      alt=""
      data-speed="0.1"
      data-depth="36"
      className={`${layer} fx-hero-vg top-[calc(var(--y)+var(--s)*768)] h-[calc(var(--s)*926)]`}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[calc(var(--y)+var(--s)*1200)] h-[calc(var(--s)*700)] bg-gradient-to-b from-background/0 to-background to-[61.384%]"
    />

    {/* Social rail */}
    <div
      data-reveal="intro"
      data-fade
      className="absolute left-20 top-[calc(var(--top)+72px)] z-10 hidden w-6 flex-col items-center gap-6 lg:flex"
    >
      <span className="fx-up text-lg font-bold [writing-mode:vertical-rl]" style={delay("1.3s")}>
        Follow us
      </span>
      <a
        href="#"
        aria-label="Instagram"
        data-magnetic
        className="fx-up transition-colors hover:text-accent"
        style={delay("1.4s")}
      >
        <InstagramIcon className="size-6" />
      </a>
      <a
        href="#"
        aria-label="Twitter"
        data-magnetic
        className="fx-up transition-colors hover:text-accent"
        style={delay("1.5s")}
      >
        <TwitterIcon className="size-6" />
      </a>
    </div>
  </section>
);
