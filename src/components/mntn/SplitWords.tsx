import { Fragment, type CSSProperties } from "react";

type SplitWordsProps = {
  text: string;
  /** Seconds before the first word starts (words then stagger by 70ms). */
  delay?: number | string;
};

/** Pre-split words for the masked reveal in motion.css (same markup as splitWords() in motion.ts). */
export const SplitWords = ({ text, delay = 0 }: SplitWordsProps) => {
  const words = text.split(" ");
  const d = typeof delay === "number" ? `${delay}s` : delay;
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word">
            <span className="word-inner" style={{ "--i": i, "--d": d } as CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
};
