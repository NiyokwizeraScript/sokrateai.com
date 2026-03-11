import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HeroAurora } from "@/components/landing/HeroAurora";
import { AnimatedAICard } from "@/components/landing/AnimatedAICard";
import { SocratesMascot } from "@/components/landing/SocratesMascot";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      className={cn(
        "relative min-h-[100vh] w-full overflow-hidden",
        "flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16",
        "pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8",
        "bg-transparent"
      )}
    >
      <HeroAurora />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-8 xl:gap-10">
        {/* Left column */}
        <div className="flex-1 max-w-[600px] lg:max-w-none min-w-0">
          <span
            className={cn(
              "inline-block px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-4",
              "border border-emerald-500/60 text-emerald-400",
              "shadow-[0_0_12px_hsl(160_50%_50%/0.25)]"
            )}
          >
            Beta
          </span>
          <h1
            className="font-heading text-[2.5rem] xs:text-[3rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.5rem] 2xl:text-[6rem] font-bold tracking-tight leading-[1.05] mb-6 sm:whitespace-nowrap"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="text-white">Meet</span>{" "}
            <span className="text-white">Sokrate</span>{" "}
            <span className="relative inline-block text-white">
              A
              <span
                className="relative inline-block drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
                style={{ textShadow: "0 3px 8px rgba(0,0,0,0.5)" }}
              >
                I
                <SocratesMascot className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[0.1em] origin-bottom" />
              </span>
            </span>
          </h1>

          <p
            className="text-xl sm:text-2xl md:text-[1.5rem] lg:text-[1.75rem] text-white/80 font-normal max-w-[600px] mt-8 leading-snug"
          >
            Turn anything into notes, flashcards, quizzes and more.
          </p>

          <Button
            asChild
            size="lg"
            className={cn(
              "mt-10 h-14 sm:h-[60px] px-8 sm:px-10 text-base font-bold rounded-xl",
              "bg-emerald-500 text-white border-0",
              "hover:bg-emerald-400 transition-colors duration-200 active:bg-emerald-600"
            )}
          >
            <Link to="/signup" className="inline-flex items-center gap-2 font-bold">
              Get Started – It's Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Right column: AI card */}
        <div className="flex-1 flex justify-center lg:justify-end min-h-[380px] lg:min-h-0 items-center">
          <AnimatedAICard />
        </div>
      </div>
    </section>
  );
}
