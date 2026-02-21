import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Clock, FileText, ScanLine, Trophy, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getStudyHistory, deleteHistoryItem, type HistoryItem, type HistoryItemType } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const typeIcons: Record<HistoryItemType, typeof ScanLine> = {
  solver: ScanLine,
  synthesizer: FileText,
  quiz: Trophy,
};

const typeLabels: Record<HistoryItemType, string> = {
  solver: "Solver",
  synthesizer: "Synthesizer",
  quiz: "Quiz",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function History() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: studyHistory = [], isLoading } = useQuery({
    queryKey: ["studyHistory", user?.uid],
    queryFn: () => getStudyHistory(user!.uid),
    enabled: !!user?.uid,
  });

  const handleDelete = async (item: HistoryItem) => {
    if (!user?.uid) return;
    try {
      await deleteHistoryItem(user.uid, item.id);
      await queryClient.invalidateQueries({ queryKey: ["studyHistory", user.uid] });
      await queryClient.invalidateQueries({ queryKey: ["recentActivity", user.uid] });
      toast({ title: "Removed", description: "Item removed from study history." });
    } catch {
      toast({ title: "Error", description: "Could not remove item.", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-400 flex items-center justify-center">
            <HistoryIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Study History</h1>
        </div>
        <p className="text-muted-foreground">Review your past study sessions and solutions.</p>
      </div>

      <Card>
        <CardContent className="py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : studyHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No history yet</h3>
              <p className="text-sm text-muted-foreground">
                Your study sessions will appear here as you use the Solver, Synthesizer, and Quizzes.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {studyHistory.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 group"
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        item.type === "solver" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                        item.type === "synthesizer" && "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                        item.type === "quiz" && "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{item.title}</p>
                      {item.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.summary}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(item.createdAt)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-70 hover:opacity-100 hover:text-destructive"
                      onClick={() => handleDelete(item)}
                      aria-label="Remove from history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}