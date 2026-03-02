import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { SubjectsSection } from "@/components/landing/SubjectsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";
import { LandingNav } from "@/components/landing/LandingNav";
import { GreenAurora } from "@/components/landing/GreenAurora";

export default function Landing() {
  return (
    <div className="landing-page min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-normal relative">
      {/* Fixed aurora: top-right glow, stays in place on scroll */}
      <div className="fixed inset-0 z-0">
        <GreenAurora />
      </div>
      <div className="relative z-10">
        <LandingNav />
        <HeroSection />
      <FeaturesSection />
      <SubjectsSection />
      <HowItWorksSection />
      <PricingSection />
      <StatsSection />
      <FAQSection />
      <CTASection />
      <Footer />
      </div>
    </div>
  );
}
