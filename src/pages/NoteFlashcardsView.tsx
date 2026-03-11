import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Resizable, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2, Layers, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getNote } from "@/lib/firestore";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PremiumMarkdown } from "@/components/notes/PremiumMarkdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function NoteFlashcardsView() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"cards" | "chat">("cards");

  const { data: note } = useQuery({
    queryKey: ["note", user?.uid, noteId],
    queryFn: () => getNote(user!.uid, noteId!),
    enabled: !!user?.uid && !!noteId,
  });

  useEffect(() => {
    if (!note?.content) return;
    const plainContent = note.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!plainContent) {
      setCards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .post<{ cards: { front: string; back: string }[] }>("/api/notes/flashcards", {
        noteContent: plainContent.slice(0, 20000),
      })
      .then((res) => setCards(res.cards ?? []))
      .catch(() => {
        toast({ title: "Error", description: "Could not generate flashcards.", variant: "destructive" });
        setCards([]);
      })
      .finally(() => setLoading(false));
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

  if (!user?.uid || !noteId) return null;
  if (!note) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const FlashcardsContent = () => (
    <div className="h-full overflow-y-auto p-3 sm:p-4 flex flex-col items-center justify-center min-h-0">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="rounded-full bg-violet-500/20 p-4">
            <Loader2 className="h-10 w-10 animate-spin text-violet-600 dark:text-violet-400" />
          </div>
          <p className="text-sm font-medium text-foreground">Creating your flashcards…</p>
          <p className="text-xs text-muted-foreground">Click the card to flip once they're ready.</p>
        </div>
      ) : cards.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No flashcards yet. Add content to your note and try again.</p>
      ) : (
        <div className="w-full max-w-md space-y-4 px-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-violet-600 dark:text-violet-400">{index + 1}</span>
            <span>/</span>
            <span>{cards.length}</span>
          </div>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className={cn(
              "w-full min-h-[150px] sm:min-h-[180px] rounded-2xl border-2 p-4 sm:p-6 text-left transition-all duration-300",
              "bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40",
              "border-violet-200 dark:border-violet-800",
              "hover:shadow-lg hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-2">
              {flipped ? "Answer" : "Question"}
            </p>
            <p className="font-medium text-foreground text-sm sm:text-base leading-relaxed">
              {flipped ? cards[index]?.back : cards[index]?.front}
            </p>
          </button>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              disabled={index === 0}
              onClick={() => { setIndex((i) => Math.max(0, i - 1)); setFlipped(false); }}
              className="rounded-full border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={index >= cards.length - 1}
              onClick={() => { setIndex((i) => Math.min(cards.length - 1, i + 1)); setFlipped(false); }}
              className="rounded-full border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 h-10 w-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const ChatContent = () => (
    <div className="h-full flex flex-col bg-muted/20">
      <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-violet-500/5 to-transparent">
        <p className="font-medium text-foreground text-sm sm:text-base">Ask about your notes</p>
        <p className="text-xs sm:text-sm text-muted-foreground">Get help while you study.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">Type a question below.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            {m.role === "user" ? (
              <span className="inline-block rounded-lg bg-violet-600 text-white px-3 py-2 text-sm max-w-[85%]">
                {m.content}
              </span>
            ) : (
              <div className="inline-block w-full max-w-full rounded-xl border border-violet-500/15 bg-[#0B0F14]/50 dark:bg-muted/80 px-3 sm:px-4 py-3 text-left">
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
        <Button onClick={handleSendMessage} disabled={chatLoading} className="bg-violet-600 hover:bg-violet-700 shrink-0">
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
        <span className="flex items-center gap-1 text-sm font-medium text-foreground">
          <Layers className="h-4 w-4 text-violet-500" />
          <span className="hidden xs:inline">Flashcards</span>
        </span>
      </header>

      {/* Mobile panel toggle */}
      <div className="md:hidden flex border-b bg-muted/30 shrink-0">
        <button
          type="button"
          onClick={() => setMobilePanel("cards")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            mobilePanel === "cards"
              ? "text-violet-700 dark:text-violet-400 border-b-2 border-violet-500 bg-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Layers className="h-4 w-4" />
          Flashcards
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            mobilePanel === "chat"
              ? "text-violet-700 dark:text-violet-400 border-b-2 border-violet-500 bg-background"
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
            <FlashcardsContent />
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
        {mobilePanel === "cards" ? <FlashcardsContent /> : <ChatContent />}
      </div>
    </div>
  );
}
