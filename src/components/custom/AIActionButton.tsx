import { ComponentProps, useState } from "react";
import { Button } from "../ui/button";
import { IPromptOption } from "@/interface/IPromptOption";
import { TDocAIActions } from "@/utils/constants";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Square } from "lucide-react";

type AIActionButtonProps = {
  option: IPromptOption;
  isApplySuggLoading: boolean;
  cancelGeneration: () => void;
  applyDocAIAction: (action: `${TDocAIActions}`, customPrompt?: string) => void;
} & Partial<ComponentProps<typeof Button>>;

const AIActionButton = ({
  option,
  isApplySuggLoading,
  applyDocAIAction,
  cancelGeneration,
  ...props
}: AIActionButtonProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleCancel = (e: Event) => {
    e.stopPropagation();
    cancelGeneration();
  };

  return (
    <Tooltip key={option.promptType}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            if (!isApplySuggLoading) {
              applyDocAIAction(option.promptType);
            }
          }}
          {...option.buttonProps}
          className={cn(
            "justify-start gap-2 h-9 relative",
            option.buttonProps?.className
          )}
          {...props}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering && isApplySuggLoading && (
            <div
              onClick={handleCancel}
              className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-filter backdrop-blur-sm cursor-pointer group-hover:opacity-100 transition-opacity duration-200"
            >
              <Square className="h-5 w-5 text-primary" />
            </div>
          )}
          {option.icon}
          <span className={`truncate max-w-full ${option.color}`}>
            {option.label}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        children={isApplySuggLoading ? "Stop operation" : option.label}
      />
    </Tooltip>
  );
};

export default AIActionButton;
