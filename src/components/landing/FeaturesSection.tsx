import { FileUp, Youtube, FileText, Trophy, Zap, Brain, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionReveal, RevealStagger } from "./SectionReveal";
import { FeatureSimulation } from "./FeatureSimulation";

type SimKind = "doc-upload" | "link" | "ai-notes" | "quizzes";

const features: Array<{
  icon: typeof FileUp;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  glowColor: "emerald" | "rose" | "violet" | "amber";
  simKind: SimKind;
}> = [
  {
    icon: FileUp,
    title: "Document Upload",
    subtitle: "PDF, DOC, PPT, images & more",
    description:
      "Upload any document and get AI-generated notes, summaries, and explanations. Turn slides, papers, or handouts into clear study material.",
    gradient: "from-emerald-500 to-teal-500",
    glowColor: "emerald",
    simKind: "doc-upload",
  },
  {
    icon: Youtube,
    title: "YouTube & Links",
    subtitle: "Turn videos into notes",
    description:
      "Paste a YouTube or webpage URL. Our AI watches, reads, and turns the content into structured notes so you can study without rewatching.",
    gradient: "from-rose-500 to-pink-500",
    glowColor: "rose",
    simKind: "link",
  },
  {
    icon: FileText,
    title: "AI Notes",
    subtitle: "Smart notes that stick",
    description:
      "Create and organize notes with AI assistance. Get explanations, definitions, and follow-up answers—all in one place.",
    gradient: "from-violet-500 to-purple-500",
    glowColor: "violet",
    simKind: "ai-notes",
  },
  {
    icon: Trophy,
    title: "Quizzes",
    subtitle: "Test what you've learned",
    description:
      "Generate quizzes from any note. Choose difficulty and question count, get instant feedback, and see where to improve.",
    gradient: "from-amber-500 to-orange-500",
    glowColor: "amber",
    simKind: "quizzes",
  },
];

const additionalFeatures = [
  { icon: Zap, title: "Lightning Fast", description: "Get notes and quizzes in seconds" },
  { icon: Brain, title: "PhD-Level Accuracy", description: "Rigorous, reliable explanations" },
  { icon: Target, title: "Personalized Learning", description: "Adapts to your goals and level" },
];

export function FeaturesSection() {
  return (
    <SectionReveal>
      <div id="features" className="py-20 sm:py-24 md:py-28 lg:py-36 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-1/2 h-64 sm:h-96 bg-primary/[0.04] blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-14 sm:mb-20">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 text-foreground tracking-tight" >
              Everything You Need to <span className="text-gradient">Excel in Science</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create notes from documents, links, or scratch—then quiz yourself
            </p>
          </RevealStagger>

          {/* Stacked cards: card left, simulation right */}
          <div className="space-y-10 sm:space-y-12 md:space-y-14 mb-20 sm:mb-24">
            {features.map((feature, index) => (
              <RevealStagger key={feature.title} index={index + 1} staggerMs={80}>
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch lg:items-center">
                  <div className="flex-1 min-w-0">
                    <FeatureCard feature={feature} />
                  </div>
                  <div className="flex-shrink-0 flex justify-center lg:justify-end lg:w-[min(100%,22rem)]">
                    <FeatureSimulation kind={feature.simKind} />
                  </div>
                </div>
              </RevealStagger>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {additionalFeatures.map((feature, index) => (
              <RevealStagger key={feature.title} index={index + 5} staggerMs={80}>
                <div className="flex flex-col items-center text-center p-5 sm:p-6 rounded-xl border border-border bg-card shadow-soft-sm transition-all duration-300 hover:shadow-soft-md hover:border-border/90">
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mb-4 shrink-0">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-base sm:text-lg mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </RevealStagger>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  return (
    <div className="group relative h-full">
      <div
        className={cn(
          "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl",
          feature.glowColor === "emerald" && "bg-emerald-500/25",
          feature.glowColor === "rose" && "bg-rose-500/25",
          feature.glowColor === "violet" && "bg-violet-500/25",
          feature.glowColor === "amber" && "bg-amber-500/25"
        )}
      />
      <div
        className={cn(
          "relative h-full rounded-2xl p-6 sm:p-7 lg:p-8 border transition-all duration-300",
          "bg-card/90 dark:bg-card/95 backdrop-blur-sm",
          "border-border/80 group-hover:border-primary/30",
          "shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.04),0_1px_2px_hsl(var(--foreground)/0.04),0_4px_12px_-2px_hsl(var(--foreground)/0.06)]",
          "dark:shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.06),0_1px_2px_hsl(0_0%_0%/0.2),0_8px_24px_-4px_hsl(0_0%_0%/0.25)]",
          "group-hover:shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.05),0_4px_20px_-4px_hsl(var(--primary)/0.15),0_12px_32px_-8px_hsl(var(--foreground)/0.08)]",
          "dark:group-hover:shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.08),0_4px_24px_-4px_hsl(var(--primary)/0.2),0_16px_40px_-8px_hsl(0_0%_0%/0.35)]"
        )}
      >
        <div
          className={cn(
            "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-5 bg-gradient-to-br shrink-0 shadow-lg shadow-black/10",
            feature.gradient
          )}
        >
          <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.25} />
        </div>
        <h3 className="font-heading text-base sm:text-lg font-bold mb-1.5 text-foreground tracking-tight">
          {feature.title}
        </h3>
        <p className="text-primary font-medium text-xs mb-3">{feature.subtitle}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
