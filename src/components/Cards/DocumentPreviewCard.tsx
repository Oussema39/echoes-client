import { IDocument } from "@/interface/IDocument";
import { cn } from "@/lib/utils";
import { FileText, Ellipsis, Trash, Share } from "lucide-react";
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
import { useCallback, useMemo } from "react";

type Props = {
  document: IDocument;
  isLoadingDelete: boolean;
  selectedDocument: IDocument;
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
};

const DocumentPreviewCard = ({
  document,
  isLoadingDelete,
  selectedDocument,
  onSelectDocument,
  onDeleteDocument,
}: Props) => {
  const isDisabled = useMemo(() => {
    return document._id === selectedDocument?._id && isLoadingDelete;
  }, [document._id, isLoadingDelete, selectedDocument?._id]);

  const handleDelete = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.stopPropagation();
      if (isDisabled) return; // Prevent multiple clicks
      onDeleteDocument(document._id);
    },
    [document._id, isDisabled, onDeleteDocument]
  );

  return (
    <div
      title={document.title}
      key={document._id}
      onClick={() => onSelectDocument(document._id)}
      className={cn(
        "w-full text-left px-2 py-0.5 rounded-md mb-1 transition-colors document-card group cursor-pointer",
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
              onClick={(e) => e.stopPropagation()}
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
              <DropdownMenuItem
                disabled={isDisabled}
                onClick={handleDelete}
                className="text-red-400 hover:text-red-400 hover:cursor-pointer"
              >
                Delete
                <DropdownMenuShortcut>
                  <Trash size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isDisabled}
                onClick={(e) => e.stopPropagation()}
                className=" hover:cursor-pointer"
              >
                Share
                <DropdownMenuShortcut>
                  <Share size={16} />
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
