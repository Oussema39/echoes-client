import { updateDocument } from "@/api/documentsApi";
import { IDocument } from "@/interface/IDocument";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  queryClient: QueryClient;
  setSelectedDocument: Dispatch<SetStateAction<IDocument | null>>;
};

const useUpdateDocumentMutation = ({ queryClient }: Props) => {
  const updateDocumentMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: (updatedDoc: IDocument) => {
      queryClient.setQueryData<IDocument[]>(["documents"], (oldDocs) => {
        const index = oldDocs.findIndex((doc) => doc._id === updatedDoc._id);
        if (index === -1) return oldDocs;
        return [
          ...oldDocs.slice(0, index),
          updatedDoc,
          ...oldDocs.slice(index + 1),
        ];
      });

      toast.success(`Document: ${updatedDoc.title}  is up-to-date`);
    },
  });
  return updateDocumentMutation;
};

export default useUpdateDocumentMutation;
