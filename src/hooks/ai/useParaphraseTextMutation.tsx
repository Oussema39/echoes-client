import { paraphraseText } from "@/api/aiApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useParaphraseTextMutation = () => {
  const paraphrased = useMutation({
    mutationFn: paraphraseText,
    onSuccess: () => {
      toast.success(`Suggestion is created`);
    },
  });
  return paraphrased;
};

export default useParaphraseTextMutation;
