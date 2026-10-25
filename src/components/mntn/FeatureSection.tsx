import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "./icons";
import { SplitWords } from "./SplitWords";
import { Tagline } from "./Tagline";

export type FeatureSectionProps = {
  id: string;
  number: string;
  tagline: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  /** Image on the left (desktop). */
  reverse?: boolean;
};

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/*
 * Figma: 1462×720 row — 566px photo + 896px text column. The text block is
 * 782px wide (number at 0, copy at 150px) and hugs the far side from the photo.
 * Percentages below are those pixel values relative to their parent.
 *
 * Motion: the photo wipes up and zooms out, then drifts inside its frame; the
 * text block reveals line-by-line when it enters the viewport.
 */
export const FeatureSection = ({
  id,
  number,
  tagline,
  title,
  paragraphs,
  image,
  imageAlt,
  reverse = false,
}: FeatureSectionProps) => (
  <article
    id={id}
    className={cn(
      "grid scroll-mt-24 items-center gap-10 lg:gap-0",
      reverse ? "lg:grid-cols-[38.714fr_61.286fr]" : "lg:grid-cols-[61.286fr_38.714fr]",
    )}
  >
    <div data-reveal data-cursor>
      <div className="fx-img relative aspect-[566/720] w-full overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          data-drift="-0.08"
          className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
        />
      </div>
    </div>

    <div
      data-reveal
      className={cn(
        "relative pt-14 lg:w-[87.277%] lg:pl-[19.182%] lg:pt-0",
        reverse ? "lg:justify-self-end" : "lg:-order-1",
      )}
    >
      <span
        aria-hidden
        data-drift="0.12"
        className="pointer-events-none absolute left-0 top-0 select-none text-[clamp(7.5rem,12.5cqw,15rem)] font-bold leading-none text-foreground/10 lg:-top-[0.4292em]"
      >
        <span className="fx-num block">{number}</span>
      </span>
      <div className="relative flex flex-col gap-6 lg:gap-[27px]">
        <Tagline delay="0.1s">{tagline}</Tagline>
        <h2 className="max-w-[8.67em] font-display text-[clamp(2.25rem,3.3334cqw,4rem)] font-semibold leading-[1.2]">
          <SplitWords text={title} delay={0.25} />
        </h2>
        <div className="fx-up max-w-[632px] text-base font-bold leading-7 sm:text-lg sm:leading-8" style={delay(0.55)}>
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <a
          href="#"
          data-magnetic
          className="fx-up group inline-flex w-fit items-center gap-4 text-lg font-bold text-accent"
          style={delay(0.7)}
        >
          <span className="fx-link">read more</span>
          <ArrowRightIcon className="h-4 w-6 transition-transform duration-500 group-hover:translate-x-1.5" />
        </a>
      </div>
    </div>
  </article>
);
