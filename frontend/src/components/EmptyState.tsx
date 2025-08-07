import React from 'react';

interface EmptyStateProps {
  registryUrl: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ registryUrl }) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-md">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-base-content/30 text-8xl mb-6">📦</div>
        <h3 className="text-xl font-semibold text-base-content mb-2">Registry is Empty</h3>
        <p className="text-base-content/70 mb-6 text-center max-w-md">
          No Docker images found in this registry. Push some images to get started!
        </p>
        <div className="bg-base-200 rounded-lg p-4 max-w-md">
          <p className="text-sm text-base-content/70 mb-2">To push an image:</p>
          <code className="text-xs bg-base-300 px-2 py-1 rounded font-mono block">
            docker tag your-image {registryUrl.replace('http://', '').replace('https://', '')}/your-image:tag
          </code>
          <code className="text-xs bg-base-300 px-2 py-1 rounded font-mono block mt-1">
            docker push {registryUrl.replace('http://', '').replace('https://', '')}/your-image:tag
          </code>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
