import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlaskConicalIcon, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TDocAIActions } from "@/utils/constants";
import { PROMPT_OPTIONS, suggestionCategories } from "@/utils/options";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Alert } from "./ui/alert";
import PromptChat from "./Views/PromptChat";

interface AiSuggestionsProps {
  open: boolean;
  onToggle: () => void;
  onApplySuggestion: (text: string) => void;
  applyDocAIAction: (action: `${TDocAIActions}`, customPrompt?: string) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({
  open,
  onToggle,
  onApplySuggestion,
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
        "w-80 h-auto bg-white border-l flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
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
          {/* <ArrowRightToLine
            className="flex cursor-pointer text-gray-900"
            size={20}
            // onClick={onToggle}
          /> */}
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
              <Tooltip key={option.promptType}>
                <TooltipTrigger asChild>
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => applyDocAIAction(option.promptType)}
                    {...option.buttonProps}
                    className={cn(
                      "justify-start gap-2 h-9",
                      option.buttonProps?.className
                    )}
                  >
                    {option.icon}
                    <span className={`truncate max-w-full ${option.color}`}>
                      {option.label}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  children={option.label}
                />
              </Tooltip>
            ))}
            <Button
              variant="ghost"
              className="text-xs text-muted-foreground col-span-2 mt-1"
            >
              Show All
            </Button>
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

        {/* 
        <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>

        */}

        {/* {activeCategory === "tone" && (
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
        )} */}

        {/* {activeCategory === "suggestions" && (
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
        )} */}
      </div>
    </aside>
  );
};

export default AiSuggestions;
