import { apiEndpoints } from "@/utils/endpoints";
import { apiClient } from "./axios";
import { AxiosRequestConfig } from "axios";
import { IDocument } from "@/interface/IDocument";
import { IBase } from "@/interface/IBase";

export const getAllDocuments = async (config: AxiosRequestConfig) => {
  const res = await apiClient.get(apiEndpoints.documents.getAll, config);
  return res.data.data ?? res.data;
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
