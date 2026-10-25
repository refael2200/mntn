import type { CSSProperties } from "react";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "More on The Blog",
    links: ["About MNTN", "Contributors & Writers", "Write For Us", "Contact Us", "Privacy Policy"],
  },
  {
    title: "More on MNTN",
    links: ["The Team", "Jobs", "Press"],
  },
];

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const Copyright = ({ className }: { className?: string }) => (
  <p className={`fx-up text-lg font-medium leading-8 text-foreground/50 ${className ?? ""}`} style={delay(0.5)}>
    Copyright 2023 MNTN, Inc. Terms &amp; Privacy
  </p>
);

export const Footer = () => (
  <footer
    data-reveal
    className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:gap-x-[clamp(3rem,11.042cqw,13.25rem)] lg:gap-y-0"
  >
    <div className="flex flex-col justify-between sm:col-span-2 lg:col-span-1">
      <div className="fx-up flex flex-col gap-6">
        <Logo className="leading-[38px]" />
        <p className="max-w-[303px] text-lg font-bold leading-8">
          Get out there &amp; discover your next slope, mountain &amp; destination!
        </p>
      </div>
      <Copyright className="hidden lg:block" />
    </div>

    {COLUMNS.map((col, c) => (
      <nav key={col.title} aria-label={col.title}>
        <h3 className="fx-up text-2xl font-bold leading-8 text-accent" style={delay(0.1 + c * 0.1)}>
          {col.title}
        </h3>
        <ul className="mt-6 flex flex-col gap-4">
          {col.links.map((link, i) => (
            <li key={link} className="fx-up" style={delay(0.15 + c * 0.1 + i * 0.05)}>
              <a href="#" className="fx-link text-lg font-medium leading-8 hover:text-accent">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    ))}

    <Copyright className="sm:col-span-2 lg:hidden" />
  </footer>
);
