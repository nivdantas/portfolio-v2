"use client";
import { useEffect } from "react";
import { haptic, isSoundName, play } from "@/lib/sound";

const INTERACTIVE = "a[href], button, summary, [data-sound-hover]";

/**
 * One delegated listener pair gives every control a voice.
 * `data-sound` chooses the click preset ("none" stays silent);
 * `data-sound-hover` chooses the hover preset ("off" stays silent).
 */
export default function SoundEffects() {
  useEffect(() => {
    let hovered: Element | null = null;
    const onOver = (event: PointerEvent) => {
      // Touch would fire a hover tick and a click for the same tap.
      if (event.pointerType !== "mouse") return;
      const element = (event.target as Element).closest?.(INTERACTIVE) ?? null;
      if (element === hovered) return;
      hovered = element;
      if (!element || (element as HTMLButtonElement).disabled) return;
      const name = (element as HTMLElement).dataset.soundHover ?? "tick";
      if (isSoundName(name)) play(name);
    };
    const onClick = (event: MouseEvent) => {
      const element = (event.target as Element).closest?.<HTMLElement>(
        "a[href], button, summary, [data-sound]",
      );
      if (!element) return;
      const name = element.dataset.sound ?? "tap";
      if (!isSoundName(name)) return;
      play(name, { throttleMs: 0 });
      haptic();
    };
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
