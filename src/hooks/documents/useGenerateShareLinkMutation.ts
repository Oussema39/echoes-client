import { generateDocShareLink } from "@/api/documentsApi";
import { IDocument } from "@/interface/IDocument";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  queryClient: QueryClient;
};

const useGenerateShareLinkMutation = ({ queryClient }: Props) => {
  const useShareDocument = useMutation({
    mutationFn: generateDocShareLink,
    onSuccess: (updatedDoc: IDocument) => {
      queryClient.setQueryData<IDocument[]>(["documents"], (oldDocs) => {
        const index = oldDocs.findIndex((doc) => doc._id === updatedDoc._id);
        if (index === -1) return oldDocs;
        return [
          ...oldDocs.slice(0, index),
          { ...oldDocs[index], ...updatedDoc },
          ...oldDocs.slice(index + 1),
        ];
      });

      toast.success(`Document: ${updatedDoc.title} has updated collaborators`);
    },
  });
  return useShareDocument;
};

export default useGenerateShareLinkMutation;
