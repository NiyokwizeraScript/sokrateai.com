import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="landing-page min-h-screen bg-[#0B0F14]">
            <LandingNav />
            <div className="pt-24 pb-16 max-w-3xl mx-auto px-4 text-white/90">
                <h1 className="font-heading text-3xl font-bold text-white tracking-tight mb-2">Privacy Policy</h1>
                <p className="text-white/60 text-sm mb-8"><em>Last updated: {new Date().toLocaleDateString()}</em></p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">1. Information We Collect</h2>
                <p className="text-white/80 leading-relaxed mb-4">We collect information you provide directly, including your name, email address, and any documents you upload for processing.</p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">2. How We Use Your Information</h2>
                <p className="text-white/80 leading-relaxed mb-4">We use your information to provide and improve our AI-powered learning services, including notes, document synthesis, and quiz generation.</p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">3. Data Storage</h2>
                <p className="text-white/80 leading-relaxed mb-4">Your uploaded documents are processed securely and are not shared with third parties. Documents are stored temporarily for processing and can be deleted at your request.</p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">4. Your Rights</h2>
                <p className="text-white/80 leading-relaxed mb-4">You have the right to access, correct, or delete your personal data at any time. Contact us at support@sokrate-ai.com for any requests.</p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">5. Contact</h2>
                <p className="text-white/80 leading-relaxed">For questions about this privacy policy, please contact us at support@sokrate-ai.com.</p>
            </div>
            <Footer />
        </div>
    );
}