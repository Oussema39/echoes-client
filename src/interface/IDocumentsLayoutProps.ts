import { ReactNode } from "react";
import { IDocument } from "./IDocument";
import { TDocAIActions } from "@/utils/constants";

export interface DocumentsLayoutProps {
  children: ReactNode;
  // Sidebar props
  documents: IDocument[];
  selectedDocument: IDocument;
  onSelectDocument: (docId: string) => void;
  onCreateDocument: () => void;
  onDeleteDocument: (docId: string) => void;
  isLoadingCreate: boolean;
  isLoadingDelete: boolean;
  // AI Suggestions props
  onApplySuggestion: (text: string) => void;
  onStopStreaming: () => void;
  applyDocAIAction: (
    action: `${TDocAIActions}`,
    customPrompt?: string
  ) => Promise<void>;
  isApplySuggLoading: boolean;
  // Layout control
  onFocusEditor?: () => void;
}
