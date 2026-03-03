import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload, ArrowRight, Check } from "lucide-react";

const PROGRESS_STEPS = [
  { id: "reading", label: "Reading your input…", duration: 900 },
  { id: "analyzing", label: "Analyzing problem…", duration: 1100 },
  { id: "generating", label: "Generating solution…", duration: 1200 },
];

const TOTAL_MS = PROGRESS_STEPS.reduce((acc, s) => acc + s.duration, 0);

export function LandingAIProgressDemo() {
  const [phase, setPhase] = useState<"idle" | "progress" | "done">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    setPhase("progress");
    setStepIndex(0);
    setProgressPercent(0);

    let elapsed = 0;
    const interval = 50;
    const timer = setInterval(() => {
      elapsed += interval;
      const p = Math.min(100, (elapsed / TOTAL_MS) * 100);
      setProgressPercent(p);
      // Derive current step from elapsed time so we don't rely on stale stepIndex
      let acc = 0;
      let newStep = 0;
      for (let i = 0; i < PROGRESS_STEPS.length; i++) {
        acc += PROGRESS_STEPS[i].duration;
        if (elapsed >= acc) newStep = i + 1;
      }
      setStepIndex(Math.min(newStep, PROGRESS_STEPS.length - 1));
    }, interval);

    setTimeout(() => {
      clearInterval(timer);
      setProgressPercent(100);
      setStepIndex(PROGRESS_STEPS.length - 1);
      setPhase("done");
    }, TOTAL_MS);
  };

  const handleTryAgain = () => {
    setPhase("idle");
    setStepIndex(0);
    setProgressPercent(0);
  };

  if (phase === "done") {
    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-card/95 shadow-soft-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-border bg-muted/40">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary/90" />
            </div>
          </div>
          <div className="p-6 sm:p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 text-primary mb-4">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Solution ready
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Sign up to get the full step-by-step solution and explanations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="glow-primary">
                <Link to="/signup" className="inline-flex items-center gap-2">
                  Get full solution
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" onClick={handleTryAgain}>
                Try another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "progress") {
    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-border/90 bg-card/95 shadow-soft-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-border bg-muted/40">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary/90" />
            </div>
          </div>
          <div className="p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary animate-pulse shrink-0" />
              <span className="text-sm font-medium text-foreground">
                AI is working…
              </span>
            </div>
            <div className="space-y-3 mb-6">
              {PROGRESS_STEPS.map((step, i) => (
                <div
                  key={step.id}
                  className={`
                    flex items-center gap-3 text-sm transition-colors duration-300
                    ${i < stepIndex ? "text-muted-foreground" : ""}
                    ${i === stepIndex ? "text-foreground" : ""}
                    ${i > stepIndex ? "text-muted-foreground/70" : ""}
                  `}
                >
                  {i < stepIndex ? (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  ) : i === stepIndex ? (
                    <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-muted shrink-0" />
                  )}
                  <span>{i <= stepIndex && i === stepIndex ? step.label : i < stepIndex ? step.label.replace("…", "") : step.label}</span>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/80 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden border border-border/90 bg-card/95 shadow-soft-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-border bg-muted/40">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary/90" />
          </div>
        </div>
        <div className="p-5 sm:p-6 md:p-8 bg-card/80">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium tracking-wide flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Paste a problem or type your question
          </p>
          <textarea
            ref={inputRef}
            placeholder="e.g. Solve: x² + 5x + 6 = 0"
            className="w-full min-h-[100px] sm:min-h-[112px] p-4 rounded-xl bg-muted/50 border border-border font-mono text-sm sm:text-base text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            rows={3}
          />
          <div className="mt-4 flex justify-end">
            <Button
              size="lg"
              onClick={handleSubmit}
              className="gap-2 glow-primary"
            >
              <Sparkles className="w-4 h-4" />
              See AI in action
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
