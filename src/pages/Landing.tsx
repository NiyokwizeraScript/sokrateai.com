import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { SubjectsSection } from "@/components/landing/SubjectsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";
import { LandingNav } from "@/components/landing/LandingNav";
import { GreenAurora } from "@/components/landing/GreenAurora";
import { HeroStars } from "@/components/landing/HeroStars";

export default function Landing() {
  return (
    <div className="landing-page min-h-screen bg-[#0B0F14] text-foreground overflow-x-hidden transition-colors duration-normal relative">
      {/* Background only: aurora sits under stars */}
      <div className="fixed inset-0 -z-[1]">
        <GreenAurora />
      </div>
      {/* Stars above background, under text/buttons */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroStars />
      </div>
      <div className="relative z-10">
        <LandingNav />
        <HeroSection />
      <FeaturesSection />
      <SubjectsSection />
      <HowItWorksSection />
      <StatsSection />
      <FAQSection />
      <CTASection />
      <Footer />
      </div>
    </div>
  );
}
