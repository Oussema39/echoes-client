import { TDocumentContextValue } from "@/context/DocumentsProvider";
import { createContext, useContext } from "react";

export const DocumentsContext = createContext<TDocumentContextValue>(null);

export const useDocuments = () => {
  try {
    const value = useContext<TDocumentContextValue>(DocumentsContext);
    return value;
  } catch (error) {
    throw new Error("Please use Documents Context in its Provider");
  }
};
