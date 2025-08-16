import React from 'react';
import StateWrapper from './StateWrapper';
import ImagesTable from './ImagesTable';
import EmptyState from './EmptyState';
import { Image } from '../types';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('feature');

  const state = isLoading ? 'loading' : error ? 'error' : images.length === 0 ? 'empty' : 'success';

  return (
    <StateWrapper state={state} error={error}>
      {state === 'success' ? (
        <ImagesTable
          images={images}
          onView={onView}
          onPull={onPull}
          onDelete={onDelete}
        />
      ) : (
        <EmptyState message={t('registry.emptyMessage', { registryUrl })} />
      )}
    </StateWrapper>
  );
};

export default ImagesTableWrapper;
