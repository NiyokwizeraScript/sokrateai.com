import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

const sectionCardClass =
  "rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0B0F14] to-[#0D1117] p-6 sm:p-8 mb-8 last:mb-0 shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)]";

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1
      {...props}
      className={cn(
        "font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 mt-10 first:mt-0",
        "pl-5 border-l-4 border-emerald-500",
        "bg-gradient-to-r from-emerald-500/10 to-transparent py-3 pr-4 rounded-r-lg",
        "shadow-[0_0_25px_-8px_rgba(16,185,129,0.4)]",
        "leading-tight tracking-tight"
      )}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className={cn(
        "font-heading text-xl sm:text-2xl font-bold text-foreground mb-5 mt-8 first:mt-0",
        "pl-4 border-l-4 border-emerald-500/90",
        "shadow-[0_0_20px_-6px_rgba(16,185,129,0.3)]",
        "leading-tight tracking-tight"
      )}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      {...props}
      className={cn(
        "font-heading text-lg sm:text-xl font-semibold text-foreground mb-4 mt-6 first:mt-0",
        "pl-3 border-l-3 border-emerald-500/70",
        "text-emerald-50",
        "leading-snug"
      )}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      {...props}
      className="font-heading text-base sm:text-lg font-semibold text-foreground mb-3 mt-5 first:mt-0 leading-snug pl-2 border-l-2 border-emerald-500/50"
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 {...props} className="font-heading text-base font-semibold text-emerald-400 mb-2 mt-4 first:mt-0 leading-snug">
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 {...props} className="font-heading text-sm font-semibold text-emerald-400/90 mb-2 mt-3 first:mt-0 leading-snug">
      {children}
    </h6>
  ),
  p: ({ children, ...props }) => (
    <p {...props} className="text-foreground/90 leading-[1.8] mb-5 last:mb-0 text-[15px] sm:text-base">
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong {...props} className="font-semibold text-emerald-300">
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em {...props} className="italic text-foreground/95">
      {children}
    </em>
  ),
  ul: ({ children, ...props }) => (
    <ul {...props} className="premium-ul mb-5 last:mb-0 pl-0 space-y-3">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="premium-ol mb-5 last:mb-0 pl-0 space-y-3 counter-reset-item">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li
      {...props}
      className="leading-[1.75] text-[15px] sm:text-base text-foreground/90"
    >
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className={cn(
        "rounded-xl border-l-4 border-emerald-500",
        "bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent",
        "py-4 px-5 my-6",
        "text-foreground/95 leading-[1.75]",
        "shadow-[0_0_20px_-8px_rgba(16,185,129,0.25),inset_0_1px_0_rgba(255,255,255,0.05)]",
        "border border-emerald-500/15 border-l-4",
        "[&>p]:mb-0 [&>p]:text-[15px] [&>p]:sm:text-base"
      )}
    >
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      className={cn(
        "rounded-xl bg-[#050810] border border-emerald-500/20",
        "p-5 overflow-x-auto my-6 text-sm leading-relaxed",
        "shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
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
          className="rounded-md bg-emerald-500/15 text-emerald-300 px-2 py-1 text-sm font-medium border border-emerald-500/20"
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
  hr: () => (
    <hr className="border-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent my-8" />
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      {...props}
      className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/50 hover:decoration-emerald-400 font-medium transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-emerald-500/20 shadow-lg">
      <table {...props} className="w-full text-sm border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead {...props} className="bg-emerald-500/10 border-b border-emerald-500/30">
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th {...props} className="text-left font-semibold text-foreground p-4 border-b border-emerald-500/20">
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td {...props} className="p-4 text-foreground/90 border-b border-border/30">
      {children}
    </td>
  ),
  tr: ({ children, ...props }) => (
    <tr {...props} className="border-b border-border/30 last:border-b-0 hover:bg-emerald-500/5 transition-colors">
      {children}
    </tr>
  ),
};

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

export function PremiumMarkdown({ content, className }: PremiumMarkdownProps) {
  if (!content?.trim()) return null;
  return (
    <div
      className={cn(
        "premium-markdown font-[family-name:var(--font-satoshi)] text-foreground",
        "space-y-8 [&>*]:first:mt-0",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSectionCards, rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
