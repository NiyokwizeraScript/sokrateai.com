import { cn } from "@/lib/utils";

const subjects = [
  {
    name: "Mathematics",
    color: "blue",
    icon: "Σ",
    examples: [
      "Differential Equations",
      "Linear Algebra",
      "Real Analysis",
      "Number Theory",
      "Topology",
    ],
    gradient: "from-blue-600 to-blue-400",
    bgGlow: "bg-blue-500/20",
  },
  {
    name: "Physics",
    color: "purple",
    icon: "⚛",
    examples: [
      "Quantum Mechanics",
      "Electromagnetism",
      "Thermodynamics",
      "Relativity",
      "Classical Mechanics",
    ],
    gradient: "from-purple-600 to-purple-400",
    bgGlow: "bg-purple-500/20",
  },
  {
    name: "Chemistry",
    color: "orange",
    icon: "⚗",
    examples: [
      "Organic Reactions",
      "Thermochemistry",
      "Quantum Chemistry",
      "Biochemistry",
      "Spectroscopy",
    ],
    gradient: "from-orange-600 to-orange-400",
    bgGlow: "bg-orange-500/20",
  },
  {
    name: "Biology",
    color: "green",
    icon: "🧬",
    examples: [
      "Molecular Biology",
      "Genetics",
      "Cell Biology",
      "Evolution",
      "Neuroscience",
    ],
    gradient: "from-emerald-600 to-emerald-400",
    bgGlow: "bg-emerald-500/20",
  },
];

export function SubjectsSection() {
  return (
    <section id="subjects" className="py-16 sm:py-20 md:py-24 lg:py-32 relative bg-slate-50/50">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(226 232 240) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900">
            Master Every <span className="text-gradient">Scientific Discipline</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-1">
            From fundamentals to cutting-edge research
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.name} subject={subject} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SubjectCard({
  subject,
  index,
}: {
  subject: (typeof subjects)[0];
  index: number;
}) {
  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Hover glow */}
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl",
          subject.bgGlow
        )}
      />

      <div className="relative h-full bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 group-hover:border-green-500 shadow-sm group-hover:shadow-md">
        <div
          className={cn(
            "h-20 sm:h-24 flex items-center justify-center bg-gradient-to-br relative",
            subject.gradient
          )}
        >
          <span className="text-4xl sm:text-5xl" aria-hidden>{subject.icon}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-slate-900">{subject.name}</h3>
          <ul className="space-y-1.5 sm:space-y-2">
            {subject.examples.map((example) => (
              <li
                key={example}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full bg-gradient-to-r",
                    subject.gradient
                  )}
                />
                {example}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}