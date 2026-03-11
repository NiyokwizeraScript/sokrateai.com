import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Resizable, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2, Trophy, MessageSquare, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getNote } from "@/lib/firestore";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PremiumMarkdown } from "@/components/notes/PremiumMarkdown";

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
  const [mobilePanel, setMobilePanel] = useState<"quiz" | "chat">("quiz");

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

  const handleRetryQuiz = () => {
    if (!note?.content) return;
    setQuizLoading(true);
    setQuestions(null);
    setAnswers({});
    setShowResults(false);
    api
      .post<{ questions: QuizQuestion[] }>("/api/notes/quiz", { noteContent: note.content })
      .then((res) => setQuestions(res.questions ?? []))
      .catch(() => {
        toast({ title: "Error", description: "Could not generate quiz.", variant: "destructive" });
      })
      .finally(() => setQuizLoading(false));
  };

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

  const QuizContent = () => (
    <div className="h-full overflow-y-auto p-3 sm:p-4">
      {quizLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="rounded-full bg-amber-500/20 p-4">
            <Loader2 className="h-10 w-10 animate-spin text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-sm font-medium text-foreground">Creating your quiz…</p>
        </div>
      ) : !questions?.length ? (
        <p className="text-sm text-muted-foreground">No questions generated.</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {showResults && (
            <div className="rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-200 dark:border-amber-800 px-3 sm:px-4 py-3">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Score: {correctCount}/{total}
              </p>
            </div>
          )}
          {questions.map((q) => (
            <Card key={q.id} className="border-2 border-amber-100 dark:border-amber-900/50 overflow-hidden">
              <CardContent className="pt-3 sm:pt-4 px-3 sm:px-4 pb-3 sm:pb-4 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent">
                <p className="font-medium text-foreground mb-3 text-sm sm:text-base">{q.question}</p>
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
                            "w-full text-left rounded-xl border-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm transition-all",
                            showCorrect && "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
                            showWrong && "border-red-500 bg-red-500/15 text-red-800 dark:text-red-200",
                            !showResults && isChosen && "border-amber-500 bg-amber-500/15 text-amber-900 dark:text-amber-100",
                            !showResults && !isChosen && "border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-950/30"
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
          {!showResults ? (
            <Button
              onClick={() => setShowResults(true)}
              className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              size="lg"
            >
              Submit & see results
            </Button>
          ) : (
            <Button
              onClick={handleRetryQuiz}
              variant="outline"
              className="w-full rounded-xl border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50"
              size="lg"
            >
              Try another quiz
            </Button>
          )}
        </div>
      )}
    </div>
  );

  const ChatContent = () => (
    <div className="h-full flex flex-col bg-muted/20">
      <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-amber-500/5 to-transparent">
        <p className="font-medium text-foreground text-sm sm:text-base">Ask about your notes</p>
        <p className="text-xs sm:text-sm text-muted-foreground">Get help while you quiz.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">Type a question below.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            {m.role === "user" ? (
              <span className="inline-block rounded-lg bg-amber-600 text-white px-3 py-2 text-sm max-w-[85%]">
                {m.content}
              </span>
            ) : (
              <div className="inline-block w-full max-w-full rounded-xl border border-amber-500/15 bg-[#0B0F14]/50 dark:bg-muted/80 px-3 sm:px-4 py-3 text-left">
                <PremiumMarkdown content={m.content} className="text-sm" />
              </div>
            )}
          </div>
        ))}
        {chatLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking...
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 border-t flex gap-2">
        <Input
          placeholder="Type a question..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          className="text-sm"
        />
        <Button onClick={handleSendMessage} disabled={chatLoading} className="bg-amber-600 hover:bg-amber-700 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="flex items-center gap-1 sm:gap-2 border-b bg-background px-2 sm:px-4 py-2 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/notes/${noteId}`)} className="h-8 px-2 sm:px-3">
          <ArrowLeft className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Back to notes</span>
        </Button>
        <div className="flex-1" />
        <span className="flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400">
          <Trophy className="h-4 w-4" />
          <span className="hidden xs:inline">Quiz</span>
        </span>
      </header>

      {/* Mobile panel toggle */}
      <div className="md:hidden flex border-b bg-muted/30 shrink-0">
        <button
          type="button"
          onClick={() => setMobilePanel("quiz")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            mobilePanel === "quiz"
              ? "text-amber-700 dark:text-amber-400 border-b-2 border-amber-500 bg-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <HelpCircle className="h-4 w-4" />
          Quiz
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            mobilePanel === "chat"
              ? "text-amber-700 dark:text-amber-400 border-b-2 border-amber-500 bg-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          AI Chat
        </button>
      </div>

      {/* Desktop: Resizable panels - only render on md+ */}
      <div className="hidden md:flex flex-1 min-h-0">
        <Resizable direction="horizontal" className="flex-1 min-h-0 flex">
        <ResizablePanel defaultSize={50} minSize={30}>
          <QuizContent />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full border-l">
            <ChatContent />
          </div>
        </ResizablePanel>
        </Resizable>
      </div>

      {/* Mobile: Single panel view */}
      <div className="md:hidden flex-1 min-h-0 overflow-hidden">
        {mobilePanel === "quiz" ? <QuizContent /> : <ChatContent />}
      </div>
    </div>
  );
}
