export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** Pure scroll choreography: every card has a stable, fully revealed stop. */
export function galleryPosition(
  distance: number,
  stops: number[],
  height: number,
) {
  const end = stops.at(-1) ?? 0;
  const travel = clamp(distance, 0, end);
  const active = stops.reduce(
    (nearest, offset, index) =>
      Math.abs(offset - travel) < Math.abs(stops[nearest] - travel)
        ? index
        : nearest,
    0,
  );
  const transition = (from: number, to: number) => {
    if (to <= from) return travel >= to ? 1 : 0;
    // Leave a short reading beat, then let the incoming scene ease upward.
    const t = clamp(((travel - from) / (to - from) - 0.12) / 0.88);
    return t * t * (3 - 2 * t);
  };
  return {
    active,
    progress: end ? travel / end : 0,
    cards: stops.map((stop, index) => {
      const entered = index === 0 ? 1 : transition(stops[index - 1], stop);
      const covered =
        index === stops.length - 1 ? 0 : transition(stop, stops[index + 1]);
      return {
        y: (1 - entered) * (height + 32) - covered * 16,
        scale: 1 - covered * 0.045,
        opacity: 1 - covered * 0.18,
        // 0 → 1 as the card arrives; drives the parallax inside the card.
        enter: entered,
      };
    }),
  };
}
