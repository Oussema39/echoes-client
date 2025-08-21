import { createDocument } from "@/api/documentsApi";
import { IDocument } from "@/interface/IDocument";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useAuth } from "../useAuth";

type Props = {
  queryClient: QueryClient;
  setSelectedDocument: Dispatch<SetStateAction<IDocument | null>>;
};

const useCreateDocumentMutation = ({
  queryClient,
  setSelectedDocument,
}: Props) => {
  const { isAuthenticated } = useAuth();

  const updateDocumentMutation = useMutation({
    mutationFn: (doc: IDocument) => createDocument(doc, isAuthenticated),
    onSuccess: (addedDoc: IDocument) => {
      queryClient.setQueryData<IDocument[]>(["documents"], (oldDocs = []) => {
        return [addedDoc, ...oldDocs];
      });

      setSelectedDocument(addedDoc);

      toast.success(
        addedDoc.isDraft ? "Temporary document created" : "New document created"
      );
    },
  });
  return updateDocumentMutation;
};

export default useCreateDocumentMutation;
