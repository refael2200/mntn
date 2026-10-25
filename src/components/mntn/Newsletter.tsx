import { useState, type CSSProperties, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRightIcon } from "./icons";
import { SplitWords } from "./SplitWords";
import { Tagline } from "./Tagline";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const field =
  "h-auto rounded-none border-0 border-b-2 border-foreground/30 bg-transparent px-0 py-3 text-lg font-bold text-foreground md:text-lg shadow-none ring-offset-0 transition-colors placeholder:font-medium placeholder:text-foreground/35 focus-visible:border-accent focus-visible:ring-0 focus-visible:ring-offset-0";
const label = "text-sm font-extrabold uppercase tracking-[0.2em] text-foreground/60";

type Status = "idle" | "sending" | "joined" | "already" | "error";

/*
 * Newsletter sign-up, styled like the feature sections (tagline + serif title).
 * Saves to Supabase table newsletter_signups (insert-only for visitors; the
 * list is read on /admin through the password-checked admin_list_signups RPC).
 * A unique email (23505) means they're already subscribed — treated as success.
 */
export const Newsletter = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [firstName, setFirstName] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    setFirstName(name.split(" ")[0]);
    setStatus("sending");

    const { error } = await supabase.from("newsletter_signups").insert({ name, email });
    if (!error) setStatus("joined");
    else if (error.code === "23505") setStatus("already");
    else setStatus("error");
  };

  const done = status === "joined" || status === "already";

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-title"
      data-reveal
      className="grid scroll-mt-24 gap-12 border-t border-foreground/10 pt-[clamp(4rem,6.25cqw,7.5rem)] lg:grid-cols-2 lg:gap-x-[clamp(3rem,6.25cqw,7.5rem)]"
    >
      <div className="flex flex-col gap-6 lg:gap-[27px]">
        <Tagline delay="0.1s">Trail notes</Tagline>
        <h2
          id="newsletter-title"
          className="max-w-[9em] font-display text-[clamp(2.25rem,3.3334cqw,4rem)] font-semibold leading-[1.2]"
        >
          <SplitWords text="The mountains, delivered to your inbox." delay={0.25} />
        </h2>
      </div>

      <div className="flex flex-col gap-10">
        <p className="fx-up max-w-[560px] text-base font-bold leading-7 sm:text-lg sm:leading-8" style={delay(0.45)}>
          One letter a month: new trail guides, gear we actually trust, and the routes worth waking up early
          for. Written by hikers, for hikers.
        </p>

        {!done ? (
          <form onSubmit={handleSubmit} className="fx-up flex flex-col gap-8" style={delay(0.6)}>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="newsletter-name" className={label}>
                  Your name
                </Label>
                <Input
                  id="newsletter-name"
                  name="name"
                  autoComplete="given-name"
                  placeholder="First name"
                  required
                  className={field}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="newsletter-email" className={label}>
                  Email address
                </Label>
                <Input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className={field}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Button
                type="submit"
                disabled={status === "sending"}
                data-magnetic
                className="group h-14 w-fit gap-4 [&_svg]:size-auto rounded-none bg-accent px-8 text-lg font-bold text-accent-foreground hover:bg-foreground"
              >
                {status === "sending" ? "Joining…" : "Join the trail"}
                <ArrowRightIcon className="h-4 w-6 transition-transform duration-500 group-hover:translate-x-1.5" />
              </Button>
              <p className="text-sm font-medium leading-6 text-foreground/50">
                No spam, ever. Unsubscribe with one click.
              </p>
            </div>
            {status === "error" && (
              <p role="alert" className="text-base font-bold text-accent">
                The trail got a little rocky — please try again in a moment.
              </p>
            )}
          </form>
        ) : (
          <div role="status" className="flex flex-col gap-3 border-l-2 border-accent pl-6">
            <p className="font-display text-[clamp(1.75rem,2.2cqw,2.5rem)] font-semibold leading-tight">
              {status === "already" ? "You're already on the trail" : "Welcome to the trail"}
              {firstName ? `, ${firstName}` : ""}.
            </p>
            <p className="text-lg font-bold leading-8 text-foreground/70">
              {status === "already"
                ? "This email is already on our list — your next trail notes are on the way."
                : "You're on the list. Your first trail notes arrive with our next letter."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
