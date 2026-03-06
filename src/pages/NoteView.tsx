import { useState, useEffect, useRef } from "react";
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
import { Share2, Trophy, Send, Loader2, Trash2, ArrowLeft, Paperclip, X, HelpCircle, Layers } from "lucide-react";
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
import { validateFile, formatFileSize } from "@/lib/file-extractors";

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
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleChatFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({ title: "Invalid file", description: validation.error, variant: "destructive" });
      return;
    }
    setAttachedFile(file);
    e.target.value = "";
  };

  const handleSendMessage = async () => {
    if ((!chatInput.trim() && !attachedFile) || !note) return;
    const questionText = chatInput.trim() || (attachedFile ? `[Attached: ${attachedFile.name}]` : "");
    const userMsg: ChatMessage = { role: "user", content: questionText };
    setMessages((m) => [...m, userMsg]);
    setChatInput("");
    const fileToSend = attachedFile;
    setAttachedFile(null);
    setChatLoading(true);
    try {
      const plainContent = note.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      const payload: {
        noteContent: string;
        messages: { role: string; content: string }[];
        attachedFileContent?: string;
        image?: { media_type: string; data: string };
        documentBase64?: string;
        documentMimeType?: string;
      } = {
        noteContent: plainContent.slice(0, 15000),
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
      };
      if (fileToSend) {
        const isImage = fileToSend.type.startsWith("image/");
        const isPdf = fileToSend.type === "application/pdf";
        const isWord = /word|msword|document/.test(fileToSend.type) || /\.(docx?|doc)$/i.test(fileToSend.name);
        const isText = fileToSend.type === "text/plain" || fileToSend.type === "text/markdown" || /\.(txt|md)$/i.test(fileToSend.name);
        if (isText) {
          const text = await fileToSend.text();
          payload.attachedFileContent = text;
        } else if (isImage) {
          const data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const b64 = (reader.result as string).split(",")[1];
              resolve(b64 || "");
            };
            reader.onerror = reject;
            reader.readAsDataURL(fileToSend);
          });
          payload.image = { media_type: fileToSend.type, data };
        } else if (isPdf || isWord) {
          const data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const b64 = (reader.result as string).split(",")[1];
              resolve(b64 || "");
            };
            reader.onerror = reject;
            reader.readAsDataURL(fileToSend);
          });
          payload.documentBase64 = data;
          payload.documentMimeType = fileToSend.type;
        } else {
          const text = await fileToSend.text().catch(() => "");
          if (text) payload.attachedFileContent = text;
        }
      }
      const res = await api.post<{ reply: string }>("/api/notes/chat", payload);
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
        {messages.length > 0 && (
          <>
            <Button size="sm" onClick={() => navigate(`/notes/${noteId}/quiz`)} className="bg-amber-500 hover:bg-amber-600 text-white border-0">
              <Trophy className="h-4 w-4 mr-1" />
              Quiz
            </Button>
            <Button size="sm" onClick={() => navigate(`/notes/${noteId}/flashcards`)} className="bg-violet-500 hover:bg-violet-600 text-white border-0">
              <Layers className="h-4 w-4 mr-1" />
              Flashcards
            </Button>
          </>
        )}
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
            <p className="text-xs text-muted-foreground/80 mb-2">All changes and edits are auto-saved. No need to save manually.</p>
            <RichNoteEditor
              value={content}
              onChange={setContent}
              onBlur={handleSaveContent}
              placeholder="Type your notes..."
              className="flex-1 min-h-0"
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col border-l bg-muted/20">
            <input
              ref={chatFileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx,.jpg,.jpeg,.png,.webp,image/*,application/pdf,text/plain,text/markdown"
              onChange={handleChatFileSelect}
              aria-label="Attach document"
            />
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
                <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-8">
                  <button
                    type="button"
                    onClick={() => noteId && navigate(`/notes/${noteId}/quiz`)}
                    className="relative rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/50 dark:hover:to-orange-900/40 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-sm hover:shadow"
                  >
                    <span className="absolute top-2 right-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Popular
                    </span>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/25 flex items-center justify-center shrink-0">
                        <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground">Quizzes</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Test your knowledge</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => noteId && navigate(`/notes/${noteId}/flashcards`)}
                    className="rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/30 hover:from-violet-100 hover:to-indigo-100 dark:hover:from-violet-900/50 dark:hover:to-indigo-900/40 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 shadow-sm hover:shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/25 flex items-center justify-center shrink-0">
                        <Layers className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground">Flashcards</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Study with active recall</p>
                      </div>
                    </div>
                  </button>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Hey, I&apos;m Sokrate AI
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-sm">
                  I can work with you on your notes and answer any questions!
                </p>
                <div className="w-full max-w-md mt-6 space-y-2">
                  {attachedFile && (
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-2 text-left text-sm">
                      <span className="truncate flex-1 text-foreground">{attachedFile.name}</span>
                      <span className="text-muted-foreground shrink-0">{formatFileSize(attachedFile.size)}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setAttachedFile(null)} aria-label="Remove attachment">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-1 rounded-xl border border-input bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                    <Input
                      placeholder="Type a question here or type '@' to reference your notes..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    />
                    <Button type="button" variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground" aria-label="Attach document" onClick={() => chatFileInputRef.current?.click()}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" className="shrink-0 h-8 w-8" onClick={handleSendMessage} disabled={chatLoading || (!chatInput.trim() && !attachedFile)}>
                      {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                <div className="p-4 border-t space-y-2">
                  {attachedFile && (
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm">
                      <span className="truncate flex-1 text-foreground">{attachedFile.name}</span>
                      <span className="text-muted-foreground shrink-0">{formatFileSize(attachedFile.size)}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setAttachedFile(null)} aria-label="Remove attachment">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-1 rounded-xl border border-input bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                    <Input
                      placeholder="Type a question here or type '@' to reference your notes..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    />
                    <Button type="button" variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground" aria-label="Attach document" onClick={() => chatFileInputRef.current?.click()}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" className="shrink-0 h-8 w-8" onClick={handleSendMessage} disabled={chatLoading || (!chatInput.trim() && !attachedFile)}>
                      {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}
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
