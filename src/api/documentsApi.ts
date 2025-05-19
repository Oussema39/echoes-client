import { apiEndpoints } from "@/utils/endpoints";
import { apiClient } from "./axios";
import { AxiosRequestConfig } from "axios";
import { IDocument } from "@/interface/IDocument";
import { IBase } from "@/interface/IBase";
import { ICollaborator } from "@/interface/ICollaborator";
import { IDocVersion } from "@/interface/IDocVersion";

type GetUserDocsResponse = {
  owned: IDocument[];
  sharedWithMe: IDocument[];
};

export const getAllDocuments = async (
  config: AxiosRequestConfig
): Promise<IDocument[] | null> => {
  const res = await apiClient.get(apiEndpoints.documents.getAll, config);
  const documents = Array.isArray(res.data.data) ? res.data.data : [];
  return documents;
};

export const getUserDocuments = async (
  config: AxiosRequestConfig
): Promise<IDocument[] | null> => {
  const res = await apiClient.get<GetUserDocsResponse>(
    apiEndpoints.documents.getByUser,
    config
  );

  const { owned, sharedWithMe } = res.data ?? {};

  const documents = [
    ...owned.map((doc) => ({ ...doc, owned: true, sharedWithMe: false })),
    ...sharedWithMe.map((doc) => ({
      ...doc,
      owned: false,
      sharedWithMe: true,
    })),
  ];

  return documents ?? [];
};

export const getDocumentVersionsMetadata = async (
  docId: string
): Promise<Omit<IDocVersion, "changes">[] | null> => {
  const res = await apiClient.get(
    apiEndpoints.documents.getVersionsMetadata(docId)
  );
  const versions = res.data.data || res.data;
  return versions ?? [];
};

export const createDocument = async (
  doc: Partial<Omit<IDocument, keyof IBase>>
) => {
  const res = await apiClient.post(apiEndpoints.documents.addDocument, doc);
  const document = res.data?.data ? res.data.data : null;

  return document;
};

export const updateDocument = async (doc: Partial<IDocument>) => {
  const { _id: id, ...payload } = doc;
  const res = await apiClient.patch(apiEndpoints.documents.updateDocument(id), {
    ...payload,
    id,
  });
  const document = res.data?.data ? res.data.data : null;

  return document;
};

export const deleteDocument = async (id: string) => {
  const res = await apiClient.delete(apiEndpoints.documents.deleteDocument(id));
  const document = res.data?.data ? res.data.data : null;

  return document;
};

export const shareDocument = async (payload: {
  docId: string;
  collaborators: ICollaborator[];
}) => {
  const res = await apiClient.post(
    apiEndpoints.documents.shareDocument,
    payload
  );
  const document = res.data?.data ? res.data.data : null;

  return document;
};

export const generateDocumentPdf = async (payload: { html: string }) => {
  const res = await apiClient.post(
    apiEndpoints.documents.generatePdf,
    payload,
    {
      responseType: "blob",
    }
  );
  const pdfFile = res.data?.data ?? res.data;

  return pdfFile;
};
