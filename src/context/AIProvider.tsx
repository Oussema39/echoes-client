import useCorrectTextMutation from "@/hooks/ai/useCorrectTextMutation";
import useParaphraseTextMutation from "@/hooks/ai/useParaphraseTextMutation";
import useShortenTextMutation from "@/hooks/ai/useShortenTextMutation copy";
import { AIContext } from "@/hooks/useDocuments";
import { UseMutationResult } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";

export type TAIContextValue = {
  paraphraseText: UseMutationResult;
  shortenText: UseMutationResult;
  correctText: UseMutationResult;
};

const AIProvider = ({ children }: { children: ReactNode }) => {
  const paraphraseTextMutation = useParaphraseTextMutation();
  const shortenTextMutation = useShortenTextMutation();
  const correctTextMutation = useCorrectTextMutation();

  const value = useMemo(() => {
    return {
      paraphraseText: paraphraseTextMutation,
      shortenText: shortenTextMutation,
      correctText: correctTextMutation,
    };
  }, [paraphraseTextMutation, shortenTextMutation, correctTextMutation]);

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export default AIProvider;
