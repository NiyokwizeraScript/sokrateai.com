import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function CTASection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[min(800px,80vh)] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-green-600">Start your free trial today</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-slate-900">
            Start Learning <span className="text-gradient">Smarter</span> Today
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto px-1">
            Join students and researchers accelerating their learning with Sokrate AI. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 sm:h-12 min-h-[44px] bg-white border-slate-200 text-slate-900 placeholder:text-gray-500 text-base"
            />
            <Button size="lg" className="w-full sm:w-auto h-11 sm:h-12 min-h-[44px] px-6 sm:px-8 bg-green-600 hover:bg-green-700 text-white" asChild>
              <Link to="/login" className="inline-flex items-center justify-center">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Link>
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
            Free forever plan available. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}