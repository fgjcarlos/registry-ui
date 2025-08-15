import React from 'react';
import Dialog from './Dialog';
import Button from './Button';
import { FaInfoCircle } from 'react-icons/fa';
import { Image } from '@/types';

interface ImageDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image
}

const ImageDetailsDialog: React.FC<ImageDetailsDialogProps> = ({
  isOpen,
  onClose,
  image
}) => {

  const  { name, tags, lastModified, size } = image

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FaInfoCircle size={24} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold">Image Details</h3>
        </div>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Tags:</strong> {tags && tags.length > 0 ? tags.join(', ') : 'No tags'}</p>
        <p><strong>Last Modified:</strong> {lastModified ? new Date(lastModified).toLocaleString() : 'Unknown'}</p>
        <p><strong>Size:</strong> {size}</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ImageDetailsDialog;
