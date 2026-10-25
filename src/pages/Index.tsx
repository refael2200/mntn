import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { FeatureSection, type FeatureSectionProps } from "@/components/mntn/FeatureSection";
import { Footer } from "@/components/mntn/Footer";
import { Header } from "@/components/mntn/Header";
import { Hero } from "@/components/mntn/Hero";
import { SectionNav } from "@/components/mntn/SectionNav";
import { initMotion } from "@/lib/motion";
import "@/styles/motion.css";

const SECTIONS: FeatureSectionProps[] = [
  {
    id: "section-01",
    number: "01",
    tagline: "Get Started",
    title: "What level of hiker are you?",
    paragraphs: [
      "Determining what level of hiker you are can be an important tool when planning future hikes. This hiking level guide will help you plan hikes according to different hike ratings set by various websites like All Trails and Modern Hiker. What type of hiker are you – novice, moderate, advanced moderate, expert, or expert backpacker?",
    ],
    image: "/images/section-01.jpg",
    imageAlt: "Hiker walking a ridge trail above a mountain lake",
  },
  {
    id: "section-02",
    number: "02",
    tagline: "Hiking Essentials",
    title: "Picking the right Hiking Gear!",
    paragraphs: [
      "The nice thing about beginning hiking is that you don’t really need any special gear, you can probably get away with things you already have.",
      "Let’s start with clothing. A typical mistake hiking beginners make is wearing jeans and regular clothes, which will get heavy and chafe wif they get sweaty or wet.",
    ],
    image: "/images/section-02.jpg",
    imageAlt: "Hiker with a backpack standing on a rock overlooking mountains",
    reverse: true,
  },
  {
    id: "section-03",
    number: "03",
    tagline: "where you go is the key",
    title: "Understand Your Map & Timing",
    paragraphs: [
      "To start, print out the hiking guide and map. If it’s raining, throw them in a Zip-Lock bag. Read over the guide, study the map, and have a good idea of what to expect. I like to know what my next landmark is as I hike. For example, I’ll read the guide and know that say, in a mile, I make a right turn at the junction..",
    ],
    image: "/images/section-03.jpg",
    imageAlt: "Hand holding a compass above a green mountain valley",
  },
];

/*
 * Page-level scene variables (used by Hero and the overlap below it):
 *   --W  hero scene width (never narrower than 1100px, so the art crops instead of shrinking)
 *   --s  1 Figma px at the current scene width (scene / 1920)
 *   --x  horizontal scene offset — biased left so the hiker stays in view on phones
 *   --y  extra top room for the headline on small screens
 *   --top  hero copy offset (SectionNav aligns to it)
 *
 * From xl the content keeps ≥200px side gutters so the fixed SectionNav never overlaps it
 * (at 1920px the Figma 229px gutters are unchanged).
 */
const Index = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  // Layout effect so html.motion is set before first paint (no flash of un-hidden content).
  useLayoutEffect(() => (rootRef.current ? initMotion(rootRef.current) : undefined), []);

  return (
    <div ref={rootRef} className="relative min-h-[100dvh] overflow-x-clip bg-background text-foreground [container-type:inline-size] [--W:max(100cqw,1100px)] [--s:calc(var(--W)/1920)] [--x:calc((100cqw-var(--W))*0.3)] [--y:140px] md:[--y:80px] lg:[--y:max(0px,calc((1920px-100cqw)*0.12))] [--top:120px] lg:[--top:max(150px,calc(var(--s)*287))]">
      <div aria-hidden className="intro-curtain fixed inset-0 z-[60] hidden items-center justify-center bg-background">
        <span className="intro-logo font-display text-[clamp(3.5rem,9vw,7rem)] font-bold leading-none">
          {"MNTN".split("").map((char, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties}>
              {char}
            </span>
          ))}
        </span>
      </div>
      <div
        aria-hidden
        data-progress
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-accent"
      />
      <Header />
      <SectionNav />
      <Hero />
      <main className="relative z-10 mx-auto mt-[calc(var(--s)*-460)] flex w-[min(1462px,calc(100%-48px))] flex-col gap-[clamp(6rem,10.417cqw,12.5rem)] pb-[clamp(4rem,6.25cqw,7.5rem)] md:w-[min(1462px,calc(100%-96px))] lg:w-[min(1462px,calc(100%-160px))] xl:w-[min(1462px,calc(100%-400px))]">
        {SECTIONS.map((section) => (
          <FeatureSection key={section.id} {...section} />
        ))}
        <Footer />
      </main>
    </div>
  );
};

export default Index;
