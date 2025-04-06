import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import AiSuggestions from "@/components/AiSuggestions";
import DocumentsProvider from "@/context/DocumentsProvider";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentForm from "@/pages/Documents/components/DocumentForm";
import Loader from "@/components/ui/loader";
import DocumentsSidebar from "./components/DocumentsSidebar";
import { ICollaborator } from "@/interface/ICollaborator";

const Documents = () => {
  const {
    documents: _documents,
    selectedDocument,
    isLoading,
    handleSelectDocument,
    updateDocument,
    createDocument,
    deleteDocument,
    shareDocument,
  } = useDocuments();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle suggestions panel
  const toggleSuggestions = () => {
    return;
    // setSuggestionsOpen(!suggestionsOpen);
  };

  // Handle new document creation
  const handleCreateDocument = () => {
    createDocument.mutate({
      title: "Untitled Document",
    });
  };

  // Handle document save
  const handleSaveDocument = ({
    content,
    title,
  }: {
    content: string;
    title: string;
  }) => {
    updateDocument.mutate({
      _id: selectedDocument?._id,
      content,
      title,
    });
  };

  // Handle share document
  const handleShareDocument = (collaborators: ICollaborator[]) => {
    shareDocument.mutate({
      docId: selectedDocument?._id,
      collaborators: collaborators.map((collab) => ({
        userId: collab.userId,
        permissionLevel: collab.permissionLevel ?? "owner",
      })),
    });
  };

  // Apply AI suggestion to the editor
  const handleApplySuggestion = (text: string) => {};

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
      />
      <div className="flex flex-1 overflow-hidden">
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

        <main className="flex-1 overflow-hidden">
          {selectedDocument ? (
            <DocumentForm
              saveDocument={handleSaveDocument}
              shareDocument={handleShareDocument}
              selectedDocument={selectedDocument}
              isLoading={updateDocument.isPending}
              isLoadingShare={shareDocument.isPending}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2">
                  No document selected
                </h2>
                <button
                  onClick={handleCreateDocument}
                  className="text-brand-blue hover:underline"
                >
                  Create a new document
                </button>
              </div>
            </div>
          )}
        </main>

        <AiSuggestions
          open={suggestionsOpen}
          onToggle={toggleSuggestions}
          onApplySuggestion={handleApplySuggestion}
        />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <DocumentsProvider>
      <Documents />
    </DocumentsProvider>
  );
};

export default Index;
