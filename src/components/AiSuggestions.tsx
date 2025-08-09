import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FlaskConicalIcon, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TDocAIActions } from "@/utils/constants";
import { PROMPT_OPTIONS, suggestionCategories } from "@/utils/options";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Alert } from "./ui/alert";
import PromptChat from "./Views/PromptChat";
import AIActionButton from "./custom/AIActionButton";

interface AiSuggestionsProps {
  open: boolean;
  onToggle: () => void;
  onApplySuggestion: (text: string) => void;
  cancelGeneration: () => void;
  isApplySuggLoading: boolean;
  applyDocAIAction: (action: `${TDocAIActions}`, customPrompt?: string) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({
  open,
  isApplySuggLoading,
  cancelGeneration,
  applyDocAIAction,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrompts, setFilteredPrompts] = useState(PROMPT_OPTIONS);
  const [activeCategory, setActiveCategory] =
    useState<(typeof suggestionCategories)[number]["id"]>("prompts");

  const handleSearchPrompts = (query: string) => {
    if (!query) {
      setFilteredPrompts(PROMPT_OPTIONS);
      setSearchQuery("");
      return;
    }

    const filtered = PROMPT_OPTIONS.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredPrompts(filtered);
    setSearchQuery(query);
  };

  return (
    <aside
      className={cn(
        "w-96 h-auto bg-white border-l flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full hidden"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-purple-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-medium">Actions</h2>
          <div className="ml-auto text-xs text-muted-foreground border rounded-full px-2 py-0.5">
            {filteredPrompts.length} options
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearchPrompts(e.target.value)}
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
              disabled={category.experimental}
              className={cn(
                "flex-1 text-sm p-2 relative",
                activeCategory === category.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center gap-2">
                    {category.label}
                    {category.experimental ? (
                      <FlaskConicalIcon size={12} />
                    ) : null}
                  </div>
                </TooltipTrigger>
                {category.experimental ? (
                  <TooltipContent
                    side="top"
                    align="center"
                    children={"Experimental feature"}
                  />
                ) : null}
              </Tooltip>
              {activeCategory === category.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        {activeCategory === "prompts" && (
          <div className="p-4 grid grid-cols-2 gap-2">
            {filteredPrompts.map((option, idx) => (
              <AIActionButton
                option={option}
                applyDocAIAction={applyDocAIAction}
                cancelGeneration={cancelGeneration}
                isApplySuggLoading={isApplySuggLoading}
              />
            ))}
          </div>
        )}

        {activeCategory === "chat" && (
          <div className="p-4 flex flex-col gap-2">
            <PromptChat
              onSubmit={(data) =>
                applyDocAIAction("custom-prompt", data.prompt)
              }
            />
            <Alert
              variant="default"
              className="text-xs text-muted-foreground col-span-2 mt-1"
            >
              Changes will be applied to the whole document content
            </Alert>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AiSuggestions;
