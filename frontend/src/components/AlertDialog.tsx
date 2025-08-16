import React from 'react';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void; // Make onConfirm optional for flexibility
  title?: string; // Make title optional
  message?: string; // Make message optional
  children?: React.ReactNode; // Add children prop
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md">
        {title && <h3 className="text-lg font-semibold text-error mb-4">{title}</h3>}
        {message && <p className="text-base-content mb-6">{message}</p>}
        {children}
        <div className="flex justify-end gap-4">
          {onConfirm && (
            <button
              className="btn btn-sm btn-error"
              onClick={onConfirm}
            >
              Confirm
            </button>
          )}
          <button
            className="btn btn-sm btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AlertDialog);
