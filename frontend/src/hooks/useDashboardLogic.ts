import { useState } from 'react';
import { Image } from '../types';

interface DialogState {
  view: boolean;
  delete: boolean;
  pull: boolean;
  logout: boolean;
}

export function useDashboardLogic() {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
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

  const handleView = (image: Image) => {
    setSelectedImage(image);
    openDialog('view');
  };

  const handleDelete = (image: Image) => {
    setSelectedImage(image);
    openDialog('delete');
  };

  const handlePull = (image: Image) => {
    setSelectedImage(image);
    openDialog('pull');
  };

  return {
    selectedImage,
    dialogState,
    openDialog,
    closeDialog,
    handleView,
    handleDelete,
    handlePull,
  };
}
