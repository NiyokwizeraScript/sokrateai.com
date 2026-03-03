import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BookOpen, Trophy } from "lucide-react";
import { SokrateLogo } from "@/components/auth/SokrateLogo";
export default function ForStudents() {
  return (
    <div className="landing-page min-h-screen bg-[#0B0F14] text-foreground">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center text-white [&_span]:!text-white [&_.text-gray-600]:!text-white/80">
            <SokrateLogo className="scale-75 origin-left" />
          </Link>
          <Button asChild size="sm" className="rounded-full bg-emerald-500 text-white border-0 hover:bg-emerald-400">
            <Link to="/login">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <section className="text-center mb-20">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            For Students
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Notes, flashcards, and quizzes from your materials. Study smarter with Sokrate AI.
          </p>
        </section>

        <section id="notes" className="scroll-mt-24">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-10 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Turn anything into notes
                </h2>
                <p className="text-sm text-white/70">PDFs, videos, links & more</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-6">
              Upload documents, paste YouTube or article links, or start from scratch. Sokrate AI generates clear, editable notes you can refine and reuse for exams and assignments.
            </p>
            <Button asChild className="rounded-xl bg-emerald-500 text-white border-0 hover:bg-emerald-400">
              <Link to="/login" className="inline-flex items-center gap-2">
                Create notes <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">Flashcards</h3>
            <p className="text-sm text-white/70 mb-4">
              Auto-generate flashcards from your notes. Review and memorize key concepts anywhere.
            </p>
            <Link to="/login" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
              Get started →
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">Quizzes</h3>
            <p className="text-sm text-white/70 mb-4">
              Generate quizzes from any note. Test yourself and see where to improve.
            </p>
            <Link to="/login" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
              Get started →
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/" className="text-white/70 hover:text-white text-sm">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
