import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Sparkles, Loader2, FileUp, X } from "lucide-react";
import { validateFile, formatFileSize } from "@/lib/file-extractors";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function Synthesizer() {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [synthesis, setSynthesis] = useState<string | null>(null);
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

    const handleSynthesize = async () => {
        if (!file) return;
        setIsLoading(true);
        setSynthesis(null);

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

            const response = await api.post<{ synthesis: string }>("/api/synthesize", {
                fileContent,
                image
            });

            setSynthesis(response.synthesis);

        } catch (error) {
            console.error(error);
            toast({
                title: "Synthesis Failed",
                description: "Could not analyze document. Please try again.",
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-slate-900">The Synthesizer</h1>
                </div>
                <p className="text-gray-600">Upload a document and let AI re-explain it for you.</p>
            </div>

            <div className="grid gap-6">
                {/* Upload area */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Upload Document</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.txt,.md,.docx"
                            onChange={handleFileSelect}
                        />

                        {!file ? (
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="font-medium text-gray-700 mb-2">
                                    Drop your document here or click to upload
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Supports PDF, images, and text documents (max 10MB)
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <FileUp className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="font-medium text-slate-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setSynthesis(null); }}>
                                    <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
                                </button>
                            </div>
                        )}

                        <Button
                            onClick={handleSynthesize}
                            disabled={isLoading || !file}
                            className="w-full mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Sparkles className="h-4 w-4 mr-2" />
                            )}
                            Synthesize Document
                        </Button>
                    </CardContent>
                </Card>

                {/* Synthesis result */}
                {(synthesis || isLoading) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Synthesis
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
                                    {synthesis}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}