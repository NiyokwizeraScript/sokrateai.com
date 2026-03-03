import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BookOpen, Trophy } from "lucide-react";
import { SokrateLogo } from "@/components/auth/SokrateLogo";
import { GreenAurora } from "@/components/landing/GreenAurora";
import { HeroStars } from "@/components/landing/HeroStars";
import { cn } from "@/lib/utils";

export default function ForStudents() {
  return (
    <div className="landing-page min-h-screen bg-[#0B0F14] text-foreground overflow-x-hidden relative">
      {/* Same background as landing: aurora + stars */}
      <div className="fixed inset-0 -z-[1]">
        <GreenAurora />
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroStars />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 pt-4 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto rounded-full border border-white/10 bg-emerald-950/15 backdrop-blur-md py-2.5 px-5 flex items-center justify-between">
            <Link to="/" className="flex items-center text-white [&_span]:!text-white [&_.text-gray-600]:!text-white/80">
              <SokrateLogo className="scale-75 origin-left" />
            </Link>
            <Button asChild size="sm" className="rounded-full bg-emerald-500 text-white border-0 hover:bg-emerald-400 font-medium">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <section className="text-center mb-24">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-5">
              For Students
            </h1>
            <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
              Notes, flashcards, and quizzes from your materials. Study smarter with Sokrate AI.
            </p>
          </section>

          <section id="notes" className="scroll-mt-28">
            <div
              className={cn(
                "rounded-2xl border p-8 sm:p-10 md:p-12 mb-14",
                "bg-white/[0.06] border-emerald-500/20",
                "shadow-[0_0_0_1px_hsl(160_50%_40%/0.08),0_8px_32px_-8px_rgba(0,0,0,0.3)]",
                "hover:border-emerald-500/30 transition-colors duration-300"
              )}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
                    Turn anything into notes
                  </h2>
                  <p className="text-sm text-white/60">PDFs, videos, links & more</p>
                </div>
              </div>
              <p className="text-white/85 leading-relaxed text-lg mb-8 max-w-2xl">
                Upload documents, paste YouTube or article links, or start from scratch. Sokrate AI generates clear, editable notes you can refine and reuse for exams and assignments.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-emerald-500 text-white border-0 hover:bg-emerald-400 font-semibold h-12 px-6 shadow-[0_0_20px_-4px_hsl(160_60%_45%/0.4)]"
              >
                <Link to="/signup" className="inline-flex items-center gap-2">
                  Create notes <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </section>

          <div className="grid sm:grid-cols-2 gap-6 mb-20">
            <div
              className={cn(
                "rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8",
                "transition-colors duration-200 hover:border-emerald-500/20 hover:bg-white/[0.06]"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">Flashcards</h3>
              <p className="text-white/70 leading-relaxed mb-5">
                Auto-generate flashcards from your notes. Review and memorize key concepts anywhere.
              </p>
              <Link to="/signup" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div
              className={cn(
                "rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8",
                "transition-colors duration-200 hover:border-emerald-500/20 hover:bg-white/[0.06]"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center mb-5">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">Quizzes</h3>
              <p className="text-white/70 leading-relaxed mb-5">
                Generate quizzes from any note. Test yourself and see where to improve.
              </p>
              <Link to="/signup" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link to="/" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
              ← Back to home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
