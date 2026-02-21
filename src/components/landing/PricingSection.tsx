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
    <section id="pricing" className="py-16 sm:py-20 md:py-24 lg:py-32 relative bg-slate-50/50">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-1">
            Start free and upgrade when you need more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
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
          "relative",
          plan.highlighted && "md:-mt-4 md:mb-4"
        )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {plan.highlighted ? (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full bg-green-600 text-white text-xs sm:text-sm font-medium">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            Most Popular
          </div>
        </div>
      ) : null}

      {plan.highlighted ? (
        <div className="absolute -inset-px rounded-xl sm:rounded-2xl bg-gradient-to-b from-green-500/50 to-green-400/50 blur-sm" aria-hidden />
      ) : null}

      <div
        className={cn(
          "relative h-full rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-300 border",
          plan.highlighted
            ? "bg-white border-2 border-green-600 shadow-lg"
            : "bg-white border-slate-200"
        )}
      >
        <div className="mb-5 sm:mb-6">
          <h3 className="font-heading text-lg sm:text-xl font-bold mb-1.5 text-slate-900">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">{plan.price}</span>
            <span className="text-gray-600 text-sm sm:text-base">/{plan.period}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1.5">{plan.description}</p>
        </div>

        <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 sm:gap-3">
              {feature.included ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 shrink-0 mt-0.5" />
              )}
              <span className={cn(
                "text-xs sm:text-sm",
                feature.included ? "text-gray-700" : "text-gray-400"
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className={cn(
            "w-full h-11 sm:h-12 min-h-[44px] transition-all duration-200",
            plan.highlighted
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-white border border-slate-300 text-slate-700 hover:border-green-600 hover:text-green-600 hover:bg-green-50"
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