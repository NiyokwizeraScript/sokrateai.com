import { Upload, FileText, Trophy, ArrowRight } from "lucide-react";
import { SectionReveal, RevealStagger } from "./SectionReveal";

const steps = [
  {
    number: "1",
    icon: Upload,
    title: "Upload",
    description:
      "Upload PDFs, paste YouTube or article links, or add audio. Record lectures or drop documents—we work with the formats you use every day.",
  },
  {
    number: "2",
    icon: FileText,
    title: "Organized notes + live AI answers",
    description:
      "Our AI structures your content into clear, editable notes. Ask questions and get instant answers—like a tutor that’s always there.",
  },
  {
    number: "3",
    icon: Trophy,
    title: "Flashcards + quizzes",
    description:
      "Generate flashcards and quizzes from any note. Study smarter with spaced repetition and see exactly where to focus before exams.",
  },
];

export function HowItWorksSection() {
  return (
    <SectionReveal>
      <div id="how-it-works" className="py-20 sm:py-24 md:py-28 lg:py-36 relative">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-14 sm:mb-20">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 text-white tracking-tight">
              How It Works – It&apos;s Simple
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Transform any PDF, YouTube video, or audio into notes and study tools in three simple steps.
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
        <div className="hidden lg:block absolute top-14 left-full w-12 h-0.5 bg-gradient-to-r from-white/20 to-transparent z-0">
          <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>
      )}
      <div className="relative rounded-2xl p-6 sm:p-7 lg:p-8 h-full border border-white/10 bg-white/[0.04]">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-500/50 bg-emerald-500/10">
            <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              {step.number}
            </span>
          </div>
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 text-white tracking-tight">{step.title}</h3>
        <p className="text-sm sm:text-base text-white/70 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}
