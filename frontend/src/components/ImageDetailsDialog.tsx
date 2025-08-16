import React from 'react';
import Dialog from './Dialog';
import Button from './Button';
import { FaInfoCircle } from 'react-icons/fa';
import { Image } from '@/types';
import { useTranslations } from 'next-intl';

interface ImageDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image
}

const ImageDetailsDialog: React.FC<ImageDetailsDialogProps> = ({
  isOpen,
  onClose,
  image
}) => {

  const  { name, tags, lastModified, size } = image
  const t = useTranslations('feature');

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FaInfoCircle size={24} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold">{t('image.detailsTitle')}</h3>
        </div>
        <p><strong>{t('image.name')}:</strong> {name}</p>
        <p><strong>{t('image.tags')}:</strong> {tags && tags.length > 0 ? tags.join(', ') : t('registry.noTags')}</p>
        <p><strong>{t('image.lastModified')}:</strong> {lastModified ? new Date(lastModified).toLocaleString() : t('registry.unknown')}</p>
        <p><strong>{t('image.size')}:</strong> {size}</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>{t('actions.close')}</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ImageDetailsDialog;
