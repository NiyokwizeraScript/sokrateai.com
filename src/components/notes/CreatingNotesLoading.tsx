import { Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatingNotesLoadingProps {
  message?: string;
  className?: string;
}

export function CreatingNotesLoading({ message = "Creating your notes...", className }: CreatingNotesLoadingProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="rounded-2xl border bg-card shadow-lg p-8 max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
          </div>
        </div>
        <h2 className="font-semibold text-lg text-foreground mb-1">{message}</h2>
        <p className="text-sm text-muted-foreground mb-6">This should take a moment...</p>
        <div className="flex justify-center">
          <div className="h-2 w-full max-w-[200px] rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary animate-loading-bar" style={{ width: "20%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
