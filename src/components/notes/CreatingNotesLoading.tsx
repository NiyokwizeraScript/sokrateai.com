import { Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatingNotesLoadingProps {
  message?: string;
  progress?: number;
  className?: string;
}

export function CreatingNotesLoading({
  message = "Creating your notes...",
  progress = 0,
  className,
}: CreatingNotesLoadingProps) {
  const displayPercent = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      <div
        className={cn(
          "rounded-2xl border border-border shadow-xl p-8 max-w-md w-full mx-4",
          "bg-gradient-to-b from-card to-card/80",
          "dark:from-primary/10 dark:to-primary/5 dark:border-primary/20"
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 className="font-bold text-xl text-foreground">Creating Your Notes</h2>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm shrink-0">
            <Clock className="h-4 w-4" />
            <span>This should take a few seconds...</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-foreground tabular-nums">{displayPercent}%</span>
        </div>

        <div className="h-2.5 rounded-full bg-muted dark:bg-primary/20 overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-primary dark:bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${displayPercent}%` }}
          />
        </div>

        <p className="text-sm text-foreground text-center mb-6">{message}</p>

        <div className="rounded-lg bg-muted/50 dark:bg-primary/10 border border-border dark:border-primary/20 p-3">
          <p className="text-[10px] uppercase tracking-wider font-medium text-primary mb-1">Tip</p>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            You can paste a transcript or add key points in the note after it’s created.
          </p>
        </div>
      </div>
    </div>
  );
}
