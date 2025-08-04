'use client';

import React, { useState } from 'react';
import Dialog from '../../components/Dialog';
import AlertDialog from '../../components/AlertDialog';
import { useDashboard } from '../../hooks/useDashboard';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import { FaInfoCircle, FaTrashAlt } from 'react-icons/fa';

export default function Dashboard() {
  const {
    registryInfo,
    isLoading,
    error,
    userInfo,
    handleRefresh,
    handleLogout
  } = useDashboard();

  // Adjust the type for an image
  interface Image {
    name: string;
    tags: string[];
    lastModified?: string;
    size?: string; // Allow undefined for compatibility
  }

  // Update state and handlers with proper types
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPullDialogOpen, setIsPullDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleView = (image: Image) => {
    setSelectedImage(image);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (image: Image) => {
    setSelectedImage(image);
    setIsDeleteDialogOpen(true);
  };

  const handlePull = (image: Image) => {
    setSelectedImage(image);
    setIsPullDialogOpen(true);
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  console.log(registryInfo)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <div>
                <h1 className="text-2xl font-bold text-base-content">Registry Dashboard</h1>
                <p className="text-base-content/70">Connected as {userInfo.username}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setIsLogoutDialogOpen(true)}>
              Logout
            </Button>
          </div>

          {/* Loading State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-base-content/70">Loading registry data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <div>
                <h1 className="text-2xl font-bold text-base-content">Registry Dashboard</h1>
                <p className="text-base-content/70">Connected as {userInfo.username}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setIsLogoutDialogOpen(true)}>
              Logout
            </Button>
          </div>

          {/* Error State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-error text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-base-content mb-2">Failed to Load Registry Data</h2>
            <p className="text-base-content/70 mb-6 text-center max-w-md">{error}</p>
            <div className="flex gap-4">
              <Button onClick={handleRefresh}>Try Again</Button>
              <Button variant="ghost" onClick={() => setIsLogoutDialogOpen(true)}>Back to Login</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div>
              <h1 className="text-2xl font-bold text-base-content">Registry Dashboard</h1>
              <p className="text-base-content/70">Connected as {userInfo.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              🔄 Refresh
            </Button>
            <Button variant="ghost" onClick={() => setIsLogoutDialogOpen(true)}>
              Logout
            </Button>
          </div>
        </div>

        {/* Registry Info */}
        <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-base-content mb-1">Registry Information</h2>
              <p className="text-base-content/70">
                <span className="font-medium">URL:</span> {userInfo.registryUrl}
              </p>
              <p className="text-base-content/70">
                <span className="font-medium">Total Images:</span> {registryInfo?.totalImages || 0}
              </p>
            </div>
            <div className="text-right">
              <div className="stat-value text-2xl text-primary">{registryInfo?.totalImages || 0}</div>
              <div className="stat-desc">Images</div>
            </div>
          </div>
        </div>

        {/* Images Table */}
        {registryInfo && registryInfo.images.length > 0 ? (
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
                  {registryInfo.images.map((image, index) => (
                    <tr key={index} className="hover">
                      <td>
                        <div className="font-mono text-sm font-medium">{image.name}</div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {image.tags.length > 0 ? (
                            image.tags.slice(0, 3).map((tag, tagIndex) => (
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
                          <Button size="xs" variant="outline" onClick={() => handleView(image)}>
                            View
                          </Button>
                          <Button size="xs" variant="ghost" onClick={() => handlePull(image)}>
                            Pull
                          </Button>
                          <Button size="xs" variant="error" onClick={() => handleDelete(image)}>
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
        ) : (
          /* Empty State */
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
                  docker tag your-image {userInfo.registryUrl.replace('http://', '').replace('https://', '')}/your-image:tag
                </code>
                <code className="text-xs bg-base-300 px-2 py-1 rounded font-mono block mt-1">
                  docker push {userInfo.registryUrl.replace('http://', '').replace('https://', '')}/your-image:tag
                </code>
              </div>
            </div>
          </div>
        )}

        {/* View Dialog */}
        {isViewDialogOpen && selectedImage && (
          <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FaInfoCircle size={24} color="var(--color-primary)" />
                <h3 className="text-lg font-semibold">Image Details</h3>
              </div>
              <p><strong>Name:</strong> {selectedImage.name}</p>
              <p><strong>Tags:</strong> {selectedImage.tags.join(', ') || 'No tags'}</p>
              <p><strong>Last Modified:</strong> {selectedImage.lastModified ? new Date(selectedImage.lastModified).toLocaleString() : 'Unknown'}</p>
              <p><strong>Size:</strong> {selectedImage.size}</p>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </div>
            </div>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        {isDeleteDialogOpen && selectedImage && (
          <AlertDialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FaTrashAlt size={24} color="var(--color-error)" />
                <h3 className="text-lg font-semibold text-error">Confirm Deletion</h3>
              </div>
              <p>Are you sure you want to delete the image <strong>{selectedImage?.name}</strong>? This action <strong>cannot</strong> be undone.</p>
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="error" onClick={() => {
                  // Add delete logic here
                  setIsDeleteDialogOpen(false);
                }}>Delete</Button>
                <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </AlertDialog>
        )}

        {/* Pull Info Dialog */}
        {isPullDialogOpen && selectedImage && (
          <Dialog open={isPullDialogOpen} onClose={() => setIsPullDialogOpen(false)}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FaInfoCircle className="text-primary text-2xl" />
                <h3 className="text-lg font-semibold">Pull Instructions</h3>
              </div>
              <p>To pull this image, run the following command:</p>
              <code className="block bg-base-300 p-2 rounded font-mono mb-4">
                docker pull {userInfo.registryUrl}/{selectedImage.name}:{selectedImage.tags[0] || 'latest'}
              </code>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setIsPullDialogOpen(false)}>Close</Button>
              </div>
            </div>
          </Dialog>
        )}

        {/* Logout Confirmation Dialog */}
        {isLogoutDialogOpen && (
          <AlertDialog
            open={isLogoutDialogOpen}
            onClose={() => setIsLogoutDialogOpen(false)}
            onConfirm={() => {
              handleLogout();
              setIsLogoutDialogOpen(false);
            }}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-error">Confirm Logout</h3>
              <p>Are you sure you want to log out?</p>
            </div>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}