"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface UnsavedChangesContextType {
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  confirmNavigation: (navigate: () => void) => boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType>({
  isDirty: false,
  setDirty: () => {},
  confirmNavigation: () => true,
});

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);

  const confirmNavigation = useCallback(
    (navigate: () => void) => {
      if (isDirty) {
        if (window.confirm("You have unsaved changes. Discard them and leave?")) {
          setIsDirty(false);
          navigate();
          return true;
        }
        return false;
      }
      navigate();
      return true;
    },
    [isDirty]
  );

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setDirty: setIsDirty, confirmNavigation }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);
