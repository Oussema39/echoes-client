const documentsBase = "/document";
const usersBase = "/user";
const authBase = "/auth";
const aiBase = "/ai";

export const apiEndpoints = {
  documents: {
    getAll: documentsBase,
    getByUser: `${documentsBase}/by-user`,
    addDocument: documentsBase,
    shareDocument: `${documentsBase}/share`,
    generatePdf: `${documentsBase}/generate-pdf`,
    shareLink: `${documentsBase}/share-link`,
    getVersionsMetadata: (id: string) => `${documentsBase}/${id}/versions`,
    updateDocument: (id: string) => `${documentsBase}/${id}`,
    deleteDocument: (id: string) => `${documentsBase}/${id}`,
  },
  users: {
    getAll: usersBase,
  },
  auth: {
    me: `${authBase}/me`,
    login: `${authBase}/login`,
    logout: `${authBase}/logout`,
    loginWithGoogle: `${authBase}/google`,
    register: `${authBase}/register`,
  },
  ai: {
    paraphrase: `${aiBase}/paraphrase`,
    shorten: `${aiBase}/shorten`,
    correct: `${aiBase}/correct`,
    stream: `${aiBase}/stream`,
    initStream: `${aiBase}/initStream`,
  },
} as const;
