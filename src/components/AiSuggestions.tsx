import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Sparkles,
  ArrowUpRight,
  Wand2,
  Flame,
  Smile,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AiSuggestionsProps {
  open: boolean;
  onToggle: () => void;
  onApplySuggestion: (text: string) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({
  open,
  onToggle,
  onApplySuggestion,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const suggestionCategories = [
    { id: "rewrite", label: "REWRITE" },
    { id: "tone", label: "ADJUST TONE" },
    { id: "suggestions", label: "SUGGESTIONS", badge: 4 },
  ];

  const rewriteOptions = [
    {
      icon: <Wand2 className="h-4 w-4 text-blue-500" />,
      label: "Improve It",
      color: "text-blue-500",
    },
    {
      icon: <ArrowUpRight className="h-4 w-4 text-cyan-500" />,
      label: "Shorten",
      color: "text-cyan-500",
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-orange-500" />,
      label: "Simplify",
      color: "text-orange-500",
    },
    {
      icon: <Sparkles className="h-4 w-4 text-green-500" />,
      label: "Detailed",
      color: "text-green-500",
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
      label: "Paraphrase",
      color: "text-purple-500",
    },
    {
      icon: <Flame className="h-4 w-4 text-blue-500" />,
      label: "Fluent",
      color: "text-blue-500",
    },
  ];

  const toneOptions = [
    {
      icon: <Sparkles className="h-4 w-4 text-amber-500" />,
      label: "Anticipatory",
      color: "text-amber-500",
    },
    {
      icon: <ThumbsUp className="h-4 w-4 text-orange-500" />,
      label: "Assertive",
      color: "text-orange-500",
    },
    {
      icon: <Smile className="h-4 w-4 text-pink-500" />,
      label: "Compassionate",
      color: "text-pink-500",
    },
    {
      icon: <Smile className="h-4 w-4 text-yellow-500" />,
      label: "Confident",
      color: "text-yellow-500",
    },
    {
      icon: <ThumbsUp className="h-4 w-4 text-amber-500" />,
      label: "Constructive",
      color: "text-amber-500",
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

  const [activeCategory, setActiveCategory] = useState("rewrite");

  return (
    <aside
      className={cn(
        "w-72 h-auto bg-white border-l flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-purple-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-medium">Actions</h2>
          <div className="ml-auto text-xs text-muted-foreground border rounded-full px-2 py-0.5">
            78
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full bg-muted/30"
          />
        </div>
      </div>

      <div className="border-b">
        <div className="flex">
          {suggestionCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex-1 text-sm py-2 relative",
                activeCategory === category.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center justify-center gap-1">
                {category.label}
                {category.badge && (
                  <span className="text-xs bg-muted rounded-full px-1.5 py-0.5">
                    {category.badge}
                  </span>
                )}
              </div>
              {activeCategory === category.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        {activeCategory === "rewrite" && (
          <div className="p-4 grid grid-cols-2 gap-2">
            {rewriteOptions.map((option, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="justify-start gap-2 h-9"
                onClick={() => {}}
              >
                {option.icon}
                <span className={option.color}>{option.label}</span>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="text-xs text-muted-foreground col-span-2 mt-1"
            >
              Show All
            </Button>
          </div>
        )}

        {activeCategory === "tone" && (
          <div className="p-4 grid grid-cols-2 gap-2">
            {toneOptions.map((option, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="justify-start gap-2 h-9"
                onClick={() => {}}
              >
                {option.icon}
                <span className={option.color}>{option.label}</span>
              </Button>
            ))}
          </div>
        )}

        {activeCategory === "suggestions" && (
          <div className="p-4 space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-muted/30 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium capitalize">
                    {suggestion.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {suggestion.content}
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <span className="sr-only">Copy</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => onApplySuggestion(suggestion.content)}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default AiSuggestions;
