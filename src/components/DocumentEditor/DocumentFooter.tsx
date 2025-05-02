import { ChevronDown, Dot } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { PromptFormValues } from "../Views/PromptPopover";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const DocumentFooter = ({
  wordCount,
  readMins,
  promptsLeft,
}: {
  wordCount: number;
  readMins: number;
  promptsLeft: number;
}) => {
  const [promptPopOverOpen, setPromptPopOverOpen] = useState(false);

  const onSubmit = (values: PromptFormValues) => {
    console.log({ values });
  };

  return (
    <footer className="flex justify-between items-center px-6 py-2 border-t text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <span>{wordCount} Words</span> <Dot />{" "}
          <span>{readMins} min read</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-6 gap-1 border"
          type="button"
        >
          <span>V1</span>
          <ChevronDown size={12} />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-brand-blue bg-brand-light">
          {promptsLeft} Prompts Left
        </Badge>

        <Tooltip>
          <TooltipTrigger asChild>
            {/* <PromptPopover
              open={promptPopOverOpen}
              onOpenChange={setPromptPopOverOpen}
              onSubmit={onSubmit}
            > */}
            <span>
              <Button
                size="sm"
                type="button"
                className="h-6 text-xs bg-brand-blue hover:bg-brand-dark"
                disabled
              >
                Write Prompt for Selection
              </Button>
            </span>

            {/* </PromptPopover> */}
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            children={"Experimental feature"}
          />
        </Tooltip>
      </div>
    </footer>
  );
};

export default DocumentFooter;
