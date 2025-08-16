import React, { Suspense } from 'react';
import StateWrapper from './StateWrapper';
import EmptyState from './EmptyState';
import { LoadingState } from './LoadingState';
const ImagesTable = React.lazy(() => import('./ImagesTable'));
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
        <Suspense fallback={<LoadingState />}> 
          <ImagesTable
            images={images}
            onView={onView}
            onPull={onPull}
            onDelete={onDelete}
          />
        </Suspense>
      ) : (
        <EmptyState message={t('registry.emptyMessage', { registryUrl })} />
      )}
    </StateWrapper>
  );
};

export default ImagesTableWrapper;
