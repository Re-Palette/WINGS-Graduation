export type Memory = {
  src: string;
  alt: string;
  caption: string;
  /** Viewport percentages. */
  x: number;
  y: number;
  /** 0 = nearest the viewer, 1 = furthest back. Drives arrival order. */
  depth: number;
  rotate: number;
  scale: number;
};

export type MemoryDetail = { alt: string; caption: string };

/** Deterministic noise in [-1, 1] — the same layout on every render. */
function jitter(seed: number): number {
  const n = Math.sin(seed * 127.1) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

/**
 * Places any number of photographs through the memory cloud.
 *
 * A jittered grid rather than pure randomness: the grid guarantees the
 * photographs spread across the frame instead of clumping, and the jitter
 * keeps them from reading as a grid. Depth is assigned on a stride so
 * neighbours don't arrive together — otherwise the cloud surfaces row by
 * row, which looks mechanical.
 */
export function buildMemoryCloud(
  count: number,
  details: MemoryDetail[] = []
): Memory[] {
  if (count <= 0) return [];

  // Slightly wider than tall, matching the frame it lives in.
  const cols = Math.max(1, Math.ceil(Math.sqrt(count * 1.7)));
  const rows = Math.max(1, Math.ceil(count / cols));

  // Co-prime stride so every photo gets a distinct depth, spread apart.
  const stride = count > 2 ? largestCoprimeBelow(count) : 1;

  const placed = Array.from({ length: count }, (_, i) => ({
    x: clamp(((i % cols) + 0.5) / cols * 100 + jitter(i + 1) * (46 / cols), 12, 88),
    y: clamp(
      (Math.floor(i / cols) + 0.5) / rows * 100 + jitter(i + 91) * (40 / rows),
      14,
      86
    ),
  }));

  // A part-filled last row leaves the set hugging one corner, which is
  // most obvious with only a handful of photographs. Re-centre the whole
  // cloud in the frame; with a full grid this is a no-op.
  const centreX = 50 - midpoint(placed.map((p) => p.x));
  const centreY = 50 - midpoint(placed.map((p) => p.y));

  return placed.map(({ x, y }, i) => {
    const depth = count === 1 ? 0.4 : ((i * stride) % count) / (count - 1);
    const detail = details[i];
    const index = String(i + 1).padStart(2, '0');

    return {
      src: `/images/memory-${index}.webp`,
      alt: detail?.alt ?? `WINGS の思い出 ${i + 1}`,
      caption: detail?.caption ?? '',
      x: round(clamp(x + centreX, 12, 88)),
      y: round(clamp(y + centreY, 14, 86)),
      depth: round(depth),
      rotate: round(jitter(i + 37) * 8),
      scale: round(0.82 + (1 - depth) * 0.24),
    };
  });
}

function midpoint(values: number[]) {
  return (Math.min(...values) + Math.max(...values)) / 2;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

/** The largest number below `n` that shares no factor with it. */
function largestCoprimeBelow(n: number) {
  for (let s = Math.floor(n / 2) + 1; s > 1; s--) {
    if (gcd(s, n) === 1) return s;
  }
  return 1;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
