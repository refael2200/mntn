/*
 * MNTN motion engine — dependency-free, framework-agnostic.
 *
 * Markup hooks (see src/styles/motion.css for the matching states):
 *   data-reveal            gets .is-in once it scrolls into view
 *   data-reveal="intro"    gets .is-in when the intro curtain lifts
 *   data-speed / -depth    hero layers: scroll parallax factor / mouse offset in px
 *   data-fade              fades out while scrolling through the hero
 *   data-drift             moves relative to the viewport centre (factor)
 *   data-magnetic          pulls toward the cursor
 *   data-header            fixed header: .is-scrolled / .is-hidden
 *   data-progress          scaleX scroll progress bar
 *   data-slider-indicator  section-nav thumb; a[data-slide] are its labels (href = section)
 *   data-split             plain text split into masked words (no-op if already split)
 *
 * Returns a cleanup function. Does nothing under prefers-reduced-motion.
 */

const LERP_SCROLL = 0.1;
const LERP_MOUSE = 0.06;
const LERP_CURSOR = 0.18;
const MAGNET_RADIUS = 90;
const MAGNET_STRENGTH = 0.35;
const INTRO_TIMEOUT = 2500;
const SPY_LINE = 0.45; // a section becomes active when its top crosses 45% of the viewport
const SLIDE_STEP = 60; // px between section-nav labels

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone !== undefined) return;
  const raw = el.dataset.splitDelay ?? "0";
  const delay = Number.isNaN(Number(raw)) ? raw : `${raw}s`;
  const words = (el.textContent ?? "").trim().split(/\s+/);
  el.textContent = "";
  words.forEach((word, i) => {
    const outer = document.createElement("span");
    outer.className = "word";
    const inner = document.createElement("span");
    inner.className = "word-inner";
    inner.style.setProperty("--i", String(i));
    inner.style.setProperty("--d", delay);
    inner.textContent = word;
    outer.appendChild(inner);
    el.appendChild(outer);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  el.dataset.splitDone = "";
}

export function initMotion(root: HTMLElement): () => void {
  const html = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    html.classList.remove("motion");
    return () => {};
  }
  html.classList.add("motion");

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const disposers: Array<() => void> = [];
  const listen = <K extends keyof WindowEventMap>(
    type: K,
    fn: (e: WindowEventMap[K]) => void,
    opts?: AddEventListenerOptions,
  ) => {
    window.addEventListener(type, fn, opts);
    disposers.push(() => window.removeEventListener(type, fn, opts));
  };

  root.querySelectorAll<HTMLElement>("[data-split]").forEach(splitWords);

  /* ---------- Intro: wait for hero art, then lift the curtain ---------- */
  const introEls = root.querySelectorAll<HTMLElement>('[data-reveal="intro"]');
  let introDone = false;
  const startIntro = () => {
    if (introDone) return;
    introDone = true;
    html.classList.add("is-loaded");
    introEls.forEach((el) => el.classList.add("is-in"));
  };
  const heroImgs = [...root.querySelectorAll<HTMLImageElement>("img[data-speed]")];
  Promise.all(heroImgs.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {})))).then(
    () => requestAnimationFrame(startIntro),
  );
  const introTimer = window.setTimeout(startIntro, INTRO_TIMEOUT);
  disposers.push(() => window.clearTimeout(introTimer));

  /* ---------- Scroll reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
  );
  root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="intro"])').forEach((el) => io.observe(el));
  disposers.push(() => io.disconnect());

  /* ---------- Pointer ---------- */
  let tmx = 0;
  let tmy = 0;
  let px = window.innerWidth / 2;
  let py = window.innerHeight / 2;
  let pointerSeen = false;

  let dot: HTMLDivElement | null = null;
  let ring: HTMLDivElement | null = null;
  let rx = px;
  let ry = py;

  if (finePointer) {
    dot = document.createElement("div");
    dot.className = "cursor-dot cursor-hidden";
    ring = document.createElement("div");
    ring.className = "cursor-ring cursor-hidden";
    document.body.append(dot, ring);
    html.classList.add("has-cursor");
    disposers.push(() => {
      dot?.remove();
      ring?.remove();
      html.classList.remove("has-cursor");
    });

    listen("pointermove", (e) => {
      px = e.clientX;
      py = e.clientY;
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!pointerSeen) {
        pointerSeen = true;
        rx = px;
        ry = py;
        dot?.classList.remove("cursor-hidden");
        ring?.classList.remove("cursor-hidden");
      }
      const interactive = (e.target as Element | null)?.closest?.("a, button, [data-cursor]");
      ring?.classList.toggle("is-hover", Boolean(interactive));
    });
    listen("pointerdown", () => ring?.classList.add("is-down"));
    listen("pointerup", () => ring?.classList.remove("is-down"));
    const hide = () => {
      pointerSeen = false;
      dot?.classList.add("cursor-hidden");
      ring?.classList.add("cursor-hidden");
    };
    document.documentElement.addEventListener("pointerleave", hide);
    disposers.push(() => document.documentElement.removeEventListener("pointerleave", hide));
  }

  /* ---------- Per-frame loop ---------- */
  const hero = root.querySelector<HTMLElement>("#top");
  const layers = [...root.querySelectorAll<HTMLElement>("[data-speed]")].map((el) => ({
    el,
    speed: Number(el.dataset.speed),
    depth: finePointer ? Number(el.dataset.depth ?? 0) : 0,
  }));
  const fades = [...root.querySelectorAll<HTMLElement>("[data-fade]")];
  const drifts = [...root.querySelectorAll<HTMLElement>("[data-drift]")].map((el) => ({
    el,
    amount: Number(el.dataset.drift),
    img: el.tagName === "IMG",
  }));
  const magnets = finePointer
    ? [...root.querySelectorAll<HTMLElement>("[data-magnetic]")].map((el) => ({ el, x: 0, y: 0 }))
    : [];
  const header = root.querySelector<HTMLElement>("[data-header]");
  const progress = root.querySelector<HTMLElement>("[data-progress]");
  const indicator = root.querySelector<HTMLElement>("[data-slider-indicator]");
  const slides = [...root.querySelectorAll<HTMLAnchorElement>("a[data-slide]")];
  const slideTargets = slides.map((a) => document.querySelector<HTMLElement>(a.hash));

  let cy = window.scrollY;
  let mx = 0;
  let my = 0;
  let lastY = window.scrollY;
  let frame = 0;

  const tick = () => {
    const sy = window.scrollY;
    const vh = window.innerHeight;
    cy += (sy - cy) * LERP_SCROLL;
    if (Math.abs(sy - cy) < 0.1) cy = sy;
    mx += (tmx - mx) * LERP_MOUSE;
    my += (tmy - my) * LERP_MOUSE;

    const heroH = hero?.offsetHeight ?? vh;

    // Hero parallax (skipped once the hero is far off-screen)
    if (cy < heroH * 1.2) {
      for (const { el, speed, depth } of layers) {
        el.style.transform = `translate3d(${(mx * depth).toFixed(2)}px, ${(cy * speed + my * depth).toFixed(2)}px, 0)`;
      }
      const fade = 1 - clamp(cy / (vh * 0.55));
      for (const el of fades) el.style.opacity = fade.toFixed(3);

    }

    // Section nav: the thumb rests on the current section's label and glides to
    // the next one over the last quarter of the way there.
    if (indicator && slideTargets.length) {
      const maxScroll = document.documentElement.scrollHeight - vh;
      const anchors = slideTargets.map((t, i) =>
        i === 0 || !t ? 0 : Math.min(t.getBoundingClientRect().top + sy - vh * SPY_LINE, maxScroll),
      );
      let k = 0;
      while (k < anchors.length - 1 && cy >= anchors[k + 1]) k++;
      let pos = k;
      if (k < anchors.length - 1) {
        const t = clamp((cy - anchors[k]) / Math.max(1, anchors[k + 1] - anchors[k]));
        const e = clamp((t - 0.75) / 0.25);
        pos += e * e * (3 - 2 * e);
      }
      indicator.style.transform = `translate3d(0, ${(pos * SLIDE_STEP).toFixed(1)}px, 0)`;
      const active = Math.round(pos);
      slides.forEach((s, i) => {
        s.classList.toggle("is-active", i === active);
        if (i === active) s.setAttribute("aria-current", "location");
        else s.removeAttribute("aria-current");
      });
    }

    // Viewport-relative drift (section photos & numbers)
    for (const { el, amount, img } of drifts) {
      const box = (img ? el.parentElement : el)!.getBoundingClientRect();
      if (box.bottom < -200 || box.top > vh + 200) continue;
      let t = (box.top + box.height / 2 - vh / 2) * amount;
      if (img) t = clamp(t, -el.offsetHeight / 12, el.offsetHeight / 12);
      el.style.transform = `translate3d(0, ${t.toFixed(2)}px, 0)`;
    }

    // Magnetic elements
    for (const m of magnets) {
      const r = m.el.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const near = pointerSeen && Math.hypot(dx, dy) < MAGNET_RADIUS + Math.max(r.width, r.height) / 2;
      m.x += ((near ? dx * MAGNET_STRENGTH : 0) - m.x) * 0.15;
      m.y += ((near ? dy * MAGNET_STRENGTH : 0) - m.y) * 0.15;
      m.el.style.transform = `translate3d(${m.x.toFixed(2)}px, ${m.y.toFixed(2)}px, 0)`;
    }

    // Cursor
    if (dot && ring) {
      rx += (px - rx) * LERP_CURSOR;
      ry += (py - ry) * LERP_CURSOR;
      dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
    }

    // Header state
    if (header) {
      const menuOpen = header.querySelector('[aria-expanded="true"]') !== null;
      header.classList.toggle("is-scrolled", sy > 60);
      if (menuOpen || sy < 400 || sy < lastY - 4) header.classList.remove("is-hidden");
      else if (sy > lastY + 4) header.classList.add("is-hidden");
    }
    if (Math.abs(sy - lastY) > 4) lastY = sy;

    if (progress) {
      const max = document.documentElement.scrollHeight - vh;
      progress.style.transform = `scaleX(${max > 0 ? (sy / max).toFixed(4) : 0})`;
    }

    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  disposers.push(() => cancelAnimationFrame(frame));

  return () => {
    disposers.forEach((d) => d());
    html.classList.remove("is-loaded");
  };
}
