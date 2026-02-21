import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ScanLine, Sparkles, Send, Loader2, FileUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateFile, formatFileSize } from "@/lib/file-extractors";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function Solver() {
    const [problem, setProblem] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [solution, setSolution] = useState<string | null>(null);
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

    const handleSubmit = async () => {
        if (!problem && !file) return;
        setIsLoading(true);
        setSolution(null);

        try {
            // Read file content if present
            let fileContent = "";
            let image = null;

            if (file) {
                if (file.type.startsWith("image/")) {
                    // Handle Image for Vision
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
                    fileContent = `[Image uploaded: ${file.name}]`; // Placeholder for text prompt
                } else if (file.type === "text/plain" || file.type === "text/markdown" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
                    fileContent = await file.text();
                } else {
                    fileContent = `[File: ${file.name}] (Binary file content extraction pending).`;
                }
            }

            const response = await api.post<{ solution: string }>("/api/solve", {
                problem,
                fileContent,
                image
            });

            setSolution(response.solution);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to get solution. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <ScanLine className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-foreground">The Solver</h1>
                </div>
                <p className="text-muted-foreground">Upload a problem or type it in — AI will solve it step by step.</p>
            </div>

            <div className="grid gap-6">
                {/* Input */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Your Problem</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Type or paste your problem here..."
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                            className="min-h-[120px] resize-none"
                        />

                        {/* File upload */}
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.txt,.md"
                                onChange={handleFileSelect}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FileUp className="h-4 w-4 mr-2" />
                                Upload File
                            </Button>
                            {file && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                                    <span>{file.name}</span>
                                    <span className="text-muted-foreground/80">({formatFileSize(file.size)})</span>
                                    <button onClick={() => setFile(null)}>
                                        <X className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || (!problem && !file)}
                            className="w-full"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Send className="h-4 w-4 mr-2" />
                            )}
                            Solve Problem
                        </Button>
                    </CardContent>
                </Card>

                {/* Solution */}
                {(solution || isLoading) && (
                    <Card className={cn(isLoading && "animate-pulse")}>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Solution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                                    {solution}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}