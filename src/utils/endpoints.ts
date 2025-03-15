const documentsBase = "/document";

export const apiEndpoints = {
  documents: {
    getAll: documentsBase,
    addDocument: documentsBase,
  },
} as const;
