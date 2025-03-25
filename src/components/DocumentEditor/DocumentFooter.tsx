import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const DocumentFooter = ({
  wordCount,
  promptsLeft,
}: {
  wordCount: number;
  promptsLeft: number;
}) => {
  return (
    <footer className="flex justify-between items-center px-6 py-2 border-t text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>{wordCount} Words</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-6 gap-1"
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
