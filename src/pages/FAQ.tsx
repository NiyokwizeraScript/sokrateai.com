import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
    { q: "What is Sokrate AI?", a: "Sokrate AI is an AI-powered learning assistant that helps students solve problems, synthesize documents, and test their knowledge through quizzes in Mathematics, Physics, Chemistry, and Biology." },
    { q: "Is there a free plan?", a: "Yes! Our Free plan gives you unlimited access to the quiz feature. Upgrade to Pro ($19/month) for full access to the Solver, Synthesizer, and all other features." },
    { q: "What file types are supported?", a: "We support PDFs, images (JPG, PNG, WebP), text files, and Word documents. You can upload problems as images of handwritten notes too." },
    { q: "How accurate are the AI solutions?", a: "Our AI provides PhD-level accuracy with detailed step-by-step explanations. However, we always recommend verifying critical results independently." },
    { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime. Your access will continue until the end of your billing period." },
    { q: "What subjects are covered?", a: "We currently support Mathematics, Physics, Chemistry, and Biology — from undergraduate to graduate level topics." },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-white">
            <LandingNav />
            <div className="pt-24 pb-16 max-w-3xl mx-auto px-4">
                <h1 className="text-4xl font-heading font-bold text-center text-slate-900 mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-center text-gray-600 mb-12">
                    Everything you need to know about Sokrate AI
                </p>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-slate-900">{faq.q}</span>
                                <ChevronDown className={cn(
                                    "h-5 w-5 text-gray-500 transition-transform",
                                    openIndex === idx && "rotate-180"
                                )} />
                            </button>
                            {openIndex === idx && (
                                <div className="px-4 pb-4 text-gray-600 text-sm">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}