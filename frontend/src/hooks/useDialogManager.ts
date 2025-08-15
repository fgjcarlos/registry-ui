import { useState } from 'react';

export interface DialogState {
  view: boolean;
  delete: boolean;
  pull: boolean;
  logout: boolean;
}

export function useDialogManager() {
  const [dialogState, setDialogState] = useState<DialogState>({
    view: false,
    delete: false,
    pull: false,
    logout: false,
  });

  const openDialog = (type: keyof DialogState) => {
    setDialogState((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof DialogState) => {
    setDialogState((prev) => ({ ...prev, [type]: false }));
  };

  return {
    dialogState,
    openDialog,
    closeDialog,
  };
}
