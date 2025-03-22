const documentsBase = "/document";

export const apiEndpoints = {
  documents: {
    getAll: documentsBase,
    addDocument: documentsBase,
    updateDocument: (id: string) => `${documentsBase}/${id}`,
  },
} as const;
