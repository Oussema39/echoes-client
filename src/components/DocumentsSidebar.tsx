import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  FileText,
  CreditCard,
  X,
  InfinityIcon,
} from "lucide-react";
import { IDocument } from "@/interface/IDocument";

interface Document {
  id: string;
  title: string;
  selected?: boolean;
}

interface DocumentsSidebarProps {
  open: boolean;
  onToggle: () => void;
  documents: IDocument[];
  selectedDocument: IDocument | null;
  onSelectDocument: (id: string) => void;
  onCreateDocument: () => void;
}

const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({
  open,
  onToggle,
  documents,
  selectedDocument,
  onSelectDocument,
  onCreateDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "w-72 h-auto bg-white border-r flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium mb-4">Your Documents</h2>
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

      <div className="p-3">
        <Button
          onClick={onCreateDocument}
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent hover:bg-muted/50"
        >
          <Plus size={16} />
          <span>New Document</span>
        </Button>
      </div>

      <div className="flex-grow overflow-auto">
        <div className="px-3 py-2">
          {filteredDocuments.map((doc) => (
            <button
              key={doc._id}
              onClick={() => onSelectDocument(doc._id)}
              className={cn(
                "w-full text-left p-3 rounded-md mb-1 transition-colors document-card",
                doc._id === selectedDocument?._id
                  ? "bg-brand-light border border-brand-blue/20"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-muted-foreground" />
                <span className="truncate">{doc.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t p-3">
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 flex items-center justify-center bg-brand-blue text-white rounded-md">
              <CreditCard size={14} />
            </div>
            <h3 className="font-medium">Become Professional</h3>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6 w-6 p-0"
              onClick={onToggle}
            >
              <X size={14} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            You have <InfinityIcon className="inline-block" size={18} />{" "}
            documents left.
          </p>
          <Button className="w-full text-xs h-7 bg-brand-blue hover:bg-brand-dark">
            Upgrade
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DocumentsSidebar;
