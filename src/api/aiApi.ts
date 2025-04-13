import { apiEndpoints } from "@/utils/endpoints";
import { apiClient } from "./axios";

export const paraphraseText = async (text: string): Promise<string | null> => {
  const res = await apiClient.post(apiEndpoints.ai.paraphrase, { text });
  const paraphrased = Array.isArray(res.data.data) ? res.data.data : [];
  return paraphrased;
};

export const shortenText = async (text: string): Promise<string | null> => {
  const res = await apiClient.post(apiEndpoints.ai.shorten, { text });
  const shortened = Array.isArray(res.data.data) ? res.data.data : [];
  return shortened;
};

export const correctText = async (text: string): Promise<string | null> => {
  const res = await apiClient.post(apiEndpoints.ai.correct, { text });
  const corrected = Array.isArray(res.data.data) ? res.data.data : [];
  return corrected;
};
