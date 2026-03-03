/**
 * Fixed pulsating stars on the landing page – stay in place on scroll.
 * Soft white glow (water-drop style), a few extra for density.
 */
export function HeroStars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-[12%] top-[18%] h-1 w-1 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "0s" }} />
      <div className="absolute left-[88%] top-[22%] h-1.5 w-1.5 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "0.8s" }} />
      <div className="absolute left-[42%] top-[55%] h-1 w-1 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "1.6s" }} />
      <div className="absolute left-[72%] top-[68%] h-1 w-1 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "0.4s" }} />
      <div className="absolute left-[28%] top-[78%] h-1.5 w-1.5 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "1.2s" }} />
      <div className="absolute left-[92%] top-[82%] h-1 w-1 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute left-[55%] top-[32%] h-0.5 w-0.5 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "2.4s" }} />
      <div className="absolute left-[18%] top-[62%] h-0.5 w-0.5 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "3.2s" }} />
      {/* A few more */}
      <div className="absolute left-[6%] top-[42%] h-0.5 w-0.5 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute left-[78%] top-[12%] h-1 w-1 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "2.8s" }} />
      <div className="absolute left-[35%] top-[88%] h-0.5 w-0.5 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "0.2s" }} />
      <div className="absolute left-[62%] top-[72%] h-1 w-1 rounded-full bg-white/90 animate-star-pulse" style={{ animationDelay: "1.8s" }} />
    </div>
  );
}
