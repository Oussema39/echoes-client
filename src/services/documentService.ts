import { v4 as uuidv4 } from "uuid";

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// LocalStorage keys
const DOCUMENTS_KEY = "wordo_documents";
const CURRENT_DOCUMENT_KEY = "wordo_current_document";

// Default document content
const DEFAULT_CONTENT = `<h1>Embracing AI in Design: Why Designers Will Always Thrive</h1><p>As we stand on the cusp of an AI-powered revolution, there's one question that often arises: Will designers still have a place in a world dominated by artificial intelligence? The short answer is a resounding YES! Designers will not only survive but continue to thrive in this new era. Here's why:</p><ul><li><strong>Creativity Beyond Code:</strong> While AI can generate designs based on data and algorithms, it can't replicate the depth of human creativity. Designers bring a unique perspective, emotional intelligence, and cultural awareness to their work that's difficult for machines to replicate.</li><li><strong>User-Centered Design:</strong> Effective design is not just about aesthetics; it's about creating experiences that resonate with users. Designers excel in understanding human behavior, psychology, and emotions, ensuring that the end product meets real-world needs and desires.</li><li><strong>Ethical Design:</strong> Design is not just about making things look good; it's about making sure they do good. Designers play a crucial role in ensuring that AI technologies are developed ethically and responsibly, addressing issues like bias, discrimination, and privacy.</li><li><strong>Problem-Solving Skills:</strong> Designers are natural problem solvers. They excel at taking complex challenges and breaking them down into actionable steps. AI may provide insights, but designers are the ones who turn those insights into real-world solutions.</li><li><strong>Human Connection:</strong> Designers build connections between brands, products, and people. They use empathy to create designs that resonate with users on a personal level. This human touch is something that AI simply cannot replicate.</li></ul>`;

// Initialize documents from localStorage or set defaults if none exist
const initializeDocuments = (): Document[] => {
  const storedDocuments = localStorage.getItem(DOCUMENTS_KEY);

  if (storedDocuments) {
    return JSON.parse(storedDocuments);
  }

  // Create default documents if none exist
  const defaultDocuments: Document[] = [
    {
      id: uuidv4(),
      title: "Untitled_1",
      content: DEFAULT_CONTENT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Client Agreement",
      content: "<p>This is a client agreement template.</p>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Project Proposal",
      content: "<p>This is a project proposal template.</p>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Interview Prep",
      content: "<p>This is an interview preparation document.</p>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(defaultDocuments));
  return defaultDocuments;
};

// Get all documents
export const getAllDocuments = (): Document[] => {
  return initializeDocuments();
};

// Get current document ID
export const getCurrentDocumentId = (): string | null => {
  return localStorage.getItem(CURRENT_DOCUMENT_KEY);
};

// Set current document ID
export const setCurrentDocumentId = (id: string): void => {
  localStorage.setItem(CURRENT_DOCUMENT_KEY, id);
};

// Get document by ID
export const getDocumentById = (id: string): Document | null => {
  const documents = getAllDocuments();
  return documents.find((doc) => doc.id === id) || null;
};

// Create a new document
export const createDocument = (title: string = "Untitled"): Document => {
  const documents = getAllDocuments();

  // Check if there are documents with similar titles and increment if needed
  const similarTitles = documents
    .map((doc) => doc.title)
    .filter((docTitle) => docTitle.startsWith(title));

  let newTitle = title;
  if (similarTitles.length > 0) {
    const suffix = similarTitles.length + 1;
    newTitle = `${title}_${suffix}`;
  }

  const newDocument: Document = {
    id: uuidv4(),
    title: newTitle,
    content: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  documents.push(newDocument);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
  return newDocument;
};

// Update a document
export const updateDocument = (
  id: string,
  updates: Partial<Document>
): Document | null => {
  const documents = getAllDocuments();
  const documentIndex = documents.findIndex((doc) => doc.id === id);

  if (documentIndex === -1) {
    return null;
  }

  const updatedDocument = {
    ...documents[documentIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  documents[documentIndex] = updatedDocument;
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));

  return updatedDocument;
};

// Delete a document
export const deleteDocument = (id: string): boolean => {
  const documents = getAllDocuments();
  const filteredDocuments = documents.filter((doc) => doc.id !== id);

  if (filteredDocuments.length === documents.length) {
    // No document was removed
    return false;
  }

  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filteredDocuments));

  // If the deleted document was the current one, update current document
  if (getCurrentDocumentId() === id && filteredDocuments.length > 0) {
    setCurrentDocumentId(filteredDocuments[0].id);
  } else if (filteredDocuments.length === 0) {
    localStorage.removeItem(CURRENT_DOCUMENT_KEY);
  }

  return true;
};
