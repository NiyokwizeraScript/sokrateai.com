import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { SubjectsSection } from "@/components/landing/SubjectsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { LandingNav } from "@/components/landing/LandingNav";

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            <LandingNav />
            <HeroSection />
            <FeaturesSection />
            <SubjectsSection />
            <HowItWorksSection />
            <StatsSection />
            <PricingSection />
            <CTASection />
            <Footer />
        </div>
    );
}