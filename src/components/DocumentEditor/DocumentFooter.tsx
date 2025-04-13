import { ChevronDown, Dot } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const DocumentFooter = ({
  wordCount,
  readMins,
  promptsLeft,
}: {
  wordCount: number;
  readMins;
  promptsLeft: number;
}) => {
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
        <Button
          size="sm"
          type="button"
          className="h-6 text-xs bg-brand-blue hover:bg-brand-dark"
        >
          Write Prompt for Selection
        </Button>
      </div>
    </footer>
  );
};

export default DocumentFooter;
