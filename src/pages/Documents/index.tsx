import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import AiSuggestions from "@/components/AiSuggestions";
import DocumentsProvider from "@/context/DocumentsProvider";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentForm from "@/pages/Documents/components/DocumentForm";
import Loader from "@/components/ui/loader";
import DocumentsSidebar from "./components/DocumentsSidebar";
import { ICollaborator } from "@/interface/ICollaborator";
import { TDocAIActions } from "@/utils/constants";
import { useGenerationStream } from "@/hooks/gen-ai/useGenerationStream";
import { toast } from "sonner";
import { purifyHtml } from "@/lib/utils";
import { PROMPT_GENERATORS } from "@/utils/prompts";
import useEditorTools from "@/components/DocumentEditor/useEditorTools";
import { useAuth } from "@/hooks/useAuth";

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
    generatePDF,
  } = useDocuments();

  const { loginWithGoogle } = useAuth();

  const { quillRef: editorRef, pushTextToBuffer } = useEditorTools();

  const [startGenStream, { isLoading: isLoadingStream }] =
    useGenerationStream();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  // Apply Document AI Action
  const applyDocAIAction = async (
    action: `${TDocAIActions}`,
    customPrompt?: string
  ) => {
    const instance = editorRef.current?.getEditor();

    if (!instance) throw new Error("No instance of an Editor was found");

    const selection = instance.getSelection();

    if (!selection && action !== "custom-prompt") {
      toast.info("Please select some text to apply the AI action.");
      return;
    }

    const selectionText = selection
      ? instance.getText(selection.index, selection.length)
      : instance.getText();

    if (!selectionText || selectionText.length === 0) {
      toast.info("Please select some text to apply the AI action.");
      return;
    }
    const prompt = PROMPT_GENERATORS[action](selectionText, customPrompt);
    startGenStream(prompt, (chunk: string) => {
      pushTextToBuffer(chunk, action === TDocAIActions.CUSTOM_PROMPT ? 5 : 25);
    });
  };

  const exportPdf = async (html: string) => {
    await generatePDF.mutateAsync({
      html: purifyHtml(html),
    });
  };

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

  const handleOnFocus = () => {
    toggleSidebar();
    toggleSuggestions();
  };

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
        <main className="flex-1 overflow-hidden">
          {selectedDocument ? (
            <DocumentForm
              exportPdf={exportPdf}
              saveDocument={handleSaveDocument}
              shareDocument={handleShareDocument}
              selectedDocument={selectedDocument}
              isLoading={updateDocument.isPending}
              isLoadingShare={shareDocument.isPending}
              isLoadingGeneratePDF={generatePDF.isPending}
              ref={editorRef}
              handleOnFocus={handleOnFocus}
              isLoadingAIAction={isLoadingStream}
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
          applyDocAIAction={applyDocAIAction}
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
