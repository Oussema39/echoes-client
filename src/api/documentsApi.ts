import { apiEndpoints } from "@/utils/endpoints";
import { apiClient } from "./axios";
import { AxiosRequestConfig } from "axios";
import { IDocument } from "@/interface/IDocument";
import { IBase } from "@/interface/IBase";

export const getAllDocuments = async (
  config: AxiosRequestConfig
): Promise<IDocument[] | null> => {
  const res = await apiClient.get(apiEndpoints.documents.getAll, config);
  const documents = Array.isArray(res.data.data) ? res.data.data : [];
  return documents;
};

export const createDocument = async (
  doc: Partial<Omit<IDocument, keyof IBase>>
) => {
  const { data } = await apiClient.post(
    apiEndpoints.documents.addDocument,
    doc
  );
  return data;
};
