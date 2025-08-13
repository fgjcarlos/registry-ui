import React from 'react';

const HelpSection: React.FC = () => {
  return (
    <div className="text-center mt-6">
      <p className="text-sm text-base-content/60">
        Need help? Check the{' '}
        <a href="https://docs.docker.com/registry/" className="link link-primary" target="_blank" rel="noopener noreferrer">
          documentation
        </a>
      </p>
    </div>
  );
};

export default HelpSection;
