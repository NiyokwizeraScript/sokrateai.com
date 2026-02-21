import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { Trophy, Upload, Sparkles, Loader2, FileUp, X, Check, XCircle } from "lucide-react";
import { validateFile, formatFileSize } from "@/lib/file-extractors";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correct: number;
}

const sampleQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "What is the derivative of x²?",
        options: ["x", "2x", "x²/2", "2x²"],
        correct: 1,
    },
    {
        id: 2,
        question: "What is Newton's second law of motion?",
        options: ["F = ma", "E = mc²", "F = mv", "a = F/m²"],
        correct: 0,
    },
    {
        id: 3,
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2,
    },
];

export default function Quizzes() {
    const [file, setFile] = useState<File | null>(null);
    const [difficulty, setDifficulty] = useState("medium");
    const [questionCount, setQuestionCount] = useState("5");
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        const validation = validateFile(selected);
        if (!validation.valid) {
            toast({ title: "Invalid file", description: validation.error, variant: "destructive" });
            return;
        }
        setFile(selected);
    };

    const handleGenerate = async () => {
        if (!file) return;
        setIsLoading(true);
        setQuestions(null);
        setAnswers({});
        setShowResults(false);

        try {
            let fileContent = "";
            let image = null;

            if (file) {
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    const base64Promise = new Promise<string>((resolve) => {
                        reader.onload = (e) => resolve(e.target?.result as string);
                        reader.readAsDataURL(file);
                    });
                    const base64Data = await base64Promise;
                    const base64Content = base64Data.split(',')[1];
                    image = {
                        media_type: file.type,
                        data: base64Content
                    };
                    fileContent = `[Image uploaded: ${file.name}]`;
                } else if (file.type === "text/plain" || file.type === "text/markdown" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
                    fileContent = await file.text();
                } else {
                    fileContent = `[File: ${file.name}] (Binary file content extraction pending).`;
                }
            }

            const response = await api.post<{ questions: QuizQuestion[] }>("/api/quiz/generate", {
                fileContent,
                image,
                difficulty,
                count: parseInt(questionCount)
            });

            if (response.questions && Array.isArray(response.questions)) {
                setQuestions(response.questions);
            } else {
                throw new Error("Invalid format received");
            }

        } catch (error) {
            console.error(error);
            toast({
                title: "Generation Failed",
                description: "Could not generate quiz. Please try again or use a text file.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (questionId: number, optionIndex: number) => {
        if (showResults) return;
        setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmitQuiz = () => {
        setShowResults(true);
        const correct = questions?.filter((q) => answers[q.id] === q.correct).length || 0;
        const total = questions?.length || 0;
        toast({
            title: `Score: ${correct}/${total}`,
            description: correct === total ? "Perfect score! 🎉" : "Keep studying! You'll get there.",
        });
    };

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-foreground">The Quizzes</h1>
                </div>
                <p className="text-muted-foreground">Upload a document and generate a quiz to test your knowledge.</p>
            </div>

            <div className="grid gap-6">
                {!questions ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Generate Quiz</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.txt,.md,.docx"
                                onChange={handleFileSelect}
                            />

                            {!file ? (
                                <div
                                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                    <p className="font-medium text-foreground">Upload your study material</p>
                                    <p className="text-sm text-muted-foreground mt-1">PDF, images, or text documents</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FileUp className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setFile(null)}>
                                        <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Difficulty</label>
                                    <Select value={difficulty} onValueChange={setDifficulty}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Questions</label>
                                    <Select value={questionCount} onValueChange={setQuestionCount}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">3 questions</SelectItem>
                                            <SelectItem value="5">5 questions</SelectItem>
                                            <SelectItem value="10">10 questions</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={handleGenerate} disabled={isLoading || !file} className="w-full">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                Generate Quiz
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {questions.map((q, idx) => (
                            <Card key={q.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Question {idx + 1}: {q.question}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2">
                                        {q.options.map((option, optIdx) => {
                                            const isSelected = answers[q.id] === optIdx;
                                            const isCorrect = showResults && q.correct === optIdx;
                                            const isWrong = showResults && isSelected && q.correct !== optIdx;

                                            return (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => handleAnswer(q.id, optIdx)}
                                                    className={cn(
                                                        "w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3",
                                                        isCorrect && "border-green-500 bg-green-50",
                                                        isWrong && "border-red-500 bg-red-50",
                                                        isSelected && !showResults && "border-primary bg-primary/5",
                                                        !isSelected && !showResults && "border-gray-200 hover:border-gray-300"
                                                    )}
                                                >
                                                    {showResults && isCorrect && <Check className="h-4 w-4 text-green-600 shrink-0" />}
                                                    {showResults && isWrong && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                                                    <span className="text-sm">{option}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {!showResults ? (
                            <Button
                                onClick={handleSubmitQuiz}
                                disabled={Object.keys(answers).length < questions.length}
                                className="w-full"
                                size="lg"
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    setQuestions(null);
                                    setAnswers({});
                                    setShowResults(false);
                                    setFile(null);
                                }}
                                variant="outline"
                                className="w-full"
                            >
                                Take Another Quiz
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}