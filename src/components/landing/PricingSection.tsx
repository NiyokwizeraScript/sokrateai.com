import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SectionReveal, RevealStagger } from "./SectionReveal";

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
    price: "$19.99",
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
    <SectionReveal>
      <div id="pricing" className="py-20 sm:py-24 md:py-28 lg:py-36 relative bg-muted/25">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger index={0} className="text-center mb-14 sm:mb-20">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 text-foreground tracking-tight" >
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Start free and upgrade when you need more
            </p>
          </RevealStagger>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <RevealStagger key={plan.name} index={index + 1} staggerMs={120}>
                <PricingCard plan={plan} />
              </RevealStagger>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

function PricingCard({ plan }: { plan: (typeof plans)[0] }) {
  return (
    <div className={cn("relative", plan.highlighted && "md:-mt-4 md:mb-4")}>
      {plan.highlighted && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-medium">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            Most Popular
          </div>
        </div>
      )}

      {plan.highlighted && (
        <div className="absolute -inset-px rounded-xl sm:rounded-2xl bg-gradient-to-b from-primary/50 to-primary/40 blur-sm" aria-hidden />
      )}

      <div
        className={cn(
          "relative h-full rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-normal border shadow-soft-sm",
          plan.highlighted
            ? "bg-card border-2 border-primary shadow-soft-md"
            : "bg-card border-border"
        )}
      >
        <div className="mb-5 sm:mb-6">
          <h3 className="font-heading text-lg sm:text-xl font-bold mb-1.5 text-foreground">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-heading font-bold text-foreground">{plan.price}</span>
            <span className="text-muted-foreground text-sm sm:text-base">/{plan.period}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">{plan.description}</p>
        </div>

        <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 sm:gap-3">
              {feature.included ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/50 shrink-0 mt-0.5" />
              )}
              <span
                className={cn(
                  "text-xs sm:text-sm",
                  feature.included ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className={cn(
            "w-full h-12 min-h-[48px] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
            plan.highlighted && "cta-premium glow-primary"
          )}
          variant={plan.highlighted ? "default" : "outline"}
          asChild
        >
          <Link to="/signup">{plan.cta}</Link>
        </Button>
      </div>
    </div>
  );
}
