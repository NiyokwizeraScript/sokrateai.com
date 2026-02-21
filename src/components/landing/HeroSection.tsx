import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85dvh] sm:min-h-screen flex items-center justify-center pt-24 pb-12 sm:pt-28 sm:pb-16 px-4 overflow-hidden bg-white">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-green-400/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(0,0,0) 1px, transparent 1px), linear-gradient(90deg, rgb(0,0,0) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-green-600">Powered by Advanced AI</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight">
            Solve Anything.
            <br />
            Understand Everything.
            <br />
            <span className="text-gradient">With Sokrate AI</span>
          </h1>

          <p className="max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 px-1">
            Any problem. Any subject. Upload a problem—get step-by-step solutions, clear explanations, and quizzes to learn.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" asChild className="glow-primary text-base px-6 sm:px-8 h-11 sm:h-12 min-h-[44px]">
              <Link to="/login" className="inline-flex items-center justify-center">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-11 sm:h-12 min-h-[44px] px-6 sm:px-8">
              <a href="#how-it-works" className="inline-flex items-center justify-center">
                <Play className="w-4 h-4 mr-2 shrink-0 text-green-600" />
                See How It Works
              </a>
            </Button>
          </div>

          <div className="mt-12 sm:mt-16 md:mt-20 px-0 sm:px-4">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xl bg-white">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 bg-slate-50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400/70" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400/70" />
                  </div>
                </div>
                <div className="p-4 sm:p-6 md:p-8 bg-white">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Input your problem</p>
                      <div className="p-3 sm:p-4 rounded-lg bg-slate-100 border border-slate-200">
                        <p className="text-xs sm:text-sm text-slate-700 font-mono break-all">d²y/dx² + 4y = cos(2x)</p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-green-600" /> AI solution
                      </p>
                      <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-100">
                        <p className="text-xs sm:text-sm text-slate-700">Step-by-step solution with explanations.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}