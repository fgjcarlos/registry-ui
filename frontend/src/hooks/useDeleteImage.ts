import { useState } from 'react';
import { Image } from '../types';
import { useDialogManager } from './useDialogManager';

export function useDeleteImage() {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const { dialogState, openDialog, closeDialog } = useDialogManager();

  const handleDelete = (image: Image) => {
    setSelectedImage(image);
    openDialog('delete');
  };

  return {
    selectedImage,
    dialogState,
    handleDelete,
    closeDialog,
  };
}
