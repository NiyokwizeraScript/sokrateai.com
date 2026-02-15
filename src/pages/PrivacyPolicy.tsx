import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <LandingNav />
            <div className="pt-24 pb-16 max-w-3xl mx-auto px-4 prose prose-slate">
                <h1>Privacy Policy</h1>
                <p className="text-gray-600"><em>Last updated: {new Date().toLocaleDateString()}</em></p>

                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly, including your name, email address, and any documents you upload for processing.</p>

                <h2>2. How We Use Your Information</h2>
                <p>We use your information to provide and improve our AI-powered learning services, including problem solving, document synthesis, and quiz generation.</p>

                <h2>3. Data Storage</h2>
                <p>Your uploaded documents are processed securely and are not shared with third parties. Documents are stored temporarily for processing and can be deleted at your request.</p>

                <h2>4. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal data at any time. Contact us at support@sokrate-ai.com for any requests.</p>

                <h2>5. Contact</h2>
                <p>For questions about this privacy policy, please contact us at support@sokrate-ai.com.</p>
            </div>
            <Footer />
        </div>
    );
}