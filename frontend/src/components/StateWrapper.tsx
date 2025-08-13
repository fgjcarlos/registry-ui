import React from 'react';
import { LoadingState } from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

interface StateWrapperProps {
  isLoading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

const StateWrapper: React.FC<StateWrapperProps> = ({ isLoading, error, empty, emptyMessage, children }) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (empty) {
    return <EmptyState message={emptyMessage} />;
  }

  return <>{children}</>;
};

export default StateWrapper;
