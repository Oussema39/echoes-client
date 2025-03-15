import { useEffect, useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import DocumentsSidebar from "@/components/DocumentsSidebar";
import DocumentEditor from "@/components/DocumentEditor";
import AiSuggestions from "@/components/AiSuggestions";
import { toast } from "sonner";
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  getCurrentDocumentId,
  setCurrentDocumentId,
  Document,
} from "@/services/documentService";
import DocumentsProvider from "@/context/DocumentsProvider";
import { useDocuments } from "@/hooks/useDocuments";

const Documents = () => {
  const {
    documents: _documents,
    selectedDocument,
    isLoading,
    handleSelectDocument,
  } = useDocuments();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  // Load documents on mount
  useEffect(() => {
    const allDocuments = getAllDocuments();
    setDocuments(allDocuments);

    // Get current document or use the first document
    const currentId =
      getCurrentDocumentId() ||
      (allDocuments.length > 0 ? allDocuments[0].id : null);

    if (currentId) {
      const document = getDocumentById(currentId);
      if (document) {
        setCurrentDocument(document);
        setCurrentDocumentId(document.id);
      }
    }

    setLoading(false);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle suggestions panel
  const toggleSuggestions = () => {
    return;
    // setSuggestionsOpen(!suggestionsOpen);
  };

  // Handle document selection
  // const handleSelectDocument = (id: string) => {
  //   const selected = getDocumentById(id);
  //   if (selected) {
  //     setCurrentDocument(selected);
  //     setCurrentDocumentId(id);
  //     // Refresh the documents list with updated selection state
  //     setDocuments(
  //       documents.map((doc) => ({
  //         ...doc,
  //       }))
  //     );
  //   }
  // };

  // Handle new document creation
  const handleCreateDocument = () => {
    const newDocument = createDocument();
    setDocuments([...documents, newDocument]);
    setCurrentDocument(newDocument);
    setCurrentDocumentId(newDocument.id);
    toast.success("New document created");
  };

  // Handle document save
  const handleSaveDocument = (content: string, title: string) => {
    if (!currentDocument) return;

    const updated = updateDocument(currentDocument.id, { content, title });
    if (updated) {
      setCurrentDocument(updated);
      // Update the document in the list
      setDocuments(
        documents.map((doc) => (doc.id === updated.id ? updated : doc))
      );
      toast.success("Document saved successfully");
    }
  };

  // Handle content change without saving
  const handleContentChange = (content: string) => {
    if (!currentDocument) return;
    // Update local state without saving to storage
    setCurrentDocument({
      ...currentDocument,
      content,
    });
  };

  // Apply AI suggestion to the editor
  const handleApplySuggestion = (text: string) => {
    if (!currentDocument) return;

    // For simplicity, we're replacing the entire content
    // In a real app, you'd want to insert at cursor position
    const updated = updateDocument(currentDocument.id, {
      content: `<p>${text}</p>`,
    });

    if (updated) {
      setCurrentDocument(updated);
      setDocuments(
        documents.map((doc) => (doc.id === updated.id ? updated : doc))
      );
      toast.success("Suggestion applied");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
        />

        <main className="flex-1 overflow-hidden">
          {selectedDocument ? (
            <DocumentEditor
              initialContent={selectedDocument.content}
              documentTitle={selectedDocument.title}
              onSave={handleSaveDocument}
              onContentChange={handleContentChange}
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
