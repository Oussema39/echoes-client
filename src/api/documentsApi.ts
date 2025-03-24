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
  const res = await apiClient.post(apiEndpoints.documents.addDocument, doc);
  const document = res.data?.data ? res.data.data : null;

  return document;
};

export const updateDocument = async (doc: IDocument) => {
  const { _id: id, ...payload } = doc;
  const res = await apiClient.patch(apiEndpoints.documents.updateDocument(id), {
    ...payload,
    id,
  });
  const document = res.data?.data ? res.data.data : null;

  return document;
};
