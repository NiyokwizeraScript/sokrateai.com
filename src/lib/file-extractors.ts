export type SupportedFileType = "pdf" | "image" | "text" | "document";

export function getFileType(file: File): SupportedFileType {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (ext === "pdf") return "pdf";
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "heic"].includes(ext)) return "image";
    if (["doc", "docx", "ppt", "pptx", "xls", "xlsx", "odt", "odp", "ods"].includes(ext)) return "document";
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
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "text/plain",
        "text/markdown",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        "application/vnd.ms-powerpoint", // .ppt
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "application/vnd.oasis.opendocument.text", // .odt
        "application/vnd.oasis.opendocument.presentation", // .odp
        "application/vnd.oasis.opendocument.spreadsheet", // .ods
        "application/rtf",
        "text/rtf",
    ];
    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt", ".md", ".ppt", ".pptx", ".xlsx", ".xls", ".odt", ".odp", ".ods", ".rtf", ".jpg", ".jpeg", ".png", ".webp"];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const typeOk = allowedTypes.includes(file.type) || file.type.startsWith("text/");
    const extOk = allowedExtensions.some((e) => ext === e);
    if (!typeOk && !extOk) {
        return { valid: false, error: "Unsupported file type. Use PDF, Word, PowerPoint, Excel, OpenDocument, RTF, text, or images." };
    }
    return { valid: true };
}
