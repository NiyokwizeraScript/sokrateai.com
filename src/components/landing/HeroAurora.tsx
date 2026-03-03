/**
 * Hero-only aurora: top-left emerald glow + green glow behind card.
 * Lighter blur and no SVG grain to reduce GPU/CPU load and device heating.
 */
export function HeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Top-left aurora: reduced blur for perf */}
      <div
        className="absolute -top-[30%] -left-[15%] w-[min(140vw,100rem)] h-[min(120vw,85rem)] animate-aurora-drift-slow motion-reduce:animate-none"
        style={{
          background: "radial-gradient(ellipse 55% 60% at 20% 10%, hsl(160 55% 45% / 0.55) 0%, hsl(165 50% 40% / 0.25) 35%, hsl(160 45% 35% / 0.08) 55%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -top-[25%] left-0 w-[min(100vw,70rem)] h-[min(90vw,60rem)] animate-aurora-opacity-slow motion-reduce:animate-none"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 10% 5%, hsl(160 60% 50% / 0.4) 0%, hsl(165 55% 45% / 0.18) 45%, transparent 60%)",
          filter: "blur(45px)",
          animationDelay: "3s",
        }}
      />
      {/* Green glow behind right-side card */}
      <div
        className="absolute top-1/2 right-0 w-[min(65vw,45rem)] h-[85vh] -translate-y-1/2"
        style={{
          background: "radial-gradient(ellipse 65% 75% at 65% 50%, hsl(160 55% 45% / 0.28) 0%, hsl(160 50% 40% / 0.1) 45%, transparent 60%)",
          filter: "blur(35px)",
        }}
      />
    </div>
  );
}
