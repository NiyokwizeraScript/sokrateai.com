import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, Clock, FileText, ScanLine, Trophy } from "lucide-react";

export default function History() {
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
                <CardContent className="py-12">
                    <div className="text-center">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-foreground mb-2">No history yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Your study sessions will appear here as you use the Solver, Synthesizer, and Quizzes.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}