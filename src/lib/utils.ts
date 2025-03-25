import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
