'use client';

import React, { useState, useEffect } from 'react';
import { RegistryApiService, RegistryInfo } from '../services/registryApiService';
import Button from './Button';
import Logo from './Logo';

interface DashboardProps {
  registryUrl: string;
  username: string;
  authToken: string;
  authType: 'basic' | 'bearer';
  onBackToLogin: () => void;
}

export default function Dashboard({ registryUrl, username, authToken, authType, onBackToLogin }: DashboardProps) {
  const [registryInfo, setRegistryInfo] = useState<RegistryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching images from registry...');
        const info = await RegistryApiService.getAllImages(registryUrl, authToken, authType);
        setRegistryInfo(info);
      } catch (err) {
        console.error('Failed to fetch registry images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch registry data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [registryUrl, authToken, authType]);

  const handleRefresh = () => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const info = await RegistryApiService.getAllImages(registryUrl, authToken, authType);
        setRegistryInfo(info);
      } catch (err) {
        console.error('Failed to fetch registry images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch registry data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  };

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
                <p className="text-base-content/70">Connected as {username}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onBackToLogin}>
              Back to Login
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
                <p className="text-base-content/70">Connected as {username}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onBackToLogin}>
              Back to Login
            </Button>
          </div>

          {/* Error State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-error text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-base-content mb-2">Failed to Load Registry Data</h2>
            <p className="text-base-content/70 mb-6 text-center max-w-md">{error}</p>
            <div className="flex gap-4">
              <Button onClick={handleRefresh}>Try Again</Button>
              <Button variant="ghost" onClick={onBackToLogin}>Back to Login</Button>
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
              <p className="text-base-content/70">Connected as {username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              🔄 Refresh
            </Button>
            <Button variant="ghost" onClick={onBackToLogin}>
              Back to Login
            </Button>
          </div>
        </div>

        {/* Registry Info */}
        <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-base-content mb-1">Registry Information</h2>
              <p className="text-base-content/70">
                <span className="font-medium">URL:</span> {registryUrl}
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
                          <Button size="xs" variant="outline">
                            View
                          </Button>
                          <Button size="xs" variant="ghost">
                            Pull
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
                  docker tag your-image {registryUrl.replace('http://', '').replace('https://', '')}/your-image:tag
                </code>
                <code className="text-xs bg-base-300 px-2 py-1 rounded font-mono block mt-1">
                  docker push {registryUrl.replace('http://', '').replace('https://', '')}/your-image:tag
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
