import { IPromptOption } from "@/interface/IPromptOption";
import {
  Sparkles,
  ThumbsUp,
  Smile,
  Wand2,
  MessageSquare,
  ArrowUpRight,
  Flame,
} from "lucide-react";

const toneOptions: IPromptOption[] = [
  {
    icon: <Sparkles className="h-4 w-4 text-amber-500" />,
    label: "Anticipatory",
    color: "text-amber-500",
    promptType: "anticipatory",
    buttonProps: {
      className: "w-full col-span-2 justify-center",
    },
  },
  {
    icon: <ThumbsUp className="h-4 w-4 text-orange-500" />,
    label: "Assertive",
    color: "text-orange-500",
    promptType: "assertive",
    buttonProps: {
      className: "w-full col-span-2 justify-center",
    },
  },

  {
    icon: <Smile className="h-4 w-4 text-yellow-500" />,
    label: "Confident",
    color: "text-yellow-500",
    promptType: "confident",
  },
  {
    icon: <ThumbsUp className="h-4 w-4 text-amber-500" />,
    label: "Constructive",
    color: "text-amber-500",
    promptType: "constructive",
  },
  {
    icon: <Smile className="h-4 w-4 text-pink-500" />,
    label: "Compassionate",
    color: "text-pink-500",
    promptType: "compassionate",
    buttonProps: {
      className: "w-full col-span-2 justify-center",
    },
  },
];

const rewriteOptions: IPromptOption[] = [
  {
    icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
    label: "Paraphrase",
    color: "text-purple-500",
    promptType: "paraphrase",
    buttonProps: {
      className: "w-full col-span-2 justify-center",
    },
  },

  {
    icon: <ArrowUpRight className="h-4 w-4 text-cyan-500" />,
    label: "Shorten",
    color: "text-cyan-500",
    promptType: "shorten",
  },
  {
    icon: <MessageSquare className="h-4 w-4 text-orange-500" />,
    label: "Simplify",
    color: "text-orange-500",
    promptType: "simplify",
  },
  {
    icon: <Sparkles className="h-4 w-4 text-green-500" />,
    label: "Detailed",
    color: "text-green-500",
    promptType: "detailed",
  },

  {
    icon: <Flame className="h-4 w-4 text-blue-500" />,
    label: "Fluent",
    color: "text-blue-500",
    promptType: "fluent",
  },
  {
    icon: <Wand2 className="h-4 w-4 text-blue-500" />,
    label: "Correct",
    color: "text-blue-500",
    promptType: "improve",
  },
];

const suggestions = [
  {
    id: "1",
    type: "paraphrase",
    content:
      "Although AI has the capacity to produce designs using data and algorithms, it falls short in replicating human creativity.",
  },
  {
    id: "2",
    type: "simplify",
    content:
      "AI can create designs from data and algorithms, but it can't match human creativity.",
  },
  {
    id: "3",
    type: "confident",
    content:
      "AI's ability to generate designs from data and algorithms simply cannot compete with the depth and nuance of human creativity.",
  },
];

export const suggestionCategories: {
  id: string;
  label: string;
  experimental?: boolean;
}[] = [
  { id: "prompts", label: "Pre-Engineered Prompts" },
  { id: "chat", label: "Chat", experimental: true },
  // { id: "suggestions", label: "SUGGESTIONS", badge: 4 },
] as const;

export const PROMPT_OPTIONS: IPromptOption[] = [
  ...rewriteOptions,
  ...toneOptions,
];
