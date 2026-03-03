import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Socrates mascot sitting on the "i" in the hero headline.
 * Uses hero.png from public folder; fallback SVG if missing.
 */
const MASCOT_IMAGE_PATH = "/hero.png";

function FallbackMascotSVG({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="56"
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
    >
      <path d="M24 20v36l-12-8V24c0-2 4-6 12-8 8 2 12 6 12 8v24L24 56V20z" fill="hsl(220 12% 92%)" fillOpacity="0.95" />
      <circle cx="24" cy="12" r="10" fill="hsl(35 25% 88%)" />
      <path d="M14 14c2-1 6-2 10-2s8 1 10 2l-2 4H16l-2-4z" fill="hsl(30 15% 45%)" fillOpacity="0.8" />
      <ellipse cx="34" cy="8" rx="4" ry="3" fill="hsl(160 40% 95%)" stroke="hsl(160 50% 45% / 0.5)" strokeWidth="0.5" />
      <line x1="32" y1="8" x2="30" y2="10" stroke="hsl(160 50% 45% / 0.4)" strokeWidth="0.5" />
    </svg>
  );
}

export function SocratesMascot({ className }: { className?: string }) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <span
      className={cn(
        "inline-block relative align-top overflow-hidden",
        "drop-shadow-[0_0_16px_hsl(160_50%_50%/0.35)]",
        "w-[6rem] h-[8rem] sm:w-[7.5rem] sm:h-[10rem] md:w-[8.5rem] md:h-[12rem] lg:w-[10rem] lg:h-[14rem]",
        className
      )}
      aria-hidden
    >
      {useFallback ? (
        <FallbackMascotSVG className="absolute inset-0 h-full w-full" />
      ) : (
        <img
          src={MASCOT_IMAGE_PATH}
          alt=""
          role="presentation"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ transform: "scale(0.75)", transformOrigin: "center center" }}
          onError={() => setUseFallback(true)}
        />
      )}
    </span>
  );
}
