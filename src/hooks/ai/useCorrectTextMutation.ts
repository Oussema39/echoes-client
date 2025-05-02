import { correctText } from "@/api/aiApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useCorrectTextMutation = () => {
  const paraphrased = useMutation({
    mutationFn: correctText,
    onSuccess: () => {
      toast.success(`Suggestion is created`);
    },
  });
  return paraphrased;
};

export default useCorrectTextMutation;
