import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SokrateLogo } from "@/components/auth/SokrateLogo";
import { BookOpen, FlaskConical, Atom, Calculator, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const subjects = [
    { id: "math", name: "Mathematics", icon: Calculator, color: "blue" },
    { id: "physics", name: "Physics", icon: Atom, color: "purple" },
    { id: "chemistry", name: "Chemistry", icon: FlaskConical, color: "orange" },
    { id: "biology", name: "Biology", icon: BookOpen, color: "green" },
];

export default function Onboarding() {
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const navigate = useNavigate();

    const toggleSubject = (id: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleContinue = () => {
        navigate("/pricing-selection");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-green-50/50 px-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <SokrateLogo size="lg" className="justify-center" />
                    <h1 className="text-2xl font-heading font-bold mt-6 text-slate-900">
                        What do you want to study?
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Select the subjects you're interested in. You can change this later.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {subjects.map((subject) => {
                        const isSelected = selectedSubjects.includes(subject.id);
                        return (
                            <Card
                                key={subject.id}
                                className={cn(
                                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                                    isSelected
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-slate-200 hover:border-green-300"
                                )}
                                onClick={() => toggleSubject(subject.id)}
                            >
                                <CardContent className="p-6 text-center relative">
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <Check className="h-5 w-5 text-primary" />
                                        </div>
                                    )}
                                    <subject.icon className={cn(
                                        "h-10 w-10 mx-auto mb-3",
                                        isSelected ? "text-primary" : "text-gray-400"
                                    )} />
                                    <p className="font-medium text-slate-900">{subject.name}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleContinue}
                    disabled={selectedSubjects.length === 0}
                >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <button
                    onClick={handleContinue}
                    className="w-full text-center mt-4 text-sm text-gray-500 hover:text-gray-700"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}