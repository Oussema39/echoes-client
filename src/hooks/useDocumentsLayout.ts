import { createContext, useContext } from "react";

export const DocumentsLayoutContext = createContext<{
  handleOnFocus: () => void;
}>(null);

export const useDocumentsLayout = () => {
  try {
    const value = useContext<{
      handleOnFocus: () => void;
    }>(DocumentsLayoutContext);
    return value;
  } catch (error) {
    throw new Error("Please use Documents Layout Context in its Provider");
  }
};
