import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Resizable, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getNote } from "@/lib/firestore";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function NoteQuizView() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const { data: note } = useQuery({
    queryKey: ["note", user?.uid, noteId],
    queryFn: () => getNote(user!.uid, noteId!),
    enabled: !!user?.uid && !!noteId,
  });

  useEffect(() => {
    if (!note?.content) return;
    api
      .post<{ questions: QuizQuestion[] }>("/api/notes/quiz", { noteContent: note.content })
      .then((res) => {
        setQuestions(res.questions ?? []);
      })
      .catch(() => {
        toast({ title: "Error", description: "Could not generate quiz.", variant: "destructive" });
      })
      .finally(() => setQuizLoading(false));
  }, [note?.content, toast]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !note) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim() };
    setMessages((m) => [...m, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await api.post<{ reply: string }>("/api/notes/chat", {
        noteContent: note.content.slice(0, 15000),
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      toast({ title: "Error", description: "Could not get reply.", variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

  const correctCount = questions
    ? questions.filter((q) => answers[q.id] === q.correct).length
    : 0;
  const total = questions?.length ?? 0;

  if (!user?.uid || !noteId) return null;
  if (!note) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="flex items-center gap-2 border-b bg-background px-4 py-2 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/notes/${noteId}`)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to notes
        </Button>
        <div className="flex-1" />
        <span className="flex items-center gap-1 text-sm font-medium text-foreground">
          <Trophy className="h-4 w-4" />
          Quiz
        </span>
      </header>

      <Resizable direction="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full overflow-y-auto p-4">
            {quizLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !questions?.length ? (
              <p className="text-sm text-muted-foreground">No questions generated.</p>
            ) : (
              <div className="space-y-4">
                {!showResults && (
                  <Button onClick={() => setShowResults(true)} className="w-full">
                    Submit & see results
                  </Button>
                )}
                {showResults && (
                  <p className="text-sm font-medium text-foreground">
                    Score: {correctCount}/{total}
                  </p>
                )}
                {questions.map((q) => (
                  <Card key={q.id}>
                    <CardContent className="pt-4">
                      <p className="font-medium text-foreground mb-2">{q.question}</p>
                      <ul className="space-y-2">
                        {q.options.map((opt, idx) => {
                          const isChosen = answers[q.id] === idx;
                          const isCorrect = idx === q.correct;
                          const showCorrect = showResults && isCorrect;
                          const showWrong = showResults && isChosen && !isCorrect;
                          return (
                            <li key={idx}>
                              <button
                                type="button"
                                onClick={() => !showResults && setAnswers((a) => ({ ...a, [q.id]: idx }))}
                                disabled={showResults}
                                className={cn(
                                  "w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors",
                                  showCorrect && "border-green-500 bg-green-500/10",
                                  showWrong && "border-red-500 bg-red-500/10",
                                  !showResults && isChosen && "border-primary bg-primary/10"
                                )}
                              >
                                {opt}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col border-l bg-muted/20">
            <div className="p-4 border-b">
              <p className="font-medium text-foreground">Ask about your notes</p>
              <p className="text-sm text-muted-foreground">Get help while you quiz.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">Type a question below.</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <span
                    className={
                      m.role === "user"
                        ? "inline-block rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm"
                        : "inline-block rounded-lg bg-muted px-3 py-2 text-sm text-foreground"
                    }
                  >
                    {m.content}
                  </span>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>
            <div className="p-4 border-t flex gap-2">
              <Input
                placeholder="Type a question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={chatLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ResizablePanel>
      </Resizable>
    </div>
  );
}
