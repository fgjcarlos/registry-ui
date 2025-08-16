import React from 'react';
import AlertDialog from './AlertDialog';
import Button from './Button';
import { FaTrashAlt } from 'react-icons/fa';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  imageName: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  imageName
}) => {
  return (
    <AlertDialog open={isOpen} onClose={onClose}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FaTrashAlt size={24} color="var(--color-error)" />
          <h3 className="text-lg font-semibold text-error">Confirm Deletion</h3>
        </div>
        <p>Are you sure you want to delete the image <strong>{imageName}</strong>? This action <strong>cannot</strong> be undone.</p>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="error" onClick={onDelete}>Delete</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </AlertDialog>
  );
};

export default React.memo(DeleteConfirmationDialog);
