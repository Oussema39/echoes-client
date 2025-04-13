const documentsBase = "/document";
const usersBase = "/user";
const authBase = "/auth";
const aiBase = "/ai";

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
  ai: {
    paraphrase: `${aiBase}/paraphrase`,
    shorten: `${aiBase}/shorten`,
    correct: `${aiBase}/correct`,
  },
} as const;
