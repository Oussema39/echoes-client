import { shortenText } from "@/api/aiApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useShortenTextMutation = () => {
  const paraphrased = useMutation({
    mutationFn: shortenText,
    onSuccess: () => {
      toast.success(`Suggestion is created`);
    },
  });
  return paraphrased;
};

export default useShortenTextMutation;
