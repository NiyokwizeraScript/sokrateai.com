import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-white">
            <LandingNav />
            <div className="pt-24 pb-16 max-w-3xl mx-auto px-4 prose prose-slate">
                <h1>Cookie Policy</h1>
                <p className="text-gray-600"><em>Last updated: {new Date().toLocaleDateString()}</em></p>

                <h2>1. What Are Cookies</h2>
                <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience.</p>

                <h2>2. How We Use Cookies</h2>
                <p>We use cookies to:</p>
                <ul>
                    <li>Keep you signed in to your account</li>
                    <li>Remember your preferences</li>
                    <li>Understand how you use our service</li>
                </ul>

                <h2>3. Types of Cookies</h2>
                <p><strong>Essential cookies:</strong> Required for the service to function (authentication, security).</p>
                <p><strong>Analytics cookies:</strong> Help us understand usage patterns to improve the service.</p>

                <h2>4. Managing Cookies</h2>
                <p>You can manage or disable cookies through your browser settings. Note that disabling essential cookies may affect the functionality of our service.</p>

                <h2>5. Contact</h2>
                <p>For questions about this cookie policy, please contact us at support@sokrate-ai.com.</p>
            </div>
            <Footer />
        </div>
    );
}