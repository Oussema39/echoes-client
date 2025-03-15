import { createDocument, getAllDocuments } from "@/api/documentsApi";
import { DocumentsContext } from "@/hooks/useDocuments";
import { IDocument } from "@/interface/IDocument";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useMemo, useState, useCallback, useEffect } from "react";

export type TDocumentContextValue = {
  documents: IDocument[];
  selectedDocument: IDocument | null;
  error: Error;
  isLoading: boolean;
  handleSelectDocument: (_id: string) => void;
  addDocument: (doc: Partial<Partial<IDocument>>) => Promise<void>;
};

const DocumentsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(
    null
  );

  const {
    data: documents = [],
    error,
    isLoading,
    isFetched,
  } = useQuery<IDocument[]>({
    queryKey: ["documents"],
    queryFn: getAllDocuments,
  });

  useEffect(() => {
    if (isFetched) {
      setSelectedDocument(documents?.[0]);
    }
  }, [isFetched, documents]);

  const handleSelectDocument = useCallback(
    (_id: string) => {
      const document = documents.find((doc) => doc._id === _id);
      setSelectedDocument(document);
    },
    [documents]
  );

  const addDocumentMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: (newDoc) => {
      queryClient.setQueryData<IDocument[]>(["documents"], (oldDocs = []) => [
        ...oldDocs,
        newDoc,
      ]);
    },
  });

  const value = useMemo(() => {
    return {
      documents,
      selectedDocument,
      error,
      isLoading,
      handleSelectDocument,
      addDocument: addDocumentMutation.mutateAsync,
    };
  }, [
    documents,
    selectedDocument,
    error,
    isLoading,
    handleSelectDocument,
    addDocumentMutation,
  ]);

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsProvider;
