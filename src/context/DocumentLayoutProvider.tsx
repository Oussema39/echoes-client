import { DocumentLayoutProviderContext } from "@/hooks/useDocumentsLayout";
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";

export type DocumentLayoutProviderContextProps = {
  sidebarOpen: boolean;
  suggestionsOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setSuggestionsOpen: Dispatch<SetStateAction<boolean>>;
};

const DocumentLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  const value = useMemo(() => {
    return {
      sidebarOpen,
      setSidebarOpen,
      suggestionsOpen,
      setSuggestionsOpen,
    };
  }, [sidebarOpen, setSidebarOpen, suggestionsOpen, setSuggestionsOpen]);

  return (
    <DocumentLayoutProviderContext.Provider value={value}>
      {children}
    </DocumentLayoutProviderContext.Provider>
  );
};

export default DocumentLayoutProvider;
