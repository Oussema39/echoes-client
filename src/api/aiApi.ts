import { apiEndpoints } from "@/utils/endpoints";
import { apiClient } from "./axios";

export const paraphraseText = async (text: string): Promise<string | null> => {
  const res = await apiClient.post(apiEndpoints.ai.paraphrase, { text });
  const paraphrased = res.data.data ?? res.data;
  return paraphrased;
};

export const shortenText = async (text: string): Promise<string | null> => {
  const res = await apiClient.post(apiEndpoints.ai.shorten, { text });
  const shortened = res.data.data ?? res.data;
  return shortened;
};

export const correctText = async (text: string): Promise<string | null> => {
  const res = await apiClient.post(apiEndpoints.ai.correct, { text });
  const corrected = res.data.data ?? res.data;
  return corrected;
};
