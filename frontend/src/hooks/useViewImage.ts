import { useState } from 'react';
import { Image } from '../types';
import { useDialogManager } from './useDialogManager';

export function useViewImage() {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const { dialogState, openDialog, closeDialog } = useDialogManager();

  const handleView = (image: Image) => {
    setSelectedImage(image);
    openDialog('view');
  };

  return {
    selectedImage,
    dialogState,
    handleView,
    closeDialog,
  };
}
