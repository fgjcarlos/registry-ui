'use client';

import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useViewImage } from '../hooks/useViewImage';
import { useDeleteImage } from '../hooks/useDeleteImage';
import { usePullImage } from '../hooks/usePullImage';
import Header from './Header';
import useLogout from '../hooks/useLogout';
import ConfirmationDialog from './ConfirmationDialog';
import ImageDetailsDialog from './ImageDetailsDialog';
import PullInstructionsDialog from './PullInstructionsDialog';
import RegistryInfo from './RegistryInfo';
import ImagesTable from './ImagesTable';
import StateWrapper from './StateWrapper';
import LoadingScreen from './LoadingScreen';
import { FaTrash } from 'react-icons/fa';
import BackgroundWrapper from './BackgroundWrapper';
import ContainerWrapper from './ContainerWrapper';
import { useTranslations } from 'next-intl';

const DashboardView: React.FC = () => {
  const {
    registryInfo,
    isLoading,
    error,
    userInfo,
    handleRefresh,
  } = useDashboard();

  const {
    selectedImage: viewImage,
    dialogState: viewDialogState,
    handleView,
    closeDialog: closeViewDialog,
  } = useViewImage();

  const {
    selectedImage: deleteImage,
    dialogState: deleteDialogState,
    handleDelete,
    closeDialog: closeDeleteDialog,
  } = useDeleteImage();

  const {
    selectedImage: pullImage,
    dialogState: pullDialogState,
    handlePull,
    closeDialog: closePullDialog,
  } = usePullImage();

  const { dialogOpen: logoutDialogState, open: setLogoutDialogState, close: closeLogoutDialog, handleLogout } = useLogout();
  const t = useTranslations('feature');

  // logout handled inside Header via store

  if (!userInfo) {
    return <LoadingScreen />;
  }

  return (
    <BackgroundWrapper>
      <ContainerWrapper>
        {/* Header */}
        <Header 
          onRefresh={handleRefresh} 
          onLogout={setLogoutDialogState}
        />

        {/* Registry Info */}
        <RegistryInfo
          registryUrl={userInfo.registryUrl}
          totalImages={registryInfo?.totalImages || 0}
        />

        {/* Images Table */}
        <StateWrapper
          error={error || undefined}
          state={isLoading ? 'loading' : error ? 'error' : registryInfo?.images?.length ? 'success' : 'empty'}
        >
          <ImagesTable
            images={registryInfo.images || []} // Ensure images is always an array
            onView={handleView}
            onPull={handlePull}
            onDelete={handleDelete}
          />
        </StateWrapper>

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
            title={t('dashboard.confirmDeleteTitle')}
            icon={<FaTrash className="text-error" />} // Add delete icon
            message={t('dashboard.confirmDeleteMessage', { name: deleteImage.name })}
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
            registryUrl={userInfo.registryUrl}
            imageName={pullImage.name}
            tag={pullImage.tags[0]}
          />
        )}

        {/* Dialog logout */}
        <ConfirmationDialog
          isOpen={logoutDialogState}
          title={t('dashboard.confirmLogoutTitle')}
          message={t('dashboard.confirmLogoutMessage')}
          onConfirm={handleLogout}
          onClose={closeLogoutDialog}
        />

      </ContainerWrapper>
    </BackgroundWrapper>
  );
};

export default DashboardView;
