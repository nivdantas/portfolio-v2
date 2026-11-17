import test from "node:test";
import assert from "node:assert/strict";
import { galleryPosition } from "../src/app/lib/gallery.ts";

const stops = [0, 900, 1800, 2700];
const height = 690;

test("vertical scenes have a reading beat and rise from below the viewport", () => {
  const start = galleryPosition(0, stops, height);
  assert.deepEqual(start.cards[0], { y: 0, scale: 1, opacity: 1, enter: 1 });
  assert.equal(start.cards[1].y, height + 32);
  assert.deepEqual(galleryPosition(90, stops, height).cards, start.cards);
  const middle = galleryPosition(450, stops, height);
  assert.ok(middle.cards[1].y > 0 && middle.cards[1].y < height);
  assert.ok(middle.cards[0].scale < 1 && middle.cards[0].scale > 0.955);
  assert.equal(middle.cards[2].y, height + 32);
});

test("each stop fully reveals one project and recedes the outgoing card", () => {
  for (let i = 0; i < stops.length; i++) {
    const position = galleryPosition(stops[i], stops, height);
    assert.equal(position.active, i);
    assert.deepEqual(position.cards[i], { y: 0, scale: 1, opacity: 1, enter: 1 });
    if (i > 0) {
      assert.equal(position.cards[i - 1].y, -16);
      assert.equal(position.cards[i - 1].scale, 0.955);
      assert.ok(Math.abs(position.cards[i - 1].opacity - 0.82) < 1e-10);
    }
  }
});

test("overscroll clamps at each end and reversing is deterministic", () => {
  const before = galleryPosition(-300, stops, height);
  assert.deepEqual(before, galleryPosition(0, stops, height));
  const end = galleryPosition(5000, stops, height);
  assert.equal(end.active, 3);
  assert.equal(end.progress, 1);
  assert.deepEqual(end.cards[3], { y: 0, scale: 1, opacity: 1, enter: 1 });
  const forward = stops.map((stop) =>
    galleryPosition(stop + 340, stops, height),
  );
  const reverse = [...stops]
    .reverse()
    .map((stop) => galleryPosition(stop + 340, stops, height));
  assert.deepEqual(forward, reverse.reverse());
});

test("unequal scene durations and unmeasured layouts have finite frames", () => {
  assert.equal(galleryPosition(2350, [0, 1080, 2350, 3540], height).active, 2);
  assert.equal(
    galleryPosition(1770, [0, 1080, 2350, 3540], height).progress,
    0.5,
  );
  assert.equal(galleryPosition(100, [], height).progress, 0);
  const zero = galleryPosition(100, [0, 0], 0);
  assert.equal(zero.progress, 0);
  for (const card of zero.cards)
    for (const value of Object.values(card)) assert.ok(Number.isFinite(value));
});
