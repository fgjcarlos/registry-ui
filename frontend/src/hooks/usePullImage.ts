import { useState } from 'react';
import { Image } from '../types';
import { useDialogManager } from './useDialogManager';

export function usePullImage() {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const { dialogState, openDialog, closeDialog } = useDialogManager();

  const handlePull = (image: Image) => {
    setSelectedImage(image);
    openDialog('pull');
  };

  return {
    selectedImage,
    dialogState,
    handlePull,
    closeDialog,
  };
}
