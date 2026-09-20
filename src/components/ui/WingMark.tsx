/**
 * The wing motif for the ending. Two mirrored feather sweeps drawn as
 * strokes so they can be revealed with stroke-dashoffset.
 */
export default function WingMark({ className = '' }: { className?: string }) {
  const feathers = [
    'M120 60 C 96 62, 66 70, 34 88',
    'M120 60 C 99 71, 72 86, 44 110',
    'M120 60 C 102 80, 82 101, 60 128',
    'M120 60 C 107 84, 96 110, 84 142',
  ];

  return (
    <svg
      viewBox="0 0 240 180"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="wing-stroke"
      >
        {feathers.map((d, i) => (
          <path key={`l-${i}`} d={d} />
        ))}
        {/* Mirrored about the 120px centre line */}
        <g transform="translate(240 0) scale(-1 1)">
          {feathers.map((d, i) => (
            <path key={`r-${i}`} d={d} />
          ))}
        </g>
        <path d="M120 44 L120 150" strokeWidth="0.7" opacity="0.5" />
      </g>
    </svg>
  );
}
