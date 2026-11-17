"use client";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Link } from "@/i18n/navigation";

const SnakeGame = dynamic(() => import("./SnakeGame"), { ssr: false });

// Module scope, so the streak survives the navigation each click performs.
let streak = 0;
let last = 0;

/** The wordmark. Pressing it more than four times in a row opens a game. */
export default function Wordmark({ label }: { label?: string }) {
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const close = useCallback(() => setOrigin(null), []);
  return (
    <>
      <Link
        href="/portfolio"
        className="wordmark"
        aria-label={label}
        onClick={(event) => {
          const now = performance.now();
          streak = now - last < 700 ? streak + 1 : 1;
          last = now;
          // Warm the game's code on the way, so it opens without a pause.
          if (streak === 3) void import("./SnakeGame");
          if (streak <= 4) return;
          event.preventDefault();
          streak = 0;
          const rect = event.currentTarget.getBoundingClientRect();
          setOrigin({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        }}
      >
        niv<span>.</span>
      </Link>
      {origin && <SnakeGame origin={origin} onClose={close} />}
    </>
  );
}
