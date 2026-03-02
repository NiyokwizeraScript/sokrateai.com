import { createContext, useContext, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const SectionRevealContext = createContext<{ inView: boolean }>({ inView: false });

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionReveal({ children, className }: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionRevealContext.Provider value={{ inView }}>
      <section ref={ref} className={className}>
        {children}
      </section>
    </SectionRevealContext.Provider>
  );
}

export function RevealStagger({
  children,
  index = 0,
  className,
  staggerMs = 90,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  staggerMs?: number;
}) {
  const { inView } = useContext(SectionRevealContext);

  return (
    <div
      className={cn(
        "transition-[transform,opacity] duration-700 ease-out-expo",
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
      style={{ transitionDelay: inView ? `${index * staggerMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
