import { Upload, Sparkles, GraduationCap, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Problem",
    description:
      "Type your question, upload an image of handwritten notes, or share a PDF document. We support equations, diagrams, and complex scientific notation.",
    visual: (
      <div className="relative w-full h-28 sm:h-32 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 border-dashed border-green-500/50 flex items-center justify-center animate-pulse">
          <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        </div>
        <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500">Drag & drop or click</p>
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
      <div className="relative w-full h-28 sm:h-32 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden p-3">
        <div className="space-y-2">
          <div className="h-2.5 sm:h-3 bg-green-500/30 rounded animate-shimmer" style={{ width: "100%" }} />
          <div className="h-2.5 sm:h-3 bg-green-500/20 rounded animate-shimmer" style={{ width: "80%", animationDelay: "0.2s" }} />
          <div className="h-2.5 sm:h-3 bg-green-500/10 rounded animate-shimmer" style={{ width: "60%", animationDelay: "0.4s" }} />
        </div>
        <div className="absolute bottom-2 right-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 animate-pulse" />
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
      <div className="relative w-full h-28 sm:h-32 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
          <span className="text-xs text-gray-600">Progress</span>
        </div>
        <div className="flex gap-0.5 sm:gap-1 items-end h-12 sm:h-16">
          {[40, 55, 35, 70, 50, 80, 65].map((height, i) => (
            <div key={i} className="flex-1 rounded-sm bg-green-600 min-w-0" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 md:py-24 lg:py-32 relative bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-1">
            From problem to solution in three steps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} isLast={index === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  return (
    <div
      className="relative animate-fade-in"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Connector line (desktop only) */}
      {!isLast ? (
        <div className="hidden lg:block absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-slate-300 to-transparent z-0">
          <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        </div>
      ) : null}

      <div className="relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 h-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <span className="text-3xl sm:text-4xl font-heading font-bold text-green-500/30">{step.number}</span>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
            <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900">{step.title}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
          {step.description}
        </p>
        {step.visual}
      </div>
    </div>
  );
}