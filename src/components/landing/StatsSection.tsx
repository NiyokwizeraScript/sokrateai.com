import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionReveal, RevealStagger } from "./SectionReveal";
import { cn } from "@/lib/utils";

const stats = [
  { value: "99%", label: "Accuracy Rate" },
  { value: "30s", label: "Processing Time" },
];

export function StatsSection() {
  return (
    <SectionReveal>
      <div className="py-24 md:py-32 lg:py-36 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-16 sm:mb-20">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 text-white tracking-tight">
              Built for Learning
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Accurate, fast AI that turns your materials into notes and study tools
            </p>
          </RevealStagger>

          <div className="grid grid-cols-2 gap-5 sm:gap-6 mb-12 sm:mb-14">
            {stats.map((stat, index) => (
              <RevealStagger key={stat.label} index={index + 1} staggerMs={80}>
                <div className="rounded-2xl p-6 sm:p-7 text-center border border-white/10 bg-white/[0.04]">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-emerald-400 mb-2 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              </RevealStagger>
            ))}
          </div>

          {/* Explore All Student Features – links to for-students, green on hover */}
          <RevealStagger index={3} className="mb-20 sm:mb-24">
            <Link
              to="/for-students"
              className={cn(
                "group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl border p-6 sm:p-8",
                "border-white/10 bg-white/[0.06]",
                "transition-colors duration-200",
                "hover:border-emerald-500/40 hover:bg-emerald-500/10"
              )}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Built for students</p>
                <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                  Explore all student features
                </h3>
                <p className="text-sm sm:text-base text-white/70 max-w-2xl">
                  Upload documents, organize notes in folders, generate flashcards from any PDF, and create quizzes that help you study. See every feature built for students.
                </p>
              </div>
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white transition-colors duration-200 group-hover:bg-emerald-500">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </RevealStagger>
        </div>
      </div>
    </SectionReveal>
  );
}
