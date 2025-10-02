import DocumentForm from "./DocumentForm";
import { useDocuments } from "@/hooks/useDocuments";
import { purifyHtml } from "@/lib/utils";
import { ICollaborator } from "@/interface/ICollaborator";
import AiSuggestions from "@/components/AiSuggestions";
import { useGenerationStream } from "@/hooks/gen-ai/useGenerationStream";
import useEditorTools from "@/components/DocumentEditor/useEditorTools";
import { TDocAIActions } from "@/utils/constants";
import { toast } from "sonner";
import { PROMPT_GENERATORS } from "@/utils/prompts";
import { useDocumentsLayout } from "@/hooks/useDocumentsLayout";

const DocumentWrapper = () => {
  const {
    quillRef: editorRef,
    pushTextToBuffer,
    stopStreamInsert,
    isInserting,
  } = useEditorTools();
  const {
    documents: _documents,
    selectedDocument,
    handleSelectDocument,
    updateDocument,
    createDocument,
    shareDocument,
    generatePDF,
  } = useDocuments();

  const { setSidebarOpen, setSuggestionsOpen, sidebarOpen, suggestionsOpen } =
    useDocumentsLayout();

  const [
    startGenStream,
    { isLoading: isLoadingStream, isLoadingInit, cancel: cancelGeneration },
  ] = useGenerationStream();

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

  const handleStopStreaming = () => {
    cancelGeneration();
    stopStreamInsert();
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle suggestions panel
  const toggleSuggestions = () => {
    setSuggestionsOpen(!suggestionsOpen);
  };

  const handleOnFocus = () => {
    toggleSidebar();
    toggleSuggestions();
  };

  // Handle new document creation
  const handleCreateDocument = () => {
    createDocument.mutate({
      title: "Untitled Document",
    });
  };

  return (
    <>
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
            isLoadingAIAction={isLoadingInit}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">No document selected</h2>
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
        cancelGeneration={handleStopStreaming}
        applyDocAIAction={applyDocAIAction}
        isApplySuggLoading={isLoadingStream || isInserting}
      />
    </>
  );
};

export default DocumentWrapper;
