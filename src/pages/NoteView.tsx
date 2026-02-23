import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Resizable, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichNoteEditor } from "@/components/notes/RichNoteEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Trophy, Send, Loader2, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getNote, updateNote, shareNoteToEmail, deleteNote } from "@/lib/firestore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function NoteView() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareSending, setShareSending] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", user?.uid, noteId],
    queryFn: () => getNote(user!.uid, noteId!),
    enabled: !!user?.uid && !!noteId,
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSaveTitle = () => {
    if (!user?.uid || !noteId) return;
    updateNote(user.uid, noteId, { title }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["note", user.uid, noteId] });
      queryClient.invalidateQueries({ queryKey: ["userNotes", user.uid] });
    });
  };

  const handleSaveContent = () => {
    if (!user?.uid || !noteId) return;
    updateNote(user.uid, noteId, { content }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["note", user.uid, noteId] });
      queryClient.invalidateQueries({ queryKey: ["userNotes", user.uid] });
    });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !note) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim() };
    setMessages((m) => [...m, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const plainContent = note.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      const res = await api.post<{ reply: string }>("/api/notes/chat", {
        noteContent: plainContent.slice(0, 15000),
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not get reply.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail.trim() || !user || !noteId || !note) return;
    setShareSending(true);
    try {
      await shareNoteToEmail(user.uid, {
        fromUserEmail: user.email ?? "",
        fromUserName: user.displayName ?? undefined,
        noteId,
        noteTitle: title || note.title,
        toEmail: shareEmail.trim(),
        noteContent: content || note.content,
      });
      toast({ title: "Shared", description: `Note shared with ${shareEmail.trim()}` });
      setShareOpen(false);
      setShareEmail("");
    } catch {
      toast({ title: "Error", description: "Could not share.", variant: "destructive" });
    } finally {
      setShareSending(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!user?.uid || !noteId) return;
    setDeleting(true);
    try {
      await deleteNote(user.uid, noteId);
      await queryClient.invalidateQueries({ queryKey: ["userNotes", user.uid] });
      toast({ title: "Note deleted" });
      navigate("/dashboard");
    } catch {
      toast({ title: "Error", description: "Could not delete note.", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (!user?.uid || !noteId) return null;
  if (isLoading || !note) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="flex items-center gap-2 border-b bg-background px-4 py-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => navigate("/dashboard")}
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSaveTitle}
          className="font-semibold border-0 shadow-none focus-visible:ring-0 max-w-xs"
        />
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        <Button size="sm" onClick={() => navigate(`/notes/${noteId}/quiz`)}>
          <Trophy className="h-4 w-4 mr-1" />
          Quiz
        </Button>
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" aria-label="Delete note">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this note?</AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone. The note will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); handleDeleteNote(); }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleting}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <Resizable direction="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col p-4 overflow-hidden">
            <p className="text-xs text-muted-foreground mb-1">Your notes — use the toolbar for font, size, colour, bold, images</p>
            <p className="text-xs text-muted-foreground/80 mb-2">All changes and edits are auto-saved. No need to save manually.</p>
            <RichNoteEditor
              value={content}
              onChange={setContent}
              onBlur={handleSaveContent}
              placeholder="Type your notes or use the toolbar above"
              className="flex-1 min-h-0"
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col border-l bg-muted/20">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg text-foreground">Hey, I&apos;m Sokrate AI</h2>
              <p className="text-sm text-muted-foreground mt-1">I can work with you on your notes and answer any questions!</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">Type a question here or type &apos;@&apos; to reference your notes.</p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "text-right" : "text-left"}
                >
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

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              type="email"
              placeholder="Email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
            <Button className="w-full" onClick={handleShare} disabled={shareSending || !shareEmail.trim()}>
              {shareSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
