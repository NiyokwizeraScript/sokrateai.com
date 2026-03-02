import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SectionReveal, RevealStagger } from "./SectionReveal";

export function CTASection() {
  return (
    <SectionReveal>
      <div className="py-20 sm:py-24 md:py-28 lg:py-36 relative overflow-hidden bg-muted/25">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,80vh)] bg-primary/[0.06] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RevealStagger index={0}>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 sm:mb-6 text-foreground tracking-tight" >
                Start Learning <span className="text-gradient">Smarter</span> Today
              </h2>
            </RevealStagger>

            <RevealStagger index={1}>
              <p className="text-base sm:text-lg text-muted-foreground mb-10 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
                Join students and researchers accelerating their learning with Sokrate AI. No credit card required.
              </p>
            </RevealStagger>

            <RevealStagger index={2}>
              <Button
                size="lg"
                asChild
                className="cta-premium glow-primary h-12 sm:h-[52px] min-h-[48px] px-7 sm:px-9 text-base font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link to="/login" className="inline-flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                </Link>
              </Button>
            </RevealStagger>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
