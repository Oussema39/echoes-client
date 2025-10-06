import DocumentsProvider from "@/context/DocumentsProvider";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentForm from "@/pages/Documents/components/DocumentForm";
import Loader from "@/components/ui/loader";
import { ICollaborator } from "@/interface/ICollaborator";
import { TDocAIActions, TDocDefaultActions } from "@/utils/constants";
import { useGenerationStream } from "@/hooks/gen-ai/useGenerationStream";
import { toast } from "sonner";
import { purifyHtml } from "@/lib/utils";
import { PROMPT_GENERATORS } from "@/utils/prompts";
import useEditorTools from "@/components/DocumentEditor/useEditorTools";
import DocumentsLayout from "@/layout/DocumentsLayout";
import { useAuth } from "@/hooks/useAuth";
import DocumentLayoutProvider from "@/context/DocumentLayoutContext/DocumentLayoutProvider";
import { useDocumentLayoutContext } from "@/context/DocumentLayoutContext/DocumentLayoutContext";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { IDocument } from "@/interface/IDocument";
import { flushSync } from "react-dom";

const DocumentsPageContent = () => {
  const {
    handleOnFocus,
    setLoginModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    draftState,
    setDraftState,
  } = useDocumentLayoutContext();
  const { isAuthenticated } = useAuth();

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

  const {
    quillRef: editorRef,
    isInserting,
    endStreamInsert,
    pushTextToBuffer,
    stopStreamInsert,
    streamInsertHTML,
    emptyEditor,
  } = useEditorTools();

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

    const handler =
      action === TDocAIActions.CUSTOM_PROMPT
        ? streamInsertHTML
        : pushTextToBuffer;

    if (action === TDocAIActions.CUSTOM_PROMPT) {
      emptyEditor();
    }

    startGenStream(
      prompt,
      (chunk: string) => {
        handler(chunk, action === TDocAIActions.CUSTOM_PROMPT ? 5 : 25);
      },
      () => {
        endStreamInsert();
      }
    );
  };

  const exportPdf = async (html: string) => {
    await generatePDF.mutateAsync({
      html: purifyHtml(html),
    });
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
    if (!isAuthenticated) {
      toast("Please sign in before saving any changes");
      setLoginModalOpen(true);
      return;
    }

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

  // Handle Delete
  const handleOpenDeleteDialog = (documentId: string) => {
    const document = _documents.find((doc) => doc._id === documentId);
    setDraftState(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDocument = async () => {
    const safeDraft = draftState as IDocument | null;
    if (!safeDraft || !safeDraft?._id) {
      console.error("No document was selected to delete");
      return;
    }

    await deleteDocument.mutateAsync(safeDraft._id);

    flushSync(() => setIsDeleteDialogOpen(false));

    if (deleteDocument.isSuccess) {
      setDraftState(null);
    }
  };

  // Apply AI suggestion to the editor
  const handleApplySuggestion = (text: string) => {
    // Implementation for applying AI suggestions
  };

  const handleStopStreaming = () => {
    cancelGeneration();
    stopStreamInsert();
  };

  const handleOnFocusEditor = () => {
    handleOnFocus();
    // Custom focus behavior can be implemented here
    // For now, we'll use the default layout behavior
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <DocumentsLayout
      documents={_documents}
      selectedDocument={selectedDocument}
      onSelectDocument={handleSelectDocument}
      onCreateDocument={handleCreateDocument}
      onDeleteDocument={handleOpenDeleteDialog}
      isLoadingCreate={createDocument.isPending}
      isLoadingDelete={deleteDocument.isPending}
      onApplySuggestion={handleApplySuggestion}
      onStopStreaming={handleStopStreaming}
      applyDocAIAction={applyDocAIAction}
      isApplySuggLoading={isLoadingStream || isInserting}
      onFocusEditor={handleOnFocusEditor}
    >
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
          handleOnFocus={handleOnFocusEditor}
          isLoadingAIAction={isLoadingInit}
          disabledActions={!isAuthenticated ? [TDocDefaultActions.SHARE] : []}
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
      <DeleteConfirmation
        open={isDeleteDialogOpen}
        isLoading={deleteDocument.isPending}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        itemName={(draftState as IDocument)?.title}
        onConfirm={handleDeleteDocument}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </DocumentsLayout>
  );
};

const DocumentsPage = () => {
  return (
    <DocumentLayoutProvider>
      <DocumentsProvider>
        <DocumentsPageContent />
      </DocumentsProvider>
    </DocumentLayoutProvider>
  );
};

export default DocumentsPage;
