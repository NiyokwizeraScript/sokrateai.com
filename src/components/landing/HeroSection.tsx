import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, BookOpen, FlaskConical, Atom } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-glow"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(0,0,0) 1px, transparent 1px), linear-gradient(90deg, rgb(0,0,0) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating elements */}
        <div className="absolute top-[20%] left-[10%] hidden md:block animate-float">
          <Sparkles className="w-6 h-6 text-green-500/30" />
        </div>
        <div className="absolute top-[30%] right-[15%] hidden md:block animate-float" style={{ animationDelay: "1s" }}>
          <BookOpen className="w-8 h-8 text-blue-500/30" />
        </div>
        <div className="absolute bottom-[30%] left-[20%] hidden md:block animate-float" style={{ animationDelay: "2s" }}>
          <FlaskConical className="w-7 h-7 text-orange-500/30" />
        </div>
        <div className="absolute bottom-[20%] right-[10%] hidden md:block animate-float" style={{ animationDelay: "0.5s" }}>
          <Atom className="w-8 h-8 text-purple-500/30" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8 animate-fade-in"
          >
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Powered by Advanced AI
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in stagger-1 leading-tight"
          >
            <span className="text-slate-900">Solve Anything</span>
            <br />
            <span className="text-slate-900">Understand Everything</span>
            <br />
            <span
              className="bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% 100%" }}
            >
              With Sokrate AI
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 animate-fade-in stagger-2"
          >
            Any problem. Any subject. Upload any problem - get step-by-step
            solutions, clear explanations, and custom quizzes to actually learn.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3"
          >
            <Button size="lg" asChild className="glow-primary text-base px-8 h-12">
              <Link to="/login">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 h-12 group"
              asChild
            >
              <a href="#how-it-works">
                <Play className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                See How It Works
              </a>
            </Button>
          </div>

          {/* App Preview Mockup */}
          <div
            className="mt-16 md:mt-20 relative animate-fade-in stagger-4"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Glow effect behind the card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/15 via-green-400/15 to-green-500/15 rounded-2xl blur-2xl opacity-50" />

              {/* Main preview card */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-white/80">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-white">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </div>

                {/* App preview content */}
                <div className="p-6 md:p-8 bg-gradient-to-b from-white to-slate-50">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Input area mockup */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Input Your Problem
                      </div>
                      <div className="p-4 rounded-lg bg-slate-100 border border-slate-200">
                        <p className="text-sm text-slate-900 font-mono">
                          Solve the differential equation:
                        </p>
                        <p className="text-lg mt-2 text-primary font-mono">
                          d²y/dx² + 4y = cos(2x)
                        </p>
                      </div>
                    </div>

                    {/* Output area mockup */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        AI-Powered Solution
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm text-slate-900">
                          <span className="text-primary font-semibold">Step 1:</span> Find the complementary solution...
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          y_c = C1cos(2x) + C2sin(2x)
                        </p>
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