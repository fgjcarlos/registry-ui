import React from 'react';
import StateWrapper from './StateWrapper';
import ImagesTable from './ImagesTable';
import EmptyState from './EmptyState';
import { Image } from '../types';

interface ImagesTableWrapperProps {
  isLoading: boolean;
  error: string | undefined;
  images: Array<Image>;
  registryUrl: string;
  onView: (image: Image) => void;
  onPull: (image: Image) => void;
  onDelete: (image: Image) => void;
}

const ImagesTableWrapper: React.FC<ImagesTableWrapperProps> = ({
  isLoading,
  error,
  images,
  registryUrl,
  onView,
  onPull,
  onDelete,
}) => {
  return (
    <StateWrapper 
      isLoading={isLoading} 
      error={error} 
      empty={!images.length} 
      emptyMessage="No images available."
    >
      {images.length > 0 ? (
        <ImagesTable 
          images={images} 
          onView={onView} 
          onPull={onPull} 
          onDelete={onDelete} 
        />
      ) : (
        <EmptyState message={`No images available for registry: ${registryUrl}`} />
      )}
    </StateWrapper>
  );
};

export default ImagesTableWrapper;
