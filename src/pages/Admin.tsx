import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Download, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/mntn/Logo";
import { Tagline } from "@/components/mntn/Tagline";
import { supabase, type NewsletterSignup } from "@/integrations/supabase/client";

/*
 * Hidden admin page (/admin, not linked anywhere, noindex).
 * The password is verified inside Postgres by admin_list_signups (bcrypt hash in
 * private.admin_settings), so it never ships in the site's code. The password is
 * kept in sessionStorage only for the current tab session.
 * Change it with: update private.admin_settings set password_hash = extensions.crypt('new', extensions.gen_salt('bf'));
 */
const SESSION_KEY = "mntn-admin-pass";

const dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};
const writeSession = (value: string | null) => {
  try {
    if (value) sessionStorage.setItem(SESSION_KEY, value);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable — stay signed in for this render only */
  }
};

const toCsv = (rows: NewsletterSignup[]) => {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [
    "Name,Email,Signed up",
    ...rows.map((r) => [cell(r.name), cell(r.email), cell(new Date(r.created_at).toISOString())].join(",")),
  ].join("\n");
};

const field =
  "h-auto rounded-none border-0 border-b-2 border-foreground/30 bg-transparent px-0 py-3 text-lg font-bold text-foreground md:text-lg shadow-none ring-offset-0 placeholder:font-medium placeholder:text-foreground/35 focus-visible:border-accent focus-visible:ring-0 focus-visible:ring-offset-0";

const Admin = () => {
  const [password, setPassword] = useState<string | null>(readSession);
  const [rows, setRows] = useState<NewsletterSignup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "Admin · MNTN";
    return () => meta.remove();
  }, []);

  const load = useCallback(async (pass: string) => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("admin_list_signups", { p_password: pass });
    setLoading(false);
    if (rpcError) {
      writeSession(null);
      setPassword(null);
      setRows(null);
      setError(rpcError.code === "28P01" ? "Wrong password. Try again." : "Couldn't reach the database. Try again.");
      return;
    }
    writeSession(pass);
    setPassword(pass);
    setRows((data ?? []) as NewsletterSignup[]);
  }, []);

  useEffect(() => {
    const saved = readSession();
    if (saved) void load(saved);
  }, [load]);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void load(String(new FormData(e.currentTarget).get("password") ?? ""));
  };

  const lock = () => {
    writeSession(null);
    setPassword(null);
    setRows(null);
  };

  const exportCsv = () => {
    if (!rows) return;
    const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `mntn-subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const signedIn = password !== null && rows !== null;

  return (
    <div className="min-h-[100dvh] bg-background px-6 py-6 text-foreground md:px-12 lg:px-20 lg:py-16">
      <header className="flex h-[25px] items-center justify-between">
        <Logo />
        {signedIn && (
          <button type="button" onClick={lock} className="flex items-center gap-2 text-[17px] font-bold hover:text-accent">
            <Lock className="size-5" />
            Lock
          </button>
        )}
      </header>

      {!signedIn ? (
        <main className="mx-auto flex max-w-md flex-col gap-8 pt-[18vh]">
          <Tagline>Admin</Tagline>
          <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.2]">Base camp</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <Label htmlFor="admin-password" className="text-sm font-extrabold uppercase tracking-[0.2em] text-foreground/60">
                Password
              </Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                className={field}
              />
            </div>
            {error && (
              <p role="alert" className="text-base font-bold text-accent">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-fit rounded-none bg-accent px-8 text-lg font-bold text-accent-foreground hover:bg-foreground"
            >
              {loading ? "Checking…" : "Enter"}
            </Button>
          </form>
        </main>
      ) : (
        <main className="mx-auto flex max-w-[1462px] flex-col gap-10 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-6">
              <Tagline>Trail notes</Tagline>
              <h1 className="font-display text-[clamp(2.25rem,4vw,4rem)] font-semibold leading-[1.2]">
                {rows.length} {rows.length === 1 ? "subscriber" : "subscribers"}
              </h1>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => password && load(password)}
                disabled={loading}
                className="h-12 gap-2 rounded-none border-foreground/30 bg-transparent px-5 text-base font-bold hover:border-accent hover:bg-transparent hover:text-accent"
              >
                <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
                Refresh
              </Button>
              <Button
                type="button"
                onClick={exportCsv}
                disabled={rows.length === 0}
                className="h-12 gap-2 rounded-none bg-accent px-5 text-base font-bold text-accent-foreground hover:bg-foreground"
              >
                <Download className="size-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {rows.length === 0 ? (
            <p className="border-t border-foreground/10 pt-10 text-lg font-bold text-foreground/60">
              No sign-ups yet. They'll appear here as soon as someone joins from the site.
            </p>
          ) : (
            <div className="overflow-x-auto border-t border-foreground/10">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="text-sm font-extrabold uppercase tracking-[0.2em] text-foreground/60">
                    <th className="py-4 pr-6 font-extrabold">Name</th>
                    <th className="py-4 pr-6 font-extrabold">Email</th>
                    <th className="py-4 font-extrabold">Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-foreground/10 text-lg font-bold">
                      <td className="py-4 pr-6">{r.name}</td>
                      <td className="py-4 pr-6">
                        <a href={`mailto:${r.email}`} className="text-accent hover:underline">
                          {r.email}
                        </a>
                      </td>
                      <td className="py-4 font-medium text-foreground/60">{dateFmt.format(new Date(r.created_at))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default Admin;
