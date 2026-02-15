import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Feedback() {
    const [type, setType] = useState("feedback");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setSubmitted(true);
            setIsLoading(false);
            toast({ title: "Feedback sent!", description: "Thank you for your feedback." });
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="p-6 lg:p-8 max-w-2xl mx-auto">
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">Thank you!</h2>
                        <p className="text-gray-600 mb-6">Your feedback has been submitted successfully.</p>
                        <Button onClick={() => { setSubmitted(false); setSubject(""); setMessage(""); }}>
                            Send Another
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-slate-900">Feedback</h1>
                </div>
                <p className="text-gray-600">Help us improve Sokrate AI with your feedback.</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="feedback">General Feedback</SelectItem>
                                    <SelectItem value="bug">Bug Report</SelectItem>
                                    <SelectItem value="feature">Feature Request</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary" required />
                        </div>
                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us more..." className="min-h-[120px]" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                            Submit Feedback
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}