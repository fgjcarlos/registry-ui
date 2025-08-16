import React from 'react';
import Button from './Button';
import Dialog from './Dialog';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  icon?: React.ReactNode; // Optional icon prop
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, title, message, onConfirm, onClose, icon }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-4">
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>} {/* Render icon if provided */}
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="py-4 break-words">{message}</div>
        <div className="modal-action">
          <Button className="btn btn-error" onClick={onConfirm}>Confirm</Button>
          <Button className="btn" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default React.memo(ConfirmationDialog);
