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
    <section id="subjects" className="py-24 md:py-32 relative bg-white">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(226 232 240) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
            Master Every <span className="text-gradient">Scientific Discipline</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From undergraduate fundamentals to cutting-edge research topics
          </p>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 group-hover:border-green-500 shadow-sm group-hover:shadow-md">
        {/* Header with gradient */}
        <div
          className={cn(
            "h-24 flex items-center justify-center bg-gradient-to-br relative",
            subject.gradient
          )}
        >
          <span className="text-5xl">{subject.icon}</span>
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading text-xl font-bold mb-4 text-slate-900">{subject.name}</h3>

          {/* Examples */}
          <ul className="space-y-2">
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