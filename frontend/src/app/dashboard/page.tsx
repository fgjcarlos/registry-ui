'use client';

import React, { useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import ImageDetailsDialog from '../../components/ImageDetailsDialog';
import PullInstructionsDialog from '../../components/PullInstructionsDialog';
import RegistryInfo from '../../components/RegistryInfo';
import ImagesTable from '../../components/ImagesTable';
import StateWrapper from '../../components/StateWrapper';
import { Image } from '../../types';

export default function Dashboard() {
  const {
    registryInfo,
    isLoading,
    error,
    userInfo,
    handleRefresh,
    handleLogout
  } = useDashboard();

  // Update state and handlers with proper types
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [dialogState, setDialogState] = useState({
    view: false,
    delete: false,
    pull: false,
    logout: false,
  });

  const openDialog = (type: keyof typeof dialogState) => {
    setDialogState((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogState) => {
    setDialogState((prev) => ({ ...prev, [type]: false }));
  };

  const handleView = (image: Image) => {
    setSelectedImage(image);
    openDialog('view');
  };

  const handleDelete = (image: Image) => {
    setSelectedImage(image);
    openDialog('delete');
  };

  const handlePull = (image: Image) => {
    setSelectedImage(image);
    openDialog('pull');
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  console.log(registryInfo)

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
          error={error} 
          empty={!registryInfo?.images.length} 
          emptyMessage="No images available."
        >
          {registryInfo && registryInfo.images.length > 0 ? (
            <ImagesTable 
              images={registryInfo.images} 
              onView={handleView} 
              onPull={handlePull} 
              onDelete={handleDelete} 
            />
          ) : (
            <EmptyState registryUrl={userInfo.registryUrl} />
          )}
        </StateWrapper>

        {/* View Dialog */}
        {dialogState.view && selectedImage && (
          <ImageDetailsDialog
            isOpen={dialogState.view}
            image={selectedImage}
            onClose={() => closeDialog('view')}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {dialogState.delete && selectedImage && (
          <ConfirmationDialog
            isOpen={dialogState.delete}
            title="Confirm Delete"
            message={`Are you sure you want to delete the image \"${selectedImage.name}\"? This action cannot be undone.`}
            onConfirm={() => {
              // Add delete logic here
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
}