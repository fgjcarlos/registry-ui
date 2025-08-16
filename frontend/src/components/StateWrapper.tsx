import React from 'react';
import { LoadingState } from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

interface StateWrapperProps {
  state: 'loading' | 'error' | 'empty' | 'success';
  error?: string;
  children: React.ReactNode;
}

const StateWrapper: React.FC<StateWrapperProps> = ({state, error, children}) => {

  const stateWrapper = {
    loading: <LoadingState />,
    error: <ErrorState error={error || 'Error occurred'} />,
    empty: <EmptyState message="No images available." />,
    success: <>{children}</>,
  };

  return stateWrapper[state]
};

export default React.memo(StateWrapper);
