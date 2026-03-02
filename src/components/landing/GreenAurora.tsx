import { cn } from "@/lib/utils";

/**
 * Green aurora effect: emerges from top-right, extends across the page,
 * soft atmospheric glow with slow drift. Noticeable and premium.
 */
export function GreenAurora({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Layer 1: main glow — larger, stronger, extends further down and left */}
      <div
        className="absolute -top-[25%] -right-[15%] w-[min(140vw,100rem)] h-[min(130vw,95rem)] animate-aurora-drift opacity-55 dark:opacity-45"
        style={{
          background: "radial-gradient(ellipse 65% 70% at 65% 15%, hsl(var(--primary) / 0.32) 0%, transparent 50%)",
          filter: "blur(80px)",
          willChange: "transform",
        }}
      />
      {/* Layer 2: secondary ray — extends across more of the viewport */}
      <div
        className="absolute -top-[20%] right-[-10%] w-[min(100vw,75rem)] h-[min(100vw,75rem)] animate-aurora-opacity opacity-90"
        style={{
          background: "radial-gradient(ellipse 55% 55% at 80% 10%, hsl(var(--primary) / 0.22) 0%, transparent 55%)",
          filter: "blur(100px)",
          animationDelay: "2s",
          willChange: "opacity",
        }}
      />
      {/* Layer 3: fill that sweeps down the right and toward center */}
      <div
        className="absolute -top-[10%] right-0 w-[min(85vw,55rem)] h-[90vh] animate-aurora-drift opacity-85"
        style={{
          background: "radial-gradient(ellipse 75% 85% at 95% 5%, hsl(var(--primary) / 0.18) 0%, transparent 45%)",
          filter: "blur(60px)",
          animationDelay: "-5s",
          willChange: "transform",
        }}
      />
      {/* Layer 4: extra length — stretches toward center and bottom for a longer “tail” */}
      <div
        className="absolute top-[20%] right-[5%] w-[min(70vw,45rem)] h-[75vh] animate-aurora-opacity opacity-70"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 70% 40%, hsl(var(--primary) / 0.12) 0%, transparent 55%)",
          filter: "blur(70px)",
          animationDelay: "4s",
          willChange: "opacity",
        }}
      />
    </div>
  );
}
