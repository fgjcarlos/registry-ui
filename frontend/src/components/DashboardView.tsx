'use client';

import React from 'react';
import { useDashboardLogic } from '../hooks/useDashboardLogic';
import { useDashboard } from '../hooks/useDashboard';
import Header from './Header';
import EmptyState from './EmptyState';
import ConfirmationDialog from './ConfirmationDialog';
import ImageDetailsDialog from './ImageDetailsDialog';
import PullInstructionsDialog from './PullInstructionsDialog';
import RegistryInfo from './RegistryInfo';
import ImagesTable from './ImagesTable';
import StateWrapper from './StateWrapper';
import LoadingScreen from './LoadingScreen';
import { FaTrash, FaSignOutAlt } from 'react-icons/fa';

const DashboardView: React.FC = () => {
  const {
    registryInfo,
    isLoading,
    error,
    userInfo,
    handleRefresh,
    handleLogout
  } = useDashboard();

  const {
    selectedImage,
    dialogState,
    openDialog,
    closeDialog,
    handleView,
    handleDelete,
    handlePull,
  } = useDashboardLogic();

  if (!userInfo) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header 
          username={userInfo.username} 
          onLogout={() => openDialog('logout')} 
          onRefresh={handleRefresh} 
        />

        {/* Registry Info */}
        <RegistryInfo 
          registryUrl={userInfo.registryUrl} 
          totalImages={registryInfo?.totalImages || 0} 
        />

        {/* Images Table */}
        <StateWrapper 
          isLoading={isLoading} 
          error={error || undefined} 
          empty={!registryInfo?.images?.length} 
          emptyMessage="No images available."
        >
          {registryInfo && registryInfo.images?.length > 0 ? (
            <ImagesTable 
              images={registryInfo.images || []} // Ensure images is always an array
              onView={handleView} 
              onPull={handlePull} 
              onDelete={handleDelete} 
            />
          ) : (
            <EmptyState message={`No images available for registry: ${userInfo.registryUrl}`} />
          )}
        </StateWrapper>

        {/* View Dialog */}
        {dialogState.view && selectedImage && (
          <ImageDetailsDialog
            isOpen={dialogState.view}
            name={selectedImage.name}
            tags={selectedImage.tags}
            lastModified={selectedImage.lastModified}
            size={selectedImage.size}
            onClose={() => closeDialog('view')}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {dialogState.delete && selectedImage && (
          <ConfirmationDialog
            isOpen={dialogState.delete}
            title="Confirm Delete"
            icon={<FaTrash className="text-error" />} // Add delete icon
            message={`Are you sure you want to delete the image \"${selectedImage.name}\"? This action cannot be undone.`}
            onConfirm={() => {
              handleDelete(selectedImage);
              closeDialog('delete');
            }}
            onClose={() => closeDialog('delete')}
          />
        )}

        {/* Pull Info Dialog */}
        {dialogState.pull && selectedImage && (
          <PullInstructionsDialog 
            isOpen={dialogState.pull} 
            onClose={() => closeDialog('pull')} 
            registryUrl={userInfo.registryUrl} 
            imageName={selectedImage.name} 
            tag={selectedImage.tags[0]} 
          />
        )}

        {/* Logout Confirmation Dialog */}
        {dialogState.logout && (
          <ConfirmationDialog
            isOpen={dialogState.logout}
            title="Confirm Logout"
            icon={<FaSignOutAlt className="text-warning" />} // Add logout icon
            message="Are you sure you want to log out?"
            onConfirm={() => {
              handleLogout();
              closeDialog('logout');
            }}
            onClose={() => closeDialog('logout')}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardView;
