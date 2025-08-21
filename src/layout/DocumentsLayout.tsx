import { ReactNode, useState, useEffect } from "react";
import AppNavbar from "@/components/AppNavbar";
import AiSuggestions from "@/components/AiSuggestions";
import { useIsMobile } from "@/hooks/use-mobile";
import { TDocAIActions } from "@/utils/constants";
import { IDocument } from "@/interface/IDocument";
import DocumentsSidebar from "@/pages/Documents/components/DocumentsSidebar";
import { DocumentsLayoutContext } from "@/hooks/useDocumentsLayout";

interface DocumentsLayoutProps {
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

const DocumentsLayout = ({
  children,
  documents,
  selectedDocument,
  onSelectDocument,
  onCreateDocument,
  onDeleteDocument,
  isLoadingCreate,
  isLoadingDelete,
  onApplySuggestion,
  onStopStreaming,
  applyDocAIAction,
  isApplySuggLoading,
  onFocusEditor,
}: DocumentsLayoutProps) => {
  const isMobile = useIsMobile(1400);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle suggestions panel
  const toggleSuggestions = () => {
    setSuggestionsOpen(!suggestionsOpen);
  };

  const handleOnFocus = () => {
    if (onFocusEditor) {
      onFocusEditor();
    } else {
      // Default behavior: close both panels on mobile
      if (isMobile) {
        setSidebarOpen(false);
        setSuggestionsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isMobile) {
      setSuggestionsOpen(false);
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
      setSuggestionsOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppNavbar
        onToggleSidebar={toggleSidebar}
        onToggleSuggestions={toggleSuggestions}
      />
      <div className="flex flex-1 overflow-hidden">
        <div id="streamed-text"></div>
        <div className={sidebarOpen ? "" : "hidden"}>
          <DocumentsSidebar
            open={sidebarOpen}
            onToggle={toggleSidebar}
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={onSelectDocument}
            onCreateDocument={onCreateDocument}
            isLoading={isLoadingCreate}
            isLoadingDelete={isLoadingDelete}
            onDeleteDocument={onDeleteDocument}
          />
        </div>
        <main className="flex-1 overflow-hidden">
          <DocumentsLayoutContext.Provider
            value={{
              handleOnFocus,
            }}
          >
            {children}
          </DocumentsLayoutContext.Provider>
        </main>
        <AiSuggestions
          open={suggestionsOpen}
          onToggle={toggleSuggestions}
          onApplySuggestion={onApplySuggestion}
          cancelGeneration={onStopStreaming}
          applyDocAIAction={applyDocAIAction}
          isApplySuggLoading={isApplySuggLoading}
        />
      </div>
    </div>
  );
};

export default DocumentsLayout;
