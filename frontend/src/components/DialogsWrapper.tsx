import React from 'react';
import ImageDetailsDialog from './ImageDetailsDialog';
import ConfirmationDialog from './ConfirmationDialog';
import PullInstructionsDialog from './PullInstructionsDialog';
import { FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { Image } from '../types';
import { DialogState } from '../hooks/useDialogManager';

interface DialogsWrapperProps {
  viewDialogState: DialogState;
  viewImage: Image | null;
  closeViewDialog: (type: keyof DialogState) => void;
  deleteDialogState: DialogState;
  deleteImage: Image | null;
  closeDeleteDialog: (type: keyof DialogState) => void;
  handleDelete: (image: Image) => void;
  pullDialogState: DialogState;
  pullImage: Image | null;
  closePullDialog: (type: keyof DialogState) => void;
  registryUrl: string;
  logoutDialogState: DialogState;
  closeLogoutDialog: (type: keyof DialogState) => void;
  handleLogout: () => void;
}

const DialogsWrapper: React.FC<DialogsWrapperProps> = ({
  viewDialogState,
  viewImage,
  closeViewDialog,
  deleteDialogState,
  deleteImage,
  closeDeleteDialog,
  handleDelete,
  pullDialogState,
  pullImage,
  closePullDialog,
  registryUrl,
  logoutDialogState,
  closeLogoutDialog,
  handleLogout,
}) => {
  return (
    <>
      {/* View Dialog */}
      {viewDialogState.view && viewImage && (
        <ImageDetailsDialog
          isOpen={viewDialogState.view}
          image={viewImage}
          onClose={() => closeViewDialog('view')}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogState.delete && deleteImage && (
        <ConfirmationDialog
          isOpen={deleteDialogState.delete}
          title="Confirm Delete"
          icon={<FaTrash className="text-error" />} // Add delete icon
          message={`Are you sure you want to delete the image "${deleteImage.name}"? This action cannot be undone.`}
          onConfirm={() => {
            handleDelete(deleteImage);
            closeDeleteDialog('delete');
          }}
          onClose={() => closeDeleteDialog('delete')}
        />
      )}

      {/* Pull Info Dialog */}
      {pullDialogState.pull && pullImage && (
        <PullInstructionsDialog 
          isOpen={pullDialogState.pull} 
          onClose={() => closePullDialog('pull')} 
          registryUrl={registryUrl} 
          imageName={pullImage.name} 
          tag={pullImage.tags[0]} 
        />
      )}

      {/* Logout Confirmation Dialog */}
      {logoutDialogState.logout && (
        <ConfirmationDialog
          isOpen={logoutDialogState.logout}
          title="Confirm Logout"
          icon={<FaSignOutAlt className="text-warning" />} // Add logout icon
          message="Are you sure you want to log out?"
          onConfirm={() => {
            handleLogout();
            closeLogoutDialog('logout');
          }}
          onClose={() => closeLogoutDialog('logout')}
        />
      )}
    </>
  );
};

export default DialogsWrapper;
