import { getAllDocuments } from "@/api/documentsApi";
import useCreateDocumentMutation from "@/hooks/documents/useCreateDocumentMutation";
import useUpdateDocumentMutation from "@/hooks/documents/useUpdateDocumentMutation";
import { DocumentsContext } from "@/hooks/useDocuments";
import { IDocument } from "@/interface/IDocument";
import {
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
  createDocument: UseMutationResult;
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

  const handleSelectDocument = useCallback(
    (_id: string) => {
      const document = documents.find((doc) => doc._id === _id);
      setSelectedDocument(document);
    },
    [documents]
  );

  const updateDocumentMutation = useUpdateDocumentMutation({
    queryClient,
    setSelectedDocument,
  });

  const createDocumentMutation = useCreateDocumentMutation({
    queryClient,
    setSelectedDocument,
  });

  const value = useMemo(() => {
    return {
      documents,
      selectedDocument,
      error,
      isLoading,
      handleSelectDocument,
      createDocument: createDocumentMutation,
      updateDocument: updateDocumentMutation,
    };
  }, [
    documents,
    selectedDocument,
    error,
    isLoading,
    handleSelectDocument,
    createDocumentMutation,
    updateDocumentMutation,
  ]);

  useEffect(() => {
    if (isFetched) {
      setSelectedDocument(documents?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsProvider;
