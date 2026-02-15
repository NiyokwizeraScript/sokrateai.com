import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  highlighted: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try out our quiz feature for free",
    features: [
      { text: "Problem Solver", included: false },
      { text: "Document Synthesizer", included: false },
      { text: "Follow-up chat & discussions", included: false },
      { text: "Unlimited quiz access", included: true },
      { text: "Quiz insights & recommendations", included: false },
      { text: "Study history", included: false },
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Full access to all features",
    features: [
      { text: "Unlimited Problem Solver", included: true },
      { text: "Unlimited Document Synthesizer", included: true },
      { text: "Follow-up chat & discussions", included: true },
      { text: "Unlimited quiz access", included: true },
      { text: "Quiz insights & recommendations", included: true },
      { text: "Unlimited study history", included: true },
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-green-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/3 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more power
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
  index: number;
}) {
  return (
    <div
      className={cn(
        "relative animate-fade-in",
        plan.highlighted && "md:-mt-4 md:mb-4"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Popular badge */}
      {plan.highlighted ? (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-600 text-white text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Most Popular
          </div>
        </div>
      ) : null}

      {/* Card glow for highlighted */}
      {plan.highlighted ? (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-green-500/50 to-green-400/50 blur-sm" />
      ) : null}

      <div
        className={cn(
          "relative h-full rounded-2xl p-6 lg:p-8 transition-all duration-300 border",
          plan.highlighted
            ? "bg-white border-2 border-primary shadow-lg"
            : "bg-white border-slate-200"
        )}
      >
        {/* Plan name and price */}
        <div className="mb-6">
          <h3 className="font-heading text-xl font-bold mb-2 text-slate-900">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-heading font-bold text-slate-900">{plan.price}</span>
            <span className="text-gray-600">/{plan.period}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
        </div>

        {/* Features list */}
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
              )}
              <span className={cn(
                "text-sm",
                feature.included ? "text-gray-700" : "text-gray-400"
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          className={cn(
            "w-full transition-all duration-200",
            plan.highlighted
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-white border border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5"
          )}
          variant={plan.highlighted ? "default" : "outline"}
          asChild
        >
          <Link to="/login">{plan.cta}</Link>
        </Button>
      </div>
    </div>
  );
}