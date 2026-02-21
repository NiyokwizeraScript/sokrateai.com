import { Calculator, FileText, Trophy, Zap, Brain, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Calculator,
    title: "The Solver",
    subtitle: "Solve Any Problem Instantly",
    description:
      "Upload any problem - images, PDFs, or documents. Our AI provides step-by-step solutions with follow-up chat for deeper understanding.",
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "blue",
  },
  {
    icon: FileText,
    title: "The Synthesizer",
    subtitle: "AI Re-explains Everything",
    description:
      "Upload any document and get clear AI explanations. Start a discussion to dive deeper into concepts you want to understand better.",
    gradient: "from-purple-500 to-pink-500",
    glowColor: "purple",
  },
  {
    icon: Trophy,
    title: "The Quizzes",
    subtitle: "Test Your Knowledge",
    description:
      "Upload documents and generate custom quizzes. Choose difficulty and question count, then get AI insights on areas to improve.",
    gradient: "from-amber-500 to-orange-500",
    glowColor: "amber",
  },
];

const additionalFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get solutions in seconds, not hours",
  },
  {
    icon: Brain,
    title: "PhD-Level Accuracy",
    description: "Rigorous, publication-quality solutions",
  },
  {
    icon: Target,
    title: "Personalized Learning",
    description: "Adapts to your skill level and goals",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 relative bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-1/2 h-64 sm:h-96 bg-green-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900">
            Everything You Need to{" "}
            <span className="text-gradient">Excel in Science</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-1">
            Three powerful tools for learning and research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-16 sm:mb-20">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {additionalFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl border border-slate-100 bg-slate-50/50"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3 sm:mb-4 shrink-0">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="font-heading font-semibold text-base sm:text-lg mb-1.5 text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
          feature.glowColor === "blue" && "bg-blue-500/20",
          feature.glowColor === "purple" && "bg-purple-500/20",
          feature.glowColor === "amber" && "bg-amber-500/20"
        )}
      />

      <div className="relative h-full bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-slate-200 transition-all duration-300 group-hover:border-green-500 group-hover:shadow-lg">
        <div
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 bg-gradient-to-br shrink-0",
            feature.gradient
          )}
        >
          <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-bold mb-1.5 text-slate-900">{feature.title}</h3>
        <p className="text-green-600 font-medium text-xs sm:text-sm mb-2 sm:mb-3">{feature.subtitle}</p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {feature.description}
        </p>
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <feature.icon className="w-16 h-16 sm:w-24 sm:h-24" />
        </div>
      </div>
    </div>
  );
}