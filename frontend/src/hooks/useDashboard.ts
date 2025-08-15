'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionService } from '../services/sessionService';
import { RegistryInfo } from '@/types';
import { listImagesPaginated } from '@/services/registryApiService';
import { PaginatedImagesResponseSchema } from '@/validators/imageValidators';

export function useDashboard() {
  const router = useRouter();
  const [registryInfo, setRegistryInfo] = useState<RegistryInfo>({
    images: [],
    totalImages: 0,
    registryUrl: '',
  }); // Initialize with default values
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    registryUrl: string;
  } | null>(null);
  const [page, setPage] = useState(1); // Add state for pagination

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const user = await SessionService.getCurrentUser();
        if (!user) {
          router.push('/');
          return;
        }
        setUserInfo(user);
      } catch (err) {
        console.error('Failed to get user info:', err);
        router.push('/');
      }
    };

    initializeDashboard();
  }, [router]);

  useEffect(() => {
    if (!userInfo) return;

    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching images from registry with pagination...');

        if (!userInfo) return;

        const data = await listImagesPaginated(page, 10);

        // Validate response using Zod
        const parsedData = PaginatedImagesResponseSchema.parse(data);

        setRegistryInfo((prev) => ({
          ...prev,
          images: [...prev.images, ...parsedData.images],
          totalImages: prev.totalImages + parsedData.images.length,
        }));

        if (parsedData.nextPage) {
          setPage(parsedData.nextPage);
        }
      } catch (err) {
        console.error('Failed to fetch registry images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch registry data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [userInfo, page]); // Add 'page' to the dependency array

  const handleRefresh = async () => {
    if (!userInfo) return;

    try {
      setIsLoading(true);
      setError(null);

      const { images, nextPage } = await listImagesPaginated(1, 10); // Fetch first page with size 10

      setRegistryInfo({
        images: images, // Directly assign the images array from the API response
        totalImages: images.length,
        registryUrl: userInfo.registryUrl,
      });

      console.log('Next page:', nextPage);
    } catch (err) {
      console.error('Failed to refresh registry images:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh registry data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await SessionService.clearSession();
    router.push('/');
  };

  return {
    registryInfo,
    isLoading,
    error,
    userInfo,
    handleRefresh,
    handleLogout
  };
}
