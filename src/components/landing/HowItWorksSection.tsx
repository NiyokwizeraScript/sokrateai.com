import { Upload, Sparkles, GraduationCap, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Problem",
    description:
      "Type your question, upload an image of handwritten notes, or share a PDF document. We support equations, diagrams, and complex scientific notation.",
    visual: (
      <div className="relative w-full h-32 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-lg border-2 border-dashed border-green-500/50 flex items-center justify-center animate-pulse">
            <Upload className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="absolute bottom-2 text-xs text-gray-500">
          Drag & drop or click to upload
        </div>
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
      <div className="relative w-full h-32 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden">
        <div className="absolute inset-0 p-3 space-y-2">
          <div className="h-3 bg-green-500/30 rounded animate-shimmer" style={{ width: "100%" }} />
          <div className="h-3 bg-green-500/20 rounded animate-shimmer" style={{ width: "80%", animationDelay: "0.2s" }} />
          <div className="h-3 bg-green-500/10 rounded animate-shimmer" style={{ width: "60%", animationDelay: "0.4s" }} />
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="animate-pulse">
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
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
      <div className="relative w-full h-32 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-600" />
          <span className="text-xs text-gray-600">Progress</span>
        </div>
        <div className="flex gap-1 items-end h-16">
          {[40, 55, 35, 70, 50, 80, 65].map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded bg-green-600 transition-all duration-500"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative bg-white">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-1/3 h-96 bg-green-500/3 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-1/3 h-96 bg-green-500/3 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From problem to solution in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
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

      <div className="relative bg-white rounded-2xl p-6 lg:p-8 h-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        {/* Step number */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl font-heading font-bold text-green-500/30">
            {step.number}
          </span>
          <div className="w-12 h-12 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center">
            <step.icon className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Content */}
        <h3 className="font-heading text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {step.description}
        </p>

        {/* Visual */}
        {step.visual}
      </div>
    </div>
  );
}