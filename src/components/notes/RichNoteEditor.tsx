import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RichNoteEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
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

  const emitChange = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    isInternalChange.current = true;
    onChange(html);
  }, [onChange]);

  return (
    <div className={cn("flex flex-col border rounded-lg bg-background overflow-hidden", className)}>
      <div
        ref={editorRef}
        contentEditable
        className="flex-1 min-h-[200px] p-4 text-sm text-foreground outline-none prose prose-sm dark:prose-invert max-w-none [&_img]:max-w-full [&_img]:h-auto"
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={onBlur}
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
