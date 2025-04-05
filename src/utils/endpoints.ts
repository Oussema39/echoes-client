const documentsBase = "/document";
const usersBase = "/user";
const authBase = "/auth";

export const apiEndpoints = {
  documents: {
    getAll: documentsBase,
    addDocument: documentsBase,
    shareDocument: `${documentsBase}/share`,
    updateDocument: (id: string) => `${documentsBase}/${id}`,
    deleteDocument: (id: string) => `${documentsBase}/${id}`,
  },
  users: {
    getAll: usersBase,
  },
  auth: {
    login: `${authBase}/login`,
  },
} as const;
