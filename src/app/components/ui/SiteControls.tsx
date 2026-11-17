"use client";
import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTranslations } from "next-intl";
import { isMuted, play, setMuted, subscribeMuted } from "@/lib/sound";

const icon = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  "aria-hidden": true,
} as const;

export default function SiteControls() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);
  const t = useTranslations("UI");
  useEffect(() => {
    setMounted(true);
    let saved = false;
    try {
      saved = localStorage.getItem("niv-motion") === "paused";
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    setPaused(saved);
    document.documentElement.dataset.motion = saved ? "paused" : "on";
  }, []);
  const dark = mounted && resolvedTheme === "dark";
  const soundLabel = mounted && muted ? t("soundOn") : t("soundOff");
  const motionLabel = paused ? t("playMotion") : t("pauseMotion");
  const themeLabel = dark ? t("lightTheme") : t("darkTheme");

  const toggleTheme = (button: HTMLButtonElement) => {
    const next = dark ? "light" : "dark";
    const root = document.documentElement;
    const still =
      root.dataset.motion === "paused" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || !document.startViewTransition) return setTheme(next);
    // The new theme spreads from the control like ink into paper.
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    root.style.setProperty("--ink-x", `${x}px`);
    root.style.setProperty("--ink-y", `${y}px`);
    root.style.setProperty(
      "--ink-radius",
      `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`,
    );
    root.dataset.inkTransition = "";
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
      root.dataset.theme = next;
    });
    transition.finished.finally(() => delete root.dataset.inkTransition);
  };

  return (
    <div className="site-controls">
      <button
        className="icon-button"
        type="button"
        data-sound="none"
        aria-label={soundLabel}
        aria-pressed={mounted && muted}
        title={soundLabel}
        onClick={() => {
          setMuted(!muted);
          if (muted) play("hello", { throttleMs: 0 });
        }}
      >
        <svg {...icon}>
          <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5Z" />
          {mounted && muted ? (
            <path d="m16 9.5 5 5m0-5-5 5" />
          ) : (
            <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
          )}
        </svg>
      </button>
      <button
        className="icon-button motion-control"
        type="button"
        data-sound="toggle"
        aria-label={motionLabel}
        aria-pressed={paused}
        title={motionLabel}
        onClick={() => {
          const next = !paused;
          setPaused(next);
          document.documentElement.dataset.motion = next ? "paused" : "on";
          try {
            localStorage.setItem("niv-motion", next ? "paused" : "on");
          } catch {
            /* The preference still applies to this visit. */
          }
        }}
      >
        <svg {...icon}>
          {paused ? <path d="m9 5 10 7-10 7Z" /> : <path d="M9 5v14M15 5v14" />}
        </svg>
      </button>
      <button
        className="icon-button"
        type="button"
        data-sound="ink"
        disabled={!mounted}
        aria-label={themeLabel}
        title={themeLabel}
        onClick={(event) => toggleTheme(event.currentTarget)}
      >
        <svg {...icon}>
          {dark ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
            </>
          ) : (
            <path d="M20 15.4A8.5 8.5 0 0 1 8.6 4a8.5 8.5 0 1 0 11.4 11.4Z" />
          )}
        </svg>
      </button>
    </div>
  );
}
