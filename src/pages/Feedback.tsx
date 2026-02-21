import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Loader2, Check, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  createFeedback,
  getUserFeedback,
  deleteFeedbackItem,
  type FeedbackItem,
  type FeedbackType,
} from "@/lib/firestore";

const typeLabels: Record<FeedbackType, string> = {
  feedback: "General Feedback",
  bug: "Bug Report",
  feature: "Feature Request",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function Feedback() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [type, setType] = useState<FeedbackType>("feedback");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: feedbackList = [], isLoading: listLoading } = useQuery({
    queryKey: ["userFeedback", user?.uid],
    queryFn: () => getUserFeedback(user!.uid),
    enabled: !!user?.uid,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      await createFeedback(user.uid, { type, subject, message });
      await queryClient.invalidateQueries({ queryKey: ["userFeedback", user.uid] });
      setSubject("");
      setMessage("");
      setSubmitted(true);
      toast({ title: "Feedback sent!", description: "Thank you for your feedback." });
    } catch {
      toast({ title: "Error", description: "Could not send feedback.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item: FeedbackItem) => {
    try {
      await deleteFeedbackItem(item.id);
      await queryClient.invalidateQueries({ queryKey: ["userFeedback", user?.uid] });
      toast({ title: "Removed", description: "Feedback removed." });
    } catch {
      toast({ title: "Error", description: "Could not remove feedback.", variant: "destructive" });
    }
  };

  if (submitted) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">Thank you!</h2>
            <p className="text-muted-foreground mb-6">Your feedback has been submitted successfully.</p>
            <Button onClick={() => setSubmitted(false)}>Send Another</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Feedback</h1>
        </div>
        <p className="text-muted-foreground">Help us improve Sokrate AI with your feedback.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="feedback">{typeLabels.feedback}</SelectItem>
                  <SelectItem value="bug">{typeLabels.bug}</SelectItem>
                  <SelectItem value="feature">{typeLabels.feature}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us more..." className="min-h-[120px]" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold text-foreground mb-3">Your feedback</h2>
          {listLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : feedbackList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">You haven’t submitted any feedback yet.</p>
          ) : (
            <ul className="space-y-2">
              {feedbackList.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{typeLabels[item.type]} · {formatDateTime(item.createdAt)}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-70 hover:opacity-100 hover:text-destructive"
                    onClick={() => handleDelete(item)}
                    aria-label="Delete feedback"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}