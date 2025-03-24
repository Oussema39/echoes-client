import { IDocument } from "@/interface/IDocument";
import { cn } from "@/lib/utils";
import { FileText, Ellipsis, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  document: IDocument;
  selectedDocument: IDocument;
  onSelectDocument: (id: string) => void;
};

const DocumentPreviewCard = ({
  document,
  selectedDocument,
  onSelectDocument,
}: Props) => {
  return (
    <div
      title={document.title}
      key={document._id}
      onClick={() => onSelectDocument(document._id)}
      className={cn(
        "w-full text-left p-3 rounded-md mb-1 transition-colors document-card group",
        document._id === selectedDocument?._id
          ? "bg-brand-light border border-brand-blue/20"
          : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-muted-foreground flex-shrink-0" />
        <span className="truncate">{document.title}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Ellipsis className="text-muted-foreground" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="truncate">
              {document.title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-red-400 hover:text-red-400 hover:cursor-pointer">
                Delete
                <DropdownMenuShortcut>
                  <Trash size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DocumentPreviewCard;
