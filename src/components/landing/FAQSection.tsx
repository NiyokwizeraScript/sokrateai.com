import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionReveal, RevealStagger } from "./SectionReveal";

const faqs = [
  {
    q: "What is Sokrate AI?",
    a: "Sokrate AI is an AI-powered learning assistant for students. Upload documents, paste YouTube or article links, or add audio—and get organized notes, live AI answers to your questions, plus flashcards and quizzes. Everything you love about studying, smarter.",
  },
  {
    q: "How do I record lectures and turn them into notes?",
    a: "Upload an audio or video file of your lecture, or paste a YouTube link. Our AI transcribes and structures the content into clear, editable notes. You can then generate flashcards and quizzes from those notes.",
  },
  {
    q: "Can I convert my PDF textbooks into study materials?",
    a: "Yes. Upload your PDF and Sokrate AI will generate organized notes, highlight key concepts, and let you create flashcards and quizzes from the material. Great for textbooks, papers, and handouts.",
  },
  {
    q: "Is Sokrate AI free to use?",
    a: "We offer a free tier so you can try notes, quizzes, and core features. Paid plans unlock more uploads, advanced AI notes, and full access across devices.",
  },
  {
    q: "Can I create flashcards from YouTube videos?",
    a: "Yes. Paste a YouTube (or article) URL and we turn the content into notes. From there you can generate flashcards and quizzes with one click.",
  },
  {
    q: "How do I organize notes for different classes?",
    a: "Use folders and titles in your dashboard to group notes by subject or class. You can rename, move, and manage everything from the notes dashboard.",
  },
  {
    q: "Can I edit the notes after they're generated?",
    a: "Yes. All notes are editable. Add, remove, or change text anytime. Your edits are saved and you can still generate flashcards and quizzes from the updated content.",
  },
  {
    q: "Does it work for STEM subjects with formulas and diagrams?",
    a: "Yes. Sokrate AI handles math, science, and technical content—including formulas and structured explanations. Upload problem sets, diagrams, or slides and get clear notes and study tools.",
  },
  {
    q: "Does it work on mobile devices?",
    a: "Yes. Sokrate works on the web and mobile so you can study anywhere. Your notes and progress sync across devices.",
  },
  {
    q: "Is there a desktop app?",
    a: "Right now Sokrate runs in your browser and on mobile. A dedicated desktop app may be added later—we’ll announce it when it’s available.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionReveal>
      <div id="faq" className="py-20 sm:py-24 md:py-28 lg:py-32 relative">
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-12 sm:mb-14">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-white/70 text-base sm:text-lg">
              Everything you need to know about Sokrate AI
            </p>
          </RevealStagger>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <RevealStagger key={idx} index={idx + 1} staggerMs={60}>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="font-medium text-white">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-white/60 shrink-0 transition-transform duration-200",
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
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-1">
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
