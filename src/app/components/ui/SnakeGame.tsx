"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { play } from "@/lib/sound";

const SIZE = 20;
type Point = { x: number; y: number };
type Phase = "ready" | "playing" | "over";

const directions: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
};

/**
 * A snake hidden behind the wordmark. The page floods with ink from the point
 * that was pressed and only the board remains: no chrome, no score.
 * Arrows, WASD, or a swipe steer; any key or a tap plays again; the X, Esc,
 * or a press outside the board leaves.
 */
export default function SnakeGame({
  origin,
  onClose,
}: {
  origin: Point;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const close = useRef(() => {});
  const [over, setOver] = useState(false);
  const t = useTranslations("Snake");

  useEffect(() => {
    const dialog = dialogRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!dialog || !canvas || !ctx) return;
    if (!dialog.open) dialog.showModal();
    play("ink", { throttleMs: 0 });

    let snake: Point[] = [];
    let direction: Point = { x: 1, y: 0 };
    let queue: Point[] = [];
    let food: Point = { x: 0, y: 0 };
    let points = 0;
    let state: Phase = "ready";
    let frame = 0;
    let lastStep = 0;
    let swipe: Point | null = null;
    let closing = 0;
    const ink = getComputedStyle(dialog).color;
    close.current = () => leave();
    let opened = performance.now();
    let ate = 0;

    const draw = (time: number) => {
      const pixels = Math.round(
        canvas.clientWidth * (window.devicePixelRatio || 1),
      );
      if (canvas.width !== pixels) canvas.width = canvas.height = pixels;
      const cell = canvas.width / SIZE;
      const elapsed = time - opened;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      // The grid surfaces as a ripple from the centre of the board.
      const dot = Math.max(1, cell * 0.06);
      for (let x = 0; x < SIZE; x++)
        for (let y = 0; y < SIZE; y++) {
          const distance = Math.hypot(x - SIZE / 2, y - SIZE / 2);
          const shown = Math.min(
            1,
            Math.max(0, (elapsed - 350 - distance * 45) / 300),
          );
          if (!shown) continue;
          ctx.globalAlpha = 0.18 * shown;
          ctx.fillRect(
            (x + 0.5) * cell - dot / 2,
            (y + 0.5) * cell - dot / 2,
            dot,
            dot,
          );
        }
      const arrive = Math.min(1, Math.max(0, (elapsed - 700) / 400));
      const pulse = 1 + 0.12 * Math.sin(time / 260);
      ctx.globalAlpha = arrive;
      ctx.beginPath();
      ctx.arc(
        (food.x + 0.5) * cell,
        (food.y + 0.5) * cell,
        cell * 0.28 * pulse,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      const dim = state === "over" ? 0.3 : 1;
      const swell = Math.max(0, 1 - (time - ate) / 180) * cell * 0.1;
      snake.forEach((part, index) => {
        const inset = cell * 0.08 - (index ? 0 : swell);
        ctx.globalAlpha =
          arrive * dim * (index ? Math.max(0.5, 1 - index * 0.025) : 1);
        ctx.fillRect(
          part.x * cell + inset,
          part.y * cell + inset,
          cell - inset * 2,
          cell - inset * 2,
        );
      });
      ctx.globalAlpha = 1;
    };
    const placeFood = () => {
      do {
        food = {
          x: Math.floor(Math.random() * SIZE),
          y: Math.floor(Math.random() * SIZE),
        };
      } while (snake.some((part) => part.x === food.x && part.y === food.y));
    };
    const reset = () => {
      snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 },
      ];
      direction = { x: 1, y: 0 };
      queue = [];
      points = 0;
      state = "ready";
      placeFood();
      setOver(false);
    };
    const end = () => {
      state = "over";
      setOver(true);
      play("error", { throttleMs: 0 });
    };
    const step = (time: number) => {
      direction = queue.shift() ?? direction;
      const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };
      const eats = head.x === food.x && head.y === food.y;
      // The tail moves away this step unless the snake grows.
      const body = eats ? snake : snake.slice(0, -1);
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= SIZE ||
        head.y >= SIZE ||
        body.some((part) => part.x === head.x && part.y === head.y)
      )
        return end();
      snake.unshift(head);
      if (!eats) return void snake.pop();
      points += 1;
      ate = time;
      play("toggle", { throttleMs: 0 });
      if (snake.length === SIZE * SIZE) return end();
      placeFood();
    };
    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (
        state === "playing" &&
        time - lastStep >= Math.max(70, 135 - points * 2)
      ) {
        lastStep = time;
        step(time);
      }
      draw(time);
    };
    const start = () => {
      if (state !== "ready") return;
      state = "playing";
    };
    const turn = (x: number, y: number) => {
      if (state === "over") return;
      start();
      const previous = queue.at(-1) ?? direction;
      // No repeats, no reversing into the body, and at most two buffered turns.
      if (previous.x === x || previous.y === y || queue.length >= 2) return;
      queue.push({ x, y });
      play("tick");
    };
    const leave = () => {
      if (closing) return;
      const still =
        document.documentElement.dataset.motion === "paused" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (still) return dialog.close();
      dialog.dataset.closing = "";
      play("page", { throttleMs: 0 });
      closing = window.setTimeout(() => dialog.close(), 520);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") return;
      if ((event.target as Element).closest("button")) return;
      const move =
        directions[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      event.preventDefault();
      if (state === "over") reset();
      else if (move) turn(move[0], move[1]);
    };
    const onCancel = (event: Event) => {
      event.preventDefault();
      leave();
    };
    const onDown = (event: PointerEvent) => {
      swipe = { x: event.clientX, y: event.clientY };
    };
    const onUp = (event: PointerEvent) => {
      if (!swipe) return;
      const x = event.clientX - swipe.x;
      const y = event.clientY - swipe.y;
      swipe = null;
      if (state === "over") return reset();
      if (Math.max(Math.abs(x), Math.abs(y)) < 16) return start();
      if (Math.abs(x) > Math.abs(y)) turn(Math.sign(x), 0);
      else turn(0, Math.sign(y));
    };
    const onOutside = (event: MouseEvent) => {
      if (event.target === dialog) leave();
    };
    // Enough to cover the farthest corner of the screen from the wordmark.
    dialog.style.setProperty(
      "--flood-scale",
      String(
        (Math.hypot(
          Math.max(origin.x, window.innerWidth - origin.x),
          Math.max(origin.y, window.innerHeight - origin.y),
        ) /
          100) *
          1.05,
      ),
    );
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onOutside);
    dialog.addEventListener("close", onClose);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    reset();
    opened = performance.now();
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(closing);
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onOutside);
      dialog.removeEventListener("close", onClose);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, [onClose, origin]);

  return (
    <dialog
      ref={dialogRef}
      className="snake-dialog"
      aria-label={t("title")}
      data-sound="none"
      style={
        {
          "--origin-x": `${origin.x}px`,
          "--origin-y": `${origin.y}px`,
        } as CSSProperties
      }
    >
      <div className="snake-flood" />
      <div className="snake-board">
        <canvas ref={canvasRef} tabIndex={0} aria-label={t("board")} />
        {over && (
          <p className="snake-over" role="status">
            {t("over")}
          </p>
        )}
      </div>
      <button
        type="button"
        className="snake-close"
        aria-label={t("close")}
        onClick={() => close.current()}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
      </button>
    </dialog>
  );
}
