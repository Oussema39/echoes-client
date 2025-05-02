import { createDocument } from "@/api/documentsApi";
import { IDocument } from "@/interface/IDocument";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  queryClient: QueryClient;
  setSelectedDocument: Dispatch<SetStateAction<IDocument | null>>;
};

const useCreateDocumentMutation = ({
  queryClient,
  setSelectedDocument,
}: Props) => {
  const updateDocumentMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: (addedDoc: IDocument) => {
      queryClient.setQueryData<IDocument[]>(["documents"], (oldDocs) => {
        return [addedDoc, ...oldDocs];
      });

      setSelectedDocument(addedDoc);

      toast.success("New document created");
    },
  });
  return updateDocumentMutation;
};

export default useCreateDocumentMutation;
