import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

const sectionCardClass =
  "rounded-xl border border-emerald-500/20 bg-[#0B0F14]/80 dark:bg-card/80 p-5 sm:p-6 mb-7 last:mb-0";

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1
      {...props}
      className={cn(
        "font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4 mt-8 first:mt-0",
        "pl-4 border-l-4 border-emerald-500 shadow-[0_0_20px_-6px_rgba(16,185,129,0.35)]",
        "leading-tight"
      )}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className={cn(
        "font-heading text-xl sm:text-2xl font-bold text-foreground mb-3 mt-6 first:mt-0",
        "pl-4 border-l-4 border-emerald-500 shadow-[0_0_16px_-6px_rgba(16,185,129,0.3)]",
        "leading-tight"
      )}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      {...props}
      className={cn(
        "font-heading text-lg sm:text-xl font-semibold text-foreground mb-2 mt-5 first:mt-0",
        "pl-3 border-l-2 border-emerald-500/80",
        "leading-snug"
      )}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      {...props}
      className="font-heading text-base sm:text-lg font-semibold text-foreground mb-2 mt-4 first:mt-0 leading-snug pl-2 border-l-2 border-emerald-500/60"
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 {...props} className="font-heading text-base font-semibold text-foreground mb-1 mt-3 first:mt-0 leading-snug text-emerald-400/90">
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 {...props} className="font-heading text-sm font-semibold text-foreground mb-1 mt-2 first:mt-0 leading-snug text-emerald-400/80">
      {children}
    </h6>
  ),
  p: ({ children, ...props }) => (
    <p {...props} className="text-foreground/95 leading-[1.65] mb-4 last:mb-0 text-sm sm:text-base">
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong {...props} className="font-semibold text-foreground">
      {children}
    </strong>
  ),
  ul: ({ children, ...props }) => (
    <ul {...props} className="premium-markdown-ul list-none mb-4 last:mb-0 pl-0 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="list-decimal list-inside mb-4 last:mb-0 pl-4 space-y-2 text-foreground/95 leading-[1.65] text-sm sm:text-base marker:text-emerald-500 marker:font-semibold">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="leading-[1.65] text-sm sm:text-base text-foreground/95">
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className={cn(
        "rounded-xl border-l-4 border-emerald-500 bg-[#0B0F14] dark:bg-white/[0.06]",
        "py-3 px-4 my-4 text-foreground/95 leading-[1.65]",
        "shadow-[0_0_0_1px_rgba(16,185,129,0.12)]"
      )}
    >
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      className={cn(
        "rounded-xl bg-[#050810] dark:bg-black/60 border border-emerald-500/15",
        "p-4 overflow-x-auto my-4 text-sm leading-relaxed",
        "shadow-inner"
      )}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          {...props}
          className="rounded bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-300 dark:text-emerald-200 px-1.5 py-0.5 text-sm font-medium"
        >
          {children}
        </code>
      );
    }
    return (
      <code {...props} className={cn("text-foreground/95 font-mono text-sm", className)}>
        {children}
      </code>
    );
  },
  hr: () => <hr className="border-border my-6 border-emerald-500/20" />,
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      {...props}
      className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-medium"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-emerald-500/20">
      <table {...props} className="w-full text-sm border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead {...props} className="bg-emerald-500/10 border-b border-emerald-500/20">
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th {...props} className="text-left font-semibold text-foreground p-3 border-b border-emerald-500/15">
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td {...props} className="p-3 text-foreground/95 border-b border-border/50 last:border-b-0">
      {children}
    </td>
  ),
  tr: ({ children, ...props }) => (
    <tr {...props} className="border-b border-border/50 last:border-b-0">
      {children}
    </tr>
  ),
};

/** Rehype plugin: wrap each h2 and its content until the next h2 in a section card. */
function rehypeSectionCards() {
  return (tree: { children?: unknown[] }) => {
    const children = tree.children;
    if (!Array.isArray(children)) return;
    const out: unknown[] = [];
    let i = 0;
    while (i < children.length) {
      const node = children[i] as { type?: string; tagName?: string; children?: unknown[] };
      if (node?.type === "element" && node.tagName === "h2") {
        const sectionChildren: unknown[] = [];
        sectionChildren.push(node);
        i++;
        while (i < children.length) {
          const next = children[i] as { type?: string; tagName?: string };
          if (next?.type === "element" && next.tagName === "h2") break;
          sectionChildren.push(next);
          i++;
        }
        out.push({
          type: "element",
          tagName: "div",
          properties: { className: sectionCardClass },
          children: sectionChildren,
        });
        continue;
      }
      out.push(node);
      i++;
    }
    tree.children = out;
  };
}

export interface PremiumMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown with Sokrate’s premium styling: emerald accents, section cards,
 * callout blockquotes, code blocks, and Satoshi-friendly typography.
 */
export function PremiumMarkdown({ content, className }: PremiumMarkdownProps) {
  if (!content?.trim()) return null;
  return (
    <div
      className={cn(
        "premium-markdown font-[family-name:var(--font-satoshi)] text-foreground",
        "space-y-7 [&>*]:first:mt-0",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSectionCards]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
