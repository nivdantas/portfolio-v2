"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

// One pen stroke, written three slightly different ways: no two signatures match.
const strokes = [
  "M76 252C82 190 92 120 106 68c4-12 12-10 18 0 30 58 68 130 100 180 6 10 14 6 14-6 2-62 8-122 22-182",
  "M80 256C80 196 88 126 100 72c2-14 12-14 18-2 34 56 72 124 106 172 8 10 16 4 16-8-2-58 2-118 12-176",
  "M72 248C82 184 96 116 112 64c4-10 10-8 16 2 26 60 60 134 92 186 6 8 14 4 14-8 4-64 12-124 30-178",
];
const STROKE = 0.85; // Share of the timeline spent on the line; the dot takes the rest.
const DRAW_MS = 1100;
const ERASE_MS = 600;

/**
 * The N, signed by hand. A press never restarts it: the pen reverses from
 * wherever it is. A finished or half-written N is unwritten back to the start
 * and then signed again; pressing while it is being unwritten writes it back.
 */
export default function PersonalMark() {
  const [variant, setVariant] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const motion = useRef({ progress: 1, direction: 0, frame: 0, time: 0 });
  const t = useTranslations("Hero");

  useEffect(() => {
    const state = motion.current;
    return () => cancelAnimationFrame(state.frame);
  }, []);

  const render = (progress: number) => {
    const line = Math.min(1, progress / STROKE);
    const dot = Math.max(0, (progress - STROKE) / (1 - STROKE));
    if (pathRef.current)
      pathRef.current.style.strokeDashoffset = String(
        1 - line * line * (3 - 2 * line),
      );
    if (dotRef.current) dotRef.current.style.transform = `scale(${dot})`;
  };
  const tick = (time: number) => {
    const state = motion.current;
    const elapsed = Math.min(64, time - (state.time || time));
    state.time = time;
    state.progress +=
      (state.direction * elapsed) / (state.direction > 0 ? DRAW_MS : ERASE_MS);
    if (state.direction < 0 && state.progress <= 0) {
      // Back at the start: pick up the pen and sign again, a little differently.
      state.progress = 0;
      state.direction = 1;
      setVariant((value) => (value + 1) % strokes.length);
    } else if (state.direction > 0 && state.progress >= 1) {
      state.progress = 1;
      state.direction = 0;
    }
    render(state.progress);
    state.frame = state.direction ? requestAnimationFrame(tick) : 0;
  };
  const press = () => {
    const state = motion.current;
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    const still =
      document.documentElement.dataset.motion === "paused" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) return setVariant((value) => (value + 1) % strokes.length);
    if (!path.style.animation) {
      // Take over from the entrance animation exactly where it is.
      const offset = parseFloat(getComputedStyle(path).strokeDashoffset) || 0;
      const scale = new DOMMatrixReadOnly(getComputedStyle(dot).transform).a;
      state.progress =
        offset > 0.001
          ? STROKE * (1 - offset)
          : STROKE + (1 - STROKE) * Math.min(1, scale);
      state.direction = state.progress < 1 ? 1 : 0;
      path.style.animation = dot.style.animation = "none";
      render(state.progress);
    }
    // Writing or finished: unwrite. Being unwritten: write it back.
    state.direction = state.direction < 0 ? 1 : -1;
    if (!state.frame) {
      state.time = 0;
      state.frame = requestAnimationFrame(tick);
    }
  };

  return (
    <div className="personal-object">
      <button
        type="button"
        className="personal-mark"
        data-sound="page"
        aria-label={t("turnMark")}
        onClick={press}
      >
        <svg viewBox="0 0 320 320" fill="none" aria-hidden="true">
          <defs>
            {/* A little tooth on the edge, like ink on paper. */}
            <filter id="mark-ink" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035"
                numOctaves="2"
                seed={variant}
              />
              <feDisplacementMap in="SourceGraphic" scale="6" />
            </filter>
          </defs>
          <g filter="url(#mark-ink)">
            <path
              ref={pathRef}
              className="mark-stroke"
              pathLength={1}
              d={strokes[variant]}
            />
            <circle
              ref={dotRef}
              className="mark-dot"
              cx="286"
              cy="246"
              r="10"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
