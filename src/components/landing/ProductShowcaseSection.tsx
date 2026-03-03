import { Link } from "react-router-dom";
import { FileText, Youtube, FileUp, Smartphone, Monitor, Tablet } from "lucide-react";
import { SectionReveal, RevealStagger } from "./SectionReveal";
import { cn } from "@/lib/utils";

export function ProductShowcaseSection() {
  return (
    <SectionReveal>
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Top card: Turn anything into an editable note → for-students#notes */}
          <RevealStagger index={0}>
            <Link
              to="/for-students#notes"
              className={cn(
                "block rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8 md:p-10",
                "transition-colors duration-200 hover:bg-white/[0.08] hover:border-emerald-500/20"
              )}
            >
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                Turn anything into an editable note
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl">
                Transform PDFs, videos, and audio into notes you can edit and share.
              </p>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                    <FileUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-white/80">DOC, PDF, PPT</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                    <Youtube className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-white/80">Videos & links</span>
                  </div>
                  <div className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-4 py-2">
                    <span className="text-xs sm:text-sm font-medium text-emerald-300">Generating notes…</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 max-w-sm shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-white/90">Sample note</span>
                  </div>
                  <p className="text-xs text-white/60 line-clamp-2">
                    Power series, Taylor and Maclaurin. Coefficients and convergence…
                  </p>
                </div>
              </div>
            </Link>
          </RevealStagger>

          {/* Bottom row: two cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: Study smarter → for-students (top of page) */}
            <RevealStagger index={1}>
              <Link
                to="/for-students"
                className={cn(
                  "block rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8 h-full",
                  "transition-colors duration-200 hover:bg-white/[0.08] hover:border-emerald-500/20"
                )}
              >
                <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                  Study smarter, not harder
                </h2>
                <p className="text-white/70 text-sm mb-6">
                  Generate quizzes and flashcards from your notes. Test yourself and see where to improve.
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/70 mb-3">Which best explains why entropy increases in a closed system?</p>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60 border border-white/5">A. Energy is destroyed…</div>
                    <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60 border border-white/5">B. Atoms lose mass…</div>
                  </div>
                </div>
              </Link>
            </RevealStagger>

            {/* Right: All your devices */}
            <RevealStagger index={2}>
              <div
                className={cn(
                  "rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8 h-full"
                )}
              >
                <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                  All your devices. Always synced.
                </h2>
                <p className="text-white/70 text-sm mb-6">
                  Sokrate works on the web and mobile. Your notes and quizzes stay in sync everywhere.
                </p>
                <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center gap-2">
                    <Monitor className="w-8 h-8 text-emerald-400/80" />
                    <span className="text-xs text-white/60">Web</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center gap-2">
                    <Tablet className="w-8 h-8 text-emerald-400/80" />
                    <span className="text-xs text-white/60">Tablet</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center gap-2">
                    <Smartphone className="w-8 h-8 text-emerald-400/80" />
                    <span className="text-xs text-white/60">Mobile</span>
                  </div>
                </div>
              </div>
            </RevealStagger>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
