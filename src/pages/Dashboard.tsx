import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScanLine, FileText, Trophy, History, ArrowRight, Sparkles, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getRecentActivity, deleteHistoryItem, type HistoryItem, type HistoryItemType } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const tools = [
    {
        title: "The Solver",
        description: "Upload a problem and get a step-by-step AI solution",
        icon: ScanLine,
        href: "/solver",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "The Synthesizer",
        description: "Upload documents and get AI-powered explanations",
        icon: FileText,
        href: "/synthesizer",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        title: "The Quizzes",
        description: "Generate quizzes from your documents",
        icon: Trophy,
        href: "/quizzes",
        gradient: "from-amber-500 to-orange-500",
    },
];

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

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Dashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const userName = user?.displayName ?? "Student";

    const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
      queryKey: ["recentActivity", user?.uid],
      queryFn: () => getRecentActivity(user!.uid, 5),
      enabled: !!user?.uid,
    });

    const handleDeleteActivity = async (item: HistoryItem) => {
      if (!user?.uid) return;
      try {
        await deleteHistoryItem(user.uid, item.id);
        await queryClient.invalidateQueries({ queryKey: ["recentActivity", user.uid] });
        await queryClient.invalidateQueries({ queryKey: ["studyHistory", user.uid] });
        toast({ title: "Removed", description: "Activity removed from your history." });
      } catch {
        toast({ title: "Error", description: "Could not remove activity.", variant: "destructive" });
      }
    };

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-foreground">
                    Welcome back, <span className="text-primary">{userName}</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                    What would you like to study today?
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {tools.map((tool) => (
                    <Link key={tool.title} to={tool.href}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3`}>
                                    <tool.icon className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-lg font-heading flex items-center gap-2">
                                    {tool.title}
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-heading">Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/history" className="flex items-center gap-1">
                            <History className="h-4 w-4" />
                            View All
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {activityLoading ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : recentActivity.length === 0 ? (
                        <div className="text-center py-8">
                            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-medium text-foreground mb-2">No activity yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start solving problems, synthesizing documents, or taking quizzes!
                            </p>
                            <Button asChild>
                                <Link to="/solver">
                                    Get Started
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {recentActivity.map((item) => {
                                const Icon = typeIcons[item.type];
                                return (
                                    <li
                                        key={item.id}
                                        className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 group"
                                    >
                                        <div className={cn(
                                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                            item.type === "solver" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                                            item.type === "synthesizer" && "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                                            item.type === "quiz" && "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        )}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-foreground truncate">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {typeLabels[item.type]} · {formatDate(item.createdAt)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 shrink-0 opacity-70 hover:opacity-100 hover:text-destructive"
                                            onClick={() => handleDeleteActivity(item)}
                                            aria-label="Remove activity"
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