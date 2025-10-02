import { DocumentLayoutProviderContextProps } from "@/context/DocumentLayoutProvider";
import { createContext, useContext } from "react";

export const DocumentLayoutProviderContext =
  createContext<DocumentLayoutProviderContextProps | null>(null);

export const useDocumentsLayout = () => {
  try {
    const value = useContext<DocumentLayoutProviderContextProps>(
      DocumentLayoutProviderContext
    );
    return value;
  } catch (error) {
    throw new Error("Please use Documents Layout Context in its Provider");
  }
};
