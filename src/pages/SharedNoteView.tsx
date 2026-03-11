import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Resizable, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSharedNote } from "@/lib/firestore";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { PremiumMarkdown } from "@/components/notes/PremiumMarkdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function SharedNoteView() {
  const { shareId } = useParams<{ shareId: string }>();
  const { toast } = useToast();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"notes" | "chat">("notes");

  const { data: share, isLoading } = useQuery({
    queryKey: ["sharedNote", shareId],
    queryFn: () => getSharedNote(shareId!),
    enabled: !!shareId,
  });

  const noteContent = share?.noteContent ?? "";
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !noteContent) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim() };
    setMessages((m) => [...m, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await api.post<{ reply: string }>("/api/notes/chat", {
        noteContent: noteContent.slice(0, 15000),
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      toast({ title: "Error", description: "Could not get reply.", variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

  if (!shareId) return null;
  if (isLoading || !share) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const NoteContent = () => (
    <div className="h-full overflow-y-auto p-3 sm:p-4">
      <p className="text-xs text-muted-foreground mb-2">Shared note (read-only)</p>
      <div
        className="rich-note-editor-content prose prose-sm dark:prose-invert max-w-none text-sm font-[family-name:var(--font-satoshi)] leading-[1.65]"
        dangerouslySetInnerHTML={{ __html: noteContent || "<p class='text-muted-foreground'>No content.</p>" }}
      />
    </div>
  );

  const ChatContent = () => (
    <div className="h-full flex flex-col bg-muted/20">
      <div className="p-3 sm:p-4 border-b">
        <p className="font-medium text-foreground text-sm sm:text-base">Ask about this note</p>
        <p className="text-xs sm:text-sm text-muted-foreground">I can answer questions using the shared content.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">Type a question below.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            {m.role === "user" ? (
              <span className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm max-w-[85%]">
                {m.content}
              </span>
            ) : (
              <div className="inline-block w-full max-w-full rounded-xl border border-emerald-500/15 bg-[#0B0F14]/50 dark:bg-muted/80 px-3 sm:px-4 py-3 text-left">
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
        <Button onClick={handleSendMessage} disabled={chatLoading} className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="flex items-center gap-1 sm:gap-2 border-b bg-background px-2 sm:px-4 py-2 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0 flex-1">
          <span className="font-semibold text-foreground text-sm sm:text-base truncate">{share.noteTitle}</span>
          <span className="text-xs sm:text-sm text-muted-foreground truncate">
            Shared by {share.fromUserEmail}
          </span>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 h-8 px-2 sm:px-3 text-xs sm:text-sm">
          <Link to="/dashboard">
            <span className="hidden sm:inline">Back to dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
      </header>

      {/* Mobile panel toggle */}
      <div className="md:hidden flex border-b bg-muted/30 shrink-0">
        <button
          type="button"
          onClick={() => setMobilePanel("notes")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            mobilePanel === "notes"
              ? "text-foreground border-b-2 border-primary bg-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
          Notes
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            mobilePanel === "chat"
              ? "text-foreground border-b-2 border-primary bg-background"
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
            <NoteContent />
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
        {mobilePanel === "notes" ? <NoteContent /> : <ChatContent />}
      </div>
    </div>
  );
}
