/**
 * A drawn sky — gradient, drifting cloud banks and haze, all in CSS/SVG.
 *
 * The comp's sky panels carry its own typography baked into the pixels, so
 * reusing them behind live text doubles the words. Drawing the sky instead
 * keeps it clean and sharp at any viewport size.
 */
export default function Sky({ className = '' }: { className?: string }) {
  // feTurbulence gives the cloud banks their soft, uneven edges.
  const clouds =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.008 0.016' numOctaves='5' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.1 0 0 0 -0.32'/%3E%3C/filter%3E%3Crect width='1200' height='700' filter='url(%23c)'/%3E%3C/svg%3E\")";

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Sky body */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b4585] via-[#6f9ed6] to-[#d9e7f7]" />

      {/* Two cloud banks at different scales so the depth reads */}
      <div
        className="absolute inset-x-[-20%] top-[-10%] h-[80%] opacity-[0.55] mix-blend-screen"
        style={{ backgroundImage: clouds, backgroundSize: '140% 140%' }}
      />
      <div
        className="absolute inset-x-[-30%] bottom-[-15%] h-[85%] opacity-80 mix-blend-screen"
        style={{
          backgroundImage: clouds,
          backgroundSize: '90% 100%',
          backgroundPosition: '30% 70%',
        }}
      />

      {/* Haze at the horizon, and a cool wash to hold the navy palette */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#eaf2fd] via-[#eaf2fd]/40 to-transparent" />
      <div className="absolute inset-0 bg-royal/10 mix-blend-soft-light" />
    </div>
  );
}
