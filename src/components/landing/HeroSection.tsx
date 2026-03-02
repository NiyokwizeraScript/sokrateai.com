import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { LandingAIProgressDemo } from "@/components/landing/LandingAIProgressDemo";

export function HeroSection() {
  return (
    <section className="relative min-h-[88dvh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Local soft blurs (aurora is global) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 sm:w-[28rem] sm:h-[28rem] bg-primary/[0.06] rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-1/3 w-56 h-56 sm:w-80 sm:h-80 bg-primary/[0.05] rounded-full blur-[70px]" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[3.5rem] font-bold tracking-tight text-foreground mb-6 sm:mb-8 leading-[1.12] animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Solve Anything.
            <br />
            Understand Everything.
            <br />
            <span className="text-gradient">With Sokrate AI</span>
          </h1>

          <p
            className="max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground mb-10 sm:mb-12 px-1 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Any problem. Any subject. Upload a problem—get step-by-step solutions, clear explanations, and quizzes to learn.
          </p>

          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              size="lg"
              asChild
              className="cta-premium glow-primary h-12 sm:h-[52px] min-h-[48px] px-7 sm:px-9 text-base font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link to="/login" className="inline-flex items-center justify-center">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 sm:h-[52px] min-h-[48px] px-7 sm:px-9 border-border/80 hover:border-primary/30 hover:text-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <a href="#how-it-works" className="inline-flex items-center justify-center">
                <Play className="w-4 h-4 mr-2 shrink-0 text-primary" />
                See How It Works
              </a>
            </Button>
          </div>

          {/* Try it: submit problem → simulated AI progress → CTA */}
          <div
            className="mt-14 sm:mt-20 md:mt-24 px-0 sm:px-4 animate-fade-up"
            style={{ animationDelay: "0.45s" }}
          >
            <LandingAIProgressDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
