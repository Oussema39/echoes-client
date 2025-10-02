import AppNavbar from "@/components/AppNavbar";
import DocumentsProvider from "@/context/DocumentsProvider";
import { useDocuments } from "@/hooks/useDocuments";
import Loader from "@/components/ui/loader";
import DocumentsSidebar from "./components/DocumentsSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router-dom";
import DocumentLayoutProvider from "@/context/DocumentLayoutProvider";
import { useDocumentsLayout } from "@/hooks/useDocumentsLayout";

const Documents = () => {
  const {
    documents: _documents,
    selectedDocument,
    isLoading,
    handleSelectDocument,
    createDocument,
    deleteDocument,
    generatePDF,
  } = useDocuments();

  const { setSidebarOpen, setSuggestionsOpen, sidebarOpen, suggestionsOpen } =
    useDocumentsLayout();

  const { loginWithGoogle } = useAuth();

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle suggestions panel
  const toggleSuggestions = () => {
    setSuggestionsOpen(!suggestionsOpen);
  };

  // Handle new document creation
  const handleCreateDocument = () => {
    createDocument.mutate({
      title: "Untitled Document",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppNavbar
        onToggleSidebar={toggleSidebar}
        onToggleSuggestions={toggleSuggestions}
        loginWithGoogle={loginWithGoogle}
      />
      <div className="flex flex-1 overflow-hidden">
        <div id="streamed-text"></div>
        <div className={sidebarOpen ? "" : "hidden"}>
          <DocumentsSidebar
            open={sidebarOpen}
            onToggle={toggleSidebar}
            documents={_documents}
            selectedDocument={selectedDocument}
            onSelectDocument={handleSelectDocument}
            onCreateDocument={handleCreateDocument}
            isLoading={createDocument.isPending}
            isLoadingDelete={deleteDocument.isPending}
            onDeleteDocument={deleteDocument.mutate}
          />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <DocumentLayoutProvider>
      <DocumentsProvider>
        <Documents />
      </DocumentsProvider>
    </DocumentLayoutProvider>
  );
};

export default Index;
