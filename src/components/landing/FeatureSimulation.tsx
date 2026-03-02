import { useState, useEffect } from "react";
import { FileUp, Link as LinkIcon, Sparkles, Check, FileText, Trophy, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

const PROGRESS_STEPS = [
  { label: "Reading…", duration: 800 },
  { label: "Analyzing…", duration: 900 },
  { label: "Generating notes…", duration: 1000 },
];
const TOTAL_MS = PROGRESS_STEPS.reduce((a, s) => a + s.duration, 0);
const DONE_SHOW_MS = 2200;
const IDLE_SHOW_MS = 2800;

const PHASE_TRANSITION = "transition-all duration-500 ease-out";

type SimKind = "doc-upload" | "link" | "ai-notes" | "quizzes";

export function FeatureSimulation({ kind }: { kind: SimKind }) {
  const [phase, setPhase] = useState<"idle" | "progress" | "done">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (phase !== "progress") return;
    let elapsed = 0;
    const interval = 50;
    const t = setInterval(() => {
      elapsed += interval;
      setProgressPercent(Math.min(100, (elapsed / TOTAL_MS) * 100));
      let acc = 0;
      let newStep = 0;
      for (let i = 0; i < PROGRESS_STEPS.length; i++) {
        acc += PROGRESS_STEPS[i].duration;
        if (elapsed >= acc) newStep = i + 1;
      }
      setStepIndex(Math.min(newStep, PROGRESS_STEPS.length - 1));
    }, interval);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const runCycle = () => {
      if (cancelled) return;
      setPhase("progress");
      setStepIndex(0);
      setProgressPercent(0);
      timeouts.push(setTimeout(() => {
        if (cancelled) return;
        setPhase("done");
        setProgressPercent(100);
        setStepIndex(PROGRESS_STEPS.length - 1);
        timeouts.push(setTimeout(() => {
          if (cancelled) return;
          setPhase("idle");
          timeouts.push(setTimeout(runCycle, IDLE_SHOW_MS));
        }, DONE_SHOW_MS));
      }, TOTAL_MS));
    };
    timeouts.push(setTimeout(runCycle, 600));
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const isQuiz = kind === "quizzes";
  if (isQuiz && (phase === "idle" || phase === "progress" || phase === "done")) {
    return <QuizSimulation phase={phase} />;
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border/80 bg-card/95 shadow-soft-sm backdrop-blur-sm w-full max-w-sm pointer-events-none">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <div className="w-2 h-2 rounded-full bg-red-500/80" />
        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
        <div className="w-2 h-2 rounded-full bg-primary/80" />
      </div>
      <div className={cn("p-4 min-h-[140px]", PHASE_TRANSITION)}>
        {phase === "idle" && (
          <div className={cn("animate-fade-in", PHASE_TRANSITION)} style={{ animationDuration: "400ms" }}>
            <IdleContent kind={kind} />
          </div>
        )}
        {phase === "progress" && (
          <div className={cn("animate-fade-in", PHASE_TRANSITION)} style={{ animationDuration: "350ms" }}>
            <ProgressContent stepIndex={stepIndex} progressPercent={progressPercent} />
          </div>
        )}
        {phase === "done" && (
          <div className={cn("animate-fade-in", PHASE_TRANSITION)} style={{ animationDuration: "450ms" }}>
            <DoneContent kind={kind} />
          </div>
        )}
      </div>
    </div>
  );
}

function IdleContent({ kind }: { kind: SimKind }) {
  if (kind === "doc-upload") {
    return (
      <>
        <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1.5">
          <FileUp className="w-3.5 h-3.5" /> Drop document
        </p>
        <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 h-16 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">PDF, DOC, image…</span>
        </div>
      </>
    );
  }
  if (kind === "link") {
    return (
      <>
        <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5" /> Paste URL
        </p>
        <div className="rounded-lg bg-muted/50 border border-border h-9 px-3 flex items-center">
          <span className="text-xs text-muted-foreground truncate">https://youtube.com/watch?v=…</span>
        </div>
      </>
    );
  }
  if (kind === "ai-notes") {
    return (
      <>
        <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> New note
        </p>
        <div className="rounded-lg bg-muted/50 border border-border h-14 p-2">
          <div className="h-2 w-3/4 rounded bg-muted-foreground/30 mb-2" />
          <div className="h-2 w-1/2 rounded bg-muted-foreground/20" />
        </div>
      </>
    );
  }
  return null;
}

function ProgressContent({ stepIndex, progressPercent }: { stepIndex: number; progressPercent: number }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse shrink-0" />
        <span className="text-xs font-medium text-foreground">AI is working…</span>
      </div>
      <div className="space-y-2 mb-3">
        {PROGRESS_STEPS.map((step, i) => (
          <div
            key={step.label}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors duration-300",
              i <= stepIndex ? "text-foreground" : "text-muted-foreground/70"
            )}
          >
            {i < stepIndex ? (
              <Check className="w-3 h-3 text-primary shrink-0" />
            ) : i === stepIndex ? (
              <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
            ) : (
              <span className="w-3 h-3 rounded-full bg-muted shrink-0" />
            )}
            {step.label}
          </div>
        ))}
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/80 transition-[width] duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </>
  );
}

function DoneContent({ kind }: { kind: SimKind }) {
  if (kind === "doc-upload") {
    return (
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
          <ListChecks className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-xs font-medium text-foreground">Document processed</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Summary + notes</p>
      </div>
    );
  }
  if (kind === "link") {
    return (
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <div className="w-9 h-9 rounded-full bg-rose-500/20 flex items-center justify-center mb-2">
          <LinkIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        </div>
        <p className="text-xs font-medium text-foreground">Notes from link</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Ready to study</p>
      </div>
    );
  }
  if (kind === "ai-notes") {
    return (
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center mb-2">
          <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <p className="text-xs font-medium text-foreground">Note saved</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">AI-assisted</p>
      </div>
    );
  }
  return null;
}

function QuizSimulation({ phase }: { phase: "idle" | "progress" | "done" }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border/80 bg-card/95 shadow-soft-sm backdrop-blur-sm w-full max-w-sm pointer-events-none">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <div className="w-2 h-2 rounded-full bg-red-500/80" />
        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
        <div className="w-2 h-2 rounded-full bg-primary/80" />
      </div>
      <div className={cn("p-4 min-h-[140px]", PHASE_TRANSITION)}>
        {phase === "idle" && (
          <div className={cn("animate-fade-in", PHASE_TRANSITION)} style={{ animationDuration: "400ms" }}>
            <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Quiz from note
            </p>
            <p className="text-xs text-foreground font-medium mb-2">Q1: What is…?</p>
            <div className="space-y-1.5">
              {["A) Option 1", "B) Option 2", "C) Option 3"].map((opt, i) => (
                <div key={i} className="rounded-md border border-border bg-muted/30 px-2 py-1.5 text-xs text-muted-foreground">
                  {opt}
                </div>
              ))}
            </div>
          </div>
        )}
        {phase === "progress" && (
          <div className={cn("flex flex-col items-center justify-center py-4 animate-fade-in", PHASE_TRANSITION)} style={{ animationDuration: "350ms" }}>
            <span className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
            <p className="text-xs text-muted-foreground">Checking answer…</p>
          </div>
        )}
        {phase === "done" && (
          <div className={cn("flex flex-col items-center justify-center py-2 text-center animate-fade-in", PHASE_TRANSITION)} style={{ animationDuration: "450ms" }}>
            <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
              <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs font-medium text-foreground">Correct</p>
            <p className="text-xs text-muted-foreground mt-0.5">Next question →</p>
          </div>
        )}
      </div>
    </div>
  );
}
