import AppNavbar from "@/components/AppNavbar";
import AiSuggestions from "@/components/AiSuggestions";
import DocumentsSidebar from "@/pages/Documents/components/DocumentsSidebar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginPage from "@/pages/Auth/Login/Login";
import { DocumentsLayoutProps } from "@/interface/IDocumentsLayoutProps";
import { useDocumentLayoutContext } from "@/context/DocumentLayoutContext/DocumentLayoutContext";
import { useDocuments } from "@/hooks/useDocuments";

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
  const {
    loginModalOpen,
    setLoginModalOpen,
    sidebarOpen,
    suggestionsOpen,
    toggleSidebar,
    toggleSuggestions,
  } = useDocumentLayoutContext();
  const { refetch } = useDocuments();

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    refetch();
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-50">
        <AppNavbar
          onToggleSidebar={toggleSidebar}
          onToggleSuggestions={toggleSuggestions}
        />
        <div className="flex flex-1 overflow-hidden">
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
          <main className="flex-1 overflow-hidden">{children}</main>
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
      {loginModalOpen && (
        <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
          <DialogContent title="" onOpenAutoFocus={(e) => e.preventDefault()}>
            <LoginPage isModal onSuccess={handleLoginSuccess} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DocumentsLayout;
