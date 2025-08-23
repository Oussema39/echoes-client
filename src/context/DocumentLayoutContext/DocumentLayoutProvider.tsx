import { ReactNode, useEffect, useMemo, useState, useCallback } from "react";
import { DocumentLayoutContext } from "./DocumentLayoutContext";
import { useIsMobile } from "@/hooks/use-mobile";

type DocumentLayoutProviderProps = {
  children: ReactNode;
};

const DocumentLayoutProvider = ({ children }: DocumentLayoutProviderProps) => {
  const isMobile = useIsMobile(1400);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Toggle suggestions panel
  const toggleSuggestions = useCallback(() => {
    setSuggestionsOpen((prev) => !prev);
  }, []);

  const handleOnFocus = useCallback(
    (onFocusEditor?: () => void) => {
      if (onFocusEditor) {
        onFocusEditor();
      } else {
        // Default behavior: close both panels on mobile

        toggleSuggestions();
        toggleSidebar();
      }
    },
    [toggleSidebar, toggleSuggestions]
  );

  useEffect(() => {
    if (isMobile) {
      setSuggestionsOpen(false);
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
      setSuggestionsOpen(true);
    }
  }, [isMobile]);

  const value = useMemo(
    () => ({
      handleOnFocus,
      setLoginModalOpen,
      toggleSidebar,
      toggleSuggestions,
      sidebarOpen,
      suggestionsOpen,
      loginModalOpen,
    }),
    [
      handleOnFocus,
      loginModalOpen,
      sidebarOpen,
      suggestionsOpen,
      toggleSidebar,
      toggleSuggestions,
    ]
  );

  return (
    <DocumentLayoutContext.Provider value={value}>
      {children}
    </DocumentLayoutContext.Provider>
  );
};

export default DocumentLayoutProvider;
