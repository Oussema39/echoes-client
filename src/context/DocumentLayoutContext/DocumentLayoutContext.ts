import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const DocumentLayoutContext =
  createContext<TDocumentLayoutContext | null>(null);

export type TDocumentLayoutContext = {
  handleOnFocus: (onFocusEditor?: () => void) => void;
  setLoginModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  setDraftState: Dispatch<SetStateAction<unknown>>;
  toggleSidebar: () => void;
  toggleSuggestions: () => void;
  sidebarOpen: boolean;
  isDeleteDialogOpen: boolean;
  suggestionsOpen: boolean;
  loginModalOpen: boolean;
  draftState: unknown;
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
