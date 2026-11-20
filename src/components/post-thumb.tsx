function hash(text: string) {
  let value = 2166136261;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value | 0 || 1;
}

function dots(seed: string) {
  let state = hash(seed);
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1000) / 1000;
  };
  const cells: { x: number; y: number; r: number }[] = [];
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      const value = next();
      if (value > 0.55) {
        cells.push({
          x: x * 10 + 5,
          y: y * 10 + 5,
          r: value > 0.8 ? 3.4 : 2.2,
        });
      }
    }
  }
  return cells;
}

export function PostThumb({ seed }: { seed: string }) {
  return (
    <span className="post-thumb">
      <svg
        viewBox="0 0 60 60"
        preserveAspectRatio="xMidYMid slice"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        {dots(seed).map((cell) => (
          <circle
            key={`${cell.x}-${cell.y}`}
            cx={cell.x}
            cy={cell.y}
            r={cell.r}
          />
        ))}
      </svg>
    </span>
  );
}
