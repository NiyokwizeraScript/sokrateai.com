import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Resizable, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { getSharedNote } from "@/lib/firestore";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="flex items-center gap-2 border-b bg-background px-4 py-2 shrink-0">
        <span className="font-semibold text-foreground truncate">{share.noteTitle}</span>
        <span className="text-sm text-muted-foreground truncate">
          Shared by {share.fromUserEmail}
        </span>
        <div className="flex-1" />
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </header>

      <Resizable direction="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full overflow-y-auto p-4">
            <p className="text-xs text-muted-foreground mb-2">Shared note (read-only)</p>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-mono text-sm">
              {noteContent || "No content."}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col border-l bg-muted/20">
            <div className="p-4 border-b">
              <p className="font-medium text-foreground">Ask about this note</p>
              <p className="text-sm text-muted-foreground">I can answer questions using the content on the left.</p>
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
