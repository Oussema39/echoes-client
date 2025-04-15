import { useEffect, useMemo, useRef, useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import AiSuggestions from "@/components/AiSuggestions";
import DocumentsProvider from "@/context/DocumentsProvider";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentForm from "@/pages/Documents/components/DocumentForm";
import Loader from "@/components/ui/loader";
import DocumentsSidebar from "./components/DocumentsSidebar";
import { ICollaborator } from "@/interface/ICollaborator";
import { TDocAIActions } from "@/utils/constants";
import {
  useCorrectTextMutation,
  useParaphraseTextMutation,
  useShortenTextMutation,
} from "@/hooks/ai";
import type Quill from "quill";
import { useGenerationStream } from "@/hooks/gen-ai/useGenerationStream";

type TEditorRef = {
  insertTextFromSelection: (text: string) => Promise<void>;
  instance: Quill;
};

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

  const paraphraseText = useParaphraseTextMutation();
  const shortenText = useShortenTextMutation();
  const correctText = useCorrectTextMutation();

  const [startStream, { message }] = useGenerationStream();

  useEffect(() => {
    startStream(
      "Technology has revolutionized the way we communicate, work, and live. The advent of the internet and mobile devices has made it easier than ever to stay connected with others, access information, and complete tasks from virtually anywhere. However, with these advancements come new challenges, such as privacy concerns, information overload, and the growing dependence on digital tools for everyday life."
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editorRef = useRef<TEditorRef>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  const isLoadingAIAction = useMemo(() => {
    return (
      paraphraseText.isPending || shortenText.isPending || correctText.isPending
    );
  }, [paraphraseText, shortenText, correctText]);

  // Apply Document AI Action
  const applyDocAIAction = async (text: `${TDocAIActions}`) => {
    const { insertTextFromSelection, instance } = editorRef.current;

    if (!instance) throw new Error("No instance of an Editor was found");
    const selection = instance.getSelection();
    const selectionText = instance.getText(selection.index, selection.length);

    let handler: any;
    switch (text) {
      case TDocAIActions.PARAPHRASE:
        handler = paraphraseText.mutateAsync;
        break;
      case TDocAIActions.SHORTEN:
        handler = shortenText.mutateAsync;
        break;
      case TDocAIActions.CORRECT:
        handler = correctText.mutateAsync;
        break;

      default:
        break;
    }

    const modifiedText: string = await handler(selectionText);

    if (modifiedText) {
      insertTextFromSelection(modifiedText);
    }
  };

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
              saveDocument={handleSaveDocument}
              shareDocument={handleShareDocument}
              selectedDocument={selectedDocument}
              isLoading={updateDocument.isPending}
              isLoadingShare={shareDocument.isPending}
              ref={editorRef}
              isLoadingAIAction={isLoadingAIAction}
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
