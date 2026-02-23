import { useRef, useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bold, Italic, Underline, Image as ImageIcon, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichNoteEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}

const FONT_SIZES = ["10", "12", "14", "16", "18", "24", "32"];
const COLORS = [
  { label: "Default", value: "" },
  { label: "Red", value: "#ef4444" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Orange", value: "#f97316" },
];

function getSelectionIn(el: HTMLElement | null): { anchorNode: Node; anchorOffset: number; focusNode: Node; focusOffset: number } | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || !el) return null;
  const range = sel.getRangeAt(0);
  if (!el.contains(range.commonAncestorContainer)) return null;
  return { anchorNode: range.startContainer, anchorOffset: range.startOffset, focusNode: range.endContainer, focusOffset: range.endOffset };
}

function restoreSelectionIn(el: HTMLElement | null, saved: { anchorNode: Node; anchorOffset: number; focusNode: Node; focusOffset: number } | null) {
  if (!saved || !el) return;
  try {
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.setStart(saved.anchorNode, saved.anchorOffset);
    range.setEnd(saved.focusNode, saved.focusOffset);
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (_) {
    /* ignore if nodes detached */
  }
}

export function RichNoteEditor({
  value,
  onChange,
  onBlur,
  placeholder = "Type your notes...",
  className,
}: RichNoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const savedSelection = useRef<ReturnType<typeof getSelectionIn>>(null);

  const [toolbarState, setToolbarState] = useState({ bold: false, italic: false, underline: false, foreColor: "" });

  const updateToolbarState = useCallback(() => {
    const el = editorRef.current;
    if (!el || !document.contains(el)) return;
    const bold = document.queryCommandState("bold");
    const italic = document.queryCommandState("italic");
    const underline = document.queryCommandState("underline");
    let foreColor = document.queryCommandValue("foreColor") || "";
    if (foreColor && foreColor.startsWith("rgb")) {
      const m = foreColor.match(/\d+/g);
      if (m && m.length >= 3) foreColor = "#" + m.slice(0, 3).map((x) => Number(x).toString(16).padStart(2, "0")).join("");
    }
    setToolbarState((s) => (s.bold === bold && s.italic === italic && s.underline === underline && s.foreColor === foreColor ? s : { bold, italic, underline, foreColor }));
  }, []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  useEffect(() => {
    const el = editorRef.current;
    const onSelectionChange = () => {
      if (el && document.activeElement === el) {
        savedSelection.current = getSelectionIn(el);
        updateToolbarState();
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [updateToolbarState]);

  const emitChange = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    isInternalChange.current = true;
    onChange(html);
  }, [onChange]);

  const exec = useCallback(
    (cmd: string, value?: string) => {
      const el = editorRef.current;
      el?.focus();
      restoreSelectionIn(el, savedSelection.current);
      document.execCommand(cmd, false, value);
      savedSelection.current = getSelectionIn(el);
      el?.focus();
      restoreSelectionIn(el, savedSelection.current);
      emitChange();
      updateToolbarState();
    },
    [emitChange, updateToolbarState]
  );

  const handleImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        exec("insertImage", dataUrl);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const currentColorForTrigger = toolbarState.foreColor || (typeof document !== "undefined" ? "hsl(var(--foreground))" : "#000");

  return (
    <div className={cn("flex flex-col border rounded-lg bg-background overflow-hidden", className)}>
      <div
        className="flex flex-wrap items-center gap-0.5 border-b bg-muted/50 p-1"
        onPointerDown={() => {
          const el = editorRef.current;
          if (el) savedSelection.current = getSelectionIn(el);
        }}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", toolbarState.bold && "bg-muted")}
          onClick={() => exec("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", toolbarState.italic && "bg-muted")}
          onClick={() => exec("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", toolbarState.underline && "bg-muted")}
          onClick={() => exec("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Select
          onValueChange={(v) => {
            exec("fontSize", v);
            emitChange();
          }}
        >
          <SelectTrigger className="h-8 w-8 p-0 border-0 shadow-none gap-0 w-auto min-w-[2.5rem]">
            <Type className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((s, i) => (
              <SelectItem key={s} value={String(i + 1)}>
                {s}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(v) => {
            exec("foreColor", v || "#000000");
          }}
        >
          <SelectTrigger className="h-8 w-8 p-0 border-0 shadow-none w-auto min-w-[2rem] flex items-center justify-center">
            <span
              className="w-4 h-4 rounded border border-border"
              style={{ backgroundColor: currentColorForTrigger }}
            />
          </SelectTrigger>
          <SelectContent>
            {COLORS.map((c) => (
              <SelectItem key={c.value || "default"} value={c.value || "#000000"}>
                <span className="flex items-center gap-2">
                  {c.value && (
                    <span
                      className="w-3 h-3 rounded border border-border"
                      style={{ backgroundColor: c.value }}
                    />
                  )}
                  {c.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleImageClick}
          title="Insert image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="flex-1 min-h-[200px] p-4 text-sm text-foreground outline-none prose prose-sm dark:prose-invert max-w-none [&_img]:max-w-full [&_img]:h-auto"
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={onBlur}
        onFocus={updateToolbarState}
        suppressContentEditableWarning
        style={{ minHeight: "200px" }}
      />
      <style>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
