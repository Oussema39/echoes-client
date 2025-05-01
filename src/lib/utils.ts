import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DomPurify from "dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const countEditorWords = (content: string) => {
  if (!content) return 0;
  const text = content.replace(/<[^>]*>/g, " ");
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words.length;
};

export const getEstimatedReadTime = (wordCount: number) => {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

export const purifyHtml = (html: string) => {
  const sanitized = DomPurify.sanitize(html);
  return sanitized;
};

export const downloadFile = (
  file: Blob | object,
  fileName: string,
  mimeType: string = "application/pdf"
) => {
  try {
    const blob =
      file instanceof Blob
        ? file
        : new Blob(Object.values(file), { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
