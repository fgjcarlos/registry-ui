import React from 'react';
import Button from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{message}</div>
        <div className="modal-action">
          <Button className="btn btn-error" onClick={onConfirm}>Confirm</Button>
          <Button className="btn" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
