"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

const marks = [
  ["introduction", "intro"],
  ["project-bolota", "Bolota"],
  ["project-n-store", "n-store"],
  ["project-takostreak", "TakoStreak"],
  ["about", "about"],
  ["experience", "experience"],
  ["repositories", "repositories"],
  ["blog", "writing"],
  ["contact", "contact"],
] as const;
const projectNames = new Set(["Bolota", "n-store", "TakoStreak"]);

/**
 * A page-long ruler in the right margin: one mark per scene or section.
 * The mark for the part being read extends; hovering names every mark.
 * It reads positions inside animation frames and never touches React state.
 */
export default function ScrollRuler() {
  const ref = useRef<HTMLElement>(null);
  const t = useTranslations("Ruler");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const links = Array.from(root.querySelectorAll("a"));
    const targets = marks.map(([id]) => document.getElementById(id));
    const gallery = document.getElementById("projects");
    const fill = root.querySelector<HTMLElement>(".ruler-progress i");
    const first = targets.findIndex((target) => !target?.hasAttribute("data-gallery-panel"));
    let frame = 0;
    let active = -1;
    const paint = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let next = -1;
      for (let index = targets.length - 1; index >= first; index--)
        if ((targets[index]?.getBoundingClientRect().top ?? Infinity) <= line) {
          next = index;
          break;
        }
      root.toggleAttribute("data-on-ink", next === targets.length - 1);
      // Inside the pinned stage the gallery already knows its scene.
      if (next < 0 && gallery?.dataset.active) next = Number(gallery.dataset.active);
      else if (next < 0) {
        next = 0;
        for (let index = 0; index < first; index++)
          if ((targets[index]?.getBoundingClientRect().top ?? Infinity) <= line)
            next = index;
      }
      const page = document.documentElement;
      const end = page.scrollHeight - window.innerHeight;
      if (fill)
        fill.style.transform = `scaleY(${(end > 0 ? Math.min(1, window.scrollY / end) : 0).toFixed(4)})`;
      if (next === active) return;
      active = next;
      links.forEach((link, index) => {
        if (index === active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const scenes = new MutationObserver(schedule);
    if (gallery)
      scenes.observe(gallery, {
        attributes: true,
        attributeFilter: ["data-active", "data-enhanced"],
      });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      scenes.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav ref={ref} className="scroll-ruler" aria-label={t("label")}>
      <span className="ruler-progress" aria-hidden="true">
        <i />
      </span>
      {marks.map(([id, name]) => (
        <a key={id} href={`#${id}`} data-sound="none">
          <span className="ruler-name">
            {projectNames.has(name) ? name : t(name)}
          </span>
          <i aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
