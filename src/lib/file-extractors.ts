export type SupportedFileType = "pdf" | "image" | "text" | "document";

export function getFileType(file: File): SupportedFileType {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (ext === "pdf") return "pdf";
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "heic"].includes(ext)) return "image";
    if (["doc", "docx", "pptx", "xlsx"].includes(ext)) return "document";
    return "text";
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function validateFile(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
        return { valid: false, error: `File is too large. Maximum size is ${maxSizeMB}MB.` };
    }
    const allowedTypes = [
        "application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp",
        "text/plain", "text/markdown",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".md")) {
        return { valid: false, error: "Unsupported file type." };
    }
    return { valid: true };
}
