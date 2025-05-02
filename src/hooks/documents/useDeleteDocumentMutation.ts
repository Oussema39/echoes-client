import { deleteDocument } from "@/api/documentsApi";
import { IDocument } from "@/interface/IDocument";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  queryClient: QueryClient;
  setSelectedDocument: Dispatch<SetStateAction<IDocument | null>>;
};

const useDeleteDocumentMutation = ({
  queryClient,
  setSelectedDocument,
}: Props) => {
  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: (deletedDoc: IDocument) => {
      queryClient.setQueryData<IDocument[]>(["documents"], (oldDocs) => {
        const updatedDocs = oldDocs.filter((doc) => doc._id !== deletedDoc._id);
        setSelectedDocument(updatedDocs[0] || null);
        return updatedDocs;
      });

      toast.success(`Document: ${deletedDoc.title} is removed`);
    },
  });
  return deleteDocumentMutation;
};

export default useDeleteDocumentMutation;
