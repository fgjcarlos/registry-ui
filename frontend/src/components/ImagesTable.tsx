import React from 'react';
import Button from './Button';

// Fix import path for Image interface
import { Image } from '../types';

interface ImagesTableProps {
  images: Image[];
  onView: (image: Image) => void;
  onPull: (image: Image) => void;
  onDelete: (image: Image) => void;
}

const ImagesTable: React.FC<ImagesTableProps> = ({ images, onView, onPull, onDelete }) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-base-300">
        <h3 className="text-lg font-semibold text-base-content">Docker Images</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image Name</th>
              <th>Tags</th>
              <th>Last Modified</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image, index) => (
              <tr key={index} className="hover">
                <td>
                  <div className="font-mono text-sm font-medium">{image.name}</div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {image.tags.length > 0 ? (
                      image.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="badge badge-outline badge-sm">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-base-content/50 text-sm">No tags</span>
                    )}
                    {image.tags.length > 3 && (
                      <span className="badge badge-ghost badge-sm">
                        +{image.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="text-sm text-base-content/70">
                    {image.lastModified ? new Date(image.lastModified).toLocaleDateString() : 'Unknown'}
                  </span>
                </td>
                <td>
                  <span className="text-sm text-base-content/70">{image.size}</span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <Button size="xs" variant="outline" onClick={() => onView(image)}>
                      View
                    </Button>
                    <Button size="xs" variant="ghost" onClick={() => onPull(image)}>
                      Pull
                    </Button>
                    <Button size="xs" variant="error" onClick={() => onDelete(image)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImagesTable;
