const documentsBase = "/document";
const usersBase = "/user";

export const apiEndpoints = {
  documents: {
    getAll: documentsBase,
    addDocument: documentsBase,
    updateDocument: (id: string) => `${documentsBase}/${id}`,
    deleteDocument: (id: string) => `${documentsBase}/${id}`,
  },
  users: {
    getAll: usersBase,
  },
} as const;
