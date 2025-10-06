import { ChevronDown, DatabaseBackup, Dot } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useDocuments } from "@/hooks/useDocuments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { format } from "date-fns";
import { IDocVersion } from "@/interface/IDocVersion";

const DocumentFooter = ({
  wordCount,
  readMins,
  promptsLeft,
}: {
  wordCount: number;
  readMins: number;
  promptsLeft: number;
}) => {
  // const [promptPopOverOpen, setPromptPopOverOpen] = useState(false);
  // const onSubmit = (values: PromptFormValues) => {
  //   console.log({ values });
  // };

  const {
    selectedDocument,
    selectedVersion,
    handleChangeSelectedVersion,
    updateSelectedDocumentById,
  } = useDocuments();

  const handleChangeVersion = (version: IDocVersion) => {
    handleChangeSelectedVersion(version._id, selectedDocument._id);
    updateSelectedDocumentById(selectedDocument._id, (doc) => {
      return {
        ...doc,
        content: version.changes.content.newValue,
        title: version.changes.title.newValue,
      };
    });
  };

  return (
    <footer className="flex justify-between flex-wrap items-center px-6 py-2 border-t text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center">
          <span>{wordCount} Words</span> <Dot />{" "}
          <span>{readMins} min read</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6 gap-1 border"
              type="button"
            >
              <div className="flex items-center gap-2">
                <DatabaseBackup size={12} />
                <p className="text-sm">V{selectedVersion?.version ?? 0}</p>
              </div>
              {selectedVersion?.timestamp ? (
                <div className="flex items-center">
                  <Dot />
                  <p className="flex-1 mr-1">
                    {format(selectedVersion.timestamp, "MMM d, yyyy - h:mm a")}
                  </p>
                  <ChevronDown size={12} />
                </div>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-48 overflow-y-auto"
            hidden={!selectedVersion}
          >
            {selectedDocument?.versions?.map((version) => (
              <DropdownMenuItem
                key={version._id ?? version.version}
                disabled={version === selectedVersion}
                onClick={() => handleChangeVersion(version)}
                className={`${
                  version === selectedVersion
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }
                flex items-center`}
              >
                <div className="flex items-center gap-2">
                  <DatabaseBackup size={12} />
                  <p className="text-sm">V{version.version}</p>
                </div>
                <div className="flex items-center">
                  <Dot />
                  <p className="flex-1">
                    {format(version.timestamp, "MMM d, yyyy - h:mm a")}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
