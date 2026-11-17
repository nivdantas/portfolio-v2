"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { galleryPosition } from "@/lib/gallery";
import { play } from "@/lib/sound";

export default function WorkGallery({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const t = useTranslations("Gallery");

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.ResizeObserver) return;
    const stage = root.querySelector<HTMLElement>(".gallery-stage")!;
    const track = root.querySelector<HTMLElement>(".gallery-track")!;
    const panels = Array.from(
      track.querySelectorAll<HTMLElement>("[data-gallery-panel]"),
    );
    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>(".gallery-index a"),
    );
    const wide = window.matchMedia(
      "(min-width: 1100px) and (min-height: 760px)",
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    let frame = 0;
    let layoutFrame = 0;
    let start = 0;
    let offsets = [0];
    let panelHeight = 0;
    let active = -1;
    let disposed = false;
    let indexFocus = false;

    // Each scene's moving parts, written to directly: custom properties would
    // restyle every descendant of a card on every frame.
    const parts = panels.map((panel) => ({
      panel,
      visual: panel.querySelector<HTMLElement>(".project-visual"),
      copy: panel.querySelector<HTMLElement>(".project-copy .panel-content"),
      last: "",
    }));
    const bar = root.querySelector<HTMLElement>(".gallery-progress span");
    let current = 0;
    let lastTime = 0;
    let snap = true;

    const clearCards = () => {
      parts.forEach((part) => {
        part.last = "";
        [part.panel, part.visual, part.copy].forEach((element) => {
          element?.style.removeProperty("transform");
          element?.style.removeProperty("opacity");
        });
        part.panel.style.removeProperty("z-index");
      });
      bar?.style.removeProperty("transform");
    };

    const instantScroll = (top: number) =>
      window.scrollTo({ top, behavior: "instant" });
    const apply = (distance: number) => {
      const position = galleryPosition(distance, offsets, panelHeight);
      position.cards.forEach((card, index) => {
        const part = parts[index];
        const key = `${card.y.toFixed(2)}|${card.scale.toFixed(4)}`;
        if (key === part.last) return;
        part.last = key;
        part.panel.style.transform = `translate3d(0,${card.y.toFixed(2)}px,0) scale(${card.scale.toFixed(4)})`;
        part.panel.style.opacity = card.opacity.toFixed(3);
        part.panel.style.zIndex = String(index + 1);
        // Depth inside an arriving card: study and copy settle at different rates.
        if (part.visual)
          part.visual.style.transform = `translate3d(0,${((1 - card.enter) * 96).toFixed(2)}px,0) scale(${(0.94 + card.enter * 0.06).toFixed(4)})`;
        if (part.copy) {
          part.copy.style.transform = `translate3d(0,${((1 - card.enter) * 56).toFixed(2)}px,0)`;
          part.copy.style.opacity = Math.max(
            0,
            Math.min(1, card.enter * 1.6 - 0.6),
          ).toFixed(3);
        }
      });
      if (bar) bar.style.transform = `scaleX(${position.progress.toFixed(4)})`;
      if (active !== position.active) {
        // A sheet of paper slides over the last one. Not on the first paint.
        if (active !== -1) play("page", { throttleMs: 140 });
        active = position.active;
        root.dataset.active = String(active);
        links.forEach((link, index) => {
          if (index === active) link.setAttribute("aria-current", "step");
          else link.removeAttribute("aria-current");
        });
      }
    };
    // The scenes ease toward the scroll position instead of mirroring every
    // wheel step, so a coarse mouse wheel moves as fluidly as a trackpad.
    const paint = (time?: number) => {
      frame = 0;
      if (!enabled) return;
      const end = offsets.at(-1) ?? 0;
      const target = Math.min(end, Math.max(0, window.scrollY - start));
      const elapsed = time && lastTime ? Math.min(64, time - lastTime) : 16;
      const gap = target - current;
      if (snap || time === undefined || Math.abs(gap) < 0.5) current = target;
      else current += gap * (1 - Math.exp(-elapsed / 85));
      snap = false;
      apply(current);
      if (current !== target) {
        lastTime = time ?? 0;
        frame = requestAnimationFrame(paint);
      } else {
        lastTime = 0;
        root.removeAttribute("data-moving");
      }
    };
    const onScroll = () => {
      if (!enabled || frame) return;
      root.setAttribute("data-moving", "");
      frame = requestAnimationFrame(paint);
    };

    const configure = () => {
      layoutFrame = 0;
      if (disposed) return;
      const wasEnabled = enabled;
      const oldStart = start;
      const oldEnd = offsets.at(-1) ?? 0;
      const headerHeight =
        document.querySelector(".site-header")?.getBoundingClientRect()
          .height ?? 80;
      const wasInside =
        wasEnabled &&
        window.scrollY >= oldStart &&
        window.scrollY <= oldStart + oldEnd;
      const visiblePanel =
        wasEnabled && window.scrollY > oldStart + oldEnd
          ? undefined
          : wasInside
            ? panels[Math.max(0, active)]
            : panels.reduce<HTMLElement | undefined>((best, panel) => {
                const visibleHeight = (element: HTMLElement) => {
                  const rect = element.getBoundingClientRect();
                  return Math.max(
                    0,
                    Math.min(rect.bottom, window.innerHeight) -
                      Math.max(rect.top, headerHeight),
                  );
                };
                // A sliver under the header is not the panel being read.
                return visibleHeight(panel) >
                  (best ? visibleHeight(best) : window.innerHeight / 4)
                  ? panel
                  : best;
              }, undefined);
      // Preserve the viewed panel, or the downstream document, when pinning changes.
      const anchor =
        visiblePanel ??
        (window.scrollY > root.offsetTop ? root.nextElementSibling : null);
      const oldTop = anchor?.getBoundingClientRect().top;
      const desired =
        wide.matches &&
        !reduced.matches &&
        document.documentElement.dataset.motion !== "paused";
      root.toggleAttribute("data-enhanced", desired);
      root.style.setProperty("--header-height", `${headerHeight}px`);
      enabled = desired;
      if (enabled) {
        panelHeight = panels[0].clientHeight;
        const step = Math.round(stage.clientHeight * 1.15);
        offsets = panels.map((_, index) => index * step);
        root.style.height = `${(offsets.at(-1) ?? 0) + stage.offsetHeight}px`;
        // Long copy, text zoom, or an expanded note must never be clipped by the pin.
        // Arrival offsets inside the cards must not count as overflowing copy.
        root.setAttribute("data-measuring", "");
        const clipped = panels.some(
          (panel) => panel.scrollHeight > panel.clientHeight + 2,
        );
        root.removeAttribute("data-measuring");
        if (clipped) {
          enabled = false;
          root.removeAttribute("data-enhanced");
        }
      }
      if (!enabled) {
        root.style.removeProperty("height");
        clearCards();
        root.removeAttribute("data-moving");
        delete root.dataset.active;
        links.forEach((link) => link.removeAttribute("aria-current"));
        active = -1;
      }
      start = root.getBoundingClientRect().top + window.scrollY - headerHeight;
      if (wasEnabled !== enabled && anchor && oldTop !== undefined) {
        if (enabled && visiblePanel) {
          instantScroll(start + offsets[panels.indexOf(visiblePanel)]);
        } else {
          instantScroll(
            window.scrollY + anchor.getBoundingClientRect().top - oldTop,
          );
        }
      }
      paint();
    };
    const scheduleLayout = () => {
      if (!layoutFrame) layoutFrame = requestAnimationFrame(configure);
    };
    const navigate = (target: HTMLElement, smooth: boolean) => {
      const panel = target.closest<HTMLElement>("[data-gallery-panel]");
      const index = target === root ? 1 : panels.indexOf(panel!);
      if (!enabled || index < 0) return false;
      // Jumps land at once; only real scrolling is eased.
      snap = !smooth;
      window.scrollTo({
        top: start + offsets[index],
        behavior: smooth ? "smooth" : "instant",
      });
      return true;
    };
    const hashTarget = () => {
      try {
        return document.getElementById(
          decodeURIComponent(window.location.hash.slice(1)),
        );
      } catch {
        return null;
      }
    };
    const onHash = () => {
      const target = hashTarget();
      if (target) navigate(target, false);
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!link || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      let target: HTMLElement | null = null;
      try {
        target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      } catch {
        return;
      }
      if (!target || !navigate(target, true)) return;
      event.preventDefault();
      history.pushState(null, "", url.hash);
      indexFocus = true;
      target.focus({ preventScroll: true });
      indexFocus = false;
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const panel = target.closest<HTMLElement>("[data-gallery-panel]");
      if (!enabled || !panel || indexFocus) return;
      const index = panels.indexOf(panel);
      const rect = target.getBoundingClientRect();
      if (
        Math.abs(window.scrollY - start - offsets[index]) > 2 ||
        rect.left < 0 ||
        rect.right > window.innerWidth ||
        rect.top < 70 ||
        rect.bottom > window.innerHeight
      )
        navigate(target, false);
    };
    const resize = new ResizeObserver(scheduleLayout);
    resize.observe(stage);
    const header = document.querySelector(".site-header");
    if (header) resize.observe(header);
    panels.forEach((panel) => {
      resize.observe(panel);
      panel
        .querySelectorAll(".panel-content")
        .forEach((element) => resize.observe(element));
    });
    const settings = new MutationObserver(scheduleLayout);
    settings.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    const content = new MutationObserver(scheduleLayout);
    content.observe(track, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    wide.addEventListener("change", scheduleLayout);
    reduced.addEventListener("change", scheduleLayout);
    window.addEventListener("resize", scheduleLayout);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    document.addEventListener("click", onClick, true);
    track.addEventListener("focusin", onFocus);
    configure();
    onHash();
    document.fonts.ready.then(() => {
      if (!disposed) {
        configure();
        onHash();
      }
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(layoutFrame);
      resize.disconnect();
      settings.disconnect();
      content.disconnect();
      wide.removeEventListener("change", scheduleLayout);
      reduced.removeEventListener("change", scheduleLayout);
      window.removeEventListener("resize", scheduleLayout);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
      document.removeEventListener("click", onClick, true);
      track.removeEventListener("focusin", onFocus);
      root.removeAttribute("data-enhanced");
      root.style.removeProperty("height");
      clearCards();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      className="work-gallery"
      aria-label={t("label")}
      tabIndex={-1}
    >
      <div className="gallery-stage">
        <div className="gallery-rail">
          <nav className="gallery-index" aria-label={t("navigation")}>
            {[
              { id: "introduction", name: t("intro") },
              { id: "project-bolota", name: "Bolota" },
              { id: "project-n-store", name: "n-store" },
              { id: "project-takostreak", name: "TakoStreak" },
            ].map((panel, i) => (
              <a key={panel.id} href={`#${panel.id}`} data-sound="none">
                <span>{String(i).padStart(2, "0")}</span> {panel.name}
              </a>
            ))}
          </nav>
          <a href="#about" className="gallery-skip">
            {t("skip")} <span aria-hidden="true">↓</span>
          </a>
          <div className="gallery-progress" aria-hidden="true">
            <span />
          </div>
        </div>
        <div className="gallery-window">
          <div className="gallery-track">{children}</div>
        </div>
      </div>
    </section>
  );
}
