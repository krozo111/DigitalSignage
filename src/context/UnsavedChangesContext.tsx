"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface UnsavedChangesContextType {
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  // Runs `navigate` immediately when there are no unsaved changes; otherwise
  // opens the in-app confirm dialog and only runs it if the user discards.
  confirmNavigation: (navigate: () => void) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType>({
  isDirty: false,
  setDirty: () => {},
  confirmNavigation: (navigate) => navigate(),
});

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);
  // Holds the navigation to run once the user confirms discarding changes.
  // A non-null value also drives the dialog's open state.
  const [pendingNavigate, setPendingNavigate] = useState<(() => void) | null>(null);

  const confirmNavigation = useCallback(
    (navigate: () => void) => {
      if (isDirty) {
        // Wrap in an arrow so React stores the fn instead of calling it as an updater.
        setPendingNavigate(() => navigate);
      } else {
        navigate();
      }
    },
    [isDirty]
  );

  const handleConfirm = useCallback(() => {
    setIsDirty(false);
    pendingNavigate?.();
    setPendingNavigate(null);
  }, [pendingNavigate]);

  const handleCancel = useCallback(() => {
    setPendingNavigate(null);
  }, []);

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setDirty: setIsDirty, confirmNavigation }}>
      {children}
      <ConfirmDialog
        open={pendingNavigate !== null}
        title="Discard unsaved changes?"
        message="You have unsaved changes that will be lost if you leave this page."
        confirmText="Discard & leave"
        cancelText="Keep editing"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </UnsavedChangesContext.Provider>
  );
}

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);
