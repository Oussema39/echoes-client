import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const DocumentLayoutContext =
  createContext<TDocumentLayoutContext | null>(null);

export type TDocumentLayoutContext = {
  handleOnFocus: (onFocusEditor?: () => void) => void;
  setLoginModalOpen: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
  toggleSuggestions: () => void;
  sidebarOpen: boolean;
  suggestionsOpen: boolean;
  loginModalOpen: boolean;
};

export const useDocumentLayoutContext = () => {
  try {
    const value = useContext(DocumentLayoutContext);
    return value;
  } catch (error) {
    throw new Error(
      "Please use the useDocumentLayoutContext in their Provider"
    );
  }
};
