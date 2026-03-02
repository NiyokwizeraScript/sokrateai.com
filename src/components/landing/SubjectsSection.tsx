import { cn } from "@/lib/utils";
import { SectionReveal, RevealStagger } from "./SectionReveal";

const subjects = [
  {
    name: "Mathematics",
    icon: "Σ",
    examples: ["Differential Equations", "Linear Algebra", "Real Analysis", "Number Theory", "Topology"],
    gradient: "from-blue-600 to-blue-400",
    bgGlow: "bg-blue-500/20",
  },
  {
    name: "Physics",
    icon: "⚛",
    examples: ["Quantum Mechanics", "Electromagnetism", "Thermodynamics", "Relativity", "Classical Mechanics"],
    gradient: "from-purple-600 to-purple-400",
    bgGlow: "bg-purple-500/20",
  },
  {
    name: "Chemistry",
    icon: "⚗",
    examples: ["Organic Reactions", "Thermochemistry", "Quantum Chemistry", "Biochemistry", "Spectroscopy"],
    gradient: "from-orange-600 to-orange-400",
    bgGlow: "bg-orange-500/20",
  },
  {
    name: "Biology",
    icon: "🧬",
    examples: ["Molecular Biology", "Genetics", "Cell Biology", "Evolution", "Neuroscience"],
    gradient: "from-emerald-600 to-emerald-400",
    bgGlow: "bg-emerald-500/20",
  },
];

export function SubjectsSection() {
  return (
    <SectionReveal>
      <div id="subjects" className="py-20 sm:py-24 md:py-28 lg:py-36 relative bg-muted/25">
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-14 sm:mb-20">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 text-foreground tracking-tight" >
              Master Every <span className="text-gradient">Scientific Discipline</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From fundamentals to cutting-edge research
            </p>
          </RevealStagger>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {subjects.map((subject, index) => (
              <RevealStagger key={subject.name} index={index + 1} staggerMs={90}>
                <SubjectCard subject={subject} />
              </RevealStagger>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

function SubjectCard({ subject }: { subject: (typeof subjects)[0] }) {
  return (
    <div className="group relative h-full">
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl",
          subject.bgGlow
        )}
      />
      <div className="relative h-full bg-card rounded-2xl overflow-hidden border border-border shadow-soft-sm transition-all duration-300 group-hover:border-primary/25 group-hover:shadow-soft-md">
        <div className={cn("h-20 sm:h-24 flex items-center justify-center bg-gradient-to-br relative", subject.gradient)}>
          <span className="text-4xl sm:text-5xl" aria-hidden>{subject.icon}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="font-heading text-lg sm:text-xl font-bold mb-4 text-foreground tracking-tight">
            {subject.name}
          </h3>
          <ul className="space-y-2">
            {subject.examples.map((example) => (
              <li key={example} className="flex items-center gap-2 text-sm text-muted-foreground leading-snug">
                <div className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r shrink-0", subject.gradient)} />
                {example}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
