import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SokrateLogo } from "@/components/auth/SokrateLogo";
import { Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (otp.length === 6) {
                navigate("/dashboard");
            } else {
                toast({ title: "Invalid code", description: "Please enter a valid 6-digit code.", variant: "destructive" });
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-green-50/50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <SokrateLogo size="lg" className="justify-center" />
                </div>

                <Card className="border-slate-200 shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-heading">Verify Your Email</CardTitle>
                        <p className="text-sm text-gray-600 mt-2">
                            We sent a 6-digit verification code to your email
                        </p>
                    </CardHeader>
                    <form onSubmit={handleVerify}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Verification Code</Label>
                                <Input
                                    id="otp"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    className="text-center text-2xl tracking-[0.5em] font-mono"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading || otp.length < 6}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Verify
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <p className="text-sm text-center text-gray-500">
                                Didn't receive a code? <button type="button" className="text-primary hover:underline">Resend</button>
                            </p>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </div>
    );
}