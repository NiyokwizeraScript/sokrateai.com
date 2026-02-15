import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PricingSelection() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSelectFree = () => {
        // Set plan in local storage (mock backend update)
        localStorage.setItem("sokrate_plan", "free");

        toast({
            title: "Welcome to Sokrate Free!",
            description: "You've successfully activated the free plan.",
        });

        navigate("/dashboard");
    };

    const handleSelectPro = () => {
        // Redirect to Stripe Payment Link
        window.location.href = "https://buy.stripe.com/cNicMX62729EfD48HB93y00";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-green-50/50 py-12 px-4 flex items-center justify-center">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Select the plan that best fits your learning needs. You can upgrade at any time.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-2xl font-bold font-heading">Free</span>
                            </CardTitle>
                            <CardDescription>Try out our quiz feature for free</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-slate-900 font-heading">$0</span>
                                <span className="text-gray-600 ml-2">/forever</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {[
                                    { text: "Problem Solver", included: false },
                                    { text: "Document Synthesizer", included: false },
                                    { text: "Follow-up chat & discussions", included: false },
                                    { text: "Unlimited quiz access", included: true },
                                    { text: "Quiz insights & recommendations", included: false },
                                    { text: "Study history", included: false },
                                ].map((feature) => (
                                    <li key={feature.text} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <Check className="h-5 w-5 text-primary shrink-0" />
                                        ) : (
                                            <X className="h-5 w-5 text-gray-300 shrink-0" />
                                        )}
                                        <span className={feature.included ? "text-gray-700 font-medium" : "text-gray-400"}>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full py-6 text-lg"
                                onClick={handleSelectFree}
                            >
                                Get Started Free
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="border-primary ring-2 ring-primary/20 shadow-xl scale-105 relative overflow-hidden bg-white">
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            MOST POPULAR
                        </div>
                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-green-500/50 to-green-400/50 blur-sm -z-10" />

                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-slate-900 font-heading">Pro</span>
                            </CardTitle>
                            <CardDescription>Full access to all features</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-slate-900 font-heading">$19</span>
                                <span className="text-gray-600 ml-2">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {[
                                    { text: "Unlimited Problem Solver", included: true },
                                    { text: "Unlimited Document Synthesizer", included: true },
                                    { text: "Follow-up chat & discussions", included: true },
                                    { text: "Unlimited quiz access", included: true },
                                    { text: "Quiz insights & recommendations", included: true },
                                    { text: "Unlimited study history", included: true },
                                ].map((feature) => (
                                    <li key={feature.text} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span className="text-slate-900 font-medium">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg"
                                onClick={handleSelectPro}
                            >
                                Start Pro
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <p className="text-center text-gray-500 mt-12 text-sm">
                    Secure payment powered by Stripe. Cancel anytime.
                </p>
            </div>
        </div>
    );
}
