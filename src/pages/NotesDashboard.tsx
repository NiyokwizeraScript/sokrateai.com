import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Link as LinkIcon,
  FileUp,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createNote,
  getUserNotes,
  getSharedWithMe,
  deleteNote,
  type NoteRecord,
  type SharedNoteRecord,
} from "@/lib/firestore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { validateFile, formatFileSize } from "@/lib/file-extractors";
import { CreatingNotesLoading } from "@/components/notes/CreatingNotesLoading";
import { cn } from "@/lib/utils";
import { marked } from "marked";

/** Converts AI markdown into HTML so the note editor shows proper paragraphs, headings, and lists. */
function markdownToNoteHtml(md: string): string {
  const t = (md ?? "").trim();
  if (!t) return md ?? "";
  try {
    const out = marked(t, { async: false });
    return typeof out === "string" ? out : t;
  } catch {
    return md ?? "";
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function NotesDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [creatingProgress, setCreatingProgress] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const startProgressSimulation = () => {
    setCreatingProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      setCreatingProgress((p) => {
        if (p >= 85) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          return 85;
        }
        return p + 4;
      });
    }, 400);
  };

  const finishProgressAndNavigate = (noteId: string) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setCreatingProgress(100);
    setTimeout(() => {
      setDocLoading(false);
      setYoutubeLoading(false);
      setCreatingProgress(0);
      navigate(`/notes/${noteId}`);
    }, 600);
  };

  const { data: myNotes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["userNotes", user?.uid],
    queryFn: () => getUserNotes(user!.uid),
    enabled: !!user?.uid,
  });

  const { data: sharedWithMe = [], isLoading: sharedLoading } = useQuery({
    queryKey: ["sharedWithMe", user?.email],
    queryFn: () => getSharedWithMe(user!.email ?? ""),
    enabled: !!user?.email,
  });

  const handleBlank = async () => {
    if (!user?.uid) return;
    try {
      const noteId = await createNote(user.uid, { sourceType: "blank" });
      navigate(`/notes/${noteId}`);
    } catch {
      toast({ title: "Error", description: "Could not create note.", variant: "destructive" });
    }
  };

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({ title: "Invalid file", description: validation.error, variant: "destructive" });
      return;
    }
    setDocFile(file);
  };

  const handleDocSubmit = async () => {
    if (!user?.uid || !docFile) return;
    setDocModalOpen(false);
    setDocLoading(true);
    startProgressSimulation();
    try {
      let fileContent = "";
      let image: { media_type: string; data: string } | null = null;
      if (docFile.type.startsWith("image/")) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((res) => {
          reader.onload = (e) => res((e.target?.result as string).split(",")[1] ?? "");
          reader.readAsDataURL(docFile);
        });
        image = { media_type: docFile.type, data: base64 };
        fileContent = `[Image: ${docFile.name}]`;
      } else if (docFile.type === "text/plain" || docFile.type === "text/markdown" || /\.(txt|md)$/i.test(docFile.name)) {
        fileContent = await docFile.text();
      } else {
        // PDF, Word, PowerPoint etc. – send as base64 so the AI can read the document
        fileContent = `[Document: ${docFile.name}]`;
        const dataUrl = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = (e) => res((e.target?.result as string) ?? "");
          reader.onerror = () => rej(new Error("Failed to read file"));
          reader.readAsDataURL(docFile);
        });
        const documentBase64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : "";
        const ext = docFile.name.toLowerCase().slice(docFile.name.lastIndexOf("."));
        const documentMimeType =
          docFile.type ||
          (ext === ".pdf" ? "application/pdf" : ext === ".docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : ext === ".doc" ? "application/msword" : "application/octet-stream");
        const res = await api.post<{ synthesis: string }>("/api/synthesize", {
          fileContent,
          documentBase64,
          documentMimeType,
        });
        const content = markdownToNoteHtml(res.synthesis || "");
        const title = docFile.name.replace(/\.[^.]+$/, "") || "Document";
        const noteId = await createNote(user.uid, {
          sourceType: "document",
          title,
          content,
        });
        setDocFile(null);
        finishProgressAndNavigate(noteId);
        return;
      }
      const res = await api.post<{ synthesis: string }>("/api/synthesize", { fileContent, image });
      const content = markdownToNoteHtml(res.synthesis || "");
      const title = docFile.name.replace(/\.[^.]+$/, "") || "Document";
      const noteId = await createNote(user.uid, {
        sourceType: "document",
        title,
        content,
      });
      setDocFile(null);
      finishProgressAndNavigate(noteId);
    } catch (err) {
      console.error(err);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setCreatingProgress(0);
      setDocLoading(false);
      const message = err instanceof Error ? err.message : "Could not process document.";
      toast({
        title: "Error",
        description: message.includes("Failed to fetch") || message.includes("NetworkError")
          ? "Network error. Check your connection and that the server is running."
          : message,
        variant: "destructive",
      });
    }
  };

  const handleYoutubeSubmit = async () => {
    if (!user?.uid || !youtubeUrl.trim()) return;
    const urlToUse = youtubeUrl.trim();
    setYoutubeOpen(false);
    setYoutubeLoading(true);
    startProgressSimulation();
    try {
      const res = await api.post<{ title: string; content: string }>("/api/notes/process-url", {
        url: urlToUse,
      });
      const noteId = await createNote(user.uid, {
        sourceType: "youtube",
        title: res.title || "YouTube note",
        content: markdownToNoteHtml(res.content || ""),
        sourceUrl: urlToUse,
      });
      setYoutubeUrl("");
      finishProgressAndNavigate(noteId);
    } catch (err) {
      console.error(err);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setCreatingProgress(0);
      setYoutubeLoading(false);
      const message = err instanceof Error ? err.message : "Could not process link.";
      toast({
        title: "Error",
        description: message.includes("Failed to fetch") || message.includes("NetworkError")
          ? "Network error. Check your connection and that the server is running."
          : message,
        variant: "destructive",
      });
    }
  };

  const openNote = (noteId: string) => navigate(`/notes/${noteId}`);
  const openShared = (share: SharedNoteRecord) => {
    navigate(`/shared/${share.id}`);
  };

  const [noteToDelete, setNoteToDelete] = useState<NoteRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteNote = async () => {
    if (!user?.uid || !noteToDelete) return;
    setDeleting(true);
    try {
      await deleteNote(user.uid, noteToDelete.id);
      await queryClient.invalidateQueries({ queryKey: ["userNotes", user.uid] });
      toast({ title: "Note deleted" });
      setNoteToDelete(null);
    } catch {
      toast({ title: "Error", description: "Could not delete note.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const filteredNotes = myNotes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.slice(0, 200).toLowerCase().includes(search.toLowerCase())
  );
  const filteredShared = sharedWithMe.filter(
    (s) => s.noteTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    {(docLoading || youtubeLoading) && (
      <CreatingNotesLoading
        message={docLoading ? "Processing document..." : "Processing link..."}
        progress={creatingProgress}
      />
    )}
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Create new notes from a blank page, a document, or a link.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={handleBlank}
        >
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Blank document</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Start from scratch</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setDocModalOpen(true)}
        >
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
              <FileUp className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Document upload</h3>
            <p className="text-sm text-muted-foreground mt-0.5">PDF, DOC, PPT, images, etc.</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setYoutubeOpen(true)}
        >
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
              <LinkIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Website link</h3>
            <p className="text-sm text-muted-foreground mt-0.5">YouTube or webpage URL</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="my-notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-notes">My Notes</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>
        <TabsContent value="my-notes" className="space-y-2 mt-4">
          {notesLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8">No notes yet. Create one above.</p>
          ) : (
            <ul className="space-y-2">
              {filteredNotes.map((note) => (
                <li key={note.id}>
                  <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors group"
                    onClick={() => openNote(note.id)}
                  >
                    <CardContent className="py-3 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{note.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 opacity-50 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteToDelete(note);
                        }}
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="shared" className="space-y-2 mt-4">
          {sharedLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredShared.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8">No shared notes yet.</p>
          ) : (
            <ul className="space-y-2">
              {filteredShared.map((share) => (
                <li key={share.id}>
                  <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => openShared(share)}
                  >
                    <CardContent className="py-3 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{share.noteTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          From {share.fromUserEmail} · {formatDate(share.createdAt)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={youtubeOpen} onOpenChange={setYoutubeOpen}>
        <DialogContent className="bg-background text-foreground border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create note from source</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Paste a website or YouTube link..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleYoutubeSubmit}
              disabled={youtubeLoading || !youtubeUrl.trim()}
            >
              {youtubeLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Generate Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={docModalOpen} onOpenChange={setDocModalOpen}>
        <DialogContent className="bg-background text-foreground border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create note from document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                docFile ? "border-primary/50 bg-muted/30 text-foreground" : "border-border hover:border-primary/50 text-muted-foreground"
              )}
              onClick={() => document.getElementById("doc-upload")?.click()}
            >
              <input
                id="doc-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={handleDocSelect}
              />
              {docFile ? (
                <p className="text-sm font-medium text-foreground">{docFile.name} ({formatFileSize(docFile.size)})</p>
              ) : (
                <>
                  <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drag documents here, or click to upload</p>
                </>
              )}
            </div>
            <Button
              className="w-full"
              onClick={handleDocSubmit}
              disabled={docLoading || !docFile}
            >
              {docLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Generate Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              {noteToDelete && `"${noteToDelete.title}" will be permanently removed. This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteNote();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
}
