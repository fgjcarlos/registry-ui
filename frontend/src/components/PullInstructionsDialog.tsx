import React from 'react';
import Dialog from './Dialog';
import Button from './Button';
import { FaInfoCircle } from 'react-icons/fa';

interface PullInstructionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  registryUrl: string;
  imageName: string;
  tag?: string;
}

const PullInstructionsDialog: React.FC<PullInstructionsDialogProps> = ({
  isOpen,
  onClose,
  registryUrl,
  imageName,
  tag = 'latest'
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FaInfoCircle className="text-primary text-2xl" />
          <h3 className="text-lg font-semibold">Pull Instructions</h3>
        </div>
        <p>To pull this image, run the following command:</p>
        <code className="block bg-base-300 p-2 rounded font-mono mb-4">
          docker pull {registryUrl}/{imageName}:{tag}
        </code>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default PullInstructionsDialog;
