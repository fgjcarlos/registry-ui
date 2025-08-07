import React from 'react';

interface RegistryInfoProps {
  registryUrl: string;
  totalImages: number;
}

const RegistryInfo: React.FC<RegistryInfoProps> = ({ registryUrl, totalImages }) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-base-content mb-1">Registry Information</h2>
          <p className="text-base-content/70">
            <span className="font-medium">URL:</span> {registryUrl}
          </p>
          <p className="text-base-content/70">
            <span className="font-medium">Total Images:</span> {totalImages}
          </p>
        </div>
        <div className="text-right">
          <div className="stat-value text-2xl text-primary">{totalImages}</div>
          <div className="stat-desc">Images</div>
        </div>
      </div>
    </div>
  );
};

export default RegistryInfo;
