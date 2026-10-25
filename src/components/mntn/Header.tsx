import { useState, type CSSProperties } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountIcon } from "./icons";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Equipment", href: "#section-02" },
  { label: "About us", href: "#" },
  { label: "Blog", href: "#" },
];

const delay = (s: string) => ({ "--d": `calc(var(--intro) + ${s})` }) as CSSProperties;

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-header
      data-reveal="intro"
      className="site-header fixed inset-x-0 top-6 z-30 px-6 md:px-12 lg:top-16 lg:px-20"
    >
      <div className="relative flex h-[25px] items-center justify-between">
        <div className="fx-down" style={delay("0.5s")}>
          <Logo />
        </div>

        <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <ul className="flex gap-10 text-lg font-bold">
            {NAV_LINKS.map((link, i) => (
              <li key={link.label} className="fx-down" style={delay(`${0.6 + i * 0.08}s`)}>
                <a href={link.href} className="fx-link hover:text-accent">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="fx-down flex items-center gap-4" style={delay("0.85s")}>
          <a
            href="#"
            data-magnetic
            className="flex items-center gap-2 text-[17px] font-bold transition-colors hover:text-accent"
          >
            <AccountIcon className="size-6" />
            <span className="hidden sm:inline">Account</span>
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden"
          >
            {open ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </div>

      <nav
        aria-label="Mobile"
        className={cn(
          "mt-6 border-t border-border bg-background/95 backdrop-blur lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <ul className="flex flex-col py-2 text-lg font-bold">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setOpen(false)} className="block py-3 hover:text-accent">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
