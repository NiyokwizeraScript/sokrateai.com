import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";

export default function CookiePolicy() {
    return (
        <div className="landing-page min-h-screen bg-[#0B0F14]">
            <LandingNav />
            <div className="pt-24 pb-16 max-w-3xl mx-auto px-4 text-white/90">
                <h1 className="font-heading text-3xl font-bold text-white tracking-tight mb-2">Cookie Policy</h1>
                <p className="text-white/60 text-sm mb-8"><em>Last updated: {new Date().toLocaleDateString()}</em></p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">1. What Are Cookies</h2>
                <p className="text-white/80 leading-relaxed mb-4">Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience.</p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">2. How We Use Cookies</h2>
                <p className="text-white/80 leading-relaxed mb-2">We use cookies to:</p>
                <ul className="list-disc list-inside text-white/80 space-y-1 mb-4">
                    <li>Keep you signed in to your account</li>
                    <li>Remember your preferences</li>
                    <li>Understand how you use our service</li>
                </ul>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">3. Types of Cookies</h2>
                <p className="text-white/80 leading-relaxed mb-2"><strong className="text-white">Essential cookies:</strong> Required for the service to function (authentication, security).</p>
                <p className="text-white/80 leading-relaxed mb-4"><strong className="text-white">Analytics cookies:</strong> Help us understand usage patterns to improve the service.</p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">4. Managing Cookies</h2>
                <p className="text-white/80 leading-relaxed mb-4">You can manage or disable cookies through your browser settings. Note that disabling essential cookies may affect the functionality of our service.</p>

                <h2 className="font-heading text-xl font-semibold text-white mt-8 mb-2">5. Contact</h2>
                <p className="text-white/80 leading-relaxed">For questions about this cookie policy, please contact us at support@sokrate-ai.com.</p>
            </div>
            <Footer />
        </div>
    );
}