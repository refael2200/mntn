# MNTN — Hiking Guide Landing Page

Pixel-perfect, responsive build of the [MNTN Figma community design](https://www.figma.com/design/BzX0Lh8kaBy2urFaFUoled/MNTN---Landing-Page--Community-?node-id=1-2), in Lovable's native stack (React + TypeScript + Tailwind + shadcn conventions), with award-style motion.

## Structure

| Path | What |
| --- | --- |
| `src/pages/Index.tsx` | Page — composes the sections, starts the motion engine |
| `src/components/mntn/` | Header, Hero (3-layer parallax), SectionNav (fixed), FeatureSection, Footer, Tagline, Logo, SplitWords, icons |
| `src/lib/motion.ts` | Dependency-free motion engine (intro, parallax, reveals, cursor, scroll-spy) |
| `src/styles/motion.css` | Motion states (all disabled under `prefers-reduced-motion`) |
| `src/index.css`, `tailwind.config.ts` | Design tokens as HSL CSS variables |
| `public/images/` | Assets exported from Figma |
| `index.html` | Standalone preview — open it directly in a browser (needs internet for Tailwind CDN + Google Fonts) |

## Newsletter + admin (Supabase)

- Supabase project `mntn` (`pgcbuflfvkfirfiyiamr`, eu-central-1). Client in `src/integrations/supabase/client.ts` (needs `@supabase/supabase-js`).
- Table `public.newsletter_signups` (name, email, created_at). Row-level security lets the public key **insert only** — visitors can't read the list. Emails are unique (case-insensitive); a repeat sign-up shows "already on the trail".
- Admin page: `admin.html` (static site) / `src/pages/Admin.tsx` (register it at `/admin` in your router). Marked `noindex`.
- An **Admin** link appears in the site menu only on admin devices: browsers where someone signed in to the admin page, or opened the site once with `?admin`. It's a convenience only (a `localStorage` flag, see `src/lib/admin.ts`); the password is what protects the data.
- The password is checked inside Postgres by `public.admin_list_signups(p_password)` against a bcrypt hash in `private.admin_settings` — it is never in the site's code. To change it, run in the Supabase SQL editor:

  ```sql
  update private.admin_settings
  set password_hash = extensions.crypt('your-new-password', extensions.gen_salt('bf'));
  ```

## Notes

- Fonts: Figma uses Gilroy + Chronicle Display (commercial). The build uses Plus Jakarta Sans + Source Serif 4 from Google Fonts — swap them in `tailwind.config.ts` if you have the licenses.
- Uses `lucide-react`, `clsx` and `tailwind-merge` (`cn()` in `src/lib/utils.ts`), all part of the default Lovable template.
- `index.html` contains inlined copies of `motion.css` / `motion.ts` — keep them in sync when editing.
