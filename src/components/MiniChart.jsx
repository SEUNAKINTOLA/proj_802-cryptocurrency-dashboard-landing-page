// Reusable neon mini line chart — renders an SVG sparkline from an array of
// numbers using smooth cubic bezier curves and a subtle color-matched glow.
// Purely presentational: no state, no external data.

// Fixed viewBox the path is computed against. The rendered size is controlled
// by Tailwind width/height classes so the SVG scales responsively.
const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 40;
// Vertical breathing room so the stroke (and its glow) never clips the edges.
const PADDING_Y = 4;

// Map raw data values to evenly-spaced {x, y} points inside the viewBox.
// Y is inverted (SVG origin is top-left) and normalized against the data range;
// a flat series is centered vertically to avoid divide-by-zero.
function toPoints(data) {
  const count = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const usableHeight = VIEW_HEIGHT - PADDING_Y * 2;

  return data.map((value, index) => {
    const x = count === 1 ? VIEW_WIDTH / 2 : (index / (count - 1)) * VIEW_WIDTH;
    const normalized = range === 0 ? 0.5 : (value - min) / range;
    const y = VIEW_HEIGHT - PADDING_Y - normalized * usableHeight;
    return { x, y };
  });
}

// Build a smooth path string using Catmull-Rom-to-bezier control points, which
// produces natural-looking curves through every data point.
function buildSmoothPath(points) {
  if (points.length === 1) {
    // A single point can't form a line; draw a tiny horizontal dash so the
    // stroke (and its glow) is still visible.
    const { x, y } = points[0];
    return `M ${x - 1} ${y} L ${x + 1} ${y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

export default function MiniChart({ data, color = '#A855F7' }) {
  // Guard against missing/empty/non-array input so a bad row never crashes
  // the whole table.
  const numericData = Array.isArray(data)
    ? data.filter((value) => Number.isFinite(value))
    : [];

  if (numericData.length === 0) {
    return (
      <div
        aria-hidden="true"
        className="h-12 w-24 rounded bg-zinc-800/40"
      />
    );
  }

  const points = toPoints(numericData);
  const path = buildSmoothPath(points);

  return (
    <div className="h-12 w-24">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        role="img"
        aria-hidden="true"
      >
        <path
          d={path}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          // Color-matched glow gives the line its neon feel.
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
      </svg>
    </div>
  );
}
