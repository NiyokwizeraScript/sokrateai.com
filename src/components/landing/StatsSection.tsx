import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionReveal, RevealStagger } from "./SectionReveal";
import { cn } from "@/lib/utils";

const stats = [
  { value: "50,000+", label: "Notes Created" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "10,000+", label: "Active Students" },
  { value: "4.9/5", label: "User Rating" },
];

const testimonials = [
  {
    quote:
      "Sokrate AI helped me turn my lecture slides and YouTube playlists into clear notes. The quizzes make revision so much faster.",
    author: "Sarah Chen",
    role: "PhD Candidate, Physics",
    avatar: "SC",
  },
  {
    quote:
      "I upload research papers and get summaries in minutes. Document upload and AI notes have become my default workflow.",
    author: "Marcus Johnson",
    role: "Graduate Researcher",
    avatar: "MJ",
  },
  {
    quote:
      "The best study tool I've used. Notes from documents and links, then quizzes to test myself—like having a tutor 24/7.",
    author: "Emily Rodriguez",
    role: "Pre-Med Student",
    avatar: "ER",
  },
];

const CAROUSEL_INTERVAL_MS = 6000;

export function StatsSection() {
  const [current, setCurrent] = useState(0);
  const n = testimonials.length;

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % n);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [n]);

  const go = (delta: number) => {
    setCurrent((c) => (c + delta + n) % n);
  };

  return (
    <SectionReveal>
      <div className="py-24 md:py-32 lg:py-36 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-16 sm:mb-20">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 text-foreground tracking-tight" >
              Trusted by <span className="text-gradient">Thousands</span> of Students
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join a growing community of learners achieving their academic goals
            </p>
          </RevealStagger>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-20 sm:mb-24">
            {stats.map((stat, index) => (
              <RevealStagger key={stat.label} index={index + 1} staggerMs={80}>
                <div className="bg-card rounded-2xl p-6 sm:p-7 text-center border border-border shadow-soft-sm">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-2 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </RevealStagger>
            ))}
          </div>

          {/* Reviews carousel */}
          <RevealStagger index={5} className="relative">
            <div className="max-w-2xl mx-auto">
              <div className="relative rounded-2xl border border-border bg-card shadow-soft-md overflow-hidden">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/15 pointer-events-none" />
                <div className="p-6 sm:p-8 md:p-10 min-h-[200px] flex flex-col justify-center">
                  {testimonials.map((t, i) => (
                    <div
                      key={t.author}
                      className={cn(
                        "transition-opacity duration-500",
                        i === current ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                      )}
                      aria-hidden={i !== current}
                    >
                      {i === current && (
                        <>
                          <p className="text-foreground/90 leading-relaxed mb-6 pr-8">
                            &ldquo;{t.quote}&rdquo;
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground shrink-0">
                              {t.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{t.author}</div>
                              <div className="text-sm text-muted-foreground">{t.role}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrent(i)}
                        className={cn(
                          "w-2.5 h-2.5 rounded-full transition-colors",
                          i === current ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        )}
                        aria-label={`Go to review ${i + 1}`}
                        aria-current={i === current ? "true" : undefined}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </RevealStagger>
        </div>
      </div>
    </SectionReveal>
  );
}
