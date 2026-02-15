import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function CTASection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(0,0,0) 1px, transparent 1px), linear-gradient(90deg, rgb(0,0,0) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Start your free trial today
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
            Start Learning{" "}
            <span className="text-gradient">Smarter</span> Today
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of students and researchers who are accelerating their
            learning with Sokrate AI. No credit card required.
          </p>

          {/* Email signup or direct CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <div className="relative w-full sm:flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pr-4 bg-white border-slate-200 text-slate-900 placeholder:text-gray-500"
              />
            </div>
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white" asChild>
              <Link to="/login">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-gray-600 mt-6">
            Free forever plan available. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}