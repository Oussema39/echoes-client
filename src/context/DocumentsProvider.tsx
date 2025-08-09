import { getUserDocuments } from "@/api/documentsApi";
import useCreateDocumentMutation from "@/hooks/documents/useCreateDocumentMutation";
import useDeleteDocumentMutation from "@/hooks/documents/useDeleteDocumentMutation";
import useGeneratePDFMutation from "@/hooks/documents/useGeneratePDFMutation";
import useShareDocumentMutation from "@/hooks/documents/useShareDocumentMutation";
import useUpdateDocumentMutation from "@/hooks/documents/useUpdateDocumentMutation";
import { DocumentsContext } from "@/hooks/useDocuments";
import { IDocument } from "@/interface/IDocument";
import { IDocVersion } from "@/interface/IDocVersion";
import {
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactNode, useMemo, useState, useCallback, useEffect } from "react";

export type TDocumentContextValue = {
  documents: IDocument[];
  selectedDocument: IDocument | null;
  selectedVersion: IDocVersion | null;
  error: Error;
  isLoading: boolean;
  handleSelectDocument: (_id: string) => void;
  handleChangeSelectedVersion: (_id: string, documentId: string) => void;
  updateSelectedDocumentById: (
    documentId: string,
    update: Partial<Omit<IDocument, "_id">> | ((doc: IDocument) => IDocument)
  ) => IDocument;
  createDocument: UseMutationResult;
  updateDocument: UseMutationResult;
  deleteDocument: UseMutationResult;
  shareDocument: UseMutationResult;
  generatePDF: UseMutationResult;
};

const DocumentsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(
    null
  );
  const [selectedVersion, setSelectedVersion] = useState<IDocVersion | null>(
    null
  );

  const {
    data: documents = [],
    error,
    isLoading,
    isFetched,
  } = useQuery<IDocument[]>({
    queryKey: ["documents"],
    queryFn: getUserDocuments,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleSelectDocument = useCallback(
    (_id: string) => {
      const document = documents.find((doc) => doc._id === _id);
      setSelectedDocument(document);
      setSelectedVersion(document.versions?.at(-1));
    },
    [documents]
  );

  const updateSelectedDocumentById = useCallback(
    (
      documentId: string,
      update: Partial<Omit<IDocument, "_id">> | ((doc: IDocument) => IDocument)
    ) => {
      const indexOfDocument = documents.findIndex(
        (doc) => doc._id === documentId
      );
      const existingDocument = documents[indexOfDocument];
      if (!existingDocument) return; // Optional: handle not found

      const nextUpdate =
        typeof update === "function" ? update(existingDocument) : update;

      const updatedDocument = { ...existingDocument, ...nextUpdate };
      setSelectedDocument(updatedDocument);
      return updatedDocument;
    },
    [documents]
  );

  const handleChangeSelectedVersion = useCallback(
    (_id: string, documentId: string) => {
      const document = documents.find((doc) => doc._id === documentId);
      if (!document) {
        console.warn(`${handleChangeSelectedVersion.name} → Doc doesn't exist`);
        return null;
      }
      const versions = document.versions;
      if (!versions) {
        console.warn(
          `${handleChangeSelectedVersion.name} → Doc has no Versions`
        );
        return null;
      }
      const version = versions.find((version) => version._id === _id);
      setSelectedVersion(version);
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

  const deleteDocumentMutation = useDeleteDocumentMutation({
    queryClient,
    setSelectedDocument,
  });

  const shareDocumentMutation = useShareDocumentMutation({
    queryClient,
  });

  const generatePDFMutation = useGeneratePDFMutation();

  const value = useMemo(() => {
    return {
      documents,
      selectedDocument,
      selectedVersion,
      error,
      isLoading,
      handleSelectDocument,
      handleChangeSelectedVersion,
      updateSelectedDocumentById,
      createDocument: createDocumentMutation,
      updateDocument: updateDocumentMutation,
      deleteDocument: deleteDocumentMutation,
      shareDocument: shareDocumentMutation,
      generatePDF: generatePDFMutation,
    };
  }, [
    documents,
    error,
    isLoading,
    selectedDocument,
    selectedVersion,
    handleSelectDocument,
    handleChangeSelectedVersion,
    updateSelectedDocumentById,
    createDocumentMutation,
    updateDocumentMutation,
    deleteDocumentMutation,
    shareDocumentMutation,
    generatePDFMutation,
  ]);

  useEffect(() => {
    if (isFetched) {
      setSelectedDocument(documents?.[0]);
      setSelectedVersion(documents?.[0]?.versions?.at(-1));
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
