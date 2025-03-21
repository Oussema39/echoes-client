import {
  createDocument,
  getAllDocuments,
  updateDocument,
} from "@/api/documentsApi";
import { DocumentsContext } from "@/hooks/useDocuments";
import { IDocument } from "@/interface/IDocument";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactNode, useMemo, useState, useCallback, useEffect } from "react";

export type TDocumentContextValue = {
  documents: IDocument[];
  selectedDocument: IDocument | null;
  error: Error;
  isLoading: boolean;
  handleSelectDocument: (_id: string) => void;
  addDocument: UseMutationResult;
  updateDocument: UseMutationResult;
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
    retry: false,
    refetchOnWindowFocus: false,
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

  const updateDocumentMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: (updatedDoc) => {
      queryClient.setQueryData<IDocument[]>(["documents"], (oldDocs) => {
        const index = oldDocs.findIndex((doc) => doc._id === updatedDoc._id);
        if (index === -1) return oldDocs;
        return [
          ...oldDocs.slice(0, index),
          updatedDoc,
          ...oldDocs.slice(index + 1),
        ];
      });
    },
  });

  const value = useMemo(() => {
    return {
      documents,
      selectedDocument,
      error,
      isLoading,
      handleSelectDocument,
      addDocument: addDocumentMutation,
      updateDocument: updateDocumentMutation,
    };
  }, [
    documents,
    selectedDocument,
    error,
    isLoading,
    handleSelectDocument,
    addDocumentMutation,
    updateDocumentMutation,
  ]);

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsProvider;
