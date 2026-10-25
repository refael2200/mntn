import { useEffect, useState, type CSSProperties } from "react";
import { Lock, Menu, X } from "lucide-react";
import { isAdminDevice } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { AccountIcon } from "./icons";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Equipment", href: "#section-02" },
  { label: "About us", href: "#" },
  { label: "Blog", href: "#" },
];

// Shown only on admin devices (see src/lib/admin.ts); the page itself is password-protected.
const ADMIN_LINK = { label: "Admin", href: "/admin" };

const delay = (s: string) => ({ "--d": `calc(var(--intro) + ${s})` }) as CSSProperties;

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => setIsAdmin(isAdminDevice()), []);

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
            {isAdmin && (
              <li className="fx-down" style={delay(`${0.6 + NAV_LINKS.length * 0.08}s`)}>
                <a href={ADMIN_LINK.href} className="fx-link flex items-center gap-2 text-accent hover:text-foreground">
                  <Lock aria-hidden className="size-4" />
                  {ADMIN_LINK.label}
                </a>
              </li>
            )}
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
          {isAdmin && (
            <li>
              <a
                href={ADMIN_LINK.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-3 text-accent hover:text-foreground"
              >
                <Lock aria-hidden className="size-4" />
                {ADMIN_LINK.label}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
