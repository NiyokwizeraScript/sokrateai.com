import { Upload, Sparkles, GraduationCap, ArrowRight } from "lucide-react";
import { SectionReveal, RevealStagger } from "./SectionReveal";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Problem",
    description:
      "Type your question, upload an image of handwritten notes, or share a PDF document. We support equations, diagrams, and complex scientific notation.",
    visual: (
      <div className="relative w-full h-28 sm:h-32 rounded-xl bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed border-primary/50 flex items-center justify-center animate-pulse">
          <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground">Drag & drop or click</p>
      </div>
    ),
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Analyzes & Solves",
    description:
      "Our advanced AI processes your input, applies relevant theorems and methods, and generates a comprehensive, step-by-step solution with explanations.",
    visual: (
      <div className="relative w-full h-28 sm:h-32 rounded-xl bg-muted/50 border border-border overflow-hidden p-3">
        <div className="space-y-2">
          <div className="h-2.5 sm:h-3 bg-primary/30 rounded animate-shimmer" style={{ width: "100%" }} />
          <div className="h-2.5 sm:h-3 bg-primary/20 rounded animate-shimmer" style={{ width: "80%", animationDelay: "0.2s" }} />
          <div className="h-2.5 sm:h-3 bg-primary/10 rounded animate-shimmer" style={{ width: "60%", animationDelay: "0.4s" }} />
        </div>
        <div className="absolute bottom-2 right-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
        </div>
      </div>
    ),
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Learn & Track Progress",
    description:
      "Review detailed solutions, take generated quizzes, and build your knowledge base. Your learning journey is saved and grows with every problem you solve.",
    visual: (
      <div className="relative w-full h-28 sm:h-32 rounded-xl bg-muted/50 border border-border overflow-hidden p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Progress</span>
        </div>
        <div className="flex gap-0.5 sm:gap-1 items-end h-12 sm:h-16">
          {[40, 55, 35, 70, 50, 80, 65].map((height, i) => (
            <div key={i} className="flex-1 rounded-sm bg-primary min-w-0 transition-all duration-300" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <SectionReveal>
      <div id="how-it-works" className="py-20 sm:py-24 md:py-28 lg:py-36 relative">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-14 sm:mb-20">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 text-foreground tracking-tight" >
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From problem to solution in three steps
            </p>
          </RevealStagger>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {steps.map((step, index) => (
              <RevealStagger key={step.number} index={index + 1} staggerMs={120}>
                <StepCard step={step} isLast={index === steps.length - 1} />
              </RevealStagger>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

function StepCard({ step, isLast }: { step: (typeof steps)[0]; isLast: boolean }) {
  return (
    <div className="relative h-full">
      {!isLast && (
        <div className="hidden lg:block absolute top-14 left-full w-12 h-0.5 bg-gradient-to-r from-border to-transparent z-0">
          <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
        </div>
      )}
      <div className="relative bg-card rounded-2xl p-6 sm:p-7 lg:p-8 h-full border border-border shadow-soft-sm hover:shadow-soft-md transition-shadow duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <span className="text-3xl sm:text-4xl font-heading font-bold text-primary/30 tabular-nums">{step.number}</span>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 text-foreground tracking-tight">{step.title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">{step.description}</p>
        {step.visual}
      </div>
    </div>
  );
}
