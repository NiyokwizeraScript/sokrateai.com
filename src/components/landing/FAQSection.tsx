import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionReveal, RevealStagger } from "./SectionReveal";

const faqs = [
  {
    q: "What is Sokrate AI?",
    a: "Sokrate AI is an AI-powered learning assistant. Upload documents or paste YouTube and webpage links to get AI-generated notes, then quiz yourself to test your understanding—all for science and math.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes! Our Free plan includes access to quizzes. Upgrade to Pro for document upload, YouTube & link notes, unlimited AI notes, and full quiz features.",
  },
  {
    q: "What file types are supported?",
    a: "We support PDFs, Word, PowerPoint, images (JPG, PNG), and text files. You can upload slides, papers, or handouts and get structured notes.",
  },
  {
    q: "How accurate are the AI notes?",
    a: "Our AI aims for high-quality explanations and step-by-step clarity. We recommend checking critical results for high-stakes work.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes. You can cancel anytime; access continues until the end of your billing period.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionReveal>
      <div id="faq" className="py-20 sm:py-24 md:py-28 lg:py-32 relative">
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-12 sm:mb-14">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground tracking-tight" >
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Everything you need to know about Sokrate AI
            </p>
          </RevealStagger>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <RevealStagger key={idx} index={idx + 1} staggerMs={60}>
                <div className="rounded-xl border border-border bg-card/80 overflow-hidden shadow-soft-sm">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-foreground">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200",
                        openIndex === idx && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-200 ease-out",
                      openIndex === idx ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/80 pt-1">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealStagger>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
